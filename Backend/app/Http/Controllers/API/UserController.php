<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Invited;
use App\Models\Session;
use App\Models\Subscription;
use Faker\Provider\Payment;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Tag;
use App\Models\Review;
use App\Models\Media;
use JWTAuth;
use Exception;
use Carbon\Carbon;
use App\Http\Controllers\API\PaymentController;
use phpDocumentor\Reflection\DocBlock\Tags\See;
use Log;

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
      if (!$user->email_verified_at) {
        return response()->json([
          'result' => 'failed',
          'message' => config('messages.auth.verify_code'),
          // ], 401);
        ]);
      }
      if (!$token = JWTAuth::attempt($input)) {
        return response()->json([
          'result' => 'failed',
          'message' => 'Email or Password is incorrect.',
          // ], 401);
        ]);
      }
      User::where('email', $request->email)->update(['origin_password' => "", 'remember_token' => ""]);
      return response()->json([
        'result' => 'success',
        'token' => $token,
        'user' => auth()->user(),
      ]);
    } catch (\Throwable $th) {
      return response()->json([
        'result' => 'failed',
        'message' => 'Email or Password is incorrect.',
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
    if (count(User::where(['email' => $email, 'is_active' => config('global.users.active')])->get())) {
      return response()->json([
        'result' => 'failed',
        'message' => 'Email address is already existed'
        // ], 300);
      ]);
    }
    try {
      $user = new User();
      $user->name = $name;
      $user->email = $email;
      if ($request['is_mentor']) {
        $user->is_mentor = $request['is_mentor'];
      } else {
        $user->is_mentor = 0;
      }
      $user->password = bcrypt($password);
      $user->origin_password = $password;
      $user->is_active = config('global.users.active');
      $user->save();
      $user->generateTwoFactorCode();
      $two_factor_code = $user->two_factor_code;
      $app_path = app_path();
      $body = include_once($app_path . '/Mails/VerifyAccount.php');
      $body = implode(" ", $body);
      if (!$this->send_email($toEmail, $name, $subject, $body)) {
        User::where(['email' => $email])->delete();
        return response()->json([
          'result' => 'failed',
          'message' => 'Sorry, fail send mail'
        ]);
      }
      return response()->json([
        'result' => 'success',
      ]);
    } catch (Exception $e) {
      return response()->json([
        'result' => 'failed',
        'message' => 'Sorry, user can not register'
        // ], 500);
      ]);
    }
  }
  
  public function signBySocial(Request $request)
  {
    $email = $request->email;
    $name = $request->name;
    $provider = $request->provider;
    $provider_id = $request->provider_id;
    Log::info([$email, $name, $provider, $provider_id]);
    $user = User::where(['email' => $email, 'provider' => $provider, 'provider_id' => $provider_id])->first();
    if ($user) {
      $token = null;
      if (!$token = JWTAuth::fromUser($user)) {
        return response()->json([
          'result' => 'failed',
          'message' => 'Email or Password is incorrect.',
          // ], 401);
        ]);
      }
      return response()->json([
        'result' => 'success',
        'token' => $token,
        'user' => $user,
      ]);
    } else {
      $user = User::where('email', $email)->first();
      if ($user) {
        User::where('email', $email)->update([
          'name' => $name,
          'provider' => $provider,
          'provider_id' => $provider_id,
        ]);
        $token = null;
        if (!$token = JWTAuth::fromUser($user)) {
          return response()->json([
            'result' => 'failed',
            'message' => 'Email or Password is incorrect.',
            // ], 401);
          ]);
        }
        $user = User::where('email', $email)->first();
        return response()->json([
          'result' => 'success',
          'token' => $token,
          'user' => $user,
        ]);
      } else {
        Log::info([$email, $name, $provider, $provider_id]);
        $user = User::create([
          'email' => $email,
          'password' => bcrypt($email),
          'name' => $name,
          'provider' => $provider,
          'provider_id' => $provider_id,
          'email_verified_at' => Carbon::now(),
          'is_active' => 1,
        ]);
        $token = null;
        if (!$token = JWTAuth::fromUser($user)) {
          return response()->json([
            'result' => 'failed',
            'message' => 'Email or Password is incorrect.',
            // ], 401);
          ]);
        }
        $user = User::where('id', $user->id)->first();
        return response()->json([
          'result' => 'success',
          'token' => $token,
          'user' => $user,
        ]);
      }
    }
  }
  
  public function getUserInfo(Request $request)
  {
    try {
      $email = $request['email'];
      $temp_names = [];
      $user = User::where('email', $email)->first();
      if ($user['dob'] == null || $user['dob'] == "") {
        $currentDate = date('Y-m-d');
        $user['dob'] = $currentDate;
      } else {
        $newDate = date("Y-m-d", strtotime($user['dob']));
        $user['dob'] = $newDate;
      }
      if (trim($user['tags_id'], ',') == null || trim($user['tags_id'], ',') == '')
        $tags_id = [];
      else
        $tags_id = explode(',', trim($user['tags_id'], ','));
      $user['tags'] = $tags_id;
      if ($user->description == null)
        $user->description = "";
      foreach ($tags_id as $tag_key => $tag_id) {
        if ($tag_names = Tag::select('name')->where('id', $tag_id)->first()) {
          $temp_names[] = $tag_names->name;
        }
      }
      $user['tags_name'] = $temp_names;
      return response()->json([
        'result' => 'success',
        'data' => $user,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  public function getUserInfoById(Request $request)
  {
    try {
      $id = $request['id'];
//      $average_review = 0;
//      $count_review = 0;
      $tag_names = [];
      
      $res_students = Review::where('mentor_id', $id)->get();
      $user = User::where('id', $id)->first();
      $temp = [];
      foreach ($res_students as $review_key => $review_value) {
        $res_student = User::where('id', $review_value->student_id)->first();
        $created_at = date('Y-m-d', strtotime($review_value->created_at));
        $current = date('Y-m-d');
        $date1 = date_create($created_at);
        $date2 = date_create($current);
        $diff = date_diff($date1, $date2);
        $temp['student'] = $res_student;
        $temp['review'] = $review_value;
        $temp['review']['day_diff'] = $diff->format('%a');
        $res_students[$review_key] = $temp;
//        $count_review++;
//        $average_review += $review_value->mark;
      }
      $newDate = date("Y-m-d", strtotime($user['dob']));
      $user['dob'] = $newDate;
      $tags_id = [];
      if (trim($user['tags_id'], ',') != "") {
        $tags_id = explode(',', trim($user['tags_id'], ','));
      }
      foreach ($tags_id as $tag_key => $tag_value) {
        $tags = Tag::where('id', $tag_value)->first();
        $tag_names[$tag_key] = $tags['name'];
      }
      $share_info = Media::where('user_id', $user['id'])->get();
      for ($i = 0; $i < count($share_info); $i++) {
        $date = $share_info[$i]['created_at'];
        $share_info[$i]['day'] = date('d/m/y', strtotime($date));
        $share_info[$i]['time'] = date('h:i a', strtotime($date));
      }
      $user['tags'] = $tag_names;
      $user['student'] = $res_students;
//      $user['count_review'] = $count_review;
      $user['count_review'] = $user->sub_count;
      $user['share_info'] = $share_info;
//      if ($count_review > 0) {
//        $user['average_review'] = round($average_review/$count_review, 1);
//      } else {
//        $user['average_review'] = 0;
//      }
      if ($user->description == null)
        $user->description = "";
      return response()->json([
        'result' => 'success',
        'data' => $user,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  public function editProfile(Request $request)
  {
    try {
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
      
      $tags = ',' . implode(",", $request['tags']) . ',';
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
      $validator = Validator::make($request->all(), $rules, $messages);
      
      if ($validator->fails()) {
        return [
          'result' => 'failed',
          'type' => 'require',
          'message' => $validator->messages()
        ];
      }
      
      $user = User::where('email', $email)->get();
      
      if ($user == null || count($user) == 0) {
        return response()->json([
          'result' => 'failed',
          'message' => 'Current User Does Not Exist',
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
          'result' => 'success',
          'data' => $user,
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  public function verifyCode(Request $request)
  {
    $subject = "Welcome to BrainsShare!";
    try {
      $code = $request->code;
      $user = User::where('two_factor_code', $code)->first();
      if (!$user) {
        return response()->json([
          'result' => 'failed',
          'message' => 'Sorry, The confirm code is incorrect!'
          // ], 500);
        ]);
      }
      $user->verifiedAccount();
      $toEmail = $user->email;
      $name = $user->name;
      $app_path = app_path();
      $body = include_once($app_path . '/Mails/Welcome.php');
      $body = implode(" ", $body);
      if (!$this->send_email($toEmail, $name, $subject, $body)) {
        return response()->json([
          'result' => 'failed',
          'message' => 'Sorry, fail send mail'
        ]);
      }
      $user->update(['two_factor_code' => "0"]);
      $request['password'] = $user->origin_password;
      $request['email'] = $user->email;
      return $this->login($request);
      
    } catch (\Throwable $th) {
      return response()->json([
        'result' => 'failed',
        'message' => 'Sorry, can not verify the code'
        // ], 500);
      ]);
    }
  }
  
  public function forgot(Request $request)
  {
    $subject = "Welcome to BrainsShare!";
    $email = $request['email'];
    $token = null;
    
    try {
      $user = User::where('email', $email)->first();
      if (!$user) {
        return response()->json([
          'result' => 'failed',
          'message' => 'Email address is not existed'
          // ], 300);
        ]);
      }
      $toEmail = $user->email;
      $name = $user->name;
      $fronturl = env("FRONT_URL");
      $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
      $vCode = substr(str_shuffle($permitted_chars), 0, 50);
      User::where('email', $email)->update(['remember_token' => $vCode]);
      
      $app_path = app_path();
      $body = include_once($app_path . '/Mails/VerifyCode.php');
      $body = implode(" ", $body);
      if (!$this->send_email($toEmail, $name, $subject, $body)) {
        return response()->json([
          'result' => 'failed',
          'message' => 'Sorry, fail send mail'
        ]);
      }
      return response()->json([
        'result' => 'success',
      ]);
    } catch (\Throwable $th) {
      return response()->json([
        'result' => 'failed',
        'message' => 'Invalid Email',
      ]);
    }
  }
  
  public function reset(Request $request)
  {
    $vCode = null;
    try {
      $vCode = $request->vCode;
//      $email = $request->email;
      $password = $request->password;
      $user = User::where('remember_token', $vCode)->first();
      if ($user) {
        if ($user->remember_token != $vCode) {
          return response()->json([
            'result' => 'failed',
            'message' => 'fail to confirm verify code.',
          ]);
        }
        if ($password == "") {
          return response()->json([
            'result' => 'failed',
            'message' => 'Can not empty password'
          ]);
        }
        $password_code = bcrypt($password);
        $user->update(['password' => $password_code]);
        return response()->json([
          'result' => 'success',
          'message' => 'Updated password',
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'Updating password failed',
        ]);
      }
    } catch (\Throwable $th) {
      return response()->json([
        'result' => 'failed',
        'message' => 'Sorry, can not update password. Try again.'
        // ], 500);
      ]);
    }
  }
  
  public function signout(Request $request)
  {
    return response()->json([
      'result' => 'success',
      'message' => 'logout successfully'
      // ], 200);
    ]);
  }
  
  public function findMentors(Request $request)
  {
    try {
      $tag_id = $request['tag_id'];
      if ($tag_id) {
        $tag_id = ',' . $tag_id . ',';
      }
      $mentor_name = $request['name'];
      $rowsPerPage = $request['rowsPerPage'];
      $mentors = User::where('name', 'LIKE', '%' . $mentor_name . '%')->where('tags_id', 'LIKE', '%' . $tag_id . '%')->where('is_mentor', 1)->paginate($rowsPerPage);
      $result_res = [];
      if (count($mentors) > 0) {
        for ($i = 0; $i < count($mentors); $i++) {
          $temp_tag = [];
          $tags_id = "";
          if (trim($mentors[$i]->tags_id, ',') != "") {
            $tags_id = trim($mentors[$i]->tags_id, ',');
          }
          if ($tags_id != "") {
            $tag_rows = explode(',', $tags_id);
            for ($j = 0; $j < count($tag_rows); $j++) {
              $tags_name = Tag::where('id', $tag_rows[$j])->first();
              $temp_tag[$j] = $tags_name->name;
            }
          }
          if ($mentors[$i]['description'] == null) {
            $mentors[$i]['description'] = "";
          }
          $mentors[$i]['tag_name'] = $temp_tag;
          $result_res[] = $mentors[$i];
        }
      }
      return response()->json([
        'result' => 'success',
        'data' => $result_res,
        'totalRows' => $mentors->total(),
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  public function featuredMentors(Request $request)
  {
    try {
//    $users = User::select('id')->get();
//    foreach ($users as $user_key => $user_value) {
//      $user_marks = Review::select('mark')->where('mentor_id', $user_value->id)->get();
//      $sum_marks = 0;
//      foreach ($user_marks as $mentor_key => $mentor_value) {
//        $sum_marks += $mentor_value->mark;
//      }
//      if (count($user_marks) > 0) {
//        $average_marks = round($sum_marks/count($user_marks), 1);
//      } else {
//        $average_marks = 0;
//      }
//
//      User::where('id', $user_value->id)->update(['average_mark' => $average_marks]);
//    }
      
      $top_mentors = User::orderBy('average_mark', 'DESC')->take(5)->get();
      foreach ($top_mentors as $top_key => $top_value) {
        if ($top_value->description == null) {
          $top_value->description = "";
        }
        $temp_tag = [];
        $tags = [];
        if (trim($top_value->tags_id, ',') != "") {
          $tags = explode(',', trim($top_value->tags_id, ','));
        }
        foreach ($tags as $tag_key => $tag_value) {
          if ($tag_value != "") {
            $tag_name = Tag::select('name')->where('id', $tag_value)->first();
            $temp_tag[$tag_key] = $tag_name->name;
          }
        }
        $top_value['tags_name'] = $temp_tag;
      }
      
      return response()->json([
        'result' => 'success',
        'data' => $top_mentors,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  public function getAllMentors(Request $request)
  {
    try {
      $email = $request['email'];
      $rowsPerPage = $request['rowsPerPage'];
      $page = $request['page'];
      $users = User::where('email', '!=', $email)->where('is_mentor', 1)->paginate($rowsPerPage);
      $mentors = [];
      
      for ($i = 0; $i < count($users); $i++) {
        if ($users[$i]['email'] != $email && $users[$i]['is_mentor'] == 1) {
          $mentors[] = $users[$i];
        }
      }
      for ($i = 0; $i < count($mentors); $i++) {
        $tags_id = [];
        if (trim($mentors[$i]['tags_id'], ',') != "") {
          $tags_id = explode(',', trim($mentors[$i]['tags_id'], ','));
        }
        $tag_names = [];
//        $all_marks = 0;
        foreach ($tags_id as $tag_key => $tag_value) {
          $tags = Tag::where('id', $tag_value)->first();
          $tag_names[$tag_key] = $tags['name'];
        }
        $mentors[$i]['tag_name'] = $tag_names;
//        $res_mark = Review::select('mark')->where('mentor_id', $mentors[$i]['id'])->get();
//        if(count($res_mark) > 0){
//          for($j = 0; $j < count($res_mark); $j++){
//            $all_marks += $res_mark[$j]['mark'];
//          }
//          $mentors[$i]['average_mark'] = round($all_marks/count($res_mark), 1);
//        } else {
//          $mentors[$i]['average_mark'] = 0;
//        }
        $temp = [];
        $sub_id = Subscription::select('student_id')->where('mentor_id', $mentors[$i]['id'])->get();
        if (count($sub_id) > 0) {
          for ($k = 0; $k < count($sub_id); $k++) {
            $temp[] = $sub_id[$k]['student_id'];
          }
        }
        if ($mentors[$i]['description'] == null) {
          $mentors[$i]['description'] = "";
        }
        $mentors[$i]['sub_id'] = $temp;
      }
      return response()->json([
        'result' => 'success',
        'data' => $mentors,
        'totalRows' => $users->total(),
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  function getAllStudents(Request $request)
  {
    try {
      $email = $request->email;
      $students = User::select('id', 'email', 'avatar')->where('email', '!=', $email)->get();
      if (count($students) > 0) {
        return response()->json([
          'result' => 'success',
          'data' => $students,
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'data' => [],
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  public function switchUser(Request $request) {
    try {
      $user_id = $request->user_id;
      $is_mentor = User::select('is_mentor')->where('id', $user_id)->first();
      $res = User::where('id', $user_id)->update(['is_mentor' => !$is_mentor->is_mentor]);
      if ($res > 0) {
        return response()->json([
          'result' => 'success',
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'data' => $th,
      ]);
    }
  }
  
  function test(Request $request)
  {
    echo Carbon::now() . "\n";
    $email = $request->email;
    $result =User::where('email', $email)->update([
      'name' => $request->name,
      'provider' => $request->provider,
      'provider_id' => $request->provider_id,
    ]);
    echo $result;
  }
}



