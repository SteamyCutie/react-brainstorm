<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Review;
use App\Models\User;
use App\Models\TransactionHistory;
use App\Models\Session;
use App\Models\Payment;

class ReviewController extends Controller
{
  function setReview(Request $request) {
    try {
      $email = $request->email;
      $mentor_id = $request->mentor_id;
      $mark = $request->mark;
      $review = $request->review;
      $conference_time = $request->conference_time;
      $session_id = $request->session_id;
      
      $student = User::select('id')->where('email', $email)->first();
      $student_id = $student->id;
      
      $rules = array(
        'review' => 'required'
      );
      $message = array(
        'required' => 'This field is required.'
      );
      $validator = Validator::make($request->all(), $rules, $message);
      if ($validator->fails()) {
        return [
          'result' => 'failed',
          'type' => 'require',
          'message' => $validator->messages()
        ];
      }
      
      
      
      /// Begin Pay for Session
      $student_info = User::select('name', 'primary_card')->where('id', $student_id)->first();
      $mentor_info = User::select('name', 'hourly_price', 'connected_account')->where('id', $mentor_id)->first();
      $session_info = Session::select('user_id', 'title', 'from')->where('id', $session_id)->first();
      $st_amount = round($mentor_info->hourly_price * $conference_time / 60, 2);
      if ($student_info->primary_card == 0 || $student_info->primary_card == "") {
        return response()->json([
          'result' => 'warning',
          'message' => 'Student did not register Card'
        ]);
      }
      if ($mentor_info->connected_account == "") {
        return response()->json([
          'result' => 'warning',
          'message' => 'Mentor did not register Bank'
        ]);
      }
      if ($mentor_info->hourly_price == 0 || $mentor_info->hourly_price == "") {
        return response()->json([
          'result' => 'warning',
          'message' => 'Mentor did not register hourly price in profile'
        ]);
      }
      //Begin Transfer money from student to platform.
      $st_pay_info = Payment::select('customer_id', 'card_src')->where('id', $student_info->primary_card)->first();
      \Stripe\Stripe::setApiKey(env("SK_LIVE"));
      $charge = \Stripe\Charge::create([
        'amount' => $st_amount * 100,
        'currency' => 'usd',
        'customer' => $st_pay_info->customer_id,
        'source' => $st_pay_info->card_src,
        'description' => $student_info->name . ' paid ' . $st_amount . '$ for <' . $session_info->title . '>',
      ]);
      if ($charge->status == 'failed') {
        return response()->json([
          'result' => 'failed',
          'message' => 'You did not pay for session. Please try again'
        ]);
      }
      
      $res_review = 0;
      $is_exist = Review::where('mentor_id', $mentor_id)->where('student_id', $student_id)->where('session_id', $session_id)->first();
      if ($is_exist) {
        Review::where('mentor_id', $mentor_id)->where('student_id', $student_id)->where('session_id', $session_id)->update(['mark' => $mark, 'review' => $review]);
      } else {
        $res_review = Review::create([
          'mentor_id' => $mentor_id,
          'session_id' => $session_id,
          'student_id' => $student_id,
          'mark' => $mark,
          'review' => $review,
        ]);
      }
  
      //Begin get average_mark for Review and User table
      $average_mark = round(Review::where('mentor_id', $mentor_id)->avg('mark'), 2);
      $review_count = Review::where('mentor_id', $mentor_id)->count();
      User::where('id', $mentor_id)->update(['average_mark' => $average_mark, 'review_count' => $review_count]);
      //End get average_mark
      
      $trans_info = TransactionHistory::create([
        'mentor_id' => $mentor_id,
        'mentor_name' => $mentor_info->name,
        'student_id' => $student_id,
        'student_name' => $student_info->name,
        'charge_id' => $charge->id,
        'transfer_id' => '',
        'session_date' => $session_info->from,
        'session_id' => $session_id,
        'conference_time' => round($conference_time, 2),
        'amount' => round($st_amount * 0.8, 2),
        'st_amount' => round($st_amount, 2),
      ]);
      //End Transfer money from student to platform.
      //Begin Transfer money from platform to mentor.
      $stripe = new \Stripe\StripeClient(env('SK_LIVE'));
      $transfer = $stripe->transfers->create([
        'amount' => round($st_amount * 0.8, 2) * 100,
        'currency' => 'usd',
        'source_transaction' => $charge->id, //transfer available
        'destination' => $mentor_info->connected_account,
        'description' => 'Brainsshare paid ' . $st_amount * 0.8 . '$ to <' . $mentor_info->name . '> for <' . $session_info->title . '>',
      ]);
      //End Transfer money from platform to mentor.
      TransactionHistory::where('id', $trans_info->id)->update(['transfer_id' => $transfer->id]);
      /// End Pay for Session
      
      
      return response()->json([
        'result' => 'success',
        'data' => [],
      ]);
    } catch(\Stripe\Exception\CardException $e) {
      // Since it's a decline, \Stripe\Exception\CardException will be caught
      $message =  $e->getError()->message . '\n';
      return response()->json(['result' => 'warning', 'message' => $message]);
    } catch (\Stripe\Exception\RateLimitException $e) {
      // Too many requests made to the API too quickly
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\InvalidRequestException $e) {
      // Invalid parameters were supplied to Stripe's API
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\AuthenticationException $e) {
      // Authentication with Stripe's API failed
      // (maybe you changed API keys recently)
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\ApiConnectionException $e) {
      // Network communication with Stripe failed
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
      // Display a very generic error to the user, and maybe send
      // yourself an email
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (Exception $e) {
      // Something else happened, completely unrelated to Stripe
      return response()->json(['result' => 'failed', 'message' => $e->getMessage() ]);
    }
  }
}
