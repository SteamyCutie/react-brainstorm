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

Route::post('/signin', 'UserController@signin');
Route::post('/signup', 'UserController@signup');
Route::post('/editprofile', 'UserController@editprofile');
Route::post('/verifycode', 'UserController@verifyCode');

Route::post('/mysharepage', 'MediaController@getMediaShare');
Route::post('/scheduleliveforum', 'SessionController@getSession');
Route::post('/createforum', 'SessionController@createforum');
Route::post('/gethistory', 'SessionController@getHistory');
Route::post('/getupcomingsessions', 'SessionController@getUpcomingSession');

Route::post('/setavailabletimes', 'AvailableTimesController@setavailabletimes');
Route::post('/getavailabletimes', 'AvailableTimesController@getavailabletimes');
Route::post('/getuserinfo', 'UserController@getuserinfo');
Route::post('/getwallets', 'WalletController@index');

Route::post('/gettags', 'TagController@index');

