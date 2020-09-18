<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Review;
use App\Models\User;

class ReviewController extends Controller
{
    function setreview(Request $request) {
      $email = $request->email;
      $mentor_id = $request->mentor_id;
      $mark = $request->mark;
      $review = $request->review;
      
      $rules = array(
        'review' => 'required'
      );
      $message = array(
        'required' => 'This field is required.'
      );
      $validator = Validator::make($request->all(), $rules, $message);
      if ($validator->fails()) {
        return [
          'result' => 'failed',
          'type' => 'require',
          'message' => $validator->messages()
        ];
      }
      $student = User::select('id')->where('email', $email)->first();
      $res_review = Review::create([
        'mentor_id' => $mentor_id,
        'student_id' => $student->id,
        'mark' => $mark,
        'review' => $review,
      ]);
      if($res_review) {
        return response()->json([
          'result'=> 'success',
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'Can not add review!'
        ]);
      }
    }
}
