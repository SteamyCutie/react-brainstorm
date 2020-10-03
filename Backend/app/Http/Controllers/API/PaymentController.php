<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
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
    try {
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
      $user_exist = Payment::where('user_id', $user_id)->first();
      if (!$user_exist) {
        return response()->json([
          'result'=> 'warning',
          'message' => 'User does not already exist.',
        ]);
      }
      $res_exist = Payment::where(['user_id' => $user_id])->where(['card_number' => $card_number])->first();
      if ($res_exist) {
        return response()->json([
          'result'=> 'warning',
          'message' => 'card number already exist.',
        ]);
      } else {
        $card_type = substr($card_number, 0, 1);
        $payment = Payment::where('user_id', $user_id)->update([
//          'user_id' => $user_id,
          'card_name' => $card_name,
          'card_number' => $card_number,
          'card_expiration' => $card_expiration,
          'cvc_code' => $cvc_code,
          'card_type' => $card_type,
          'token' => $token,
          'is_primary' => true,
        ]);
//        Payment::where('created_at', '<', Carbon::now())->update(['is_primary' => false]);
      }
      if ($payment) {
        return response()->json([
          'result'=> 'success',
          'message' => 'craeted payment',
        ]);
      }
      
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
      ]);
    }
  }
  
  public function getPayment(Request $request) {
    $user_id = $request['user_id'];
    $user = Payment::where('user_id', $user_id)
      ->where('card_number','!=', '')->first();
    if ($user) {
      $user['expired_date'] = date('m/d', strtotime($user->card_expiration));
      return response()->json([
        'result'=> 'success',
        'data' => $user,
      ]);
    }
    return response()->json([
      'result'=> 'success',
      'data' => [],
    ]);
  }
  
  public function testpayment(Request $request) {
    \Stripe\Stripe::setApiKey('sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO');
  
    $result_payment = \Stripe\PaymentIntent::create([
      'amount' => 1000,
      'currency' => 'usd',
      'payment_method_types' => ['card'],
      'receipt_email' => 'paul425@protonmail.com',
    ]);
    
    echo $result_payment;
  }
  
  public function finishedsession(Request $request) {
    $user_id = $request['user_id'];
    
    $pay_info = Payment::where('user_id', $user_id)->first();
    $expir_date = $pay_info->card_expiration;
    $temp = explode('-', $expir_date);
    $exp_year = $temp[0];
    $exp_month = $temp[1];
    $temp = $pay_info['card_number'];
    $card_cvd = $pay_info['cvc_code'];
    $card_number = str_replace(' ','', $temp);
    
    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
//    $result = $stripe->paymentMethods->create([
//      'type' => 'card',
//      'card' => [
//        'number' => $card_number,
//        'exp_month' => $exp_month,
//        'exp_year' => $exp_year,
//        'cvc' => $card_cvd,
//      ],
//    ]);
    
    $result = $stripe->paymentMethods->create([
      'type' => 'card',
      'card' => [
        'number' => '4242424242424242',
        'exp_month' => 10,
        'exp_year' => 2021,
        'cvc' => '314',
      ],
    ]);
    echo $result;
  }

  public function createcustomer(Request $request) {
    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    $result = $stripe->customers->create([
      'email' => "lexus0526@protonmail.com",
      'description' => 'register lexus0526 customer',
    ]);
    echo $result->id;
  }
  
  public function test(Request $request) {
    $user_id = $request['user_id'];
    $user = Payment::where('user_id', $user_id)
      ->where('card_number','!=', '')->first();
    echo $user;
  }
}
