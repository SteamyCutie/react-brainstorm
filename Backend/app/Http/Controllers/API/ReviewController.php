<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Review;
use App\Models\User;

class ReviewController extends Controller
{
  function setReview(Request $request) {
    try{
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
      // get average_mark for Review and User table
      $m_marks = Review::select('mark')->where('mentor_id', $mentor_id)->get();
      $average_mark = 0;
      if (count($m_marks) > 0) {
        $all_marks = 0;
        $average_mark = 0;
        foreach ($m_marks as $m_mark) {
          $all_marks += $m_mark->mark;
        }
        $average_mark = round($all_marks/count($m_marks), 1);
      } else {
        $average_mark = 0;
      }
      Review::where('mentor_id', $mentor_id)->update(['average_mark' => $average_mark]);
      User::where('id', $mentor_id)->update(['average_mark' => $average_mark]);
      // end get average_mark
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
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
      ]);
    }
    
  }
}
