<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Language;

class LanguageController extends Controller
{
  function getlanguages(Request $request)
  {
    try{
      $all_languages = Language::select('id', 'language')->get();
      if (count($all_languages) > 0) {
        return response()->json([
          'result'=> 'success',
          'data'=> $all_languages,
        ]);
      } else {
        return response()->json([
          'result'=> 'success',
          'data'=> [],
        ]);
      }
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
}
