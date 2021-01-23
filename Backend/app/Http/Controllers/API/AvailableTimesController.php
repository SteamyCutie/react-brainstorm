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
use Illuminate\Support\Facades\DB;

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
      $recurrenceList = AvailableTimes::select('day_of_week', 'status', 'timezone', 'fromTimeStr', 'toTimeStr')->where('user_id', $user['id'])->get();
      $specificListInfo = SpecificDate::select('sp_date', 'timezone', 'fromTimeStr', 'toTimeStr')->where('user_id', $user['id'])->get();
      $timeList['recurrenceList'] = $recurrenceList;
      $timeList['specificList'] = $specificListInfo;
      $timeList['timezone'] = "";
      if (count($recurrenceList) > 0) {
        $timeList['timezone'] = $recurrenceList[0]->timezone;
      }
      if (count($specificListInfo) > 0) {
        $timeList['timezone'] = $specificListInfo[0]->timezone;
      }
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
    DB::table('available_times')->where('user_id', $user['id'])->truncate();
    DB::table('specific_dates')->where('user_id', $user['id'])->truncate();
    for ($i = 0; $i < count($recurrenceList); $i ++) {
      for ($j = 0; $j < count($recurrenceList[$i]['timeList']); $j ++) {
        AvailableTimes::create([
          'user_id' => $user['id'],
          'day_of_week' => $recurrenceList[$i]['dayOfWeek'],
          'fromTimeStr' => $recurrenceList[$i]['timeList'][$j]['fromTimeStr'],
          'toTimeStr' => $recurrenceList[$i]['timeList'][$j]['toTimeStr'],
          'status' => $recurrenceList[$i]['status'],
          'timezone' => $timeZone,
        ]);
      }
    }
    
    for ($i = 0; $i < count($specificList); $i ++) {
      for ($j = 0; $j < count($specificList[$i]['timeList']); $j ++) {
        SpecificDate::create([
          'user_id' => $user['id'],
          'sp_date' => $specificList[$i]['sp_date'],
          'fromTimeStr' => $specificList[$i]['timeList'][$j]['fromTimeStr'],
          'toTimeStr' => $specificList[$i]['timeList'][$j]['toTimeStr'],
          'timezone' => $timeZone,
        ]);
      }
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
      $booked_timeList = $this->getBookingTimeList($fromDate, $toDate);
      $oneDayTimeSlots = $this->convertDateListToTimeSlots($dateList[$indexDay]['day'], $mentor_timezone, $student_timezone, $availableTimeList1, $availableTimeList2, $availableTimeList3, $booked_timeList)->timeSlots;
      $temp['date'] = $dateList[$indexDay]['day'];
      $temp['spots'] = $oneDayTimeSlots;
      $wholeDayTimeSlots[] = $temp;
    }
    return response()->json([
      'result'=> 'success',
      'data' => $wholeDayTimeSlots
    ]);
  }
  
  private function is_bookable_time($time_start, $duration)
  {
    $date = new DateTime($time_start);
    $timestamp_from = $date->getTimeStamp();
    $timestamp_to = $timestamp_from + $duration * 3600;
    $mentor_timezone = "Europe/Warsaw";
    $student_timezone = "Asia/Tokyo";
    $retVal = false;
    foreach (getTimeSlots($date->format("Y-m-d"), $mentor_timezone, $student_timezone)->timeRangeSlots as $time_range) {
      if (($time_range->from <= $timestamp_from) && ($time_range->to >= $timestamp_to))
        return true;
    }
    return $retVal;
  }
  
  private function convertDateListToTimeSlots($date, $timezone1, $timezone2, $availableTimeList1, $availableTimeList2, $availableTimeList3, $booked_timeList) {
    $tomorrow = new DateTime($date);
    $tomorrow->modify("+1 day");
    $tomorrow = $tomorrow->format("Y-m-d");
    $yesterday = new DateTime($date);
    $yesterday->modify("-1 day");
    $yesterday = $yesterday->format("Y-m-d");
    $time_slots = array();
    $time_range_slots = array();
  
    foreach ($availableTimeList1 as $value) {
      $_time_slots = $this->getTimeSlots($yesterday, $date, $value['from'], $value['to'], $timezone1, $timezone2, $booked_timeList);
      foreach ($_time_slots->timeRangeSlots as $time_slot) {
        array_push($time_range_slots, $time_slot);
      }
      foreach ($_time_slots->timeSlots as $time) {
        array_push($time_slots, $time);
      }
    }
    
    foreach ($availableTimeList2 as $value) {
      $_time_slots = $this->getTimeSlots($date, $date, $value['from'], $value['to'], $timezone1, $timezone2, $booked_timeList);
      foreach ($_time_slots->timeRangeSlots as $time_slot) {
        array_push($time_range_slots, $time_slot);
      }
      foreach ($_time_slots->timeSlots as $time) {
        array_push($time_slots, $time);
      }
    }
    foreach ($availableTimeList3 as $value) {
      $_time_slots = $this->getTimeSlots($tomorrow, $date, $value['from'], $value['to'], $timezone1, $timezone2, $booked_timeList);
      foreach ($_time_slots->timeRangeSlots as $time_slot) {
        array_push($time_range_slots, $time_slot);
      }
      foreach ($_time_slots->timeSlots as $time) {
        array_push($time_slots, $time);
      }
    }
    $retVal = (object)array(
      "timeSlots" => $time_slots,
      "timeRangeSlots" => $time_range_slots
    );
    return $retVal;
  }
  
  private function getTimeSlots($date1, $date2, $time_from, $time_to, $timezone1, $timezone2, $booked_timeList) {
    $mentorTimezone = new DateTimeZone($timezone1);
    $studentTimezone = new DateTimeZone($timezone2);
    $time_slots = array();
    $time_range_slots = array();
    $s = $date1 . " " . $time_from;
    $time_from = new DateTime($s, $mentorTimezone);
    $timestamp_from = $time_from->getTimestamp();
    $s = $date1 . " " . $time_to;
    $time_to = new DateTime($s, $mentorTimezone);
    $timestamp_to = $time_to->getTimestamp();
    $time_range_from = null;
    $time_range_to = null;
    $range_from_set = false;
    $range_to_set = false;
    $current_time_stamp = time();
    $time_range_slot = (object)array(
      "from" => null,
      "to" => null
    );
    $retVal = (object)array(
      "timeSlots" => $time_slots,
      "timeRangeSlots" => $time_range_slots
    );
    if ($timestamp_to <= $current_time_stamp)
      return $retVal;
    if ($timestamp_from <= $current_time_stamp) {
      $timestamp_from = $current_time_stamp + (900 - $current_time_stamp % 900); // 900 means 15 mins
      if ($timestamp_from >= $timestamp_to)
        return $retVal;
    }
    foreach ($booked_timeList as $booked_time) {
      $book_timestamp_from = (new DateTime($booked_time['from']))->getTimeStamp();
      $book_timestamp_to = $book_timestamp_from + $booked_time['duration'] * 3600;
      if (($timestamp_from <= $book_timestamp_from) && ($timestamp_to >= $book_timestamp_to)) {
        if ($timestamp_from != $book_timestamp_from) {
          for ($index = $timestamp_from; $index < $book_timestamp_from; $index += 900) {
            $student_time_slot = (new DateTime("@" . $index))->setTimezone($studentTimezone);
            if ($student_time_slot->format("Y-m-d") != $date2) {
              if ($range_from_set && !$range_to_set) {
                $time_range_to = $index;
                $range_to_set = true;
              }
              continue;
            }
            if (!$range_from_set) {
              $time_range_from = $index;
              $range_from_set = true;
            }
            array_push($time_slots, $student_time_slot->format("c"));
          }
          $time_range_slot->from = $time_range_from;
          $time_range_slot->to = $time_range_to;
          array_push($time_range_slots, $time_range_slot);
        }
        $range_to_set = false;
        $range_from_set = false;
        if ($book_timestamp_to != $timestamp_to) {
          for ($index = $book_timestamp_to; $index < $timestamp_to; $index += 900) {
            $student_time_slot = (new DateTime("@" . $index))->setTimezone($studentTimezone);
            if ($student_time_slot->format("Y-m-d") != $date2) {
              if ($range_from_set && !$range_to_set) {
                $time_range_to = $index;
                $range_to_set = true;
              }
              continue;
            }
            if (!$range_from_set) {
              $time_range_from = $index;
              $range_from_set = true;
            }
            array_push($time_slots, $student_time_slot->format("c"));
          }
          $time_range_slot->from = $time_range_from;
          $time_range_slot->to = $time_range_to;
          array_push($time_range_slots, $time_range_slot);
        }
        $retVal->timeSlots = $time_slots;
        $retVal->timeRangeSlots = $time_range_slots;
        return $retVal;
      }
    }
    for ($index = $timestamp_from; $index < $timestamp_to; $index += 900) {
      $student_time_slot = (new DateTime("@" . $index))->setTimezone($studentTimezone);
      if ($student_time_slot->format("Y-m-d") != $date2) {
        if ($range_from_set && !$range_to_set) {
          $time_range_to = $index;
          $range_to_set = true;
        }
        continue;
      }
      if (!$range_from_set) {
        $time_range_from = $index;
        $range_from_set = true;
      }
      array_push($time_slots, $student_time_slot->format("c"));
    };
    if ($range_from_set && !$range_to_set)
      $time_range_to = $timestamp_to;
    $time_range_slot->from = $time_range_from;
    $time_range_slot->to = $time_range_to;
    array_push($time_range_slots, $time_range_slot);
    $retVal->timeSlots = $time_slots;
    $retVal->timeRangeSlots = $time_range_slots;
    return $retVal;
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
  
  private function getBookingTimeList($fromDate, $toDate){
    $bookingTimeList = [];
    $fromTimestamp = strtotime($fromDate); // 1612137600
    $toTimestamp = strtotime($toDate); // 1612224000
    $allBookingTimeInfo = BookingTimes::get();
  
    for ($index = 0; $index < count($allBookingTimeInfo); $index++){
      $temp = [];
      if ((new DateTime($allBookingTimeInfo[$index]->fromTime))->getTimestamp() >= $fromTimestamp
        && (new DateTime($allBookingTimeInfo[$index]->fromTime))->getTimestamp() <= $toTimestamp) {
        $temp['from'] = $allBookingTimeInfo[$index]->fromTime;
        $temp['duration'] = $allBookingTimeInfo[$index]->duration;
        $bookingTimeList[] = $temp;
      }
    }
    return $bookingTimeList;
  }
}
