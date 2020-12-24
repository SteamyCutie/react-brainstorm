<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Associate extends Model
{
  protected $fillable = [
    'request_id', 'response_id', 'accepted'
  ];
}
