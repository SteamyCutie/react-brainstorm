<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PostedNotification;
use Illuminate\Http\Request;

class PostedNotificationController extends Controller
{
  public function checkedNotification(Request $request) {
    try {
      $user_id = $request->user_id;
      $session_id = $request->session_id;
      $res_notific = PostedNotification::where(['user_id' => $user_id, 'session_id' => $session_id])->update(['notification_posted' => 1]);
      if ($session_id == 0) {
        $res_notific = PostedNotification::where('user_id', $user_id)->update(['notification_posted' => 1]);
      }
      if ($res_notific) {
        return response()->json([
          'result'=> 'success',
          'message' => 'checked notification.',
        ]);
      } else {
        return response()->json([
          'result'=> 'warning',
          'message' => 'did not check notification.',
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
