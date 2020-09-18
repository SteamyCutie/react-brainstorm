<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Session;
use App\Models\Tag;
use App\Models\User;

class SessionController extends Controller
{
  function getAllForum(Request $request)
  {
    $email = $request['email'];
    $user_id = User::select('id', 'is_mentor')->where('email', $email)->first();
    if ($user_id->is_mentor == 0){
      return response()->json([
        'result'=> 'success',
        'data'=> [],
      ]);
    }
    $session_info = Session::where('user_id', $user_id['id'])->get();
    foreach ($session_info as $key => $value) {
      $from_date = $value['from'];
      $to_date = $value['to'];
      $session_info[$key]['day'] = date('d/m/y', strtotime($from_date));
      $session_info[$key]['from_time'] = date('h:i a', strtotime($from_date));
      $session_info[$key]['to_time'] = date('h:i a', strtotime($to_date));
      
      $str_invited = $value['invited_id'];
      $invited_id = explode(',',$str_invited);
      $session_info[$key]['invited'] = $invited_id;
      
      foreach ($invited_id as $user_key => $user_value) {
        $avatar = User::select('avatar')->where('id', $user_value)->first();
        $avatar_url[$user_key] = $avatar['avatar'];
      }
      $session_info[$key]['avatar'] = $avatar_url;
      
      $str_tags = $value['tags_id'];
      $tags_id = explode(',',$str_tags);
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
  }
  
  function getForum(Request $request)
  {
    $id = $request['id'];
    $temp_names = [];
    $forum = Session::where('id', $id)->first();
    if ($forum['tags_id'] == null || $forum['tags_id'] == '')
      $tags_id = [];
    else
      $tags_id = explode(',', $forum['tags_id']);
    
    $forum['tags'] = $tags_id;
    foreach ($tags_id as $tag_key=> $tag_id) {
      $tag_names = Tag::select('name')->where('id', $tag_id)->first();
      $temp_names[] = $tag_names->name;
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
    
    $forum['day'] = $day;
    $forum['from'] = $from;
    $forum['to'] = $to;
    return response()->json([
      'result'=> 'success',
      'data'=> $forum,
    ]);
  }
  
  function createForum(Request $request)
  {
    $email = $request['email'];
    $user_id = User::select('id')->where('email', $email)->first();
    $title = $request['title'];
    $description = $request['description'];
    $tags = implode(",", $request['tags']);
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
    
    Session::create([
      'user_id' => $user_id['id'],
      'title' => $title,
      'description' => $description,
      'tags_id' => $tags,
      'from' => $from_day_str,
      'to' => $to_day_str,
      'status' => 0,
    ]);
    
    return response()->json([
      'result'=> 'success',
      'data'=> [],
    ]);
  }
  
  function editForum(Request $request)
  {
    
    $id = $request['id'];
    $title = $request['title'];
    $description = $request['description'];
    $tags = implode(",", $request['tags']);
    
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
    
    $forum = Session::where('id', $id)->get();
    
    if ($forum == null || count($forum) == 0) {
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
  }
  
  function  deleteForum(Request $request) {
    $session_id = $request['id'];
    $res = Session::where('id', $session_id)->delete();
    if ($res) {
      return response()->json([
        'result'=> 'success',
      ]);
    } else {
      return response()->json([
        'result'=> 'failed',
      ]);
    }
  }
  
  function getHistory(Request $request)
  {
    $result_res = [];
    $email = $request['email'];
    $user_id = User::select('id','name', 'avatar')->where('email', $email)->first();
    $session_infos = Session::select('id', 'user_id', 'invited_id', 'from','tags_id')->where('status', '3')->get();
    
    foreach ($session_infos as $session_key => $session_info)
    {
      $result_from = $session_info['from'];
      $result_tag = $session_info['tags_id'];
      $tags_id = explode(',',$result_tag);
      
      $result_invited = $session_info['invited_id'];
      $invited_id = explode(',', $result_invited);
      
      foreach ($invited_id as $invited_key => $invited_value) {
        if (trim($invited_value) == $user_id['id'])
        {
          $result_res[$session_key] = $session_info;
          
          $result_res[$session_key]['day'] = date('d/m/y', strtotime($result_from));
          $result_res[$session_key]['time'] = date('h:i a', strtotime($result_from));
          
          foreach ($tags_id as $tag_key => $tag_value) {
            $tags = Tag::select('name')->where('id', $tag_value)->first();
            $tag_names[$tag_key] = $tags['name'];
          }
          $result_res[$session_key]['tag_name'] = $tag_names;
          $menter_name = User::select('name')->where('id', $session_info['user_id'])->first();
          $result_res[$session_key]['name'] = $menter_name['name'];
          $result_res[$session_key]['avatar'] = $user_id['avatar'];
        }
      }
    }
    return response()->json([
      'result'=> 'success',
      'data'=> $result_res,
    ]);
  }
  
  function getUpcomingSession(Request $request)
  {
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
      $result_infos = Session::where('user_id', '!=', $user->id)->where('from','>=',date('y-m-d h:i:s', strtotime($current_time)))->get();
      if ($tag_id == "" || $tag_id == null) {
        $temp1 = $result_infos;
      } else {
        foreach ($result_infos as $tags_key => $result_info) {
          $tag_array = explode(',', $result_info['tags_id']);
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
        $tags_id = explode(',',$result_tag);
        $result_invited = $session_info['invited_id'];
        $invited_id = explode(',', $result_invited);
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
        $mentor_name = User::select('name')->where('id', $session_info['user_id'])->first();
        $temp['name'] = $mentor_name['name'];
        $temp['avatar'] = $user['avatar'];
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
          $tag_array = explode(',', $tags_value->tags_id);
          for ($j = 0; $j < count($tag_array); $j++) {
            if ($tag_id == trim($tag_array[$j])){
              $result_res[] = $result_tags[$tags_key];
            }
          }
        }
      }
      
      $mentor = User::select('name')->where('id', $user->id)->first();
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
        
        $tags_id = explode(',', $result_res[$i]['tags_id']);
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
        $result_res[$i]['avatar'] = $user['avatar'];
        $result_res[$i]['mentor_name'] = $mentor->name;
      }
    }
    
    return response()->json([
      'result'=> 'success',
      'data'=> $result_res,
    ]);
  }
}
