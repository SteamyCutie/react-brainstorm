<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AvailableTimes;
use App\Models\SpecificDate;
use App\Models\BookingTimes;
use App\Models\User;
use DateTime;
use DateTimeZone;
use Carbon\Carbon;

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
//    try{
    $email = $request['email'];
    $timeZone = $request['timezone'];
    $user = User::where('email', $email)->first();
    $recurrenceList = $request['recurrence'];
    $specificList = $request['specific_date'];
    AvailableTimes::where('user_id', $user['id'])->delete();
    SpecificDate::where('user_id', $user['id'])->delete();
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
      SpecificDate::create([
        'user_id' => $user['id'],
        'sp_date' => $specificList[$i]['sp_date'],
        'fromTimeStr' => $specificList[$i]['fromTimeStr'],
        'toTimeStr' => $specificList[$i]['toTimeStr'],
        'timezone' => $timeZone,
      ]);
    }
    return response()->json([
      'result'=> 'success',
    ]);
//    } catch (\Throwable $th) {
//      return response()->json([
//        'result'   => "failed",
//        'message'   => 'could not set the booking time',
//      ], 500);
//    }
  }
  
  public function setBookingTime(Request $request)
  {
    try{
      $res_match = BookingTimes::where('fromTime', $request->start)->get();
      if (count($res_match) > 0) {
        return response()->json([
          'result'=> 'warning',
          'message' => 'Time already booked'
        ]);
      }
      $res_stat = BookingTimes::create([
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
    $mentor_id = $request->mentor_id;
    $fromDate = $request->fromDate;
    $toDate = $request->toDate;
    $student_timezone = $request->timezone;
    $mentorInfo = AvailableTimes::where('user_id', $mentor_id)->first();
    $mentor_timezone = $mentorInfo->timezone;

    $dateList = $this->getMentorAvailableDataWithWeek($mentor_id, $fromDate, $toDate);
    $wholeDayTimeSlots = [];
    for ($indexDay = 1; $indexDay < count($dateList) - 1; $indexDay++) {
      $temp = [];
      $availableTimeList1 = $availableTimeList2 = $availableTimeList3 = [];
      if (count($dateList[$indexDay-1]) > 1) {
        $availableTimeList1 = $dateList[$indexDay-1]['time'];
      }
      if (count($dateList[$indexDay]) > 1) {
        $availableTimeList2 = $dateList[$indexDay]['time'];
      }
      if (count($dateList[$indexDay+1]) > 1) {
        $availableTimeList3 = $dateList[$indexDay+1]['time'];
      }
      $oneDayTimeSlots = $this->convertDateListToTimeSlots($dateList[$indexDay]['day'], $mentor_timezone, $student_timezone, $availableTimeList1, $availableTimeList2, $availableTimeList3);
      $temp['date'] = $dateList[$indexDay]['day'];
      $temp['spots'] = $oneDayTimeSlots;
      $wholeDayTimeSlots[] = $temp;
    }
    return response()->json([
      'result'=> 'success',
      'mentor_id' => $mentor_id,
      'fromDate' => $fromDate,
      'toDate' => $toDate,
      'student_timezone' => $student_timezone,
      'mentor_timezone' => $mentor_timezone,
//      'dateList' => $dateList,
      'wholeDayTimeSlots' => $wholeDayTimeSlots
    ]);
  }
  
  private function convertDateListToTimeSlots($date, $timezone1, $timezone2, $availableTimeList1, $availableTimeList2, $availableTimeList3) {
    $tomorrow = new DateTime($date);
    $tomorrow->modify('+1 day');
    $tomorrow = $tomorrow->format('Y-m-d');
    $yesterday = new DateTime($date);
    $yesterday->modify('-1 day');
    $yesterday = $yesterday->format('Y-m-d');
    $time_slots = array();
    foreach ($availableTimeList1 as $value) {
      foreach($this->getTimeSlots($yesterday, $date, $value['from'], $value['to'], $timezone1, $timezone2) as $time) {
        array_push($time_slots, $time);
      }
    }
    foreach ($availableTimeList2 as $value) {
      foreach($this->getTimeSlots($date, $date, $value['from'], $value['to'], $timezone1, $timezone2) as $time) {
        array_push($time_slots, $time);
      }
    }
    foreach ($availableTimeList3 as $value) {
      foreach($this->getTimeSlots($tomorrow, $date, $value['from'], $value['to'], $timezone1, $timezone2) as $time) {
        array_push($time_slots, $time);
      }
    }
    return $time_slots;
  }
  
  private function getTimeSlots($date1, $date2, $time_from, $time_to, $timezone1, $timezone2) {
    $mentorTimezone = new DateTimeZone($timezone1);
    $studentTimezone = new DateTimeZone($timezone2);
    $time_slots = array();
    $s = $date1." ".$time_from;
    $time_from = new DateTime($s, $mentorTimezone);
    $timestamp_from = $time_from->getTimestamp();
    $s = $date1." ".$time_to;
    $time_to = new DateTime($s, $mentorTimezone);
    $timestamp_to = $time_to->getTimestamp();
    for ($index = $timestamp_from; $index < $timestamp_to; $index += 900) {
      $student_time_slot = (new DateTime('@' . $index))->setTimezone($studentTimezone);
      if ($student_time_slot->format('Y-m-d') != $date2)
        continue;
      array_push($time_slots, $student_time_slot->format('c'));
    };
    return $time_slots;
  }
  
  private function getMentorAvailableDataWithWeek($mentor_id, $fromDate, $toDate)
  {
    $fromTimestamp = strtotime($fromDate); // 1612137600
    $toTimestamp = strtotime($toDate); // 1612224000
    $dayOfWeek = "";
    $dateList = [];
    for ($day_interval = $fromTimestamp - 86400; $day_interval <= $toTimestamp + 86400; $day_interval += 86400) {
      $dateFormat = date('Y-m-d', $day_interval); // 2021-02-01
      $temp = [];
      $temp['day'] = $dateFormat;
      switch (date('D', $day_interval)) {
        case "Sun":
          $dayOfWeek = "Sunday";
          break;
        case "Mon":
          $dayOfWeek = "Monday";
          break;
        case "Tue":
          $dayOfWeek = "Tuesday";
          break;
        case "Wed":
          $dayOfWeek = "Wednesday";
          break;
        case "Thu":
          $dayOfWeek = "Thursday";
          break;
        case "Fri":
          $dayOfWeek = "Friday";
          break;
        case "Sat":
          $dayOfWeek = "Saturday";
          break;
      }
      $availTimeInfo = AvailableTimes::where('user_id', $mentor_id)
        ->where('day_of_week', $dayOfWeek)
        ->get();
      $specificInfo = SpecificDate::where('user_id', $mentor_id)
        ->where('sp_date', $dateFormat)
        ->get();
      if (count($specificInfo) > 0) {
        $availTimeInfo = $specificInfo;
      }
      $temp1 = [];
      for ($i = 0; $i < count($availTimeInfo); $i++) {
        $temp1['from'] = $availTimeInfo[$i]->fromTimeStr;
        $temp1['to'] = $availTimeInfo[$i]->toTimeStr;
        $temp['time'][$i] = $temp1;
      }
      $dateList[] = $temp;
    }
    return $dateList;
  }
  
  public function converttime(Request $request) {
    $current_date_time = Carbon::now()->toDateTimeString();
    $current_timestamp = Carbon::now()->timestamp;
    $full_iso = date("c", strtotime($current_date_time));
    $bookingInfo = BookingTimes::whereDate('fromTime', '>', $full_iso)->get();
    return response()->json([
      'result'=> 'success',
      'bookingTime' => $bookingInfo
    ]);
  }
}
