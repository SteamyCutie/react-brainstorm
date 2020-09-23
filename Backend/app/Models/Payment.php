<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
  protected $fillable = [
    'user_id', 'card_name', 'card_number', 'card_expiration', 'cvc_code', 'is_primary'
  ];
}
