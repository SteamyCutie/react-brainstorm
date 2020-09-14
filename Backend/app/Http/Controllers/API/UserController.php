<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Tag;
use JWTAuth;
use Exception;

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
                    'result'=> 'failed',
                    'message' => config('messages.auth.verify_code'),
                // ], 401);
                ]);
            }

            if (!$token = JWTAuth::attempt($input)) {
                return response()->json([
                    'result'=> 'failed',
                    'message' => 'Email or Password is incorrect.',
                // ], 401);
                ]);
            }

            return response()->json([
                'result'=> 'success',
                'token' => $token,
                'user' => auth()->user(),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'result'=> 'failed',
                'message'=> 'Email or Password is incorrect.',
            ]);
        }
    }

    public function signup(Request $request)
    {
        $email = $request['email'];
        $name = $request['name'];
        $password = $request['password'];
        $subject = "Welcome to BrainsShare!";
        $body = "Hi ".$name."<br>";
        $body = $body."<img src='https://brainshares.s3-us-west-2.amazonaws.com/1599947110_517759_logo.svg' style='width:10%;'/><br>";

        if(count(User::where(['email' => $email, 'is_active' => config('global.users.active')])->get())){
            return response()->json([
                'result'=> 'failed',
                'message'   =>  'Email address is already existed'
            // ], 300);
            ]);
        }

        try {
            $user = new User();
            $user->name = $name;
            $user->email = $email;
            $user->password = bcrypt($password);
            $user->is_active = config('global.users.active');
            // $user->save();
            $user->generateTwoFactorCode();
            $toEmail = $user->email;

            $body = $body."<p>Veryfication Code :".$user->two_factor_code."<p><br>";
            $body = $body."<a href = '".env("FRONT_URL")."/verification'><button>Click to confirm your account</button></a>";
            if (!$this->send_email($toEmail, $name, $subject, $body)){
                User::where(['email' => $email])->delete();
                return response()->json([
                    'result'=> 'failed',
                    'message' => 'Sorry, fail send mail'
                ]);
            }
            return response()->json([
                'result'=> 'success',
                'user'      => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'result'=> 'failed',
                'message' => 'Sorry, user can not register'
            // ], 500);
            ]);
        }
    }

    public function getuserinfo(Request $request)
    {
        $email = $request['email'];

        $user = User::where('email', $email)->first();
        $newDate = date("Y-m-d", strtotime($user['dob']));
        $user['dob'] = $newDate;
        if ($user['tags_id'] == null || $user['tags_id'] == '')
            $tags_id = [];
        else
            $tags_id = explode(',', $user['tags_id']);
        $user['tags'] = $tags_id;
        return response()->json([
            'result'=> 'success',
            'data'=> $user,
        ]);
    }

    public function editprofile(Request $request)
    {
        $name = $request['name'];
        $birthday = $request['birthday'];
        $email = $request['email'];
        $description = $request['description'];
        $expertise = $request['expertise'];
        $hourlyprice = $request['hourlyprice'];
        $subpagename = $request['subpagename'];
        $subplanfee = $request['subplanfee'];
        $videourl = $request['videourl'];
        $instantcall = $request['instantcall'];
        $avatar = $request['avatar'];
        $is_mentor = $request['is_mentor'];
        $tags = implode(",", $request['tags']);

        $rules = array(
            'name' => 'required',
            'email' => 'required|email',
            'expertise' => 'required',
            'hourlyprice' => 'required',
            'subpagename' => 'required',
            'subplanfee' => 'required',
            'videourl' => 'required|url'
        );
        $messages = array(
            'required' => 'This field is required.',
        );
        $validator = Validator::make( $request->all(), $rules, $messages );

        if ($validator->fails())
        {
            return [
                'result' => 'failed',
                'type' => 'require',
                'message' => $validator->messages()
            ];
        }

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
                'avatar' => $avatar,
                'expertise' => $expertise,
                'hourly_price' => $hourlyprice,
                'sub_page_name' => $subpagename,
                'sub_plan_fee' => $subplanfee,
                'video_url' => $videourl,
                'instant_call' => $instantcall,
                'status' => 1,
                'is_mentor' => $is_mentor,
                'tags_id' => $tags
            ));

            return response()->json([
                'result'=> 'success',
                'data'=> $user,
            ]);
        }
    }

    public function verifyCode(Request $request){
        $subject = "Welcome to BrainsShare!";

        try {
            $code = $request->code;
            $email = $request->email;
            $user = User::where('email', $email)->first();

            if($code != $user->two_factor_code) {
                return response()->json([
                    'result'=> 'failed',
                    'message' => 'Sorry, The confirm code is incorrect!'
                // ], 500);
                ]);
            }

            $user->verifiedAccount();
            $toEmail = $user->email;
            $name = $user->name;
            $body = "Hi ".$name."<br>";
            $body = $body."<img src='https://brainshares.s3-us-west-2.amazonaws.com/1599947110_517759_logo.svg' style='width:10%;'/><br>";
            $body = $body."<p>Verify Code Success!</p><br>";

            if (!$this->send_email($toEmail, $name, $subject, $body)){
                return response()->json([
                    'result'=> 'failed',
                    'message' => 'Sorry, fail send mail'
                ]);
            }
            return $this->login($request);

        } catch (\Throwable $th) {
            return response()->json([
                'result'=> 'failed',
                'message' => 'Sorry, can not verify the code'
            // ], 500);
            ]);
        }
    }

    public function forgot(Request $request) {
        $subject = "Welcome to BrainsShare!";
        $email = $request['email'];
        $token = null;

        $user = User::where('email', $email)->first();

        if(!$user){
            return response()->json([
                'result'=> 'failed',
                'message'   =>  'Email address is not existed'
            // ], 300);
            ]);
        }

        try {
            $toEmail = $user->email;
            $name = $user->name;
            $body = "Hi ".$name."<br>";
            $body = $body."<img src='https://brainshares.s3-us-west-2.amazonaws.com/1599947110_517759_logo.svg' style='width:10%;'/><br>";
            $body = $body."<p>Did you forget your password?</p><br>";
            $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';            
            $vCode =  substr(str_shuffle($permitted_chars), 0, 30);
            User::where('email', $email)->update(['remember_token' => $vCode]);
            $body = $body."<a href = '".env("FRONT_URL")."/resetpassword/{$vCode}'><button>Click to reset your password</button></a>";

            if (!$this->send_email($toEmail, $name, $subject, $body)){
                return response()->json([
                    'result'=> 'failed',
                    'message' => 'Sorry, fail send mail'
                ]);
            }
            return response()->json([
                'result'=> 'success',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'result'=> 'failed',
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
                        'result'=> 'failed',
                        'message' => 'fail to confirm verify code.',
                    ]);
                }
                if($password == "") {
                    return response()->json([
                        'result'=> 'failed',
                        'message' => 'Can not empty password'
                    ]);
                }
                $password_code = bcrypt($password);
                $user->update(['password' => $password_code]);
                return response()->json([
                    'result'=> 'success',
                    'message' => 'Updated password',
                ]);
            } else {
                return response()->json([
                    'result'=> 'failed',
                    'message'      => 'Updating password failed',
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'result'=> 'failed',
                'message' => 'Sorry, can not update password. Try again.'
            // ], 500);
            ]);
        }
    }

    public function signout(Request $request)
    {
        return response()->json([
            'result'=> 'success',
            'message'      =>  'logout successfully'
        // ], 200);
        ]);
    }

    public function getallmentors(Request $request)
    {
        $email = $request['email'];
        $users = User::all();
        $mentors = [];
        for ($i = 0; $i < count($users); $i ++) {
            if ($users[$i]['email'] != $email && $users[$i]['is_mentor'] == 1) {
                $mentors[] = $users[$i];
            }
        }

        for ($i = 0; $i < count($mentors); $i ++) {
            $tags_id = explode(',', $mentors[$i]['tags_id']);
            $tag_names = [];
            foreach ($tags_id as $tag_key => $tag_value) {
                $tags = Tag::where('id', $tag_value)->first();
                $tag_names[$tag_key] = $tags['name'];
            }
            $mentors[$i]['tag_name'] = $tag_names;
        }

        return response()->json([
            'result'=> 'success',
            'data'=> $mentors,
        ]);
    }
}
