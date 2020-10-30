<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionHistoriesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('transaction_histories', function (Blueprint $table) {
      $table->id();
      $table->integer('mentor_id')->nullable();
      $table->string('mentor_name')->nullable();
      $table->integer('student_id')->nullable();
      $table->string('student_name')->nullable();
      $table->string('charge_id')->nullable();//webhook,to refund
      $table->string('transfer_id')->nullable();//webhook, to refund
      $table->timestamp('session_date')->nullable();
      $table->string('session_id')->nullable();
      $table->float('conference_time')->nullable();
      $table->float('amount')->nullable();
      $table->boolean('check_confirmed_sum')->nullable();//webhook, added user->life_time_earning
      $table->enum('status', ['Confirmed', 'Pending', 'Failed'])->default("Pending");//webhook, set
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
    Schema::dropIfExists('transaction_histories');
  }
}
