<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
}
