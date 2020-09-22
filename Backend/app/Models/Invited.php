<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invited extends Model
{
  protected $fillable = [
    'mentor_id', 'student_id', 'session_id'
  ];
  
  protected $table = "inviteds";
}
