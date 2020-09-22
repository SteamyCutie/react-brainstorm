<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAvailableTimesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('available_times', function (Blueprint $table) {
      $table->id();
      $table->bigInteger("user_id")->unsigned();
      $table->string('day_of_week');
      $table->integer('fromTime');
      $table->integer('toTime');
      $table->integer('status');
      $table->string('timezone');
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
    Schema::dropIfExists('availabe_times');
  }
}
