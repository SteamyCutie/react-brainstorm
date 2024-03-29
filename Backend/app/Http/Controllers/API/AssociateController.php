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
        'response_id' => $response_id,
        'status' => 'Pending'
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
          'status' => 'Connected'
        ]);
      
      $fronturl = env("APP_URL");
      $current_time = date("Y-m-d h:i a");
      $user_info = User::where('id', $request_id)->first();
      $toEmail = $user_info->email;
      $send_mail = new Controller;
      $name = $user_info->name;
      $user_info = User::where('id', $response_id)->first();
      $mentor_avatar = $user_info->avatar;
      $from_user = $user_info->name;
      $subject = $from_user." accepted your request.";
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

  function associatedecline(Request $request) {
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
          'status' => 'Declined'
        ]);
    
      if ($rest_accept) {
        return response()->json([
          'result' => 'success',
          'data' => []
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'failed decline'
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
  
  function associateunassociate(Request $request) {
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
          'status' => 'Cancelled'
        ]);
    
      if ($rest_accept) {
        return response()->json([
          'result' => 'success',
          'data' => []
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'failed unassociate.'
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
  
  function associatereassociate(Request $request) {
    try{
      $request_id = $request->request_id;
      $response_id = $request->response_id;
    
      $rest_accept1 = DB::table('associates')
        ->where('request_id', $request_id)
        ->where('response_id', $response_id)
        ->update([
          'status' => 'Pending',
          'request_id' => $response_id,
          'response_id' => $request_id
        ]);
  
      $rest_accept2 = DB::table('associates')
        ->where('request_id', $response_id)
        ->where('response_id', $request_id)
        ->update([
          'status' => 'Pending',
          'request_id' => $request_id,
          'response_id' => $response_id
        ]);
    
      if ($rest_accept1 || $rest_accept2) {
        return response()->json([
          'result' => 'success',
          'data' => []
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'failed reassociation'
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
  
  function associatewithdraw(Request $request) {
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
        ->delete();
      
      if ($rest_accept) {
        return response()->json([
          'result' => 'success',
          'data' => []
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'failed withdraw'
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
        ->where('status', 'Connected')
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
  
  function getassociationstatus (Request $request)
  {
    try{
      $request_id = $request->request_id;
      $response_id = $request->response_id;
      
      $res_associate = DB::table('associates')
        ->where('request_id', $request_id)
        ->where('response_id', $response_id)
        ->orWhere(function($query) use ($request_id, $response_id){
          $query->where('request_id', $response_id)
            ->where('response_id', $request_id);
        })
        ->first();
      
      $status = 0;
      if ($res_associate) {
        switch ($res_associate->status) {
          case 'Pending':
            $status = 0;
            break;
          case 'Connected':
            $status = 1;
            break;
          case 'Declined':
            $status = 2;
            break;
          case 'Cancelled':
            $status = 3;
            break;
        }
        if(Associate::where('response_id', $request_id)->where('request_id', $response_id)->where('status', 'Pending')->first()) {
          $status = 4;
        }
      }
      
      if ($res_associate) {
        return response()->json([
          'result' => 'success',
          'data' => $status
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'failed get status'
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
  
  function getassociatedusers(Request $request) {
    try {
      $email = $request->email;
      $rowsPerPage = $request->rowsPerPage;
      $page = $request->page;
      $user_info = User::where('email', $email)->first();
      $user_id = $user_info->id;
      
      $users_info = DB::table('users')
        ->join('associates', function ($join) use ($user_id) {
          $join->where('request_id', $user_id)
            ->on('users.id', '=', 'associates.response_id')
            ->orWhere(function($query) use ($user_id){
              $query->where('response_id', $user_id)
                    ->on('users.id', '=', 'associates.request_id');
            });
        })
        ->select('users.id', 'users.name', 'users.email', 'users.avatar', 'associates.status', 'associates.response_id')
        ->paginate($rowsPerPage);
      foreach ($users_info as $user_key =>$user_info) {
        if ($user_info) {
          switch ($user_info->status) {
            case 'Pending':
              $user_info->status = 0;
              if(Associate::where('response_id', $user_id)
                ->where('request_id', $user_info->id)
                ->where('status', 'Pending')
                ->first()) {
                $user_info->status = 4;
              }
              break;
            case 'Connected':
              $user_info->status = 1;
              break;
            case 'Declined':
              $user_info->status = 2;
              if ($user_id == $user_info->response_id) {
                unset($users_info[$user_key]);
              }
              break;
            case 'Cancelled':
              $user_info->status = 3;
              break;
            case 'Admiting':
              $user_info->status = 4;
              break;
          }
        }
      }
      return response()->json([
        'result' => 'success',
        'data' => $users_info,
        'totalRows' => $users_info->total(),
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'message' => $th->getMessage(),
      ]);
    }
  }
}
