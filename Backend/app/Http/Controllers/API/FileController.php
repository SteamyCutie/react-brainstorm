<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;

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
        'data'=> $th,
      ]);
    }
  }
  
  public function uploadVideo(Request $request)
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
        'data'=> $th,
      ]);
    }
  }
}