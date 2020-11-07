<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionHistory extends Model
{
  protected $fillable = [
    'mentor_id', 'mentor_name', 'student_id', 'student_name', 'charge_id',
    'transfer_id', 'session_date', 'session_id', 'conference_time',
    'amount', 'st_amount','check_confirmed_sum', 'status'
  ];
}
