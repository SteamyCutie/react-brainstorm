<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = [
        'user_id', 'lesson_id', 'student_name', 'conference_name', 'amount', 'status'
    ];

    protected $table = "wallets";
}
