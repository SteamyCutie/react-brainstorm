<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
  protected $fillable = [
    'user_id', 'email', 'customer_id', 'token','card_name', 'card_number', 'card_expiration', 'card_type','cvc_code', 'is_primary', 'card_src'
  ];
}
