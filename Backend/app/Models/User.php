<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'name', 'email', 'password', 'dob', 'avatar', 'two_factor_code', 'email_verified_at', 'average_mark',
    'hourly_price', 'video_url', 'sub_page_name', 'sub_plan_fee', 'pay_verified',
    'description', 'instant_call', 'status', 'is_active','timezone', 'expertise', 'origin_password',
    'provider', 'provider_id', 'sub_count', 'tags_id', 'channel_name'
  ];
  
  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [
    'password', 'remember_token',
  ];
  /**
   * Get the identifier that will be stored in the subject claim of the JWT.
   *
   * @return mixed
   */
  public function getJWTIdentifier()
  {
    return $this->getKey();
  }
  
  /**
   * Return a key value array, containing any custom claims to be added to the JWT.
   *
   * @return array
   */
  public function getJWTCustomClaims()
  {
    return [];
  }
  
  public function generateTwoFactorCode()
  {
    $this->timestamps = false;
    $this->two_factor_code = rand(100000, 999999);
    $this->save();
  }
  
  public function verifiedAccount(){
    $this->email_verified_at = now();
    $this->save();
  }
}
