<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
  protected $fillable = [
    'user_id', 'email', 'customer_id', 'card_name', 'card_number',
    'card_expiration', 'cvc_code', 'card_src', 'card_type', 'connected_account',
    'oauth_code', 'payment_type', 'is_primary'
  ];
}
