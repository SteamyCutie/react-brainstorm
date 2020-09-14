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
    function getSession(Request $request)
    {
        $email = $request['email'];
        $user_id = User::select('id')->where('email', $email)->first();
        $session_info = Session::where('user_id', $user_id['id'])->get();
        foreach ($session_info as $key => $value) {
            $from_date = $value['from'];
            $session_info[$key]['day'] = date('d/m/y', strtotime($from_date));
            $session_info[$key]['time'] = date('h:i a', strtotime($from_date));

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

    function getforum(Request $request)
    {
        $id = $request['id'];
        $forum = Session::where('id', $id)->first();
        if ($forum['tags_id'] == null || $forum['tags_id'] == '')
            $tags_id = [];
        else
            $tags_id = explode(',', $forum['tags_id']);
        $forum['tags'] = $tags_id;
        if ($forum['from'] == "" || $forum['from'] == null)
            $from = "";
        else
            $from = date("Y-m-d", strtotime($forum['from']));

        if ($forum['from'] == "" || $forum['from'] == null)
            $to = "";
        else
            $to = date("Y-m-d", strtotime($forum['to']));

        $forum['from'] = $from;
        $forum['to'] = $to;
        return response()->json([
            'result'=> 'success',
            'data'=> $forum,
        ]);
    }

    function createforum(Request $request)
    {
        $email = $request['email'];
        $user_id = User::select('id')->where('email', $email)->first();
        $title = $request['title'];
        $description = $request['description'];
        $tags = implode(",", $request['tags']);
        $from = $request['from'];
        $to = $request['to'];

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

        Session::create([
            'user_id' => $user_id['id'],
            'title' => $title,
            'description' => $description,
            'tags_id' => $tags,
            'from' => $from,
            'to' => $to,
            'status' => 0,
        ]);

        return response()->json([
            'result'=> 'success',
            'data'=> [],
        ]);
    }

    function editforum(Request $request)
    {

        $id = $request['id'];
        $title = $request['title'];
        $description = $request['description'];
        $tags = implode(",", $request['tags']);
        $from = $request['from'];
        $to = $request['to'];

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
                'from' => $from,
                'to' => $to
            ));

            return response()->json([
                'result'=> 'success',
                'data'=> $forum,
            ]);
        }
    }

    function getHistory(Request $request)
    {
        $result_res = null;
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

        if ($result_res == null) {
            return response()->json([
                'result'=> 'failed',
                'message'=> 'Current User Does Not Exist',
            ]);
        } else {
            return response()->json([
                'result'=> 'success',
                'data'=> $result_res,
            ]);
        }
    }

    function getUpcomingSession(Request $request)
    {
        $result_res = [];
        $email = $request['email'];
        $user = User::select('id','name', 'avatar', 'is_mentor')->where('email', $email)->first();
        $session_infos = Session::select('id', 'user_id', 'invited_id', 'from','tags_id')->where('status', '1')->get();
        if ($user['is_mentor'] == 0) {
            foreach ($session_infos as $session_key => $session_info)
            {
                $result_from = $session_info['from'];
                $result_tag = $session_info['tags_id'];
                $tags_id = explode(',',$result_tag);

                $result_invited = $session_info['invited_id'];
                $invited_id = explode(',', $result_invited);

                foreach ($invited_id as $invited_key => $invited_value) {
                    $temp = [];
                    if (trim($invited_value) == $user['id'])
                    {
                        
                        $temp = $session_info;

                        $temp['day'] = date('d/m/y', strtotime($result_from));
                        $temp['time'] = date('h:i a', strtotime($result_from));

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
                    }
                }
            }
        } else if ($user['is_mentor'] == 1) {
            $user = User::select('id','name', 'avatar', 'is_mentor')->where('email', $email)->first();
            $result_res = Session::where('user_id', $user['id'])->get();

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
                $result_res[$i]['time'] = date('h:i a', strtotime($result_res[$i]['from']));
            }
        }

        if ($result_res == []) {
            return response()->json([
                'result'=> 'failed',
                'message'=> 'Session Empty',
            ]);
        } else {
            return response()->json([
                'result'=> 'success',
                'data'=> $result_res,
            ]);
        }
    }
}
