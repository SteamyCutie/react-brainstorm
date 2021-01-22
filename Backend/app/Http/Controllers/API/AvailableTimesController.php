<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AvailableTimes;
use App\Models\SpecificDate;
use App\Models\BookingTime;
use App\Models\User;

class AvailableTimesController extends Controller
{
  public function __construct()
  {
  
  }
  
  public function getavailableTimesForStudent(Request $request) {
    try{
      $user_id = $request->user_id;
      $week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday', 'Saturday'];
      $res_week = [];
      for ($i = 0; $i < 7; $i++) {
        $week_list = AvailableTimes::where('user_id', $user_id)->where('day_of_week', $week[$i])->get();
        if (count($week_list) > 0) {
          $temp_list = [];
          for ($j = 0; $j < count($week_list); $j++){
            $temp_list[$j]['value'] = str_replace(' ', '', $week_list[$j]->fromTimeStr);
            $temp_list[$j]['from_stamp'] = $week_list[$j]->fromTimestamp;
          }
          $res_week[$i] = $temp_list;
        } else {
          $res_week[$i] = [];
        }
      }
      return response()->json([
        'result'=> 'success',
        'data' => $res_week
      ]);
    } catch (\Throwable $th) {
      return response()->json([
        'result'   => "failed",
        'message'   => 'could not get the booking time',
      ], 500);
    }
  }
  
  public function getAvailableTimes(Request $request)
  {
    try{
      $email = $request['email'];
      $user = User::where('email', $email)->first();
      $recurrenceList = AvailableTimes::where('user_id', $user['id'])->get();
      $specificList = SpecificDate::where('user_id', $user['id'])->get();
      $timeList['recurrenceList'] = $recurrenceList;
      $timeList['specificList'] = $specificList;
      return response()->json([
        'result'=> 'success',
        'data' => $timeList
      ]);
    } catch (\Throwable $th) {
      return response()->json([
        'result'   => "failed",
        'message'   => 'could not get the booking time',
      ], 500);
    }
  }
  
  public function setAvailableTimes(Request $request)
  {
    try{
      $email = $request['email'];
      $timeZone = $request['timezone'];
      $user = User::where('email', $email)->first();
      $recurrenceList = $request['recurrence'];
      $specificList = $request['specific_date'];
      AvailableTimes::where('user_id', $user['id'])->delete();
      for ($i = 0; $i < count($recurrenceList); $i ++) {
        for ($j = 0; $j < count($recurrenceList[$i]['timeList']); $j ++) {
          AvailableTimes::create([
            'user_id' => $user['id'],
            'day_of_week' => $recurrenceList[$i]['dayOfWeek'],
            'fromTime' => $recurrenceList[$i]['timeList'][$j]['from'],
            'toTime' => $recurrenceList[$i]['timeList'][$j]['to'],
            'fromTimeStr' => $recurrenceList[$i]['timeList'][$j]['fromStr'],
            'toTimeStr' => $recurrenceList[$i]['timeList'][$j]['toStr'],
            'fromTimestamp' => $recurrenceList[$i]['timeList'][$j]['fromTimestamp'],
            'toTimestamp' => $recurrenceList[$i]['timeList'][$j]['toTimestamp'],
            'status' => $recurrenceList[$i]['status'],
            'timezone' => $timeZone,
          ]);
        }
      }
  
      for ($i = 0; $i < count($specificList); $i ++) {
        for ($j = 0; $j < count($specificList[$i]['timeList']); $j ++) {
          SpecificDate::create([
            'user_id' => $user['id'],
            'sp_date' => $specificList[$i]['date'],
            'fromTimeStr' => $specificList[$i]['timeList'][$j]['from'],
            'toTimeStr' => $specificList[$i]['timeList'][$j]['to'],
            'timezone' => $timeZone,
          ]);
        }
      }
      return response()->json([
        'result'=> 'success',
      ]);
    } catch (\Throwable $th) {
      return response()->json([
        'result'   => "failed",
        'message'   => 'could not set the booking time',
      ], 500);
    }
  }
  
  public function setBookingTime(Request $request)
  {
    try{
    $res_match = BookingTime::where('fromTime', $request->start)->get();
    if (count($res_match) > 0) {
      return response()->json([
        'result'=> 'warning',
        'message' => 'Time already booked'
      ]);
    }
    $res_stat = BookingTime::create([
      'user_id' => $request->user_id,
      'mentor_id' => $request->mentor_id,
      'duration' => $request->duration,
      'fromTime' => $request->start,
      'description' => $request->description,
    ]);
    if ($res_stat) {
      return response()->json([
        'result'=> 'success',
        'message' => 'Time correctly booked'
      ]);
    } else {
      return response()->json([
        'result'=> 'failed',
        'message' => 'failed booking'
      ]);
    }
    } catch (\Throwable $th) {
      return response()->json([
        'result'   => "failed",
        'message'   => 'could not set the booking time',
      ], 500);
    }
  }

  public function getAvailableTimeSlots(Request $request)
  {
//    try{
      $mentor_id = $request->mentor_id;
      $fromDate = $request->fromDate;
      $toDate = $request->toDate;
      $timezone = $request->timezone;
      
      $curr = date("y-m-d h:i:s");
      $week_date = Date($curr.setDate($curr.getDate() - $curr.getDay() + 0));
      return response()->json([
        'result'=> 'success',
        'data' => $week_date
      ]);
  
      $week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday', 'Saturday'];
      $res_week = [];
      for ($i = 0; $i < 7; $i++) {
        $week_list = AvailableTimes::where('user_id', $mentor_id)->where('day_of_week', $week[$i])->get();
        if (count($week_list) > 0) {
          $temp_list = [];
          for ($j = 0; $j < count($week_list); $j++){
            $temp_list[$j]['value'] = str_replace(' ', '', $week_list[$j]->fromTimeStr);
            $temp_list[$j]['from_stamp'] = $week_list[$j]->fromTimestamp;
          }
          $res_week[$i] = $temp_list;
        } else {
          $res_week[$i] = [];
        }
      }
      return response()->json([
        'result'=> 'success',
        'data' => $res_week
      ]);
//    } catch (\Throwable $th) {
//      return response()->json([
//        'result'   => "failed",
//        'message'   => 'could not set the booking time',
//      ], 500);
//    }
  }
}
