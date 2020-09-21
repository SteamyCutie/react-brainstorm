<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wallet;
use App\Models\User;

class WalletController extends Controller
{
  public function __construct()
  {
  
  }
  
  public function index(Request $request)
  {
    try{
      $email = $request['email'];
  
      $user = User::where('email', $email)->first();
      $wallets = Wallet::where('user_id', $user['id'])->get();
      for ($i = 0; $i < count($wallets); $i ++) {
        $wallets[$i]['lDate'] = date('d/m/y', strtotime($wallets[$i]['created_at']));
      }
      return response()->json([
        'result'=> 'success',
        'data'=> $wallets,
      ]);
    } catch (Exception $th) {
      return response()->json([
        'result'=> 'failed',
        'data'=> $th,
      ]);
    }
  }
}
