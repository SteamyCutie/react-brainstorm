<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
  public function addLibrary(Request $request) {
    try{
      $mentor_name = $request->mentor_name;
      $student_id = $request->student_id;
      $media_url = $request->media_url;
      
      $add_result = Report::create([
        'student_id' => $student_id,
        'mentor_name' => $mentor_name,
        'media_url' => $media_url,
      ]);
      
      if ($add_result) {
        return response()->json([
          'result'=> 'success',
          'message' => 'added Report'
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
}
