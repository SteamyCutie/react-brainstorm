<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
  protected $fillable = [
    'mentor_id', 'student_id', 'sub_plan_fee', 'card_type'
  ];
}
