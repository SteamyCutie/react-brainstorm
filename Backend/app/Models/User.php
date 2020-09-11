<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'dob', 'avatar', 'two_factor_code', 'hourly_price', 'video_url', 'sub_page_name', 'sub_plan_fee', 'description', 'instant_call', 'status', 'is_active','timezone'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

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
