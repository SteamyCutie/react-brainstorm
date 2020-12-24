<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Associate;

class AssociateController extends Controller
{
  function associateRequest(Request $request)
  {
    try{
      $request_id = $request->request_id;
      $response_id = $request->response_id;
      
      $exist = DB::table('associates')
        ->where('request_id', $request_id)
        ->where('response_id', $response_id)
        ->orWhere(function($query) use ($request_id, $response_id){
          $query->where('request_id', $response_id)
            ->where('response_id', $request_id);
        })
        ->get();
      if (count($exist) > 0) {
        return response()->json([
          'result' => 'failed',
          'message' => 'already associated'
        ]);
      }
      $res_associate = Associate::create([
        'request_id' => $request_id,
        'response_id' => $response_id
      ]);
      if ($res_associate) {
        return response()->json([
          'result' => 'success',
          'data' => []
        ]);
      }
    } catch (Exception $th) {
      \Log::info(['++++++++++ associateRequest +++++++++', $th->getMessage()]);
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
  
  function associateAccept(Request $request)
  {
    try{
      $request_id = $request->request_id;
      $response_id = $request->response_id;
      
      $rest_accept = DB::table('associates')
        ->where('request_id', $request_id)
        ->where('response_id', $response_id)
        ->orWhere(function($query) use ($request_id, $response_id){
          $query->where('request_id', $response_id)
            ->where('response_id', $request_id);
        })
        ->update([
          'accepted' => true
        ]);
      if ($rest_accept) {
        return response()->json([
          'result' => 'success',
          'data' => []
        ]);
      } else {
        return response()->json([
          'result' => 'failed',
          'message' => 'failed accept'
        ]);
      }
    } catch (Exception $th) {
      \Log::info(['++++++++++ associateRequest +++++++++', $th->getMessage()]);
      return response()->json([
        'result'=> 'failed',
        'message'=> $th->getMessage(),
      ]);
    }
  }
}
