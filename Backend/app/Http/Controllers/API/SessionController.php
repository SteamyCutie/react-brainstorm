<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\PostedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\Session;
use App\Models\Tag;
use App\Models\User;
use App\Models\Review;
use App\Models\Invited;
use Carbon\Carbon;
use DateTime;
use Log;

class SessionController extends Controller
{
  function getAllScheduleLiveForum(Request $request)
  {
    try{
      $email = $request['email'];
      $user_id = User::select('id', 'is_mentor')->where('email', $email)->first();
      
      if ($user_id->is_mentor == 0){
        return response()->json([
          'result'=> 'success',
          'data'=> [],
        ]);
      }
      $current_timestamp = Carbon::now()->timestamp;
      $current_time = date("y-m-d h:i:s");
      $pasted_session_id = Review::select('session_id')->get();
      $session_info = Session::where('user_id', $user_id['id'])
//        ->where('created_id', $user_id['id'])
        ->where('forum_end', '>', $current_timestamp)
        ->whereNotIn('id',$pasted_session_id)
        ->get();
      foreach ($session_info as $key => $value) {
        $from_date = $value['from'];
        $to_date = $value['to'];
        $session_info[$key]['day'] = date('Y-m-d', strtotime($from_date));
        $session_info[$key]['from_time'] = date('h:i a', strtotime($from_date));
        $session_info[$key]['to_time'] = date('h:i a', strtotime($to_date));
        $res_students = Invited::select('student_id')->where('session_id', $value->id)->get();
        $temp_st = [];
        foreach ($res_students as $st_key => $st_value) {
          $res_st = User::select('id', 'name', 'email', 'channel_name', 'tags_id', 'is_mentor', 'hourly_price', 'pay_verified',
            'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
            'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count')
            ->where('id', $st_value->student_id)->first();
          $temp_st[$st_key] = $res_st;
        }
        $session_info[$key]['student_info'] = $temp_st;
        
        $str_tags = $value['tags_id'];
        $tags_id = explode(',',trim($str_tags, ','));
//        $session_info[$key]['tags'] = $tags_id;
        $tag_names = [];
        foreach ($tags_id as $tag_key => $tag_value) {
          $tags = Tag::select('name')->where('id', $tag_value)->first();
          $tag_names[$tag_key]['id'] = $tag_value;
          $tag_names[$tag_key]['name'] = $tags['name'];
        }
        $attach_infos = Media::where('session_id', $value->id)->get();
        $temp_attach = [];
        foreach ($attach_infos as $value) {
          $temp = [];
          $temp['name'] = $value->origin_name;
          $temp['path'] = $value->media_url;
          $temp_attach[] = $temp;
        }
        $session_info[$key]['tag_name'] = $tag_names;
        $session_info[$key]['attachments'] = $temp_attach;
        unset($session_info[$key]['day']);
        unset($session_info[$key]['from_time']);
        unset($session_info[$key]['to_time']);
        unset($session_info[$key]['to']);
        unset($session_info[$key]['from']);
        unset($session_info[$key]['tags_id']);
        unset($session_info[$key]['posted']);
        unset($session_info[$key]['status']);
        unset($session_info[$key]['created_id']);
        unset($session_info[$key]['tags_id']);
        unset($session_info[$key]['created_at']);
        unset($session_info[$key]['updated_at']);
      }
      if ($session_info == null) {
        return response()->json([
          'result'=> 'failed',
          'message'=> 'Current User Does Not Exist',
        ]);
      } else {
        return response()->json([
          'result'=> 'success',
          'data'=> $session_info,
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function getForum(Request $request)
  {
    try{
      $id = $request['id'];
      $temp_names = [];
      $forum = Session::where('id', $id)->first();
      if ($forum['tags_id'] == ",,"){
        $tags_id = [];
        $forum['tags_id'] = "";
      }
      else {
        $tags_id = explode(',', trim($forum['tags_id'], ','));
      }
      $forum['tags'] = $tags_id;
      foreach ($tags_id as $tag_key=> $tag_id) {
        $tag_names = Tag::select('name')->where('id', $tag_id)->first();
        if ($tag_names) {
          $temp_names[] = $tag_names->name;
        }
      }
      $forum['tags_name'] = $temp_names;
//      if ($forum['from'] == "" || $forum['from'] == null) {
//        $from = "";
//        $day = "";
//      } else {
//        $from = date("h:i", strtotime($forum['from']));
//        $day = date("Y-m-d", strtotime($forum['from']));
//      }
//
//      if ($forum['to'] == "" || $forum['to'] == null)
//        $to = "";
//      else
//        $to = date("h:i", strtotime($forum['to']));
      
      $temp_email = [];
      $temp_id = [];
      $temp_st = [];
      $m_inviteds = Invited::where('session_id', $id)->get();
      foreach ($m_inviteds as $invited_key => $invited) {
        $st_info = User::select('id', 'name', 'email', 'channel_name', 'tags_id', 'is_mentor', 'hourly_price', 'pay_verified',
          'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
          'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count')
          ->where('id', $invited->student_id)->first();
        $temp_email[$invited_key] = $st_info->email;
        $temp_id[$invited_key] = $invited->student_id;
        $temp_st[$invited_key] = $st_info;
      }
      
//      $forum['day'] = $day;
//      $forum['from'] = $from;
//      $forum['to'] = $to;
      $forum['students_email'] = $temp_email;
      $forum['students_id'] = $temp_id;
      $forum['students'] = $temp_st;
      return response()->json([
        'result'=> 'success',
        'data'=> $forum,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function getOpenedForum(Request $request) {
    try{
//      $openForums = DB::table('sessions')
//        ->where('opened', true)
//        ->join('users', 'sessions.user_id', '=', 'users.id')
//        ->join('medias', 'sessions.id', '=', 'medias.session_id')
//        ->select('users.name', 'users.avatar', 'medias.media_url', 'medias.media_type', 'sessions.title', 'sessions.description', 'sessions.tags_id')
//        ->get();
      $current_timestamp = Carbon::now()->timestamp;
      $openForums = Session::where('opened', true)->where('forum_end', '>', $current_timestamp)->get();
      $openInfo = [];
      $allowed = array('gif', 'png', 'jpg', 'bmp', 'mp4', 'avi');
      foreach ($openForums as $forum) {
        $mediaUrl = '';
        $mediaType = '';
        $userInfo = User::where('id', $forum->user_id)->first();
        $mediaInfo = Media::where('session_id', $forum->id)
          ->where('isForum', true)
          ->where(function($query){
            $query->where('media_type', 'image')
              ->orWhere('media_type', 'video');
          })
          ->first();
        
        if ($mediaInfo) {
          $mediaUrl = $mediaInfo->media_url;
          $mediaType = $mediaInfo->media_type;
        } else {
          $mediaType = 'other';
        }
        //TODO filter file extension
        $ext = pathinfo($mediaUrl, PATHINFO_EXTENSION);
        if (!in_array($ext, $allowed)) {
          $mediaType = 'other';
        }
        $temp_names = [];
        if ($forum->tags_id == ",,"){
          $tags_id = [];
        } else {
          $tags_id = explode(',', trim($forum->tags_id, ','));
        }
        foreach ($tags_id as $tag_key=> $tag_id) {
          $tag_names = Tag::select('name')->where('id', $tag_id)->first();
          if ($tag_names) {
            $temp_names[] = $tag_names->name;
          }
        }
        $tempOpenInfo['name'] = $userInfo->name;
        $tempOpenInfo['avatar'] = $userInfo->avatar;
        $tempOpenInfo['path'] = $mediaUrl;
        $tempOpenInfo['type'] = $mediaType;
        $tempOpenInfo['title'] = $forum->title;
        $tempOpenInfo['price'] = $forum->price;
        $tempOpenInfo['description'] = $forum->description;
        $tempOpenInfo['tags'] = $temp_names;
        $openInfo[] = $tempOpenInfo;
      }
      return response()->json([
        'result' => 'success',
        'data' => $openInfo
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'message' => $th->getMessage()
      ]);
    }
  }
  
  function createForum(Request $request)
  {
    try{
      $forumInfo = json_decode($request->forumInfo);
      $validatorArrays =  (array) $forumInfo;
      $email = $forumInfo->email;
      $title = $forumInfo->title;
      $description = $forumInfo->description;
      $language = $forumInfo->language;
      $forum_start = $forumInfo->forum_start;
      $forum_end = $forumInfo->forum_end;
      $opened = $forumInfo->opened;
      $tags = ','.implode(",", $forumInfo->tags).',';
      //TODO Validation Check
      $rules = array(
        'title' => 'required',
        'description' => 'required',
      );
      $messages = array(
        'required' => 'This field is required.',
      );
      $validator = Validator::make( $validatorArrays ,$rules, $messages );
      if ($res = $validator->fails())
      {
        return response()->json([
          'result' => 'failed',
          'type' => 'require',
          'message' => $validator->messages()
        ]);
      }
      //TODO Mentor hourly, plan_fee check
      $user_id = User::select('id', 'hourly_price' , 'sub_plan_fee', 'avatar', 'name')->where('email', $email)->first();
      if ($user_id->hourly_price == 0 || $user_id->sub_plan_fee == 0) {
        return [
          'result' => 'warning',
          'message' => 'You should input hourly price or subscription plan fee',
        ];
      }
      //TODO past time check
      $back_timestamp = Carbon::now()->timestamp;
      if ( $forum_start < $back_timestamp ) {
        return response()->json([
          'result' => 'warning',
          'message' => 'Please select correct Forum time',
        ]);
      }
      //TODO same Forum check
      $same_session = Session::where('user_id', $user_id->id)->where('forum_start', $forum_start)->where('forum_end', $forum_end)->get();
      if (count($same_session) > 0) {
        return response()->json([
          'result' => 'warning',
          'message' => 'The same Forum already exists.'
        ]);
      }
      //TODO Open Forum
      if ( $opened ) {
        try {
          $ageLimitation = $forumInfo->ageLimitation;
          $sessionInfo = Session::create([
            'user_id' => $user_id['id'],
            'title' => $title,
            'description' => $description,
            'tags_id' => $tags,
            'from' => date('Y-m-d H:i:s', $forum_start),
            'to' => date('Y-m-d H:i:s', $forum_end),
            'forum_start' => $forum_start,
            'forum_end' => $forum_end,
            'status' => 0,
            'language' => $language,
            'room_id' => mt_rand(100000,999999),
            'created_id' => $user_id['id'],
            'opened' => $opened,
            'age_limitation' => $ageLimitation,
            'price' => $forumInfo->price,
          ]);
          //TODO save attached files
          $file = $request['files'];
          if ($file != NULL) {
            for ($i = 0; $i < count($file); $i++) {
              $mimeType = $file[$i]->getClientMimeType();
              $mediaType = explode("/", $mimeType);
              $file_origin_name = $file[$i]->getClientOriginalName();
              $file_name = time().'_'.rand(100000, 999999).'_'.$file_origin_name;
              $file = $request->file('files');
              $s3 = Storage::disk('s3');
              $s3->put($file_name, file_get_contents($file[$i]), 'public');
              $file_path = $s3->url($file_name);
              
              Media::create([
                'title' => $title,
                'description' => $description,
                'media_url' => $file_path,
                'origin_name' => $file_origin_name,
                'user_id' => $user_id['id'],
                'session_id' => $sessionInfo->id,
                'media_type' => $mediaType[$i],
                'isForum' => true,
              ]);
            }
          }
          //TODO send Email to mentor in opened Forum
          $send_mail = new Controller;
          $subject = "Opened Forum have been created!";
          $fronturl = env("APP_URL");
          $from = date('Y-m-d H:i:s', $forum_start);
          $mentor_avatar = $user_id->avatar;
          $mentor_name = $user_id->name;
          $name = $user_id->name;
          $toEmail = $email;
          $app_path = app_path();
          $body = include($app_path.'/Mails/Session.php');
          $body = implode(" ",$body);
          $send_mail->send_email($toEmail, $name, $subject, $body);
          //TODO get associated members for opened Forum
          $userId = $user_id->id;
          $associate_users = DB::table('associates')
            ->where('request_id', $userId)
            ->where('status', 'Connected')
            ->orWhere(function($query) use ($userId){
              $query->where('response_id', $userId)
                ->where('status', 'Connected');
            })
            ->get();
          $temp_users = [];
          foreach ($associate_users as $value) {
            if ($value->request_id != $userId) {
              $temp_users[] = $value->request_id;
            } else {
              $temp_users[] = $value->response_id;
            }
          }
          //TODO send Email to associated members in opened Forum
          for ($i = 0; $i < count($temp_users); $i ++){
            $userInfo = User::select('id', 'hourly_price' , 'sub_plan_fee', 'avatar', 'name')->where('id', $temp_users[$i])->first();
            $toEmail = $userInfo->email;
            $name = $userInfo->name;
            $send_mail->send_email($toEmail, $name, $subject, $body);
          }
          return response()->json([
            'result'=> 'success',
            'data'=> [],
          ]);
        } catch (Exception $th) {
          return response()->json([
            'result'=> 'failed',
            'message'=> $th->getMessage(),
          ]);
        }
      }
      //TODO Default Forum
      $res_session = Session::create([
        'user_id' => $user_id['id'],
        'title' => $title,
        'description' => $description,
        'tags_id' => $tags,
        'from' => date('Y-m-d H:i:s', $forum_start),
        'to' => date('Y-m-d H:i:s', $forum_end),
        'forum_start' => $forum_start,
        'forum_end' => $forum_end,
        'status' => 0,
        'language' => $language,
        'room_id' => mt_rand(100000,999999),
        'created_id' => $user_id['id'],
      ]);
      //TODO send Email to mentor
      $send_mail = new Controller;
      $subject = "You have been invited for Forum!";
      $fronturl = env("APP_URL");
      $from = $res_session->from;
      $mentor_avatar = $user_id->avatar;
      $mentor_name = $user_id->name;
      $name = $user_id->name;
      $toEmail = $email;
      $app_path = app_path();
      $body = include($app_path.'/Mails/Session.php');
      $body = implode(" ",$body);
      $send_mail->send_email($toEmail, $name, $subject, $body);
      //TODO set notification when create Forum
      PostedNotification::create([
        'user_id' => $user_id['id'],
        'session_id' => $res_session->id,
        'session_title' => $res_session->title,
        'from' => $res_session->from,
        'to' => $res_session->to,
        'forum_start' => $res_session->forum_start,
        'forum_end' => $res_session->forum_end,
        'is_mentor' => true,
        'avatar' => $mentor_avatar,
        'type' => 'Session',
      ]);
      $students = $forumInfo->students;
      for ($i = 0; $i < count($students); $i++) {
        Invited::create([
          'mentor_id' => $user_id->id,
          'student_id' => $students[$i],
          'session_id' => $res_session->id,
        ]);
        $st_info = User::select('email', 'name')->where('id', $students[$i])->first();
        PostedNotification::create([
          'user_id' => $students[$i],
          'session_id' => $res_session->id,
          'session_title' => $res_session->title,
          'from' => $res_session->from,
          'to' => $res_session->to,
          'forum_start' => $res_session->forum_start,
          'forum_end' => $res_session->forum_end,
          'is_mentor' => false,
          'avatar' => $mentor_avatar,
          'type' => 'Session',
        ]);
        $toEmail = $st_info->email;
        $name = $st_info->name;
        $send_mail->send_email($toEmail, $name, $subject, $body);
      }
      return response()->json([
        'result'=> 'success',
        'data'=> [],
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function editForum(Request $request)
  {
    try{
      $forumInfo = json_decode($request->forumInfo);
      $validatorArrays =  (array) $forumInfo;
      $email = $forumInfo->email;
      $id = $forumInfo->id;
      $title = $forumInfo->title;
      $description = $forumInfo->description;
      $language = $forumInfo->language;
      $opened = $forumInfo->opened;
      $tags = ','.implode(",", $forumInfo->tags).',';
      $user_id = User::where('email', $email)->pluck('id')->first();
//      $from = $forumInfo->$request['from'];
//      $to = $forumInfo->$request['to'];
//      $day = $forumInfo->$request['day'];
//      $from_arr = explode(":", $from);
//      $to_arr = explode(":", $to);
//
//      $from_day_str = $day . " " . $from_arr[0] . ":" . $from_arr[1] . ":00";
//      $to_day_str = $day . " " . $to_arr[0] . ":" . $to_arr[1] . ":00";
      $forum_start = $forumInfo->forum_start;
      $forum_end = $forumInfo->forum_end;
      //TODO Validation Check
      $rules = array(
        'title' => 'required',
        'description' => 'required',
      );
      $messages = array(
        'required' => 'This field is required.',
      );
      $validator = Validator::make( $validatorArrays, $rules, $messages );
      if ($validator->fails())
      {
        return [
          'result' => 'failed',
          'type' => 'require',
          'message' => $validator->messages()
        ];
      }
      //TODO existing forum check
      $forum = Session::where('id', $id)->first();
      if ($forum == null || $forum == "") {
        return response()->json([
          'result'=> 'failed',
          'message'=> 'Current Session Does Not Exist',
        ]);
      }
      //TODO Open Forum
      if ($opened) {
        try {
          $ageLimitation = $forumInfo->ageLimitation;
          //TODO remove modified files. Media table.
          $attachments = $forumInfo->attachments;
          $existInfos = [];
          foreach ($attachments as $value) {
            $existInfos[] = $value->path;
          }
          $removeInfos = Media::where('session_id', $id)->whereNotIn('media_url', $existInfos)->get();
          foreach ($removeInfos as $value) {
            $s3 = Storage::disk('s3');
            if($s3->exists(basename($value->media_url))) {
              $s3->delete(basename($value->media_url));
            }
            Media::where('media_url', $value->media_url)->delete();
          }
          //TODO update Session table.
          $sessionInfo = Session::where('id', $id)->update(array(
            'title' => $title,
            'description' => $description,
            'tags_id' => $tags,
            'from' => date('Y-m-d H:i:s', $forum_start),
            'to' => date('Y-m-d H:i:s', $forum_end),
            'forum_start' => $forum_start,
            'forum_end' => $forum_end,
            'language' => $language,
            'age_limitation' => $ageLimitation,
            'price' => $forumInfo->price,
          ));
          //TODO save attached files
          $file = $request['files'];
          if ($file != NULL) {
            for ($i = 0; $i < count($file); $i++) {
              $mimeType = $file[$i]->getClientMimeType();
              $mediaType = explode("/", $mimeType);
              $file_origin_name = $file[$i]->getClientOriginalName();
              $file_name = time().'_'.rand(100000, 999999).'_'.$file_origin_name;
              $file = $request->file('files');
              $s3 = Storage::disk('s3');
              $s3->put($file_name, file_get_contents($file[$i]), 'public');
              $file_path = $s3->url($file_name);
              Media::create([
                'title' => $title,
                'description' => $description,
                'media_url' => $file_path,
                'origin_name' => $file_origin_name,
                'user_id' => $user_id,
                'session_id' => $id,
                'media_type' => $mediaType[$i],
                'isForum' => true,
              ]);
            }
          }
          return response()->json([
            'result'=> 'success',
            'data'=> [],
          ]);
        } catch (Exception $th) {
          return response()->json([
            'result'=> 'failed',
            'message'=> $th->getMessage(),
          ]);
        }
      }
      //TODO refresh invited students
      $students = $forumInfo->students;
      Invited::where('session_id', $id)->delete();
      for ($j = 0; $j < count($students); $j++ ){
        Invited::create([
          'mentor_id' => $forum->user_id,
          'session_id' => $id,
          'student_id' => $students[$j]
        ]);
      }
      Session::where('id', $id)->update(array(
        'title' => $title,
        'description' => $description,
        'tags_id' => $tags,
        'language' => $language,
        'from' => date('Y-m-d H:i:s', $forum_start),
        'to' => date('Y-m-d H:i:s', $forum_end),
        'forum_start' => $forum_start,
        'forum_end' => $forum_end,
      ));
      return response()->json([
        'result'=> 'success',
        'data'=> $forum,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function  deleteForum(Request $request) {
    try{
      $session_id = $request['id'];
      $res = Session::where('id', $session_id)->delete();
      $res_invite = Invited::where('session_id', $session_id)->delete();
      $res_posted = PostedNotification::where('session_id', $session_id)->delete();
      //TODO delete from s3
      $s3 = Storage::disk('s3');
      $mediaInfos = Media::where('session_id', $session_id)->pluck('media_url')->all();
      foreach ($mediaInfos as $value) {
        if($s3->exists(basename($value))) {
          $s3->delete(basename($value));
        }
      }
      Media::where('session_id', $session_id)->delete();
      return response()->json([
        'result'=> 'success',
        'data' => []
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function deleteInvitedUser(Request $request) {
    try{
      $session_id = $request['session_id'];
      $student_id = $request['student_id'];
      $res = Invited::where('session_id', $session_id)->where('student_id', $student_id)->delete();
      if ($res ) {
        return response()->json([
          'result'=> 'success',
        ]);
      } else {
        return response()->json([
          'result'=> 'failed',
          'message'=> 'remove invited student',
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function inviteParticipantToRoom(Request $request) {
    try{
      $room_id = $request['roomName'];
      $user_email = $request['participantId'];
      $user_info = User::where('email', $user_email)->first();
      $session_info = Session::where('room_id', $room_id)->first();
      $res = Invited::create([
        'mentor_id' => $session_info->user_id,
        'session_id' => $session_info->id,
        'student_id' => $user_info->id,
      ]);
      if ($res ) {
        return response()->json([
          'result'=> 'success',
        ]);
      } else {
        return response()->json([
          'result'=> 'failed',
          'message'=> 'failed invite student',
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function getHistory(Request $request)
  {
    try{
      $result_res = [];
      $email = $request['email'];
      $tag_id = $request['tag_id'];
      $req_time = $request['time'];
      $user = User::select('id', 'is_mentor')->where( 'email', $email)->first();
      
      if ($req_time != null || $req_time != "") {
        $from_time = trim(explode('~', $req_time)[0]);
        $to_time = trim(explode('~', $req_time)[1]);
      } else {
        $from_time = "";
        $to_time = "";
      }
      $result_infos = [];
      if ($user['is_mentor'] == 0) {
        $invited_session_id = Invited::select('session_id')->where('student_id', $user->id)->get();
        $result_infos = Session::where('user_id', '!=', $user->id)
          ->where(function ($query) {
            $current_time = date("y-m-d h:i:s");
            $pasted_session_id = Review::select('session_id')->get();
            $query->where('from','<',date('y-m-d h:i:s', strtotime($current_time)))
              ->orwhereIn('id',$pasted_session_id);
          })
          ->whereIn('id',$invited_session_id)
          ->get();
      } else if ($user['is_mentor'] == 1) {
        $result_infos = Session::where('user_id', $user->id)
          ->where(function ($query) {
            $current_time = date("y-m-d h:i:s");
            $pasted_session_id = Review::select('session_id')->get();
            $query->where('from','<',date('y-m-d h:i:s', strtotime($current_time)))
              ->orwhereIn('id',$pasted_session_id);
          })
          ->get();
      }
      $temp1 = [];
      $temp2 = [];
      
      if ($tag_id == "" || $tag_id == null) {
        $temp1 = $result_infos;
      } else {
        foreach ($result_infos as $tags_key => $result_info) {
          $tag_array = explode(',', trim($result_info['tags_id'], ','));
          for ($j = 0; $j < count($tag_array); $j++) {
            if ($tag_id == trim($tag_array[$j])){
              $temp1[] = $result_info;
            }
          }
        }
      }
      
      if ($from_time == "" || $to_time == "") {
        $temp2 = $temp1;
      } else {
        foreach ($temp1 as $key => $result) {
          if ((date('y-m-d', strtotime($result->from)) >= date('y-m-d', strtotime($from_time)))
            && (date('y-m-d', strtotime($result->to)) <= date('y-m-d', strtotime($to_time)))) {
            $temp2[] = $result;
          }
        }
      }
      foreach ($temp2 as $session_key => $session_info)
      {
        $result_from = $session_info['from'];
        $result_to = $session_info['to'];
        $result_tag = $session_info['tags_id'];
        $tags_id = explode(',', trim($result_tag, ','));
        $temp = [];
        $temp = $session_info;
        $temp['day'] = date('d/m/y', strtotime($result_from));
        $temp['from_time'] = date('h:i a', strtotime($result_from));
        $temp['to_time'] = date('h:i a', strtotime($result_to));
        $tag_names = [];
        foreach ($tags_id as $tag_key => $tag_value) {
          $tags = Tag::select('name')->where('id', $tag_value)->first();
          $tag_names[$tag_key]['id'] = $tag_value;
          $tag_names[$tag_key]['name'] = $tags['name'];
        }
        $temp['tag_name'] = $tag_names;
        $mentor_name = User::select('name', 'avatar')->where('id', $session_info['user_id'])->first();
        $temp['name'] = $mentor_name['name'];
        $temp['avatar'] = $mentor_name['avatar'];
        $result_res[] = $temp;
      }
      
      return response()->json([
        'result'=> 'success',
        'data'=> $result_res,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function getUpcomingSession(Request $request)
  {
    try{
      $result_res = [];
      $email = $request['email'];
      $tag_id = $request['tag_id'];
      $req_time = $request['time'];
      $user = User::select('id', 'is_mentor')->where( 'email', $email)->first();
      $current_time = date("y-m-d h:i:s");
      $pasted_session_id = Review::select('session_id')->get();
      if ($req_time != null || $req_time != "") {
        $from_time = trim(explode('~', $req_time)[0]);
        $to_time = trim(explode('~', $req_time)[1]);
      } else {
        $from_time = "";
        $to_time = "";
      }
      if ($user['is_mentor'] == 0) {
        $temp1 = [];
        $temp2 = [];
        
        $invited_session_id = Invited::select('session_id')->where('student_id', $user->id)->get();
        $result_infos = Session::where('user_id', '!=', $user->id)
          ->where('from','>=',date('y-m-d h:i:s', strtotime($current_time)))
          ->whereIn('id',$invited_session_id)
          ->whereNotIn('id', $pasted_session_id)
          ->get();
        
        if ($tag_id == "" || $tag_id == null) {
          $temp1 = $result_infos;
        } else {
          foreach ($result_infos as $tags_key => $result_info) {
            $tag_array = explode(',', trim($result_info['tags_id'], ','));
            for ($j = 0; $j < count($tag_array); $j++) {
              if ($tag_id == trim($tag_array[$j])){
                $temp1[] = $result_info;
              }
            }
          }
        }
        
        if ($from_time == "" || $to_time == "") {
          $temp2 = $temp1;
        }
        else {
          foreach ($temp1 as $key => $result) {
            if ((date('y-m-d', strtotime($result->from)) >= date('y-m-d', strtotime($from_time)))
              && (date('y-m-d', strtotime($result->to)) <= date('y-m-d', strtotime($to_time)))) {
              $temp2[] = $result;
            }
          }
        }
        foreach ($temp2 as $session_key => $session_info)
        {
          $result_from = $session_info['from'];
          $result_to = $session_info['to'];
          $result_tag = $session_info['tags_id'];
          $tags_id = explode(',', trim($result_tag, ','));
          $result_invited = $session_info['invited_id'];
          $invited_id = explode(',', trim($result_invited, ','));
          // foreach ($invited_id as $invited_key => $invited_value) {
          $temp = [];
          // if (trim($invited_value) == $user['id'])
          // {
          $temp = $session_info;
          $temp['day'] = date('d/m/y', strtotime($result_from));
          $temp['from_time'] = date('h:i a', strtotime($result_from));
          $temp['to_time'] = date('h:i a', strtotime($result_to));
          $tag_names = [];
          foreach ($tags_id as $tag_key => $tag_value) {
            $tags = Tag::select('name')->where('id', $tag_value)->first();
            $tag_names[$tag_key] = $tags['name'];
          }
          $temp['tag_name'] = $tag_names;
          $mentor_name = User::select('name', 'avatar')->where('id', $session_info['user_id'])->first();
          $temp['name'] = $mentor_name['name'];
          $temp['avatar'] = $mentor_name['avatar'];
          $result_res[] = $temp;
          // }
          // }
        }
      } else if ($user['is_mentor'] == 1) {
        $result_tags = Session::where('user_id', $user['id'])
          ->where('from','>=',date('y-m-d h:i:s', strtotime($current_time)))
          ->whereNotIn('id', $pasted_session_id)
          ->get();
        if ($tag_id == "" || $tag_id == null) {
          $result_res = $result_tags;
        } else {
          foreach ($result_tags as $tags_key => $tags_value) {
            $tag_array = explode(',', trim($tags_value->tags_id, ','));
            for ($j = 0; $j < count($tag_array); $j++) {
              if ($tag_id == trim($tag_array[$j])){
                $result_res[] = $result_tags[$tags_key];
              }
            }
          }
        }
        
        $mentor = User::select('name', 'avatar')->where('id', $user->id)->first();
        for ($i = 0; $i < count($result_res); $i ++) {
          $s_year = date("Y", strtotime($result_res[$i]['from']));
          $s_month = date("m", strtotime($result_res[$i]['from']));
          $s_day = date("d", strtotime($result_res[$i]['from']));
          
          $e_year = date("Y", strtotime($result_res[$i]['to']));
          $e_month = date("m", strtotime($result_res[$i]['to']));
          $e_day = date("d", strtotime($result_res[$i]['to']));
          
          $result_res[$i]['s_year'] = $s_year;
          $result_res[$i]['s_month'] = $s_month;
          $result_res[$i]['s_day'] = $s_day;
          
          $result_res[$i]['e_year'] = $e_year;
          $result_res[$i]['e_month'] = $e_month;
          $result_res[$i]['e_day'] = $e_day;
          
          $tags_id = explode(',', trim($result_res[$i]['tags_id'], ','));
          $tag_names = [];
          foreach ($tags_id as $tag_key => $tag_value) {
            $tags = Tag::select('name')->where('id', $tag_value)->first();
            $tag_names[$tag_key] = $tags['name'];
          }
          $result_res[$i]['tag_name'] = $tag_names;
          $result_res[$i]['name'] = $result_res[$i]['title'];
          $result_res[$i]['day'] = date('d/m/y', strtotime($result_res[$i]['from']));
          $result_res[$i]['from_time'] = date('h:i a', strtotime($result_res[$i]['from']));
          $result_res[$i]['to_time'] = date('h:i a', strtotime($result_res[$i]['to']));
          $result_res[$i]['avatar'] = $mentor['avatar'];
          $result_res[$i]['mentor_name'] = $mentor->name;
        }
      }
      
      return response()->json([
        'result'=> 'success',
        'data'=> $result_res,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  public function bookSession(Request $request) {
    try{
      $mentor_id = $request['mentor_id'];
      $student_id = $request['user_id'];
      $tags = User::select('tags_id', 'name', 'hourly_price', 'sub_plan_fee')->where('id', $mentor_id)->first();
      $st_info = User::select('hourly_price', 'sub_plan_fee')->where('id', $student_id)->first();
      if (!$st_info->hourly_price) {
        return [
          'result' => 'warning',
          'message' => 'You must input hourly or subscription plan fee',
        ];
      }
      if (!$tags->hourly_price) {
        return [
          'result' => 'warning',
          'message' => 'Mentor\'s hourly or subscription does not exist.',
        ];
      }
      $title = $tags->name;
      $description = $title.'\'s session';
//      $tags = ','.implode(",", $request['tags']).',';
//      $from = date('H:i:s', strtotime($request['from']));
      $from = date('Y-m-d H:i:s', $request['time_stamp']);
//      $to = $request['to'];
      $day = $request['day'];
      $from_arr = explode(":", $from);
//      $to_arr = explode(":", $to);
      
      $from_day_str = $day . " " . $from_arr[0] . ":" . $from_arr[1] . ":00";
//      $to_day_str = $day . " " . $to_arr[0] . ":" . $to_arr[1] . ":00";
      
      $same_session = Session::where('user_id', $mentor_id)->where('from', $from)->get();
      if (count($same_session) > 0) {
        return [
          'result' => 'warning',
          'message' => 'The same Forum already exists.'
        ];
      }
      $res_session = Session::create([
        'user_id' => $mentor_id,
        'title' => $title,
        'description' => $description,
        'tags_id' => $tags->tags_id,
//        'from' => $from_day_str,
        'from' => $from,
//        'to' => $to_day_str,
        'forum_start' => $request['time_stamp'],
        'status' => 0,
        'room_id' => mt_rand(100000,999999),
        'created_id' => $student_id,
      ]);
      
      Invited::create([
        'mentor_id' => $mentor_id,
        'student_id' => $student_id,
        'session_id' => $res_session->id,
      ]);
      return response()->json([
        'result'=> 'success',
        'data'=> [],
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
}
