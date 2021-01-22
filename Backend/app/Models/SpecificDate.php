<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecificDate extends Model
{
  protected $fillable = [
    'user_id', 'sp_date', 'timezone', 'fromTimeStr', 'toTimeStr'
  ];
}
