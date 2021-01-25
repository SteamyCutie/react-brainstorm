<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingTimesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('booking_times', function (Blueprint $table) {
      $table->id();
      $table->bigInteger("user_id")->nullable()->unsigned();
      $table->bigInteger("mentor_id")->nullable()->unsigned();
      $table->string('fromTime')->nullable();
      $table->Integer('duration')->nullable();
      $table->text('description')->nullable();
      $table->enum('status', ['Pending', 'Connected', 'Declined', 'Cancelled', 'Admiting'])->nullable();
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
    Schema::dropIfExists('booking_times');
  }
}
