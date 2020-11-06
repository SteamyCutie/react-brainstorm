<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invited;
use App\Models\Session;
use App\Models\User;
use App\Models\SessionUser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;
use Log;



class PaymentController extends Controller
{
  public function registercardbystudent(Request $request) {
    $user_id = $request['user_id'];
    $card_name = $request['card_name'];
    $card_number = $request['card_number'];
    $card_type = substr($card_number, 0, 1);
    $cvc_code = $request['cvc_code'];
    $card_token = $request['token'];
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
    $user_info = User::select('customer_id', 'email', 'name', 'primary_card')->where('id', $user_id)->first();
    //Begin register customer ID for stripe
    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    if (!$user_info->customer_id) {
      $stripe_customer = $stripe->customers->create([
        'email' => $user_info->email,
        'description' => 'customer is '.$user_info->email,
        'name' => $user_info->name,
      ]);
      if (!$stripe_customer) {
        return [
          'result' => 'failed',
          'message' => 'could not register card'
        ];
      }
      User::where('id', $user_id)->update(['customer_id' => $stripe_customer]);
    }
    //End register customer ID for stripe
    //Begin create source(link card to customer)
    $card_src = $stripe->customers->createSource(
      $user_info->customer_id,
      ['source' => $card_token]
    );
    //End create source(link card to customer)
    $res_pay_card = Payment::create([
      'user_id' => $user_id,
      'email' => $user_info->email,
      'customer_id' => $user_info->customer_id,
      'card_name' => $card_name,
      'card_type' => $card_type,
      'card_number' => $card_number,
      'card_src' => $card_src->id,
      'card_expiration' => $card_expiration,
      'cvc_code' => $cvc_code,
      'payment_type' => 'Card',
    ]);
    if ($user_info->primary_card == 0) {
      User::where('id', $user_id)->update(['primary_card' => $res_pay_card->id, 'pay_verified' => true]);
      Payment::where('id', $res_pay_card->id)->update(['is_primary' => true]);
    }
    return response()->json([
      'result'=> 'success',
      'message'=> 'card registered successfully',
    ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> 'failed card register',
      ]);
    }
  }
  
  public function getuseridformentor(Request $request) {
    try{
      SessionUser::truncate();
      if ($request->user_id) {
        SessionUser::create([
          'key' => 'mentor',
          'value' => $request->user_id,
        ]);
      }
      return response()->json([
        'result' => 'success',
        'data' => []
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th
      ]);
    }
  }
  
  public function registerbankbymentor(Request $request) {
    try {
      $user_temp = SessionUser::where('key', 'mentor')->first();
      $user_id = $user_temp->value;
      $oauth_code = $request->input("code");
      $stripe = new \Stripe\StripeClient(env('SK_LIVE'));
  
      //Begin Original user connected account delete.
      $user_info = User::select('connected_account', 'email', 'name')->where('id', $user_id)->first();
      if ($user_info->connected_account != "") {
        $stripe->accounts->delete(
          $user_info->connected_account,
          []
        );
      }
      //End Original user connected account delete.
  
      //Begin create connected account with oauth token
      \Stripe\Stripe::setApiKey(env('SK_LIVE'));
      $response = \Stripe\OAuth::token([
        'grant_type' => 'authorization_code',
        'code' => $oauth_code,
      ]);
      $connected_account_id = $response->stripe_user_id;
      //End create connected account with oauth token
  
      //Begin set delay day 7 to connected_account
      \Stripe\Account::update(
        $connected_account_id,
        [
          'business_profile' => [
            'name' => $user_info->name,
          ],
          'settings' => [
            'payouts' => [
              'schedule' => [
                "delay_days" => 7,
                "interval" => "daily",
              ],
            ],
          ],
        ]
      );
      //End set delay day 7 to connected_account
  
      if (!Payment::where('user_id', $user_id)->where('payment_type', 'Bank')->first()){
        Payment::create([
          'user_id' => $user_id,
          'email' => $user_info->email,
          'oauth_code' => $oauth_code,
          'connected_account' => $connected_account_id,
          'payment_type' => 'Bank',
        ]);
      } else {
        Payment::where('user_id', $user_id)->where('payment_type', 'Bank')->update([
          'oauth_code' => $oauth_code,
          'connected_account' => $connected_account_id,
        ]);
      }
      SessionUser::truncate();
      return redirect(env('FRONT_URL').'/mentorWallet');
    } catch(Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th
      ]);
    }
  }
  
  public function getusercards(Request $request) {
//    try {
      $user_id = $request->user_id;
      //card, primary
      $user_cards = Payment::select('id', 'card_name', 'card_type','card_expiration', 'cvc_code', 'is_primary')
        ->where('payment_type', 'Card')
        ->where('user_id', $user_id)
        ->get();
      $temp_result = [];
      if (count($user_cards)>0) {
        foreach ($user_cards as $key => $user_card) {
          $user_card['expired_date'] = date('m/d', strtotime($user_card->card_expiration));
          $temp_result[] = $user_card;
        }
      }
      return response()->json([
        'result'=> 'success',
        'data' => $temp_result,
      ]);
//    } catch(Exception $th) {
//      return response()->json([
//        'result' => 'failed',
//        'data' => $th
//      ]);
//    }
  }
  
  public function setprimarycard(Request $request) {
    try {
      $user_id = $request->user_id;
      $payment_id = $request->payment_id;
  
      //Begin set primary card on payment table for stripe
      $pay_info = Payment::where('id', $payment_id)->first();
      \Stripe\Stripe::setApiKey(env('SK_LIVE'));
      $res_default_card = \Stripe\Customer::update(
        $pay_info->customer_id,
        [
          'default_source' => $pay_info->card_src,
        ]
      );
      //End set primary card on payment table for stripe
      Payment::where('user_id', $user_id)->update(['is_primary' => false]);
      Payment::where('user_id', $user_id)->where('id', $payment_id)->update(['is_primary' => true]);
      $res_set_primary = User::where('id', $user_id)->update(['primary_card' => $payment_id]);
      if ($res_default_card && $res_set_primary) {
        return response()->json([
          'result'=> 'success',
          'data' => [],
        ]);
      } else {
        return response()->json([
          'result'=> 'success',
          'message'  => 'failed to set primary card',
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th
      ]);
    }
  }
  
  
  public function testpayment(Request $request) {
  //tset charge
    \Stripe\Stripe::setApiKey(env("SK_LIVE"));
//    $charge = \Stripe\Charge::create([
//      'amount' => 11110,
//      'currency' => 'usd',
//      'customer' => 'cus_IIaXxU5RsCon1q',
//      'source' => 'card_1Hi0miGRfXBTO7BE1jjllzSD',
//      'description' => 'test charge',
//    ]);
    $stripe = new \Stripe\StripeClient(env('SK_LIVE'));
    $transfer = $stripe->transfers->create([
      'amount' => round(110 * 0.8, 2),
      'currency' => 'usd',
      'source_transaction' => 'ch_1Hj98nGRfXBTO7BE9nj7z1Jq', //transfer available
      'destination' => 'acct_1Hi01UGCSs28tFWr',
      'description' => 'test transfer',
    ]);
  
//        $payout = \Stripe\Payout::create([
//      'amount' => 8800,
//      'currency' => 'usd',
//    ], [
//      'stripe_account' => 'acct_1Hi01UGCSs28tFWr',
//    ]);
  
    return response()->json([
      'result' => $transfer
    ]);
    //    echo "env SK_LIVE = ".env('SK_LIVE');
    // Begin available, pending
//    $connected_account = $request->connected_account;
    \Stripe\Stripe::setApiKey(env('SK_LIVE'));
//
//    $balance = \Stripe\Balance::retrieve(
//      ['stripe_account' => 'acct_1HgHD3FwTXTDZg0D']
//    );
//    return response()->json([
//      'result' => $balance,
//    ]);
    // End available, pending
    
//    $balance = \Stripe\Balance::retrieve(
//      ['stripe_account' => 'acct_1Hi01UGCSs28tFWr']
//    );
//    $payout = \Stripe\Payout::create([
//      'amount' => 20000,
//      'currency' => 'usd',
//    ], [
//      'stripe_account' => 'acct_1HhVnXEy9A4DJWeL',
//    ]);
//    return response()->json([
//      'result' => $payout,
//    ]);
  //balanceTransactions->retrieve
//    $stripe = new \Stripe\StripeClient(
//      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
//    );
//    $response = $stripe->balanceTransactions->retrieve(
//      'txn_1HYhImGRfXBTO7BEIC8ZCiMR',
//      []
//    );
  
  }
}
