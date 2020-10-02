<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostedNotificationsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('posted_notifications', function (Blueprint $table) {
      $table->id();
      $table->integer('user_id')->nullable();
      $table->integer('session_id')->nullable();
      $table->string('session_title')->nullable();
      $table->timestamp('from')->nullable();
      $table->timestamp('to')->nullable();
      $table->integer('notification_posted')->default(0);
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
    Schema::dropIfExists('posted_notifications');
  }
}

