<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
  protected $fillable = [
    'mentor_name', 'student_id', 'media_url'
  ];
}
