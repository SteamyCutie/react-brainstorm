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

    public function getAvailableTimes(Request $request)
    {
        $email = $request['email'];        
        $user = User::where('email', $email)->first();
        // var_dump($user['id']);
        $timeList = AvailableTimes::where('user_id', $user['id'])->get();

        return response()->json([
            'result'=> 'success',            
            'data' => $timeList
        ]);
    }

    public function setAvailableTimes(Request $request)
    {
        $email = $request['email'];
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
                ]);
            }
        }
        return response()->json([
            'result'=> 'success',
        ]);
    }
}
