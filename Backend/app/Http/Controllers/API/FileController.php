<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use http\Env\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;
use Log;

class FileController extends Controller
{
  public function __construct()
  {
  
  }
  
  public function uploadImage(Request $request)
  {
    $file = $request['files'];
    $file_origin_name = $file[0]->getClientOriginalName();
    $file_name = time().'_'.rand(100000, 999999).'_'.$file_origin_name;
    
    try {
      $s3 = Storage::disk('s3');
      $s3->put($file_name, file_get_contents($file[0]), 'public');
      
      $file_path = $s3->url($file_name);
      return response()->json([
        'result'=> 'success',
        'data'=> $file_path,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  public function uploadVideo(Request $request)
  {
    $file = $request['files'];
    $mimeType = $file[0]->getClientMimeType();
    $mediaType = explode("/", $mimeType);
    $file_origin_name = $file[0]->getClientOriginalName();
    $file_name = time().'_'.rand(100000, 999999).'_'.$file_origin_name;
    try {
      $s3 = Storage::disk('s3');
      $result = $s3->put($file_name, file_get_contents($file[0]), 'public');
      if ( !$result ) {
        return Response()->json([
          'result' => 'failed',
          'message' => 'failed upload file'
        ]);
      }
      $file_path = $s3->url($file_name);
      return response()->json([
        'result'=> 'success',
        'data'=> $file_path,
        'mimetype' => $mediaType[0],
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
}