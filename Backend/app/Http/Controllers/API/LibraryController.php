<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Library;

class LibraryController extends Controller
{
  public function addLibrary(Request $request) {
    try{
      $mentor_name = $request->mentor_name;
      $student_id = $request->student_id;
      $media_url = $request->media_url;
      $add_result = Library::create([
        'student_id' => $student_id,
        'mentor_name' => $mentor_name,
        'media_url' => $media_url,
      ]);
      
      if ($add_result) {
        return response()->json([
          'result'=> 'success',
          'message' => 'added library'
        ]);
      } else {
        return response()->json([
          'result'=> 'failed',
          'message' => config('messages.errors.cannot_create'),
        ]);
      }
    } catch (\Throwable $th) {
      return response()->json([
        'result'   => "failed",
        'message'   => config('messages.errors.cannot_create'),
      ], 500);
    }
  }
  
  public function getLibrary(Request $request) {
    try {
      $student_id = $request->student_id;
      $get_result = Library::all();
      if ($get_result) {
        return response()->json([
          'result'=> 'success',
          'data' => $get_result,
        ]);
      } else {
        return response()->json([
          'result'=> 'failed',
          'message' => config('messages.errors.cannot_get'),
        ]);
      }
    } catch (\Throwable $th) {
      return response()->json([
        'result'   => "failed",
        'message'   => config('messages.errors.cannot_create'),
      ], 500);
    }
  }
}
