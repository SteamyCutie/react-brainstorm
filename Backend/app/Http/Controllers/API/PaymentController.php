<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invited;
use App\Models\Session;
use App\Models\User;
use Carbon\Carbon;
use function GuzzleHttp\Psr7\str;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;
use Log;



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
      'card_token' => $token,
      'payment_type' => 'Card',
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
  
  public function createBank(Request $request) {
    $routing_number = $request['bank_number'];
    $account_number = $request['bank_ifsc'];
    $bank_token = $request['bank_swift'];
    $user_id = $request['user_id'];
    $payment_type = "Bank";
    $user_info = User::select('customer_id', 'email')->where('id', $user_id)->first();
    
    
    //Begin Create bank account
//    $stripe = new \Stripe\StripeClient(
//      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
//    );
//    $result = $stripe->customers->createSource(
//      'cus_IAkhzrGmHexPR1',
//      ['source' => 'btok_1HaPCxGRfXBTO7BEf6kvkPAf']
//    );
//    echo $result;
    //End Create bank account
    
    
    //Begin verify bank account
//    $stripe = new \Stripe\StripeClient(
//      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
//    );
//    $result = $stripe->customers->verifySource(
//      'cus_IAkhzrGmHexPR1',
//      'ba_1HaPCxGRfXBTO7BE2IRLCmVm',
//      ['amounts' => [32, 45]]
//    );
//    echo $result;
    //End verify bank account

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
    $stripe = new \Stripe\StripeClient(
      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
    );
    $result = $stripe->transfers->create([
      'amount' => 400,
      'currency' => 'usd',
      'destination' => 'acct_1HaRHxGzaE7oOvmc',
//      'transfer_group' => 'ORDER_95',
    ]);
    echo $result;
//    Payment::create([
//      'user_id' => $user_id,
//      'email' => $user_info->email,
//      'customer_id' => $user_info->customer_id,
////      'bank_src' => $bank->id,
//      'bank_token' => $bank_token,
//      'payment_type' => $payment_type,
//      'is_primary' => true,
//    ]);
    
    return response()->json([
      'result'=> 'success',
      'message'=> 'Bank registered successfully',
    ]);
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
  
  public function getBank(Request $request) {
  
  }
  public function paySessionPayment(Request $request) {
//    $session_name = $request['session_name'];
//    $amount = $request['amount'];
//    $card_number = $request['card_number'];
//    $card_info = Payment::select('card_src', 'customer_id')->where('card_number', $card_number)->first();

//    $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
    \Stripe\Stripe::setApiKey(env("SK_LIVE"));
    $charge = \Stripe\Charge::create([
      'amount' => 300000,
      'currency' => 'usd',
      'customer' => "cus_IEpOWIc0zt54G9",
      'source' => "card_1HeLvQGRfXBTO7BEJLfLqfV3",
      'description' => 'Paul Create Charge for Mentor'
//          'description' => 'Charge for '.$session_name,
    ]);
//    echo $charge;
    return response()->json([
      'result'=> 'success',
      'data' => 'created charge',
    ]);
  }
  
  public function getPaymentSession(Request $request) {
  
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
  
  public function removesource(Request $request) {
    $stripe = new \Stripe\StripeClient(env('SK_LIVE') );
    $res_remove = $stripe->customers->deleteSource(
      'cus_I9cBtmuKThEmkA',
      'src_1HYpt2GRfXBTO7BEY5r7h2AG'
    );
    echo $res_remove;
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
  
  public function createaccount(Request $request) {
    //create connected account
    $stripe = new \Stripe\StripeClient(
      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
    );
    $res_account = $stripe->accounts->create([
      'type' => 'custom',
      "tos_acceptance" => [
        "date" => time(),
        "ip" => $_SERVER['REMOTE_ADDR'],
      ],
      'country' => 'AU',
      'default_currency' => 'AUD',
      'email' => 'Erick_dev@protonmail.com',
      'capabilities' => [
        'card_payments' => ['requested' => true],
        'transfers' => ['requested' => true],
//        'sepa_debit_payments' => ['requested' => true],
//        'bancontact_payments' => ['requested' => true],
//        'eps_payments' => ['requested' => true],
//        'giropay_payments' => ['requested' => true],
//        'ideal_payments' => ['requested' => true],
//        'p24_payments' => ['requested' => true],
//        'sofort_payments' => ['requested' => true],
      ],
      'business_type' => 'individual',
      'individual' => [
        'first_name' => "Erick",
        'last_name'=> "Huang",
        'address' => [
          "city" => 'San Marcos',
          "country" => "AU",
          "line1" => '591 Grand Avenue',
          "line2" => 'Suite G102',
          "postal_code" => '2000',
          "state" => 'New South Wales',
        ],
        "dob" => [
          "day" => '31',
          "month" => "08",
          "year" => "1991"
        ],
        "email" => "erick_dev@protonmail.com",
        "phone" => "+61 2 1234 5678",
//        "ssn_last_4" => "0000",
      ],
      'settings' => [
        'payouts' => [
          "schedule" => [
            "delay_days" => 7,
            "interval" => "daily",
          ],
        ],
      ],
      'business_profile' => [
        'url' => 'https://brinasshare.com',
        "mcc" => '7399',
//        'name' => 'Erick Huang',
//        'product_description' => 'connected account for Erick',
//        'support_address' => [
//          'city' => 'San Marcos',
//          'country' => 'US',
//          'line1' => '591 Grand Avenue',
//          'line2' => 'Suite G102',
//          'postal_code' =>'92069',
//          'state' => 'California',
//        ],
//        'support_email' => 'Erick_dev@protonmail.com',
//        'support_phone' => '+19179835150',
//        'support_url' => 'https://brainsshare.com',
      ],
    ]);
    return response()->json([
      'result'=> 'success',
      'data' => $res_account,
    ]);
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
//    \Stripe\Stripe::setApiKey('sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO');
//    $res = \Stripe\Payout::create([
//      'amount' => 24784,
//      'currency' => 'usd',
//      'source_type' => 'bank_account'
//      'source_type' => 'ba_1HZbgIGRfXBTO7BEeY8KIqPE'
//    ]);
//    echo $res;
    //============Begin payout create
  }
  
  
  public function createexternalaccount (Request $request) {
    $stripe = new \Stripe\StripeClient(
      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
    );
//    $res_external = $stripe->accounts->createExternalAccount(
//      'acct_1HefqYJbQzLbpzB4',
//      ['external_account' => 'tok_1HefrJGRfXBTO7BEbpb3Mylm']
//    );
    $res_external = $stripe->accounts->createExternalAccount(
      'acct_1Hf0MfAjR5toktVQ',
      [
        'external_account' => [
          'object' => 'bank_account',
          'country' => 'AU',
          'currency' => 'aud',
          'account_holder_name' => 'lucal',
          'account_holder_type' => 'individual',
          'routing_number' => '110000',
          'account_number' => '000123456',
        ]
      ]
    );
    return response()->json([
      'result'=> 'success',
      'data' => $res_external,
    ]);
  }
  
  public function createaccountlink (Request $request) {
    // Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
    \Stripe\Stripe::setApiKey('sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO');
    
    $res_result = $response = \Stripe\OAuth::token([
      'grant_type' => 'authorization_code',
      'code' => 'ac_IH4umRytsmbHk91W75BSzxQOQ7oNn5MJ',
    ]);

// Access the connected account id in the response
    $connected_account_id = $response->stripe_user_id;
    
    
    
    return response()->json([
      'result'=> 'success',
      'data' => $res_result,
    ]);
  }
  
  public function webhook (Request $request, Response $response) {
    Log::info("webhook +++++");
    \Stripe\Stripe::setApiKey('sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO');
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
  
  public function connect (Request $request) {
    \Log::info("connect +++++");
  }
  
  public function transfermoney (Request $request) {
    $stripe = new \Stripe\StripeClient(
      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
    );
    $res_transfer = $stripe->transfers->create([
      'amount' => 4880,
      'currency' => 'usd',
      'destination' => 'acct_1HgWg3GGo6mXIVLI',
//      'transfer_group' => 'ORDER_95',
    ]);
    return response()->json([
      'result'=> 'success',
      'data' => $res_transfer,
    ]);
  }
  
  public function deleteaccount (Request $request) {
    $stripe = new \Stripe\StripeClient(
      'sk_test_51HV0m8GRfXBTO7BEhCSm4H66pXZAKU1PpMUcbn11BDX5K7Vurr8hEBJ5PcVkygsJVUyIemFwmkJ1gU4sjG7ruSCP00GyCDe4aO'
    );
    $stripe->accounts->delete(
      'acct_1Hea8RLNIluQpVfI',
      []
    );
    return response()->json([
      'result'=> 'success',
      'data' => 'deleted account',
    ]);
  }
}
