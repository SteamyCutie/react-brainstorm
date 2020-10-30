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
    $cvc_code = $request['cvc_code'];
    $card_token = $request['token'];
    $input_date = str_replace('/','/25/', $request['card_expiration']);
    $temp_date = strtotime($input_date);
    $card_expiration = date('Y-m-d', $temp_date);
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
//    } catch (Exception $th) {
//      return response()->json([
//        'result'=> 'failed',
//        'message'=> 'failed card register',
//      ]);
//    }
  }
  
  public function getuseridformentor(Request $request) {
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
  }
  
  public function registerbankbymentor(Request $request) {
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
    User::where('id', $user_id)->update(['connected_account' => $connected_account_id, 'pay_verified' => true]);
    
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
  }
  
  public function getusercards(Request $request) {
    $user_id = $request->user_id;
    //card, primary
    $user_cards = Payment::select('id', 'card_name', 'card_number', 'card_expiration', 'cvc_code', 'is_primary')
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
  }
  
  public function setprimarycard(Request $request) {
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
  }
  
  public function webhook (Request $request, Response $response) {
    Log::info("webhook +++++");
    \Stripe\Stripe::setApiKey('SK_LIVE');
    // Uncomment and replace with a real secret. You can find your endpoint's
    // secret in your webhook settings.
    $webhook_secret = 'whsec_GAiXSYTXdz4fU2hwQyiOFxzNmAW5gDwJ';
    
    $payload = $request->getBody();
    $sig_header = $request->getHeaderLine('stripe-signature');
    $event = null;
    // Verify webhook signature and extract the event.
    // See https://stripe.com/docs/webhooks/signatures for more information.
    
    try {
      $event = \Stripe\Webhook::constructEvent(
        $payload, $sig_header, $webhook_secret
      );
    } catch(\UnexpectedValueException $e) {
      // Invalid payload.
      return $response->withStatus(400);
    } catch(\Stripe\Exception\SignatureVerificationException $e) {
      // Invalid Signature.
      return $response->withStatus(400);
    }
    
    if ($event->type == 'account.updated') {
      $account = $event->data->object;
      Log::info(['webhook++++  event = ', $event, ' account = ', $account]);
    }
    
    return $response->withStatus(200);
  }
  
  public function testpayment(Request $request) {
    // Begin available, pending
//    $connected_account = $request->connected_account;
//    \Stripe\Stripe::setApiKey('sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO');
//
//    $balance = \Stripe\Balance::retrieve(
//      ['stripe_account' => $connected_account]
//    );
//    return response()->json([
//      'result' => $balance,
//    ]);
    // End available, pending
    echo '2020-10-29 08:00:00' < now();
  }
}
