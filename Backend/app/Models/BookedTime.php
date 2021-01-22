<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookedTime extends Model
{
  protected $fillable = [
    'user_id', 'mentor_id', 'timezone', 'duration', 'fromTime', 'status'
  ];
}
