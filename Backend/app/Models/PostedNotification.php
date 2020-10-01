<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostedNotification extends Model
{
  protected $fillable = [
    'user_id', 'session_id','session_title', 'from', 'to', 'notification_posted'
  ];
}
