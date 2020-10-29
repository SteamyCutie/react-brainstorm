<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TransactionHistory;
use App\Models\User;
use App\Models\Session;
use App\Models\Payment;
use Illuminate\Http\Request;

class TransactionHistoryController extends Controller
{
  function payforsession(Request $request) {
//    try{
    $mentor_id = $request->mentor_id;
    $student_id = $request->student_id;
    $conference_time = $request->conference_time;
    $session_id = $request->session_id;
    
    $student_info = User::select('name', 'primary_card')->where('id', $student_id)->first();
    $mentor_info = User::select('name', 'hourly_price', 'connected_account')->where('id', $mentor_id)->first();
    $session_info = Session::select('user_id', 'title', 'from')->where('id', $session_id)->first();
    $st_amount = round($mentor_info->hourly_price * $conference_time/60, 2);
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
      'description' => $student_info->name.' paid '.$st_amount.'$ for <'.$session_info->title.'>',
    ]);
    //End Transfer money from student to platform.
    //Begin Transfer money from platform to mentor.
    $stripe = new \Stripe\StripeClient(env('SK_LIVE'));
    $transfer = $stripe->transfers->create([
      'amount' => round($st_amount * 0.8, 2) * 100,
      'currency' => 'usd',
      'destination' => $mentor_info->connected_account,
      'description' => 'Brainsshare paid '.$st_amount * 0.8.'$ to <'.$mentor_info->name.'> for <'.$session_info->title.'>',
    ]);
    //End Transfer money from platform to mentor.
    TransactionHistory::create([
      'mentor_id' => $mentor_id,
      'mentor_name' => $mentor_info->name,
      'student_id' => $student_id,
      'student_name' => $student_info->name,
      'charge_id' => $charge->id,
      'transfer_id' => $transfer->id,
      'session_date' => $session_info->from,
      'session_id' => $session_id,
      'conference_time' => $conference_time,
      'amount' => round($st_amount * 0.8, 2),
    ]);
    return response()->json([
      'result' => 'success',
      'data' => [],
    ]);
//    } catch (Exception $th){
//      return response()->json([
//        'result'=> 'failed',
//        'data'=> $th,
//      ]);
//    }
  }
  
  function gettransactionhistorybystudent(Request $request) {
    //pagenation
//    try{
      $user_id = $request->user_id;
      $rowsPerPage = $request->rowsPerPage;
      //transaction
      $student_transactions = TransactionHistory::select('session_id', 'session_date', 'mentor_name', 'conference_time', 'amount', 'status')
        ->where('student_id', $user_id)
        ->orderBy('created_at', 'DESC')
        ->paginate($rowsPerPage);
      foreach ($student_transactions as $key => $value) {
      
      }
      return response()->json([
        'result' => 'success',
        'data' => $student_transactions,
        'totalRows' => $student_transactions->total(),
      ]);
//    } catch (Exception $th){
//      return response()->json([
//        'result' => 'failed',
//        'data' => $th,
//      ]);
//    }
  }
  
  function gettransactionhistorybymentor(Request $request) {
//    try{
      $user_id = $request->user_id;
      $rowsPerPage = $request->rowsPerPage;
      $mentor_transaction =  TransactionHistory::select('session_id', 'session_date','student_name', 'conference_time', 'amount', 'status')
          ->where('mentor_id', $user_id)
          ->orderBy('created_at', 'DESC')
          ->paginate($rowsPerPage);
      $mentor_info = User::select('available_balance', 'pending_balance', 'life_time_earnings')->first();
      $result['balance'] = $mentor_info;
      $result['transaction'] = $mentor_transaction;
      return response()->json([
        'result' => 'success',
        'data' => $result,
        'totalRows' => $mentor_transaction->total(),
      ]);
//    } catch (Exception $th){
//      return response()->json([
//        'result' => 'failed',
//        'data' => $th,
//      ]);
//    }
  }
}
