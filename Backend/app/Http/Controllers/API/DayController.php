<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Session;
use App\Models\Tag;
use App\Models\User;

class DayController extends Controller
{
  function index(Request $request)
  {
    try{
      $month = date("m");
      // $month_name = '';
      // switch ($month) {
      // 	case '01':
      // 		$month_name = 'January ';
      // 		break;
      // 	case '02':
      // 		$month_name = 'February ';
      // 		break;
      // 	case '03':
      // 		$month_name = 'March ';
      // 		break;
      // 	case '04':
      // 		$month_name = 'April ';
      // 		break;
      // 	case '05':
      // 		$month_name = 'May ';
      // 		break;
      // 	case '06':
      // 		$month_name = 'June ';
      // 		break;
      // 	case '07':
      // 		$month_name = 'July ';
      // 		break;
      // 	case '08':
      // 		$month_name = 'August ';
      // 		break;
      // 	case '09':
      // 		$month_name = 'September ';
      // 		break;
      // 	case '10':
      // 		$month_name = 'October ';
      // 		break;
      // 	case '11':
      // 		$month_name = 'November ';
      // 		break;
      // 	case '12':
      // 		$month_name = 'December ';
      // 		break;
      // 	default:
      // 		# code...
      // 		break;
      // }
      $year = date("Y");
      $week = date("W", strtotime($year . "-" . $month ."-01"));
      $idx = 0; $weekdata = [];
      $unix = strtotime($year."W".$week ."+1 week");
      $weekdata[] = $year . '-' . $month . '-' . date("d", strtotime($year . "-" . $month ."-01")) ." ~ " . $year . '-' . $month . '-' . date("d", $unix - 86400);
      while(date("m", $unix + (86400 * 7)) == $month) {
        $weekdata[] = $year . '-' . $month . '-' . date("d", $unix) ." ~ " . $year . '-' . $month . '-' . date("d", $unix + 86400 * 6);
        $unix = $unix + (86400 * 7);
      }
      $weekdata[] = $year . '-' . $month . '-' . date("d", $unix) ." ~ ". $year . '-' . $month . '-' . date("d", strtotime("last day of ".$year . "-" . $month));
      return response()->json([
        'result'=> 'success',
        'data'=> $weekdata,
      ]);
    } catch (\Throwable $th) {
      return response()->json([
        'result'   => "failed",
        'message'   => config('messages.errors.cannot_get'),
      ], 500);
    }
  }
}
