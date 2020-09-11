<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;

class UserController extends Controller
{
    public function __construct()
    {

    }

    public function signin(Request $request)
    {
        $email = $request['email'];
        $password = $request['password'];
        
        $user = User::where('email', $email)->first();
        if ($user == null) {
            return response()->json([
                'result'=> 'failed',
                'message'=> 'Email is incorrect',
            ]);
        }

        // if ($user['password'] == bcrypt($password)) {
        if ($user['password'] == $password) {
            return response()->json([
                'result'=> 'success',
                'data'=> $user,
            ]);  
        } else {
            return response()->json([
                'result'=> 'failed',
                'message'=> 'Password is incorrect.',
            ]);  
        }
    }

    public function signup(Request $request)
    {
        $user = User::where('email', $request['email'])->first();
        if ($user) {
            return response()->json([
                'result'=> 'failed',
                'message'=> 'This email is already in use',
            ]);
        }

        $user = User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            // 'password' => bcrypt($request['password']),
            'password' => $request['password'],
            'dob' => null,
            'avatar' => '',
            'hourly_price' => 0,
            'video_url' => '',
            'sub_page_name' => '',
            'sub_plan_fee' => 0,
            'description' => '',
            'instant_call' => false,
            'status' => 0,
            'timezone' => ''
        ]);

        return response()->json([
            'result'=> 'success',
            'data'=> $user,
        ]);
    }

    public function getuserinfo(Request $request)
    {
        $email = $request['email'];

        $user = User::where('email', $email)->first();
        return response()->json([
            'result'=> 'success',
            'data'=> $user,
        ]);
    }

    public function editprofile(Request $request)
    {
        $name = $request['fullname'];
        $birthday = $request['birthday'];
        $email = $request['email'];
        $description = $request['description'];
        $expertise = $request['expertise'];
        $hourlyprice = $request['hourlyprice'];
        $subpagename = $request['subpagename'];
        $subplanfee = $request['subplanfee'];
        $videourl = $request['videourl'];
        $instantcall = $request['instantcall'];

        $user = User::where('email', $email)->get();

        if ($user == null || count($user) == 0) {
            return response()->json([
                'result'=> 'failed',
                'message'=> 'Current User Does Not Exist',
            ]);
        } else {
            User::where('email', $email)->update(array(
                'name' => $name,
                'dob' => $birthday,
                'email' => $email,
                'description' => $description,
                // 'expertise' => $expertise,
                'hourly_price' => $hourlyprice,
                'sub_page_name' => $subpagename,
                'sub_plan_fee' => $subplanfee,
                'video_url' => $videourl,
                'instant_call' => $instantcall,
                'status' => 1,
            ));

            return response()->json([
                'result'=> 'success',
                'data'=> $user,
            ]);
        }
    }
}