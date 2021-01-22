<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingTimes extends Model
{
  protected $fillable = [
    'user_id', 'mentor_id', 'timezone', 'duration', 'fromTime', 'status'
  ];
}
