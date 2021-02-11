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
  
  public function createShareInfo(Request $request)
  {
    try{
      $email = $request['email'];
      $title = $request['title'];
      $description = $request['description'];
      $media_url = $request['media_url'];
      $media_type = $request['media_type'];
  
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
        'user_id' => $user[0]['id'],
        'media_type' => $media_type,
        'isForum' => 0
      ]);
  
      return response()->json([
        'result'=> 'success',
        'data'=> []
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
}
