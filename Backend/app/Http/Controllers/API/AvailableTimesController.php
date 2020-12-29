<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AvailableTimes;
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
        'message'   => config('messages.errors.cannot_get'),
      ], 500);
    }
  }
  
  public function getAvailableTimes(Request $request)
  {
    try{
      $email = $request['email'];
      $user = User::where('email', $email)->first();
      $timeList = AvailableTimes::where('user_id', $user['id'])->get();
      return response()->json([
        'result'=> 'success',
        'data' => $timeList
      ]);
    } catch (\Throwable $th) {
      return response()->json([
        'result'   => "failed",
        'message'   => config('messages.errors.cannot_get'),
      ], 500);
    }
  }
  
  public function setAvailableTimes(Request $request)
  {
    try{
      $email = $request['email'];
      $timeZone = $request['timezone'];
      $user = User::where('email', $email)->first();
      $timeList = $request['data'];
      AvailableTimes::where('user_id', $user['id'])->delete();
      for ($i = 0; $i < count($timeList); $i ++) {
        for ($j = 0; $j < count($timeList[$i]['timeList']); $j ++) {
          AvailableTimes::create([
            'user_id' => $user['id'],
            'day_of_week' => $timeList[$i]['dayOfWeek'],
            'fromTime' => $timeList[$i]['timeList'][$j]['from'],
            'toTime' => $timeList[$i]['timeList'][$j]['to'],
            'fromTimeStr' => $timeList[$i]['timeList'][$j]['fromStr'],
            'toTimeStr' => $timeList[$i]['timeList'][$j]['toStr'],
            'fromTimestamp' => $timeList[$i]['timeList'][$j]['fromTimestamp'],
            'toTimestamp' => $timeList[$i]['timeList'][$j]['toTimestamp'],
            'status' => $timeList[$i]['status'],
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
        'message'   => config('messages.errors.cannot_set'),
      ], 500);
    }
  }
}
