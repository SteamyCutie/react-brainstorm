<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use function GuzzleHttp\Psr7\str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
  public function createPayment(Request $request) {
    $user_id = $request['user_id'];
    $card_name = $request['card_name'];
    $card_number = $request['card_number'];
    $cvc_code = $request['cvc_code'];
    $token = $request['token'];
    $is_primary = $request['is_primary'];
    
    $input_date = str_replace('/','/25/', $request['card_expiration']);
    $temp_date = strtotime($input_date);
    $card_expiration = date('Y-m-d', $temp_date);
    $card_type = substr($card_number, 0, 1);
//    try {
    $rules = array(
      'user_id' => 'required',
      'card_name' => 'required',
      'card_number' => 'required',
      'card_expiration' => 'required',
      'cvc_code' => 'required',
    );
    $messages = array(
      'required' => 'This field is required.',
    );
    $validator = Validator::make( $request->all(), $rules, $messages);
    if ($validator->fails())
    {
      return [
        'result' => 'failed',
        'type' => 'require',
        'message' => $validator->messages()
      ];
    }
    $user_info = User::select('customer_id', 'email')->where('id', $user_id)->first();
    $same_exist = Payment::where('card_number', $card_number)->first();
    if ($same_exist) {
      return response()->json([
        'result'=> 'failed',
        'message'=> 'already same card number',
      ]);
    }
    //Begin create source
    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    $src_result = $stripe->sources->create([
      "type" => "ach_credit_transfer",
      "currency" => "usd",
      "token" => $token,
      "owner" => [
        "email" => $user_info->email,
      ]
    ]);
    
    $stripe->customers->createSource(
      $user_info->customer_id,
      [
        'source' => $src_result->id,
      ]
    );
    //End create source
    Payment::create([
      'user_id' => $user_id,
      'email' => $user_info->email,
      'customer_id' => $user_info->customer_id,
      'card_name' => $card_name,
      'card_number' => $card_number,
      'card_src' => $src_result->id,
      'card_expiration' => $card_expiration,
      'cvc_code' => $cvc_code,
      'card_type' => $card_type,
      'token' => $token,
      'is_primary' => true,
    ]);
    return response()->json([
      'result'=> 'success',
      'message'=> 'card registered successfully',
    ]);
//    } catch (Exception $th) {
//      return response()->json([
//        'result'=> 'failed',
//        'message'=> 'failed card register',
//      ]);
//    }
  }
  
  public function getPayment(Request $request) {
    $user_id = $request['user_id'];
    $user_cards = Payment::where('user_id', $user_id)
      ->where('card_number','!=', '')->get();
    $temp_result = [];
    if (count($user_cards)>0) {
      foreach ($user_cards as $key => $user_card) {
        $user_card['expired_date'] = date('m/d', strtotime($user_card->card_expiration));
        $temp_result[] = $user_card;
      }
      return response()->json([
        'result'=> 'success',
        'data' => $temp_result,
      ]);
    }
    return response()->json([
      'result'=> 'success',
      'data' => [],
    ]);
  }
  
  public function payBySession(Request $request) {
//    $session_name = $request['session_name'];
//    $amount = $request['amount'];
    $card_number = $request['card_number'];
    $card_info = Payment::select('card_src', 'customer_id')->where('card_number', $card_number)->first();
    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    $res_charge = $stripe->charges->create([
      'amount' => 100,
      'currency' => 'usd',
      'source' => "src_1HYpAZGRfXBTO7BEhWYEsOIt",
      'customer' => "cus_I97OREjr3YSXIA",
      'description' => 'My First Test Charge (created for API docs)',
      //      'amount' => $amount,
      //      'currency' => 'usd',
      //      'source' => $card_info->card_src,
      //      'customer' => $card_info->customer_id,
      //      'description' => 'Charge for '.$session_name,
    ]);
    echo $res_charge;
  }
  
  public function testpayment(Request $request) {

//    $result_payment = \Stripe\PaymentIntent::create([
//      'amount' => 1000,
//      'currency' => 'usd',
//      'payment_method_types' => ['card'],
////      'receipt_email' => 'paul425@protonmail.com',
//    ]);
    
    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    $stripe->charges->create([
      'amount' => 10000,
      'currency' => 'usd',
      'source' => "src_1HYgkFGRfXBTO7BEOvondX7C",
      'customer' => "cus_I7zDAyz6yqYTdp",
      'description' => 'My First Test Charge (created for API docs)',
    ]);
  }
  
  public function finishedsession(Request $request) {
    $user_id = $request['user_id'];
    $token = $request['token'];
    $customer_id = $request['customer_id'];
    $pay_info = Payment::where('user_id', $user_id)->first();
    if (!$pay_info) {
      return;
    }
    
    $expir_date = $pay_info->card_expiration;
    $temp = explode('-', $expir_date);
    $exp_year = $temp[0];
    $exp_month = $temp[1];
    $temp = $pay_info['card_number'];
    $card_cvd = $pay_info['cvc_code'];
    $card_number = str_replace(' ','', $temp);

//    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
//    $result = $stripe->paymentMethods->create([
//      'type' => 'card',
//      'card' => [
//        'number' => $card_number,
//        'exp_month' => $exp_month,
//        'exp_year' => $exp_year,
//        'cvc' => $card_cvd,
//      ],
//    ]);
    \Stripe\Stripe::setApiKey(env("SK_LIVE"));
    $intent = \Stripe\PaymentIntent::create([
      'amount' => 100000,
      'currency' => 'usd',
      'customer' => $customer_id,
    ]);
    echo $intent;
  }
  
  public function removesource(Request $request) {
    $stripe = new \Stripe\StripeClient(env('SK_LIVE') );
    $res_remove = $stripe->customers->deleteSource(
      'cus_I97OREjr3YSXIA',
      'src_1HYpt2GRfXBTO7BEY5r7h2AG'
    );
    echo $res_remove;
  }
  
  public function createsource(Request $request) {
    $token = $request['token'];
    $email= $request['email'];
    $customer_id = $request['customer_id'];
    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    $src_result = $stripe->sources->create([
      "type" => "ach_credit_transfer",
      "currency" => "usd",
      "token" => $token,
      "owner" => [
        "email" => $email,
      ]
    ]);
    echo $src_result."==============================\n";
    $card_src = $stripe->customers->createSource(
      $customer_id,
      [
        'source' => $src_result->id,
      ]
    );
    echo $card_src;
  }
  
  public function createcustomer(Request $request) {
    $user_id = $request['user_id'];
    $user_info = User::select('email')->where('id', $user_id)->first();
    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    $result = $stripe->customers->create([
      'email' => $user_info->email,
      'description' => 'register '.$user_info->email.' customer',
    ]);
    echo $result;
  }
  
  public function test(Request $request) {
//    $user_id = $request['user_id'];
//    $user = Payment::where('user_id', $user_id)
//      ->where('card_number','!=', '')->first();
    $user = User::where('email_verified_at', null)->delete();
    echo $user;
  }
}
