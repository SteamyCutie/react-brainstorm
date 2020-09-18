<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\User;

class SubscriptionController extends Controller
{
  function setsubscription(Request $request) {
    $mentor_id = $request->mentor_id;
    $sub_plan_fee = $request->sub_plan_fee;
    $card_type = $request->card_type;
    $email = $request->email;
    $student = User::select('id')->where('email', $email)->first();
    $res_sub = null;
    $is_exist = Subscription::where('mentor_id', $mentor_id)->where('student_id', $student->id)->first();
    if (!$is_exist) {
      $res_sub = Subscription::create([
        'mentor_id' => $mentor_id,
        'student_id' => $student->id,
        'sub_plan_fee' => $sub_plan_fee,
        'card_type' => $card_type,
      ]);
      $sub_count = User::select('sub_count')->where('id', $mentor_id)->first();
      User::where('id', $mentor_id)->update(['sub_count' => $sub_count->sub_count +1]);
      if($res_sub) {
        return response()->json([
          'result'=> 'success',
        ]);
      }
    } else {
      return response()->json([
        'result' => 'failed',
        'message' => 'Subscription already registered!'
      ]);
    }
  }
  
  function getsubscription(Request $request) {
    $student = $request->student_id;
    $res_sub = Subscription::where('student_id', $student);
    if($res_sub) {
      return response()->json([
        'result'=> 'success',
        'data' => $res_sub,
      ]);
    } else {
      return response()->json([
        'result' => 'failed',
        'message' => 'can not get the data',
      ]);
    }
  }
  
  function editsubscription(Request $request) {
    $mentor_id = $request->mentor_id;
    $student = $request->student_id;
    $sub_plan_fee = $request->sub_plan_fee;
    $status = $request->status;
    $card_type = $request->card_type;
    $res_sub = null;
  
    $res_sub = Subscription::where(['mentor_id' => $mentor_id, 'student_id' => $student])->update(array(
      'mentor_id' => $mentor_id,
      'student_id' => $student,
      'sub_plan_fee' => $sub_plan_fee,
      'status' => $status,
      'card_type' => $card_type
    ));
    
    if ($res_sub == null) {
      return response()->json([
        'result' => 'failed',
        'message' => 'can not edit the data',
      ]);
    } else {
      return response()->json([
        'result'=> 'success',
      ]);
    }
  }
}
