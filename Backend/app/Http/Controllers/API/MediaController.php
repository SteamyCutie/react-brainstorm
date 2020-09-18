<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Media;
use App\Models\User;

class MediaController extends Controller
{
    public function __construct()
    {

    }

    public function getMediaShare(Request $request)
    {
        $email = $request['email'];
        $user_id = User::select('id')->where('email', $email)->first();
        $share_info = Media::where('user_id', $user_id['id'])->get();
        for($i = 0; $i < count($share_info); $i++){
            $date = $share_info[$i]['created_at'];
            $share_info[$i]['day'] = date('d/m/y', strtotime($date));
            $share_info[$i]['time'] = date('h:i a', strtotime($date));
        }
        if ($share_info == null) {
            return response()->json([
                'result'=> 'failed',
                'message'=> 'Current User Does Not Exist',
            ]);
        } else {
            return response()->json([
                'result'=> 'success',
                'data'=> $share_info,
            ]);
        }
    }

    public function createShareInfo(Request $request)
    {
        $email = $request['email'];
        $title = $request['title'];
        $description = $request['description'];
        $media_url = $request['media_url'];

        $user = User::where('email', $email)->first();

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

        $user = User::where('email', $email)->get();

        $user = Media::create([
            'title' => $title,
            'description' => $description,
            'media_url' => $media_url,
            'user_id' => $user[0]['id']
        ]);

        return response()->json([
            'result'=> 'success',
            'data'=> []        
        ]);
    }
}
