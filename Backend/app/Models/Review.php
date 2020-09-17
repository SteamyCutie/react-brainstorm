<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
  protected $fillable = [
    'mentor_id', 'student_id', 'mark', 'review'
  ];
}
