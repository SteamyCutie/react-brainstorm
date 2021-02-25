<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = [
        'user_id', 'title', 'description', 'media_url', 'media_type', 'isForum', 'origin_name', 'session_id'
    ];

    protected $table = "medias";
}
