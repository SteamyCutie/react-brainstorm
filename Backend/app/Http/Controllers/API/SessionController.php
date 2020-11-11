<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Session;
use App\Models\Tag;
use App\Models\User;
use App\Models\Invited;
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
      $session_info = Session::where('user_id', $user_id['id'])->where('created_id', $user_id['id'])->get();
      
      foreach ($session_info as $key => $value) {
        $from_date = $value['from'];
        $to_date = $value['to'];
        $session_info[$key]['day'] = date('d/m/y', strtotime($from_date));
        $session_info[$key]['from_time'] = date('h:i a', strtotime($from_date));
        $session_info[$key]['to_time'] = date('h:i a', strtotime($to_date));
        
        $res_students = Invited::select('student_id')->where('session_id', $value->id)->get();
        $temp_st = [];
        foreach ($res_students as $st_key => $st_value) {
          $res_st = User::where('id', $st_value->student_id)->first();
          $temp_st[$st_key] = $res_st;
        }
        $session_info[$key]['student_info'] = $temp_st;
        
        $str_tags = $value['tags_id'];
        $tags_id = explode(',',trim($str_tags, ','));
        $session_info[$key]['tags'] = $tags_id;
        $tag_names = [];
        foreach ($tags_id as $tag_key => $tag_value) {
          $tags = Tag::select('name')->where('id', $tag_value)->first();
          $tag_names[$tag_key] = $tags['name'];
        }
        $session_info[$key]['tag_name'] = $tag_names;
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
        'data'=> $th,
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
      if ($forum['from'] == "" || $forum['from'] == null) {
        $from = "";
        $day = "";
      } else {
        $from = date("h:i", strtotime($forum['from']));
        $day = date("Y-m-d", strtotime($forum['from']));
      }
      
      if ($forum['to'] == "" || $forum['to'] == null)
        $to = "";
      else
        $to = date("h:i", strtotime($forum['to']));
      
      $temp_email = [];
      $temp_id = [];
      $temp_st = [];
      $m_inviteds = Invited::where('mentor_id', $forum->user_id)->get();
      foreach ($m_inviteds as $invited_key => $invited) {
        $st_info = User::select('id', 'name', 'email', 'channel_name', 'tags_id', 'is_mentor', 'hourly_price', 'pay_verified',
          'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
          'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count')
          ->where('id', $invited->student_id)->first();
        $temp_email[$invited_key] = $st_info->email;
        $temp_id[$invited_key] = $invited->student_id;
        $temp_st[$invited_key] = $st_info;
      }
      
      $forum['day'] = $day;
      $forum['from'] = $from;
      $forum['to'] = $to;
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
        'data'=> $th,
      ]);
    }
  }
  
  function createForum(Request $request)
  {
    try{
      $email = $request['email'];
      $user_id = User::select('id', 'hourly_price' , 'sub_plan_fee')->where('email', $email)->first();
      if ($user_id->hourly_price == 0 || $user_id->sub_plan_fee == 0) {
        return [
          'result' => 'warning',
          'message' => 'You should input hourly price or subscription plan fee',
        ];
      }
      $title = $request['title'];
      $description = $request['description'];
      $tags = ','.implode(",", $request['tags']).',';
      $rules = array(
        'title' => 'required',
        'description' => 'required',
      );
      
      $from = $request['from'];
      $to = $request['to'];
      $day = $request['day'];
      $from_arr = explode(":", $from);
      $to_arr = explode(":", $to);
      
      $from_day_str = $day . " " . $from_arr[0] . ":" . $from_arr[1] . ":00";
      $to_day_str = $day . " " . $to_arr[0] . ":" . $to_arr[1] . ":00";
      $messages = array(
        'required' => 'This field is required.',
      );
      $validator = Validator::make( $request->all(), $rules, $messages );
      
      if ($validator->fails())
      {
        return [
          'result' => 'failed',
          'type' => 'require',
          'message' => $validator->messages()
        ];
      }
      $same_session = Session::where('user_id', $user_id->id)->where('from', $from_day_str)->where('to', $to_day_str)->get();
      if (count($same_session) > 0) {
        return [
          'result' => 'warning',
          'message' => 'The same Forum already exists.'
        ];
      }
      $res_session = Session::create([
        'user_id' => $user_id['id'],
        'title' => $title,
        'description' => $description,
        'tags_id' => $tags,
        'from' => $from_day_str,
        'to' => $to_day_str,
        'status' => 0,
        'room_id' => mt_rand(100000,999999),
        'created_id' => $user_id['id'],
      ]);
      
      $students = $request['students'];
      for ($i = 0; $i < count($students); $i++) {
        Invited::create([
          'mentor_id' => $user_id->id,
          'student_id' => $students[$i],
          'session_id' => $res_session->id,
        ]);
      }
      
      return response()->json([
        'result'=> 'success',
        'data'=> [],
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
      ]);
    }
  }
  
  function editForum(Request $request)
  {
    try{
      $id = $request['id'];
      $title = $request['title'];
      $students = $request['students'];
      $description = $request['description'];
      $tags = ','.implode(",", $request['tags']).',';
      
      $from = $request['from'];
      $to = $request['to'];
      $day = $request['day'];
      $from_arr = explode(":", $from);
      $to_arr = explode(":", $to);
      
      $from_day_str = $day . " " . $from_arr[0] . ":" . $from_arr[1] . ":00";
      $to_day_str = $day . " " . $to_arr[0] . ":" . $to_arr[1] . ":00";
      $rules = array(
        'title' => 'required',
        'description' => 'required',
      );
      $messages = array(
        'required' => 'This field is required.',
      );
      $validator = Validator::make( $request->all(), $rules, $messages );
      
      if ($validator->fails())
      {
        return [
          'result' => 'failed',
          'type' => 'require',
          'message' => $validator->messages()
        ];
      }
      $forum = Session::where('id', $id)->first();
      Invited::where('session_id', $id)->delete();
      for ($j = 0; $j < count($students); $j++ ){
        Invited::create([
          'mentor_id' => $forum->user_id,
          'session_id' => $id,
          'student_id' => $students[$j]
        ]);
      }
      if ($forum == null || $forum == "") {
        return response()->json([
          'result'=> 'failed',
          'message'=> 'Current User Does Not Exist',
        ]);
      } else {
        Session::where('id', $id)->update(array(
          'title' => $title,
          'description' => $description,
          'tags_id' => $tags,
          'from' => $from_day_str,
          'to' => $to_day_str
        ));
        return response()->json([
          'result'=> 'success',
          'data'=> $forum,
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
      ]);
    }
  }
  
  function  deleteForum(Request $request) {
    try{
      $session_id = $request['id'];
      $res = Session::where('id', $session_id)->delete();
      $res_invite = Invited::where('session_id', $session_id)->delete();
      return response()->json([
        'result'=> 'success',
        'data' => []
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
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
        'data'=> $th,
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
      $current_time = date("y-m-d h:i:s");
      
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
          ->where('from','<',date('y-m-d h:i:s', strtotime($current_time)))
          ->whereIn('id',$invited_session_id)
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
          $temp = [];
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
        }
      }
      return response()->json([
        'result'=> 'success',
        'data'=> $result_res,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
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
        $result_tags = Session::where('user_id', $user['id'])->where('from','>=',date('y-m-d h:i:s', strtotime($current_time)))->get();
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
        'data'=> $th,
      ]);
    }
  }
  
  public function bookSession(Request $request) {
    try{
      $mentor_id = $request['mentor_id'];
      $student_id = $request['user_id'];
      $tags = User::select('tags_id', 'name', 'hourly_price', 'sub_plan_fee')->where('id', $mentor_id)->first();
      $st_info = User::select('hourly_price', 'sub_plan_fee')->where('id', $student_id)->first();
      if ($st_info->hourly_price || $st_info->sub_plan_fee) {
        return [
          'result' => 'warning',
          'message' => 'Mentor\'s hourly or subscription does not exist.',
        ];
      }
      if ($tags->hourly_price || $tags->sub_plan_fee) {
        return [
          'result' => 'warning',
          'message' => 'You must input hourly or subscription plan fee',
        ];
      }
      $title = $tags->name;
      $description = $title.'\'s session';
//      $tags = ','.implode(",", $request['tags']).',';
      $from = date('H:i:s', strtotime($request['from']));
//      $to = $request['to'];
      $day = $request['day'];
      $from_arr = explode(":", $from);
//      $to_arr = explode(":", $to);
      
      $from_day_str = $day . " " . $from_arr[0] . ":" . $from_arr[1] . ":00";
//      $to_day_str = $day . " " . $to_arr[0] . ":" . $to_arr[1] . ":00";
      
      $same_session = Session::where('user_id', $mentor_id)->where('from', $from_day_str)->get();
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
        'from' => $from_day_str,
//        'to' => $to_day_str,
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
        'data'=> $th,
      ]);
    }
  }
}
