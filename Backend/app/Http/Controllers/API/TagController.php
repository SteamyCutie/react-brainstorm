<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Session;
use App\Models\Tag;
use App\Models\User;

class TagController extends Controller
{
    function index(Request $request)
    {
        $all_tags = Tag::all();

        return response()->json([
            'result'=> 'success',
            'data'=> $all_tags,
        ]);
    }
}
