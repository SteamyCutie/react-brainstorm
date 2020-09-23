<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
  return $request->user();
});

Route::post('/signin', 'UserController@login');
Route::post('/signup', 'UserController@signup');
Route::post('/verifycode', 'UserController@verifyCode');
Route::post('/forgot', 'UserController@forgot');
Route::post('/reset', 'UserController@reset');
Route::post('/test', 'UserController@test');
Route::post('/findmentors', 'UserController@findMentors');
Route::post('/featuredmentors', 'UserController@featuredMentors');

Route::group(['middleware' => 'jwt.verify'], function () {
  Route::post('/signout', 'UserController@logout');
  Route::post('/editprofile', 'UserController@editProfile');
  Route::post('/getuserinfo', 'UserController@getUserInfo');
  Route::post('/getuserinfobyid', 'UserController@getUserInfoById');
  Route::post('/getallmentors', 'UserController@getAllMentors');
  Route::post('/getallstudents', 'UserController@getAllStudents');
  Route::post('/createshareinfo', 'MediaController@createShareInfo');
  Route::post('/scheduleliveforum', 'SessionController@getAllForum');
  Route::post('/createforum', 'SessionController@createForum');
  Route::post('/gethistory', 'SessionController@getHistory');
  Route::post('/getupcomingsessions', 'SessionController@getUpcomingSession');
  Route::post('/deleteforum', 'SessionController@deleteForum');
  Route::post('/editforum', 'SessionController@editForum');
  Route::post('/getforum', 'SessionController@getForum');
  Route::post('/getweekdata', 'DayController@index');
  Route::post('/setavailabletimes', 'AvailableTimesController@setAvailableTimes');
  Route::post('/getavailabletimes', 'AvailableTimesController@getavailableTimes');
  Route::post('/getwallets', 'WalletController@index');
  Route::post('/gettags', 'TagController@index');
  Route::post('/uploadimage', 'FileController@uploadImage');
  Route::post('/uploadvideo', 'FileController@uploadVideo');
  Route::post('/setsubscription', 'SubscriptionController@setSubscription');
  Route::post('/unsubscription', 'SubscriptionController@unSubscription');
  Route::post('/setreview', 'ReviewController@setReview');
});
