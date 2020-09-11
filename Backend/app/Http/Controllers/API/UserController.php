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
        try {
            $input = $request->only('email', 'password');
            $token = null;
            $user = User::where('email', $request->email)->first();

            if( !$user->email_verified_at ) {
                return response()->json([
                    'success' => false,
                    'message' => config('messages.auth.verify_code'),
                ], 401);
            }
            
            if (!$token = JWTAuth::attempt($input)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Email or Password',
                ], 401);
            }

            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => auth()->user(),
            ]);            
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email or Password',
            ]);
        }
    }

    public function signup(Request $request)
    {
        $email = $request['email'];
        $name = $request['fullname'];
        $password = $request['password'];
        $subject = "Welcome to BransShare!";
        $body = "Hi ".$name."<br>";
        $body = $body."<img src='http://buscasa360storage0010513.s3-us-west-2.amazonaws.com/buscasa360_logo.png' style='width:90%;'/><br>";
            

        if(count(User::where(['email' => $email, 'is_active' => config('global.users.active')])->get())){
            return response()->json([
                'success'   =>  false,
                'message'   =>  'Email address is already existed'
            ], 300);
        }

        try {
            $user = new User();
            $user->name = $name;
            $user->email = $email;
            $user->password = bcrypt($password);            
            $user->is_active = config('global.users.active');
            $user->id = 0;
            
            $user->save();

            $user->generateTwoFactorCode();
            $toEmail = $user->email;            

            $body = $body."<p>Veryfication Code :".$user->two_factor_code."<p><br>";            
            $body = $body."<a href = '".env("APP_URL")."/verifycode/'><button>Click to confirm your account</button></a>";

            $this->send_email($toEmail, $name, $subject, $body);

            return response()->json([
                'success'   => true,
                'user'      => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, user can not register'
            ], 500);
        }        
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

    public function verifyCode(Request $request){
        $subject = "Welcome to BransShare!";
        $body = "Hi ".$name."<br>";
        try {
            $code = $request->code;
            $email = $request->email;
            $user = User::where('email', $email)->first();

            if($code != $user->two_factor_code) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sorry, confirm code is wrong!'
                ], 500);
            }
            $user->verifiedAccount();

            $toEmail = $user->email;            
            $name = $user->name;
            $body = $body."<p>Veryfy Code</p>";
            
            $this->send_email($toEmail, $name, $subject, $body);
            return $this->signin($request);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, can not verify the code'
            ], 500);
        }
    }
}