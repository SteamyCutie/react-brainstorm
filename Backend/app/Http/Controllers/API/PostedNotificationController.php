<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PostedNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Mockery\Exception;

class PostedNotificationController extends Controller
{
  public function checkedNotification(Request $request) {
//    try {
      $user_id = $request->user_id;
      $session_id = $request->session_id;
      $res_notific = PostedNotification::where(['user_id' => $user_id, 'session_id' => $session_id])->update(['notification_posted' => 1]);
      $case_info =  PostedNotification::select('is_mentor')->where('user_id', $user_id)->where('session_id', $session_id)->first();
      User::where('id', $user_id)->update(['is_mentor' => $case_info->is_mentor]);
      if ($session_id == 0) {
        $res_notific = PostedNotification::where('user_id', $user_id)->update(['notification_posted' => 1]);
      }
      if ($res_notific && $case_info) {
        return response()->json([
          'result'=> 'success',
          'data' => $case_info->is_mentor,
        ]);
      } else {
        return response()->json([
          'result'=> 'warning',
          'message' => 'did not check notification.',
        ]);
      }
//    } catch (Exception $th) {
//      return response()->json([
//        'result'=> 'failed',
//        'data'=> $th,
//      ]);
//    }
  }
  
  public function getNotification(Request $request) {
    try {
      $user_id = $request->user_id;
      $res_notific = PostedNotification::where('user_id', $user_id)->where('notification_posted', 0)->get();
      if (count($res_notific)) {
        return response()->json([
          'result'=> 'success',
          'data' => $res_notific,
        ]);
      } else {
        return response()->json([
          'result'=> 'success',
          'data' => []
//          'message' => 'did not get notification.',
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
      ]);
    }
  }
}
