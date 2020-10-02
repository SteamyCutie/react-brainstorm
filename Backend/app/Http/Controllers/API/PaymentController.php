<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
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
      $res_exist = Payment::where(['cvc_code' => $cvc_code])->orwhere(['card_number' => $card_number])->get();
      if (count($res_exist) > 0) {
        return response()->json([
          'result'=> 'warning',
          'message' => 'Payment already exist.',
        ]);
      } else {
        $card_type = substr($card_number, 0, 1);
        $payment = Payment::create([
          'user_id' => $user_id,
          'card_name' => $card_name,
          'card_number' => $card_number,
          'card_expiration' => $card_expiration,
          'cvc_code' => $cvc_code,
          'card_type' => $card_type,
          'is_primary' => true,
        ]);
        Payment::where('created_at', '<', Carbon::now())->update(['is_primary' => false]);
      }
      return response()->json([
        'result'=> 'success',
        'message' => 'craeted payment',
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
      ]);
    }
  }
  
  public function getPayment(Request $request) {
    $user_id = $request['user_id'];
    $user = Payment::select('card_name', 'card_expiration', 'is_primary', 'card_type')->where('user_id', $user_id)->get();
    foreach ($user as $user_value) {
      $user_value['expired_date'] = date('m/d', strtotime($user_value->card_expiration));
    }
    if ($user) {
      return response()->json([
        'result'=> 'success',
        'data' => $user,
      ]);
    } else {
      return response()->json([
        'result'=> 'failed',
        'message' => 'user not exsited.',
      ]);
    }
  }
}
