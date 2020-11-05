<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TransactionHistory;
use App\Models\User;
use App\Models\Session;
use App\Models\Payment;
use Illuminate\Http\Request;
use Log;
class TransactionHistoryController extends Controller
{
  function payforsession(Request $request) {
    try{
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
    if ($charge->status == 'failed') {
      return response()->json([
        'result' => 'failed',
        'message' => 'You did not pay for session. Please try again'
      ]);
    }
    $trans_info = TransactionHistory::create([
      'mentor_id' => $mentor_id,
      'mentor_name' => $mentor_info->name,
      'student_id' => $student_id,
      'student_name' => $student_info->name,
      'charge_id' => $charge->id,
      'transfer_id' => '',
      'session_date' => $session_info->from,
      'session_id' => $session_id,
      'conference_time' => $conference_time,
      'amount' => round($st_amount * 0.8, 2),
    ]);
    //End Transfer money from student to platform.
    //Begin Transfer money from platform to mentor.
    $stripe = new \Stripe\StripeClient(env('SK_LIVE'));
    $transfer = $stripe->transfers->create([
      'amount' => round($st_amount * 0.8, 2) * 100,
      'currency' => 'usd',
      'source_transaction' => $charge->id, //transfer available
      'destination' => $mentor_info->connected_account,
      'description' => 'Brainsshare paid '.$st_amount * 0.8.'$ to <'.$mentor_info->name.'> for <'.$session_info->title.'>',
    ]);
    //End Transfer money from platform to mentor.
    TransactionHistory::where('id', $trans_info->id)->update(['transfer_id' => $transfer->id]);
    return response()->json([
      'result' => 'success',
      'data' => [],
    ]);
    } catch (Exception $th){
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
      ]);
    }
  }
  
  function gettransactionhistorybystudent(Request $request) {
    //pagenation
    try{
      $user_id = $request->user_id;
      $rowsPerPage = $request->rowsPerPage;
      $result = [];
      //transaction
      $student_transactions = TransactionHistory::select('session_id', 'session_date', 'mentor_name', 'conference_time', 'amount', 'status')
        ->where('student_id', $user_id)
        ->orderBy('created_at', 'DESC')
        ->paginate($rowsPerPage);
      
      foreach ($student_transactions as $key => $value) {
        if($value->status == 'Failed') {
          $status = 2;
        } else if ($value->status == "Pending") {
          $status = 0;
        } else if ($value->status == "Confirmed") {
          $status = 1;
        }
        $result[$key]['lId'] = $value->session_id;
        $result[$key]['lDate'] = date('y/m/d', strtotime($value->session_date));
        $result[$key]['sName'] = $value->mentor_name;
        $result[$key]['conferenceTime'] = $value->conference_time;
        $result[$key]['amount'] = $value->amount;
        $result[$key]['status'] = $status;
      }
      return response()->json([
        'result' => 'success',
        'data' => $result,
        'totalRows' => $student_transactions->total(),
      ]);
    } catch (Exception $th){
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  function gettransactionhistorybymentor(Request $request) {
    try{
      $user_id = $request->user_id;
      $rowsPerPage = $request->rowsPerPage;
      $result = [];
      $mentor_transactions =  TransactionHistory::select('session_id', 'session_date','student_name', 'conference_time', 'amount', 'status')
          ->where('mentor_id', $user_id)
          ->orderBy('created_at', 'DESC')
          ->paginate($rowsPerPage);
      foreach ($mentor_transactions as $key => $value) {
        if($value->status == 'Failed') {
          $status = 2;
        } else if ($value->status == "Pending") {
          $status = 0;
        } else if ($value->status == "Confirmed") {
          $status = 1;
        }
        $result[$key]['lId'] = $value->session_id;
        $result[$key]['lDate'] = date('y/m/d', strtotime($value->session_date));
        $result[$key]['sName'] = $value->student_name;
        $result[$key]['conferenceTime'] = $value->conference_time;
        $result[$key]['amount'] = $value->amount;
        $result[$key]['status'] = $status;
      }
      $mentor_info = User::select('available_balance', 'pending_balance', 'life_time_earnings', 'connected_account')->where('id', $user_id)->first();
      if ($mentor_info->connected_account != "") {
        \Stripe\Stripe::setApiKey(env('SK_LIVE'));
        $balance = \Stripe\Balance::retrieve(
          ['stripe_account' => $mentor_info->connected_account]
        );
        $available_balance = $balance->available[0]->amount / 100;
        $pending_balance = $balance->pending[0]->amount / 100;
      }
      $result[]['available_balance'] = $available_balance;
      $result[]['pending_balance'] = $pending_balance;
      $result[]['life_time_earnings'] = $mentor_info->life_time_earnings;
      return response()->json([
        'result' => 'success',
        'data' => $result,
        'totalRows' => $mentor_transactions->total(),
      ]);
    } catch (Exception $th){
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  function webhook (Request $request) {
    Log::info("++++++++ webhook function +++++");
    $payload = @file_get_contents('php://input');
    $event = null;
    try {
      $event = \Stripe\Event::constructFrom(
        json_decode($payload, true)
      );
    } catch(\UnexpectedValueException $e) {
      // Invalid payload
      http_response_code(400);
      exit();
    }
    // Handle the event
    \Stripe\Stripe::setApiKey(env('SK_LIVE'));
    $stripe = new \Stripe\StripeClient(env('SK_LIVE'));
    switch ($event->type) {
      case 'transfer.created':
        $payment_event = $event->data->object;
        $user_info = User::select('life_time_earnings')->where('connected_account', $payment_event->destination)->first();
        Log::info(["++++++++ transfer.created +++ life =  $user_info->life_time_earnings +++ amount =  $payment_event->amount  ++++"]);
        TransactionHistory::where('transfer_id', $payment_event->id)->update(['status' => 'Confirmed', 'check_confirmed_sum' => true]);
        $balance = \Stripe\Balance::retrieve(
          ['stripe_account' => $payment_event->destination]
        );
        $available_balance = $balance->available[0]->amount / 100;
        $pending_balance = $balance->pending[0]->amount / 100;
        User::where('connected_account', $payment_event->destination)
          ->update(['life_time_earnings' => $user_info->life_time_earnings + $payment_event->amount / 100,
                    'pending_balance' => $pending_balance,
                    'available_balance' => $available_balance
                  ]);
        break;
      case 'transfer.failed':
        $payment_event = $event->data->object;
        $trans_info = TransactionHistory::where('transfer_id', $payment_event->id)->first();
        Log::info(["++++++++ transfer.failed +++ $trans_info->charge_id ++", $payment_event->id]);
        $stripe->refunds->create([
          'charge' => $trans_info->charge_id * 1.25,
        ]);
        TransactionHistory::where('transfer_id', $payment_event->id)->update(['status' => 'Failed']);
        break;
      default:
        echo 'Received unknown event type ' . $event->type;
    }
    http_response_code(200);
  }
  
  function connect(Request $request) {
    Log::info("++++++++ connect function +++++");
    $payload = @file_get_contents('php://input');
    $event = null;
    try {
      $event = \Stripe\Event::constructFrom(
        json_decode($payload, true)
      );
    } catch(\UnexpectedValueException $e) {
      // Invalid payload
      http_response_code(400);
      exit();
    }
    // Handle the event
    switch ($event->type) {
      case 'balance.available':
        $payment_event = $event->data->object; 
        Log::info(["++++++++ balance.available +++++", $payment_event->id]);
        break;
      case 'payout.created':
        $payment_event = $event->data->object;
        Log::info(["++++++++ payout.created +++++", $payment_event->id]);
        break;
      case 'payout.failed':
        $payment_event = $event->data->object;
        Log::info(["++++++++ payout.failed +++++", $payment_event->id]);
        break;
      case 'payout.paid':
        $payment_event = $event->data->object;
        Log::info(["++++++++ payout.paid +++++", $payment_event->id]); // $payment_event->destination
        break;
      default:
        echo 'Received unknown event type ' . $event->type;
    }
    http_response_code(200);
  }
}
