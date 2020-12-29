<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Associate;
use App\Models\User;

class AssociateController extends Controller
{
  function associateRequest(Request $request)
  {
    try{
      $request_id = $request->request_id;
      $response_id = $request->response_id;
      if ($request_id == '' || $request_id == null || $response_id == '' || $response_id == null){
        return response()->json([
          'result' => 'warning',
          'message' => 'empty value'
        ]);
      }
      $exist = DB::table('associates')
        ->where('request_id', $request_id)
        ->where('response_id', $response_id)
        ->orWhere(function($query) use ($request_id, $response_id){
          $query->where('request_id', $response_id)
            ->where('response_id', $request_id);
        })
        ->get();
      if (count($exist) > 0) {
        return response()->json([
          'result' => 'failed',
          'message' => 'already associated'
        ]);
      }
      $res_associate = Associate::create([
        'request_id' => $request_id,
        'response_id' => $response_id
      ]);
      
      $fronturl = env("APP_URL");
      $current_time = date("Y-m-d h:i a");
      $user_info = User::where('id', $response_id)->first();
      $toEmail = $user_info->email;
      $send_mail = new Controller;
      $subject = "You have received a request about the association!";
      $name = $user_info->name;
      $user_info = User::where('id', $request_id)->first();
      $from_user = $user_info->name;
      $mentor_avatar = $user_info->avatar;
      $app_path = app_path();
      $body = include($app_path.'/Mails/Association.php');
      $body = implode(" ",$body);
      $send_mail->send_email($toEmail, $name, $subject, $body);
      
      if ($res_associate) {
        return response()->json([
          'result' => 'success',
          'data' => []
        ]);
      }
    } catch (Exception $th) {
      \Log::info(['++++++++++ associateRequest +++++++++', $th->getMessage()]);
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function associateAccept(Request $request)
  {
    try{
      $request_id = $request->request_id;
      $response_id = $request->response_id;
      
      $rest_accept = DB::table('associates')
        ->where('request_id', $request_id)
        ->where('response_id', $response_id)
        ->orWhere(function($query) use ($request_id, $response_id){
          $query->where('request_id', $response_id)
            ->where('response_id', $request_id);
        })
        ->update([
          'accepted' => true
        ]);
      
      $fronturl = env("APP_URL");
      $current_time = date("Y-m-d h:i a");
      $user_info = User::where('id', $request_id)->first();
      $toEmail = $user_info->email;
      $send_mail = new Controller;
      $subject = "You have received a response about the association!";
      $name = $user_info->name;
      $user_info = User::where('id', $response_id)->first();
      $mentor_avatar = $user_info->avatar;
      $from_user = $user_info->name;
      $app_path = app_path();
      $body = include($app_path.'/Mails/AssociationResponse.php');
      $body = implode(" ",$body);
      $send_mail->send_email($toEmail, $name, $subject, $body);
      
      if ($rest_accept) {
        return response()->json([
          'result' => 'success',
          'data' => []
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'failed accept'
        ]);
      }
    } catch (Exception $th) {
      \Log::info(['++++++++++ associateRequest +++++++++', $th->getMessage()]);
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function getassociatedStudents(Request $request)
  {
    try{
      $email = $request->email;
      $user_info = User::where('email', $email)->first();
      $user_id = $user_info->id;
      $temp_associate_id = [];
      $rest_accept = DB::table('associates')
        ->where(function($query) use ($user_id){
          $query->where('request_id', $user_id)
            ->orWhere('response_id', $user_id);
        })
        ->where('accepted', true)
        ->get();
      foreach ($rest_accept as $key => $value) {
        if ($value->request_id == $user_id) {
          $user_info = User::select('id', 'email', 'avatar')->where('id', $value->response_id)->first();
          $temp_associate_id[$key] = $user_info;
        } else {
          $user_info = User::select('id', 'email', 'avatar')->where('id', $value->request_id)->first();
          $temp_associate_id[$key] = $user_info;
        }
      }
      if ($rest_accept) {
        return response()->json([
          'result' => 'success',
          'data' => $temp_associate_id
        ]);
      }
    } catch (Exception $th) {
      \Log::info(['++++++++++ associateRequest +++++++++', $th->getMessage()]);
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
}
