<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailableTimes extends Model
{
  protected $fillable = [
    'user_id', 'day_of_week', 'fromTime', 'toTime', 'status', 'timezone', 'fromTimeStr', 'toTimeStr'
  ];
}
