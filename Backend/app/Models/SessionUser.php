<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SessionUser extends Model
{
  protected $fillable = [
    'key', 'value',
  ];
}
