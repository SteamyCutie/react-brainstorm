<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Payment;
use Log;

class SubscriptionController extends Controller
{
  function setSubscription(Request $request) {
    try{
      $mentor_id = $request->mentor_id;
      $sub_plan_fee = $request->sub_plan_fee;
      $payment_id = $request->payment_id;
      $email = $request->email;
      
      if ($payment_id == "" || $payment_id == null || $payment_id == 0) {
        return response()->json([
          'result' => 'warning',
          'message' => 'You did not select payment card'
        ]);
      }
      $student = User::select('id', 'customer_id')->where('email', $email)->first();
      $mentor_info = User::select('name', 'connected_account', 'hourly_price', 'sub_plan_fee', 'sub_plan_id')->where('id', $mentor_id)->first();
      if ($mentor_info->sub_plan_fee == 0) {
        return response()->json([
          'result' => 'warning',
          'message' => $mentor_info->name.' did not input sub_plane_fee in profile',
        ]);
      }
      if ($mentor_info->connected_account == null || $mentor_info->connected_account == ""){
        return response()->json([
          'result' => 'warning',
          'message' => $mentor_info->name.' disconnected with his bank.'
        ]);
      }
      $res_sub = null;
      $is_exist = Subscription::where('mentor_id', $mentor_id)->where('student_id', $student->id)->first();
      if (!$is_exist) {
        $res_sub = Subscription::create([
          'mentor_id' => $mentor_id,
          'student_id' => $student->id,
          'sub_plan_fee' => $sub_plan_fee,
        ]);
      } else {
        $res_sub = Subscription::where('mentor_id', $mentor_id)->where('student_id', $student->id)->update([
          'mentor_id' => $mentor_id,
          'student_id' => $student->id,
          'sub_plan_fee' => $sub_plan_fee,
        ]);
      }
      $sub_count = Subscription::where('mentor_id', $mentor_id)->count();
      User::where('id', $mentor_id)->update(['sub_count' => $sub_count]);
      if($res_sub) {
        //Begin set primary_card for subscription
        $pay_info = Payment::where('id', $payment_id)->first();
        \Stripe\Stripe::setApiKey(env('SK_LIVE'));
        \Stripe\Customer::update(
          $pay_info->customer_id,
          [
            'default_source' => $pay_info->card_src,
          ]
        );
        //End set primary_card for stripe
        //Begin set primary_plan_card and create subscription for stripe
        User::where('email', $email)->update(['primary_plan_card' => $payment_id]);
        $subscription = \Stripe\Subscription::create([
          "customer" => $student->customer_id,
          "items" => [
            ["price" => $mentor_info->sub_plan_id],
          ],
          "expand" => ["latest_invoice.payment_intent"],
          "application_fee_percent" => 10,
          "transfer_data" => [
            "destination" => $mentor_info->connected_account,
          ],
        ]);
        //End set primary_plan_card and create subscription for stripe
        Subscription::where('mentor_id', $mentor_id)->where('student_id', $student->id)->update([
          'st_customer_id' => $student->customer_id,
          'st_subscription_id' => $subscription->id,
        ]);
        Payment::where('user_id', $student->id)->where('payment_type', 'Card')->update(['is_primary' => false]);
        Payment::where('id', $payment_id)->update(['is_primary' => true]);
        return response()->json([
          'result' => 'success',
          'data' => [],
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'Subscription register failed',
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function unSubscription(Request $request) {
    try{
      $mentor_id = $request->mentor_id;
      $email = $request->email;
      $student = User::select('id')->where('email', $email)->first();
      
      //Begin Cancel Subscription for stripe
      $sub_info = Subscription::where('mentor_id', $mentor_id)->where('student_id', $student->id)->first();
      $stripe = new \Stripe\StripeClient(env('SK_LIVE'));
      $stripe->subscriptions->cancel(
        $sub_info->st_subscription_id,
        []
      );
      //End Cancel Subscription for stripe
      Subscription::where('mentor_id', $mentor_id)->where('student_id', $student->id)->delete();
      $sub_count = Subscription::where('mentor_id', $mentor_id)->count();
      User::where('id', $mentor_id)->update(['sub_count' => $sub_count]);
      return response()->json([
        'result'=> 'success',
        'data' => [],
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
}
