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

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//  return $request->user();
//});
//TODO User Signin and Signup without token
Route::post('/signin', 'UserController@login');
Route::post('/signup', 'UserController@signup');
Route::post('/signout', 'UserController@logout');
Route::post('/signbysocial', 'UserController@signBySocial');
Route::post('/verifycode', 'UserController@verifyCode');
Route::post('/forgot', 'UserController@forgot');
Route::post('/reset', 'UserController@reset');
Route::post('/findmentors', 'UserController@findMentors');
Route::post('/findmentorsbytags', 'UserController@findMentorsByTags');
Route::post('/featuredmentors', 'UserController@featuredMentors');
Route::post('/getintroduceinfo', 'UserController@getIntroduceInfo');
Route::post('/getopenedforum', 'SessionController@getOpenedForum');
//TODO Stripe Payment webhook API without token
Route::post('/webhook', 'TransactionHistoryController@webhook');
Route::post('/connect', 'TransactionHistoryController@connect');
Route::get('/registerbankbymentor', 'PaymentController@registerbankbymentor');
Route::post('/testapi', 'FileController@testapi');
Route::post('/getallstudents', 'UserController@getAllStudents');
//TODO with token
Route::group(['middleware' => 'jwt.verify'], function () {
  //TODO UserController API
  Route::post('/editprofile', 'UserController@editProfile');
  Route::post('/getuserinfo', 'UserController@getUserInfo');
  Route::post('/getuserinfobyid', 'UserController@getUserInfoById');
  Route::post('/getallmentors', 'UserController@getAllMentors');
//  Route::post('/getallstudents', 'UserController@getAllStudents');
  Route::post('/switchuser', 'UserController@switchUser');
  Route::post('/getallparticipants', 'UserController@getAllParticipants');
  Route::post('/findmentorsbytagsorname', 'UserController@findMentorsByTagsOrName');
  //TODO MediaController API
  Route::post('/createshareinfo', 'MediaController@createShareInfo');
  //TODO SessionController API
  Route::post('/scheduleliveforum', 'SessionController@getAllScheduleLiveForum');
  Route::post('/createforum', 'SessionController@createForum');
  Route::post('/gethistory', 'SessionController@getHistory');
  Route::post('/getupcomingsessions', 'SessionController@getUpcomingSession');
  Route::post('/deleteforum', 'SessionController@deleteForum');
  Route::post('/editforum', 'SessionController@editForum');
  Route::post('/getforum', 'SessionController@getForum');
  Route::post('/schedulepost', 'SessionController@schedulePost');
  Route::post('/deleteinviteduser', 'SessionController@deleteInvitedUser');
  Route::post('/inviteparticipanttoroom', 'SessionController@inviteParticipantToRoom');
  Route::post('/booksession', 'SessionController@bookSession');
  //TODO DayController API
  Route::post('/getweekdata', 'DayController@index');
  //TODO /*AvailableTimesController API*/
  Route::post('/setavailabletimes', 'AvailableTimesController@setAvailableTimes');
  Route::post('/getavailabletimes', 'AvailableTimesController@getavailableTimes');
  Route::post('/getavailabletimesforstudent', 'AvailableTimesController@getavailableTimesForStudent');
  Route::post('/setbookedtime', 'AvailableTimesController@setBookingTime');
  Route::post('/getavailabletimeslots', 'AvailableTimesController@getAvailableTimeSlots');
  //TODO LanguageController API
  Route::post('/getlanguages', 'LanguageController@getlanguages');
  //TODO TagController API
  Route::post('/gettags', 'TagController@gettaglists');
  //TODO FileController API
  Route::post('/uploadimage', 'FileController@uploadImage');
  Route::post('/uploadvideo', 'FileController@uploadVideo');
  //TODO /*SubscriptionController API*/
  Route::post('/setsubscription', 'SubscriptionController@setSubscription');
  Route::post('/unsubscription', 'SubscriptionController@unSubscription');
  Route::post('/getsubscribedstudents', 'SubscriptionController@getSubscribedStudents');
  //TODO /*ReviewController API*/
  Route::post('/setreview', 'ReviewController@setReview');
  //TODO /*LibraryController API*/
  Route::post('/addlibrary', 'LibraryController@addLibrary');
  Route::post('/getlibrary', 'LibraryController@getLibrary');
  //TODO /*ReportController API*/
  Route::post('/addreport', 'ReportController@addReport');
  //TODO /*PostedNotificationController API*/
  Route::post('/checkednotification', 'PostedNotificationController@checkedNotification');
  Route::post('/getnotification', 'PostedNotificationController@getNotification');
  //TODO /*TransactionHistoryController API*/
  Route::post('/payforsession', 'TransactionHistoryController@payforsession');
  Route::post('/gettransactionhistorybystudent', 'TransactionHistoryController@gettransactionhistorybystudent');
  Route::post('/gettransactionhistorybymentor', 'TransactionHistoryController@gettransactionhistorybymentor');
  //TODO /*PaymentController API*/
  Route::post('/registercardbystudent', 'PaymentController@registercardbystudent');
  Route::post('/getuseridformentor', 'PaymentController@getuseridformentor');
  Route::post('/getusercards', 'PaymentController@getusercards');
  Route::post('/setprimarycard', 'PaymentController@setprimarycard');
  Route::post('/deletestudentcard', 'PaymentController@deletestudentcard');
  //TODO /*AssociateController API*/
  Route::post('/associaterequest', 'AssociateController@associateRequest');
  Route::post('/associateaccept', 'AssociateController@associateAccept');
  Route::post('/getassociatedstudents', 'AssociateController@getassociatedStudents');
  Route::post('/getassociationstatus ', 'AssociateController@getassociationstatus');
  Route::post('/associatedecline', 'AssociateController@associatedecline');
  Route::post('/associateunassociate', 'AssociateController@associateunassociate');
  Route::post('/associatereassociate', 'AssociateController@associatereassociate');
  Route::post('/associatewithdraw', 'AssociateController@associatewithdraw');
  Route::post('/getassociatedusers', 'AssociateController@getassociatedusers');
});
