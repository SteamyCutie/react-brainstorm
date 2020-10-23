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
Route::post('/signbysocial', 'UserController@signBySocial');
Route::post('/verifycode', 'UserController@verifyCode');
Route::post('/forgot', 'UserController@forgot');
Route::post('/reset', 'UserController@reset');
Route::post('/findmentors', 'UserController@findMentors');
Route::post('/findmentorsbytags', 'UserController@findMentorsByTags');
Route::post('/featuredmentors', 'UserController@featuredMentors');

Route::post('/createpayment', 'PaymentController@createPayment');
Route::post('/createbank', 'PaymentController@createBank');
Route::post('/getpayment', 'PaymentController@getPayment');
Route::post('/paysessionpayment', 'PaymentController@paySessionPayment');
Route::post('/getsessionpayment', 'PaymentController@getPaymentSession');
Route::post('/removesource', 'PaymentController@removesource');
Route::post('/testpayment', 'PaymentController@testpayment');
Route::post('/createcustomer', 'PaymentController@createcustomer');
Route::post('/createaccount', 'PaymentController@createaccount');
Route::post('/deleteaccount', 'PaymentController@deleteaccount');
Route::post('/createexternalaccount', 'PaymentController@createexternalaccount');
Route::post('/transfermoney', 'PaymentController@transfermoney');
Route::post('/createbank', 'PaymentController@createBank');
Route::post('/getbank', 'PaymentController@getBank');

Route::group(['middleware' => 'jwt.verify'], function () {
  Route::post('/signout', 'UserController@logout');
  Route::post('/editprofile', 'UserController@editProfile');
  Route::post('/getuserinfo', 'UserController@getUserInfo');
  Route::post('/getuserinfobyid', 'UserController@getUserInfoById');
  Route::post('/getallmentors', 'UserController@getAllMentors');
  Route::post('/getallstudents', 'UserController@getAllStudents');
  Route::post('/switchuser', 'UserController@switchUser');
  Route::post('/getallparticipants', 'UserController@getAllParticipants');
  Route::post('/findmentorsbytagsorname', 'UserController@findMentorsByTagsOrName');
  Route::post('/createshareinfo', 'MediaController@createShareInfo');
  Route::post('/scheduleliveforum', 'SessionController@getAllScheduleLiveForum');
  Route::post('/createforum', 'SessionController@createForum');
  Route::post('/gethistory', 'SessionController@getHistory');
  Route::post('/getupcomingsessions', 'SessionController@getUpcomingSession');
  Route::post('/deleteforum', 'SessionController@deleteForum');
  Route::post('/editforum', 'SessionController@editForum');
  Route::post('/getforum', 'SessionController@getForum');
  Route::post('/schedulepost', 'SessionController@schedulePost');
  Route::post('/deleteinviteduser', 'SessionController@deleteInvitedUser');
  Route::post('/booksession', 'SessionController@bookSession');
  Route::post('/getweekdata', 'DayController@index');
  Route::post('/setavailabletimes', 'AvailableTimesController@setAvailableTimes');
  Route::post('/getavailabletimes', 'AvailableTimesController@getavailableTimes');
  Route::post('/getavailabletimesforstudent', 'AvailableTimesController@getavailableTimesForStudent');
  Route::post('/getwallets', 'WalletController@index');
  Route::post('/gettags', 'TagController@index');
  Route::post('/uploadimage', 'FileController@uploadImage');
  Route::post('/uploadvideo', 'FileController@uploadVideo');
  Route::post('/setsubscription', 'SubscriptionController@setSubscription');
  Route::post('/unsubscription', 'SubscriptionController@unSubscription');
  Route::post('/setreview', 'ReviewController@setReview');
  Route::post('/addlibrary', 'LibraryController@addLibrary');
  Route::post('/getlibrary', 'LibraryController@getLibrary');
  Route::post('/addreport', 'ReportController@addReport');
  Route::post('/checkednotification', 'PostedNotificationController@checkedNotification');
  Route::post('/getnotification', 'PostedNotificationController@getNotification');
});
