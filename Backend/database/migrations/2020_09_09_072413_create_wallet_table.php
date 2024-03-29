<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWalletTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('wallets', function (Blueprint $table) {
      $table->id();
      $table->bigInteger("user_id")->unsigned();
      $table->string("lId");
      $table->string('sName')->nullable();
      $table->string('conferenceTime')->nullable();
      $table->string('amount')->nullable();
      $table->bigInteger('status')->nullable();
      $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
      $table->timestamps();
    });
  }
  
  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('wallets');
  }
}
