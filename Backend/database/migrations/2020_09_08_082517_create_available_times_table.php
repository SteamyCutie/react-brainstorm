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
      $table->bigInteger("user_id")->nullable()->unsigned();
      $table->string('day_of_week')->nullable();
      $table->integer('fromTime')->nullable();
      $table->integer('toTime')->nullable();
      $table->string('fromTimeStr')->nullable();
      $table->string('toTimeStr')->nullable();
      $table->integer('status')->nullable();
      $table->string('timezone')->nullable();
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
