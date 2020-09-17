<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Tag;
use App\Models\Review;
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
    $subject = "Welcome to BransShare!";
    $fronturl = env("FRONT_URL");
    $toEmail = $email;
    
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
      $user->save();
      $user->generateTwoFactorCode();
      $user->is_active = config('global.users.active');
      $two_factor_code = $user->two_factor_code;
      $app_path = app_path();
      $body = include_once($app_path.'/Mails/VerifyAccount.php');
      $body = implode(" ",$body);
      
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
    $temp_names = [];
    $user = User::where('email', $email)->first();
    if ($user['dob'] == null || $user['dob'] == "") {
      $user['dob'] = '2020-01-01';
    } else {
      $newDate = date("Y-m-d", strtotime($user['dob']));
      $user['dob'] = $newDate;
    }
    if ($user['tags_id'] == null || $user['tags_id'] == '')
      $tags_id = [];
    else
      $tags_id = explode(',', $user['tags_id']);
    $user['tags'] = $tags_id;
    foreach ($tags_id as $tag_key=> $tag_id) {
      $tag_names = Tag::select('name')->where('id', $tag_id)->first();
      $temp_names[] = $tag_names->name;
    }
    $user['tags_name'] = $temp_names;
    return response()->json([
      'result'=> 'success',
      'data'=> $user,
    ]);
  }
  
  public function getuserinfobyid(Request $request)
  {
    $id = $request['id'];
    $average_review = 0;
    $count_review = 0;
    $res_students = Review::where('mentor_id', $id)->get();
    $user = User::where('id', $id)->first();
    $temp = [];
    foreach ($res_students as $review_key => $review_value) {
      $res_student = User::where('id', $review_value->student_id)->first();
      $temp['student'] = $res_student;
      $temp['review'] = $review_value;
      $res_students[$review_key] = $temp;
      $count_review++;
      $average_review += $review_value->mark;
    }
    
    
    $newDate = date("Y-m-d", strtotime($user['dob']));
    $user['dob'] = $newDate;
    $tags_id = explode(',', $user['tags_id']);
    foreach ($tags_id as $tag_key => $tag_value) {
      $tags = Tag::where('id', $tag_value)->first();
      $tag_names[$tag_key] = $tags['name'];
    }
    
    $user['tags'] = $tag_names;
    $user['student'] = $res_students;
    $user['count_review'] = $count_review;
    $user['average_review'] = (float)$average_review/$count_review;
    
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
      $user = User::where('two_factor_code', $code)->first();
      if(!$user) {
        return response()->json([
          'result'=> 'failed',
          'message' => 'Sorry, The confirm code is incorrect!'
          // ], 500);
        ]);
      }
      $user->verifiedAccount();
      $toEmail = $user->email;
      $name = $user->name;
      $app_path = app_path();
      $body = include_once($app_path.'/Mails/Welcome.php');
      $body = implode(" ",$body);
      
      if (!$this->send_email($toEmail, $name, $subject, $body)){
        return response()->json([
          'result'=> 'failed',
          'message' => 'Sorry, fail send mail'
        ]);
      }
      
      $user->update(['two_factor_code' => "0"]);
      return response()->json([
        'result'=> 'success',
        'message' => 'verified code',
      ]);
      
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
      $fronturl = env("FRONT_URL");
      
      $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
      $vCode =  substr(str_shuffle($permitted_chars), 0, 50);
      User::where('email', $email)->update(['remember_token' => $vCode]);
      
      $app_path = app_path();
      $body = include_once($app_path.'/Mails/VerifyCode.php');
      $body = implode(" ",$body);
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
