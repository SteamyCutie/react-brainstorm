<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invited;
use App\Models\Session;
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
    $card = $stripe->customers->createSource(
      $user_info->customer_id,
      ['source' => $token]
    );
    //End create source
    
    Payment::create([
      'user_id' => $user_id,
      'email' => $user_info->email,
      'customer_id' => $user_info->customer_id,
      'card_name' => $card_name,
      'card_number' => $card_number,
      'card_src' => $card->id,
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
  
  public function createBank(Request $request) {
    $name = $request->name;
    $email = $request->email;
    $iban = $request->iban;
    
  }
  
  public function getBank(Request $request) {
  
  }
  public function payBySession(Request $request) {
//    $session_name = $request['session_name'];
//    $amount = $request['amount'];
//    $card_number = $request['card_number'];
//    $card_info = Payment::select('card_src', 'customer_id')->where('card_number', $card_number)->first();

//    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    \Stripe\Stripe::setApiKey(env("SK_LIVE"));
    
    $charge = \Stripe\Charge::create([
      'amount' => 80000,
      'currency' => 'usd',
      'customer' => "cus_I9cBtmuKThEmkA",
      'source' => "card_1HZIxbGRfXBTO7BEENqtq1RO",
      'description' => 'My session Charge for Mentor'
//          'description' => 'Charge for '.$session_name,
    ]);
    echo $charge;
  }
  
  public function testpayment(Request $request) {
//    Begin create source
//    $stripe = new \Stripe\StripeClient(
//      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
//    );
//    $card = $stripe->customers->createSource(
//      'cus_I9Zpq1G7IDmXIU',
//      ['source' => 'card_1HZHtNGRfXBTO7BEbqmFMSL5']
//    );
//    echo $card;
//    End create source
//    Begin update source
    
    $stripe = new \Stripe\StripeClient(
      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
    );
    $stripe->customers->updateSource(
      'cus_I9c8AvLBuGMMVs',
      'card_1HZIwBGRfXBTO7BElYaNwmOE',
      ['name' => 'paul']
    );

//    \Stripe\Stripe::setApiKey(env("SK_LIVE"));
//
//    $charge = \Stripe\Charge::create([
//      'amount' => 20000,
//      'currency' => 'usd',
//      'customer' => "cus_I9c8AvLBuGMMVs",
//      'source' => "tok_1HZIwBGRfXBTO7BEHDhRVzzz",
//      'description' => 'My session Charge for Mentor'
//          'description' => 'Charge for '.$session_name,
//    ]);
//    echo $charge;

//    $stripe->customers->updateSource(
//      'cus_I9c8AvLBuGMMVs',
//      'card_1HZIvEGRfXBTO7BEhrkYLQrH',
//      ['name' => 'paul']
//    );
//    End update source
  }
  
  
  public function finishedsession(Request $request) {
    $user_id = $request['user_id'];
    $token = $request['token'];
    $customer_id = $request['customer_id'];
    $pay_info = Payment::where('user_id', $user_id)->first();
    if (!$pay_info) {
      return;
    }
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
    //Begin create source
    $stripe = new \Stripe\StripeClient(
      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
    );
    $stripe->customers->createSource(
      'cus_I9YW0KCueJnZYO',
      ['source' => 'tok_visa']
    );
    //End create source
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
    $session = Invited::select('session_id')->where('student_id', 30)->get();
    echo $session."\n";
    $result = Session::where('title', '2222')->whereIn('id',$session)->get();
    echo $result;
  }
  
  public function createaccount(Request $request) {
    
    
    //=========Begin Create Bank account token
//    $stripe = new \Stripe\StripeClient(
//      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
//    );
//    $result = $stripe->tokens->create([
//      'bank_account' => [
//        'country' => 'US',
//        'currency' => 'usd',
//        'account_holder_name' => 'Jenny Rosen',
//        'account_holder_type' => 'individual',
//        'routing_number' => '110000000',
//        'account_number' => '000123456789',
//      ],
//    ]);
//    echo $result;
    //=========End Create Bank account token
    
    //=========Begin create Bank
//    $stripe = new \Stripe\StripeClient(
//      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
//    );
//    $res = $stripe->customers->createSource(
//      'cus_I9cBtmuKThEmkA',
//      ['source' => "btok_1HZbiXGRfXBTO7BEeTzsqKQF"]
//    );
//    echo $res;
    //=========End craete Bank
  
    //============Begin payout create
    \Stripe\Stripe::setApiKey('sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO');
    $res = \Stripe\Payout::create([
      'amount' => 24784,
      'currency' => 'usd',
//      'source_type' => 'bank_account'
      'source_type' => 'ba_1HZbgIGRfXBTO7BEeY8KIqPE'
    ]);
    echo $res;
    //============Begin payout create
  }
}
