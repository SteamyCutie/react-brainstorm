<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use JWTAuth;
use Exception;
use Tymon\JWTAuth\Exceptions\JWTException;
use Auth;

class UserController extends Controller
{
    public function __construct()
    {

    }

    public function login(Request $request)
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
            $user->save();
            $user->generateTwoFactorCode();
            $toEmail = $user->email;            

            $body = $body."<p>Veryfication Code :".$user->two_factor_code."<p><br>";            
            $body = $body."<a href = '".env("FRONT_URL")."/verify'><button>Click to confirm your account</button></a>";
            if (!$this->send_email($toEmail, $name, $subject, $body)){
                return response()->json([
                    'success' => false,
                    'message' => 'Sorry, fail send mail'
                ]);    
            }
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
            $body = "Hi ".$name."<br>";
            $body = $body."<p>Veryfy Code Success!</p><br>";            
            
            if (!$this->send_email($toEmail, $name, $subject, $body)){
                return response()->json([
                    'success' => false,
                    'message' => 'Sorry, fail send mail'
                ]);        
            }
            return $this->login($request);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, can not verify the code'
            ], 500);
        }
    }

    public function forgot(Request $request) {
        $subject = "Welcome to BransShare!";
        $email = $request['email'];
        $token = null;

        $user = User::where('email', $email)->first();      
        
        if(!$user){
            return response()->json([
                'success'   =>  false,
                'message'   =>  'Email address is not existed'
            ], 300);
        }
        
        try {     
            $toEmail = $user->email;
            $name = $user->name;
            $body = "Hi ".$name."<br>";
            $body = $body."<p>Did you forget your password?</p><br>";
            
            $vCode = base64_encode($email);
            User::where('email', $email)->update(['remember_token' => $vCode]);
            $body = $body."<a href = '".env("FRONT_URL")."/reset/{$vCode}'><button>Click to reset your password</button></a>";
            
            if (!$this->send_email($toEmail, $name, $subject, $body)){
                return response()->json([
                    'success' => false,
                    'message' => 'Sorry, fail send mail'
                ]);        
            }
            return response()->json([
                'success' => true,
                'vCode' => $vCode,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email',
            ]);
        }
    }
    public function reset(Request $request) {
        $vCode = null;
        try {            
            $vCode = $request->vCode;
            $email = $request->email;
            $password = $request->password;                        

            $user = User::where('email', $email)->first();
            
            if($user){
                if($user->remember_token != $vCode){
                    return response()->json([
                        'success' => false,
                        'message' => 'fail to confirm verify code.',
                    ]);
                }              
                $password_code = bcrypt($password);
                $user->update(['password' => $password_code]);
                return response()->json([
                    'success'   => true,
                    'message' => 'Updated password',
                ]);
            } else {
                return response()->json([
                    'success'   => false,
                    'message'      => 'Updating password failed',
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, can not update password. Try again.'
            ], 500);
        }
    }

    public function signout(Request $request)
    {
        return response()->json([
            'success'   =>  true,
            'message'      =>  'logout successfully'
        ], 200);
    }
}