<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
            // var_dump($tags_id);

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

    function createforum(Request $request)
    {
        $email = $request['email'];
        $user_id = User::select('id')->where('email', $email)->first();
        $title = $request['title'];
        $description = $request['description'];
        $tags = implode(",", $request['tags']);

        Session::create([
            'user_id' => $user_id['id'],
            'title' => $title,
            'description' => $description,
            'tags_id' => $tags,
            'status' => 0,
        ]);

        return response()->json([
            'result'=> 'success',
            'data'=> [],
        ]);
    }
}
