<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Associate;
use App\Models\Session;
use App\Models\Subscription;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Tag;
use App\Models\Review;
use App\Models\Media;
use App\Models\Language;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Exception;
use Carbon\Carbon;
use Log;

class UserController extends Controller
{
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
      User::where('email', $request->email)->update(['origin_password' => "", 'remember_token' => "", 'status' => 1]);
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
    $email = $request->email;
    $name = $request->name;
    $password = $request->password;
    $channel_name = $request->channel_name;
    $subject = "Welcome to BransShare!";
    $fronturl = env("APP_URL");
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
      $user->channel_name = $channel_name;
      if ($request->is_mentor) {
        $user->is_mentor = $request->is_mentor;
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
      
      //Begin register customer ID for stripe
      $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
      $stripe_customer = $stripe->customers->create([
        'email' => $email,
        'description' => 'customer is '.$name,
        'name' => $name,
      ]);
      //End register customer ID for stripe
      $user->customer_id = $stripe_customer->id;
      $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
      $alias = substr(str_shuffle($permitted_chars), 0, 50);
      $user->alias = $alias;
      $user->save();
      
      return response()->json([
        'result' => 'success',
      ]);
    } catch(\Stripe\Exception\CardException $e) {
      // Since it's a decline, \Stripe\Exception\CardException will be caught
      $message =  $e->getError()->message . '\n';
      return response()->json(['result' => 'warning', 'message' => $message]);
    } catch (\Stripe\Exception\RateLimitException $e) {
      // Too many requests made to the API too quickly
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\InvalidRequestException $e) {
      // Invalid parameters were supplied to Stripe's API
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\AuthenticationException $e) {
      // Authentication with Stripe's API failed
      // (maybe you changed API keys recently)
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\ApiConnectionException $e) {
      // Network communication with Stripe failed
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
      // Display a very generic error to the user, and maybe send
      // yourself an email
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (Exception $e) {
      // Something else happened, completely unrelated to Stripe
      return response()->json(['result' => 'failed', 'message' => 'Sorry, user can not register' ]);
    }
  }
  
  public function signBySocial(Request $request)
  {
    try {
      $email = $request->email;
      $name = $request->name;
      $provider = $request->provider;
      $provider_id = $request->provider_id;
      $channel_name = $request->channel_name;
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
        User::where('email', $email)->update(['status' => 1]);
        return response()->json([
          'result' => 'success',
          'token' => $token,
          'user' => $user,
          'logged_type' => 'signin',
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
          User::where('email', $email)->update(['status' => 1]);
          return response()->json([
            'result' => 'success',
            'token' => $token,
            'user' => $user,
            'logged_type' => 'signin',
          ]);
        } else {
          $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
          $alias = substr(str_shuffle($permitted_chars), 0, 50);
          //Begin register customer ID for stripe
          $stripe = new \Stripe\StripeClient(env("SK_LIVE"));
          $stripe_customer = $stripe->customers->create([
            'email' => $email,
            'description' => 'customer is '.$name,
            'name' => $name,
          ]);
          //End register customer ID for stripe
          $user = User::create([
            'email' => $email,
            'password' => bcrypt($email),
            'name' => $name,
            'provider' => $provider,
            'provider_id' => $provider_id,
            'email_verified_at' => Carbon::now(),
            'is_active' => 1,
            'channel_name' => $channel_name,
            'alias' => $alias,
            'customer_id' => $stripe_customer->id,
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
          User::where('email', $email)->update(['status' => 1]);
          return response()->json([
            'result' => 'success',
            'token' => $token,
            'user' => $user,
            'logged_type' => 'signup',
          ]);
        }
      }
    } catch(\Stripe\Exception\CardException $e) {
      // Since it's a decline, \Stripe\Exception\CardException will be caught
      $message =  $e->getError()->message . '\n';
      return response()->json(['result' => 'warning', 'message' => $message]);
    } catch (\Stripe\Exception\RateLimitException $e) {
      // Too many requests made to the API too quickly
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\InvalidRequestException $e) {
      // Invalid parameters were supplied to Stripe's API
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\AuthenticationException $e) {
      // Authentication with Stripe's API failed
      // (maybe you changed API keys recently)
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\ApiConnectionException $e) {
      // Network communication with Stripe failed
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
      // Display a very generic error to the user, and maybe send
      // yourself an email
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (Exception $e) {
      // Something else happened, completely unrelated to Stripe
      return response()->json(['result' => 'failed', 'message' => $e->getMessage() ]);
    }
  }
  
  public function getUserInfo(Request $request)
  {
    try {
      $email = $request->email;
      $temp_names = [];
      $temp_languages = [];
      $user = User::select('id', 'name', 'email', 'channel_name', 'tags_id', 'languages_id', 'is_mentor', 'hourly_price', 'pay_verified',
        'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
        'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count', 'phone')
        ->where('email', $email)->first();
      if (!$user) {
        return response()->json([
          'result' => 'failed',
          'message' => 'not exist user',
        ]);
      }
      if ($user->dob == null || $user->dob == "") {
        $currentDate = date('Y-m-d');
        $user->dob = $currentDate;
      } else {
        $newDate = date("Y-m-d", strtotime($user->dob));
        $user->dob = $newDate;
      }
      if (trim($user->tags_id, ',') == null || trim($user->tags_id, ',') == '')
        $tags_id = [];
      else
        $tags_id = explode(',', trim($user->tags_id, ','));
      $user->tags = $tags_id;
      if (trim($user->languages_id, ',') == null || trim($user->languages_id, ',') == '')
        $languages_id = [];
      else
        $languages_id = explode(',', trim($user->languages_id, ','));
      $user->language = $languages_id;
      if ($user->description == null)
        $user->description = "";
      foreach ($tags_id as $tag_key => $tag_id) {
        if ($tag_names = Tag::select('name')->where('id', $tag_id)->first()) {
          $temp_names[] = $tag_names->name;
        }
      }
      foreach ($languages_id as $lang_key => $lang_id) {
        if ($language = Language::select('language')->where('id', $lang_id)->first()) {
          $temp_languages[] = $language->language;
        }
      }
      $user->tags_name = $temp_names;
      $user->languages_name = $temp_languages;
      return response()->json([
        'result' => 'success',
        'data' => $user,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'message' => $th->getMessage(),
      ]);
    }
  }
  
  public function getUserInfoById(Request $request)
  {
//    try {
    $id = $request->id;
    $tag_names = [];
    $res_students = Review::where('mentor_id', $id)->get();
    $user = User::select('id', 'name', 'email', 'channel_name', 'tags_id', 'is_mentor', 'hourly_price', 'pay_verified',
      'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
      'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count', 'phone')
      ->where('id', $id)->first();
    $temp = [];
    foreach ($res_students as $review_key => $review_value) {
      $res_student = User::select('id', 'name', 'email', 'channel_name', 'tags_id', 'is_mentor', 'hourly_price', 'pay_verified',
        'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
        'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count', 'phone')->where('id', $review_value->student_id)->first();
      $created_at = date('Y-m-d', strtotime($review_value->created_at));
      $current = date('Y-m-d');
      $date1 = date_create($created_at);
      $date2 = date_create($current);
      $diff = date_diff($date1, $date2);
      $temp['student'] = $res_student;
      $temp['review'] = $review_value;
      $temp['review']['day_diff'] = $diff->format('%a');
      $res_students[$review_key] = $temp;
    }
    $newDate = date("Y-m-d", strtotime($user->dob));
    $user->dob = $newDate;
    $tags_id = [];
    if (trim($user->tags_id, ',') != "") {
      $tags_id = explode(',', trim($user->tags_id, ','));
    }
    foreach ($tags_id as $tag_key => $tag_value) {
      $tags = Tag::where('id', $tag_value)->first();
      $tag_names[$tag_key] = $tags->name;
    }
    $share_info = Media::where('user_id', $user->id)->where('isForum', false)->get();
    for ($i = 0; $i < count($share_info); $i++) {
      $date = $share_info[$i]['created_at'];
      $share_info[$i]['day'] = date('d/m/y', strtotime($date));
      $share_info[$i]['time'] = date('h:i a', strtotime($date));
    }
    $session_max = Media::where('user_id', $user->id)->where('isForum', true)->max('session_id');
    $session_min = Media::where('user_id', $user->id)->where('isForum', true)->min('session_id');
    
    $forum_infos = [];
    for ($i = $session_min; $i <= $session_max; $i++) {
      $attach = [];
      $forum_info = [];
      $media_infos = Media::where('user_id', $user->id)->where('isForum', true)->where('session_id', $i)->get();
      $session_info = Session::where('user_id', $user->id)->where('id', $i)->first();
      $temp_names = [];
      if ($session_info) {
        if ($session_info['tags_id'] == ",,"){
          $tags_id = [];
          $session_info['tags_id'] = "";
        }
        else {
          $tags_id = explode(',', trim($session_info['tags_id'], ','));
        }
        $session_info['tags'] = $tags_id;
        foreach ($tags_id as $tag_key=> $tag_id) {
          $tag_names = Tag::select('name')->where('id', $tag_id)->first();
          if ($tag_names) {
            $temp_names[] = $tag_names->name;
          }
        }
      }
      if (count($media_infos) > 0) {
        for ($j = 0; $j < count($media_infos); $j++) {
          $attach['origin_name'] = $media_infos[$j]->origin_name;
          $attach['path'] = $media_infos[$j]->media_url;
          $forum_info['attachments'][] = $attach;
        }
        $forum_info['title'] = $media_infos[0]->title;
        $forum_info['description'] = $media_infos[0]->description;
        $forum_info['isForum'] = $media_infos[0]->isForum;
        $forum_info['session_id'] = $media_infos[0]->session_id;
        $forum_info['language'] = $session_info['language'];
        $forum_info['forum_start'] = $session_info['forum_start'];
        $forum_info['forum_end'] = $session_info['forum_end'];
        $forum_info['age_limitation'] = $session_info['age_limitation'];
        $forum_info['price'] = $session_info['price'];
        $forum_info['tags_name'] = $temp_names;
        $forum_infos[] = $forum_info;
      }
    }
    $user->tags = $tag_names;
    $user->student = $res_students;
    $user->share_info = $share_info;
    $user->forum_info = $forum_infos;
    if ($user->description == null)
      $user->description = "";
    return response()->json([
      'result' => 'success',
      'data' => $user,
    ]);
//    } catch (Exception $th) {
//      return response()->json([
//        'result' => 'failed',
//        'message' => $th->getMessage(),
//      ]);
//    }
  }
  
  public function getIntroduceInfo (Request $request) {
    try {
      $alias = $request->alias;
      $user = User::where('alias', $alias)->first();
      if ($user) {
        return response()->json([
          'result' => 'success',
          'data' => $user,
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'does not exist user',
        ]);
      }
    } catch(Exception $th) {
      return response()->json([
        'result' => 'failed',
        'message' => $th->getMessage()
      ]);
    }
  }
  
  public function editProfile(Request $request)
  {
    try {
      $name = $request->name;
      $birthday = $request->birthday;
      $email = $request->email;
      $phone = $request->phone;
      $description = $request->description;
      $expertise = $request->expertise;
      $hourlyprice = $request->hourlyprice;
      $subpagename = $request->subpagename;
      $subplanfee = $request->subplanfee;
      $videourl = $request->videourl;
      $instantcall = $request->instantcall;
      $avatar = $request->avatar;
      $is_mentor = $request->is_mentor;
      $category = $request->category;
      $subcategory = $request->subcategory;
      $minimum_age = $request->minimum_age;
      
      $tags = ',' . implode(",", $request->tags) . ',';
      $language = ',' . implode(",", $request->language) . ',';
      $rules = array(
        'name' => 'required',
        'email' => 'required|email',
        'expertise' => 'required',
        'hourlyprice' => 'required',
        'subpagename' => 'required',
        'subplanfee' => 'required',
        'category' => 'required',
        'subcategory' => 'required',
        'minimum_age' => 'required',
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
      
      //Begin set product(prod_) and plan(price_) for stripe
      $user_info = User::select('sub_plan_fee', 'sub_product_id', 'sub_plan_id')->where('email', $email)->first();
      $stripe = new \Stripe\StripeClient(env('SK_LIVE'));
      if ($user_info->sub_product_id == "") {
        $product_info = $stripe->products->create([
          'name' => $name,
          'description' => $name.'\'s production is Session',
        ]);
        $plan_info = $stripe->plans->create([
          'amount' => $subplanfee * 100,
          'currency' => 'usd',
          'interval' => 'month',
          'product' => $product_info->id,
          'nickname' => $name,
        ]);
        User::where('email', $email)->update([
          'sub_product_id' => $product_info->id,
          'sub_plan_id' => $plan_info->id,
        ]);
      } else {
        $stripe->plans->delete(
          $user_info->sub_plan_id,
          []
        );
        $plan_info = $stripe->plans->create([
          'amount' => $subplanfee * 100,
          'currency' => 'usd',
          'interval' => 'month',
          'product' => $user_info->sub_product_id,
          'nickname' => $name,
        ]);
        User::where('email', $email)->update([
          'sub_plan_id' => $plan_info->id,
        ]);
      }
      //End set plan_id for stripe
      if ($avatar == "" || $avatar == null)
        $avatar = "https://brainshares.s3-us-west-2.amazonaws.com/avatar.jpg";
      User::where('email', $email)->update(array(
        'name' => $name,
        'dob' => $birthday,
        'email' => $email,
        'phone' => $phone,
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
        'tags_id' => $tags,
        'languages_id' => $language,
        'minimum_age' => $minimum_age,
        'category' => $category,
        'subcategory' => $subcategory
      ));
      $res_user_info = User::where('email', $email)->first();
      return response()->json([
        'result' => 'success',
        'data' => $res_user_info,
      ]);
    } catch(\Stripe\Exception\CardException $e) {
      // Since it's a decline, \Stripe\Exception\CardException will be caught
      $message =  $e->getError()->message . '\n';
      return response()->json(['result' => 'warning', 'message' => $message]);
    } catch (\Stripe\Exception\RateLimitException $e) {
      // Too many requests made to the API too quickly
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\InvalidRequestException $e) {
      // Invalid parameters were supplied to Stripe's API
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\AuthenticationException $e) {
      // Authentication with Stripe's API failed
      // (maybe you changed API keys recently)
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\ApiConnectionException $e) {
      // Network communication with Stripe failed
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
      // Display a very generic error to the user, and maybe send
      // yourself an email
      return response()->json(['result' => 'warning', 'message' => $e->getMessage() ]);
    } catch (Exception $e) {
      // Something else happened, completely unrelated to Stripe
      return response()->json(['result' => 'failed', 'message' => $e->getMessage() ]);
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
    $email = $request->email;
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
      $fronturl = env("APP_URL");
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
  
  public function logout(Request $request)
  {
    try {
      $email = $request->email;
      User::where('email', $email)->update(['status' => 0]);
      auth()->logout();
      return response()->json([
        'result' => 'success',
        'message' => 'logout successfully'
        // ], 200);
      ]);
    } catch(Exception $th) {
      return response()->json([
        'result' => 'failed',
        'message' => $th->getMessage()
      ]);
    }
  }
  
  public function findMentors(Request $request)
  {
    try {
      $tag_id = $request->tag_id;
      if ($tag_id) {
        $tag_id = ',' . $tag_id . ',';
      }
      $mentor_name = $request->name;
      $rowsPerPage = $request->rowsPerPage;
      $filter_level = $request->filterbylevel;
      $filter_hourly = $request->filterbyhourly;
      if ($filter_level == true) {
        $level_direction = 'DESC';
      } else {
        $level_direction = 'ASC';
      }
      if ($filter_hourly == true) {
        $hourly_direction = 'DESC';
      } else {
        $hourly_direction = 'ASC';
      }
      $mentors = User::where('name', 'LIKE', '%' . $mentor_name . '%')
        ->where('tags_id', 'LIKE', '%' . $tag_id . '%')
        ->where('is_mentor', 1)
        ->orderBy('expertise', $level_direction)
        ->orderBy('hourly_price', $hourly_direction)
        ->paginate($rowsPerPage);
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
        'message' => $th->getMessage(),
      ]);
    }
  }
  
  public function findMentorsByTags(Request $request) {
    try {
      $user_id = $request->user_id;
      $tag_ids = $request->tags_id;
      $rowsPerPage = $request->rowsPerPage;
      $is_mentor = User::select('is_mentor')->where('id', $user_id)->first();
      $temp_query = "";
      if ($tag_ids) {
        $count_tag = count($tag_ids);
      }
      for ($i = 0; $i < $count_tag; $i++) {
        $tag_id = ','.$tag_ids[$i].',';
        if ($i == $count_tag-1) {
          $temp_query = $temp_query."tags_id like '%$tag_id%'";
        } else {
          $temp_query = $temp_query."tags_id like '%$tag_id%' and ";
        }
      }
      
      if ($count_tag > 0) {
        if ($is_mentor->is_mentor == 1) {
          $mentors = DB::table('users')
            ->where('is_mentor', 1)
            ->where('id', '!=', $user_id)
            ->whereRaw(DB::raw($temp_query))
            ->paginate($rowsPerPage);
        } else {
          $mentors = DB::table('users')
            ->where('is_mentor', 1)
            ->whereRaw(DB::raw($temp_query))
            ->paginate($rowsPerPage);
        }
      } else {
        if ($is_mentor->is_mentor == 1) {
          $mentors = DB::table('users')
            ->where('is_mentor', 1)
            ->where('id', '!=', $user_id)
            ->paginate($rowsPerPage);
        } else {
          $mentors = DB::table('users')
            ->where('is_mentor', 1)
            ->paginate($rowsPerPage);
        }
      }
      
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
          if ($mentors[$i]->description == null) {
            $mentors[$i]->description = "";
          }
          $mentors[$i]->tag_name = $temp_tag;
          
          $share_info = Media::where('user_id', $mentors[$i]->id)->get();
          for ($j = 0; $j < count($share_info); $j++) {
            $date = $share_info[$j]['created_at'];
            $share_info[$j]['day'] = date('d/m/y', strtotime($date));
            $share_info[$j]['time'] = date('h:i a', strtotime($date));
          }
          
          $mentors[$i]->share_info = $share_info;
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
        'message' => $th->getMessage(),
      ]);
    }
  }
  
  public function findMentorsByTagsOrName(Request $request) {
    try {
      $user_id = $request->user_id;
      $tag_ids = $request->tags_id;
      $mentor_name = $request->name;
      $rowsPerPage = $request->rowsPerPage;
      $mentor_language = $request->language; //language
      $mentor_hourlyRate = $request->hourlyRate; //hourlyRate
      $temp_query = "";
      $count_tag = 0;
      
      if ($tag_ids){
        $count_tag = count($tag_ids);
      }
      for ($i = 0; $i < $count_tag; $i++) {
        $tag_id = ','.$tag_ids[$i].',';
        if ($i == $count_tag-1) {
          $temp_query = $temp_query."tags_id like '%$tag_id%'";
        } else {
          $temp_query = $temp_query."tags_id like '%$tag_id%' and ";
        }
      }
      $mentor_lang_id = '';
      if ( $mentor_language != '')
        $mentor_lang_id = ','.$mentor_language.',';
      
      $min_hourly = 0;
      $max_hourly = 1000;
      switch ($mentor_hourlyRate) {
        case 1:
          $min_hourly = 0;
          $max_hourly = 10;
          break;
        case 2:
          $min_hourly = 10;
          $max_hourly = 30;
          break;
        case 3:
          $min_hourly = 30;
          $max_hourly = 60;
          break;
        case 4:
          $min_hourly = 60;
          $max_hourly = 1000;
          break;
        default:
      }
      
      if ($count_tag > 0) {
//        $mentors = DB::table('users')
        $mentors = User::select('id', 'name', 'email', 'channel_name', 'tags_id', 'languages_id', 'is_mentor', 'hourly_price', 'pay_verified',
          'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
          'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count', 'phone')
          ->where('name', 'LIKE', '%' . $mentor_name . '%')
          ->where('id', '!=', $user_id)
          ->where('languages_id', 'LIKE', '%'.$mentor_lang_id.'%')
          ->whereBetween('hourly_price', [$min_hourly, $max_hourly])
          ->orderBy('average_mark', 'DESC')
          ->whereRaw(DB::raw($temp_query))
          ->paginate($rowsPerPage);
      } else {
        if ($mentor_name != "") {
//        $mentors = DB::table('users')
          $mentors = User::select('id', 'name', 'email', 'channel_name', 'tags_id','languages_id', 'is_mentor', 'hourly_price', 'pay_verified',
            'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
            'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count', 'phone')
            ->where('name', 'LIKE', '%' . $mentor_name . '%')
            ->where('id', '!=', $user_id)
            ->where('languages_id', 'LIKE', '%'.$mentor_lang_id.'%')
            ->whereBetween('hourly_price', [$min_hourly, $max_hourly])
            ->orderBy('average_mark', 'DESC')
            ->paginate($rowsPerPage);
        } else {
//        $mentors = DB::table('users')
          $mentors = User::select('id', 'name', 'email', 'channel_name', 'tags_id','languages_id', 'is_mentor', 'hourly_price', 'pay_verified',
            'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
            'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count', 'phone')
            ->where('id', '!=', $user_id)
            ->where('languages_id', 'LIKE', '%'.$mentor_lang_id.'%')
            ->whereBetween('hourly_price', [$min_hourly, $max_hourly])
            ->orderBy('average_mark', 'DESC')
            ->paginate($rowsPerPage);
        }
      }
      
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
          if ($mentors[$i]->description == null) {
            $mentors[$i]->description = "";
          }
          $mentors[$i]->tag_name = $temp_tag;
          
          $share_info = Media::where('user_id', $mentors[$i]->id)->get();
          for ($j = 0; $j < count($share_info); $j++) {
            $date = $share_info[$j]['created_at'];
            $share_info[$j]['day'] = date('d/m/y', strtotime($date));
            $share_info[$j]['time'] = date('h:i a', strtotime($date));
          }
          
          $response_id = $mentors[$i]->id;
          $res_associate = DB::table('associates')
            ->where('request_id', $user_id)
            ->where('response_id', $response_id)
            ->orWhere(function($query) use ($user_id, $response_id){
              $query->where('request_id', $response_id)
                ->where('response_id', $user_id);
            })
            ->first();
          $mentors[$i]['associate'] = -1;
          if ($res_associate) {
            switch ($res_associate->status) {
              case 'Pending':
                $mentors[$i]['associate'] = 0;
                break;
              case 'Connected':
                $mentors[$i]['associate'] = 1;
                break;
              case 'Declined':
                $mentors[$i]['associate'] = 2;
                break;
              case 'Cancelled':
                $mentors[$i]['associate'] = 3;
                break;
            }
            if(Associate::where('response_id', $user_id)->where('request_id', $response_id)->where('status', 'Pending')->first()) {
              $mentors[$i]['associate'] = 4;
            }
          }
          $res_sub = Subscription::where('mentor_id', $mentors[$i]->id)
            ->where('student_id', $user_id)
            ->first();
          $mentors[$i]->share_info = [];
          $mentors[$i]->subscribe = false;
          if ($res_sub) {
            $mentors[$i]->share_info = $share_info;
            $mentors[$i]->subscribe = true;
          }
          $temp = [];
          $sub_id = Subscription::select('student_id')->where('mentor_id', $mentors[$i]->id)->get();
          if (count($sub_id) > 0) {
            for ($k = 0; $k < count($sub_id); $k++) {
              $temp[] = $sub_id[$k]->student_id;
            }
          }
          $mentors[$i]->sub_id = $temp;
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
        'message' => $th->getMessage(),
      ]);
    }
  }
  
  public function featuredMentors(Request $request)
  {
    try {
      $top_mentors = User::select('id', 'name', 'email', 'channel_name', 'tags_id','languages_id', 'is_mentor', 'hourly_price', 'pay_verified',
        'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
        'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count', 'phone')
        ->where('is_mentor', 1)->orderBy('average_mark', 'DESC')->take(5)->get();
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
        $top_value->tags_name = $temp_tag;
      }
      
      return response()->json([
        'result' => 'success',
        'data' => $top_mentors,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'message' => $th->getMessage(),
      ]);
    }
  }
  
  public function getAllMentors(Request $request)
  {
    try {
      $email = $request->email;
      $rowsPerPage = $request->rowsPerPage;
      $page = $request->page;
      $users = User::select('id', 'name', 'email', 'channel_name', 'tags_id','languages_id', 'is_mentor', 'hourly_price', 'pay_verified',
        'instant_call', 'avatar', 'expertise', 'sub_count', 'sub_page_name', 'dob', 'video_url', 'description',
        'status', 'timezone', 'alias', 'average_mark', 'sub_plan_fee', 'review_count', 'phone')
        ->orderBy('average_mark', 'DESC')->where('email', '!=', $email)->where('is_mentor', 1)->paginate($rowsPerPage);
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
          $tag_names[$tag_key] = $tags->name;
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
        'message' => $th->getMessage(),
      ]);
    }
  }
  
  function getAllStudents(Request $request)
  {
    try {
      $email = $request->email;
      $students = User::select('id', 'email', 'avatar')->where('email', '=', $email)->first();
      $userID = $students->id;
      $allStudents = [];
      //TODO get the subscribed students
      $subUserInfos = DB::table('subscriptions')
        ->where('subscriptions.mentor_id','=', $userID)
        ->join('users', 'subscriptions.student_id', '=', 'users.id')
        ->select('users.id', 'users.email', 'users.avatar')
        ->get();
      //TODO get the assocciated students
      $temp_associate_id = [];
      $rest_accept = DB::table('associates')
        ->where(function($query) use ($userID){
          $query->where('request_id', $userID)
            ->orWhere('response_id', $userID);
        })
        ->where('status', 'Connected')
        ->get();
      foreach ($rest_accept as $key => $value) {
        if ($value->request_id == $userID) {
          $user_info = User::select('id', 'email', 'avatar')->where('id', $value->response_id)->first();
          $temp_associate_id[$key] = $user_info;
        } else {
          $user_info = User::select('id', 'email', 'avatar')->where('id', $value->request_id)->first();
          $temp_associate_id[$key] = $user_info;
        }
      }
      //TODO get all students
      $allStudents = $subUserInfos;
      for($i = 0; $i < count($temp_associate_id); $i++) {
        $flag = false;
        for($j = 0; $j < count($subUserInfos); $j++) {
          if ($temp_associate_id[$i]->id == $subUserInfos[$j]->id) {
            $flag = true;
            continue;
          }
        }
        if (!$flag) {
          $allStudents[] = $temp_associate_id[$i];
        }
      }
      return response()->json([
        'result' => 'success',
        'data' => $allStudents,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'message' => $th->getMessage(),
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
        'message' => $th->getMessage(),
      ]);
    }
  }
  
  public function getAllParticipants(Request $request) {
    try {
      $user_id = $request->user_id;
      $allParticipants = User::select('name', 'id', 'email', 'avatar')->where('id', '!=', $user_id)->get();
      if (count($allParticipants) > 0) {
        return response()->json([
          'result' => 'success',
          'data' => $allParticipants,
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result' => 'failed',
        'message' => $th->getMessage(),
      ]);
    }
  }
}



