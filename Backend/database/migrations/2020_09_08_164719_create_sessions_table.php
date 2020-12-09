<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('sessions', function (Blueprint $table) {
      $table->id();
      $table->bigInteger("user_id")->unsigned();
      $table->string('invited_id')->nullable();
      $table->string('tags_id')->nullable();
      $table->integer('posted')->default(0);
      $table->string('title');
      $table->text('description')->nullable();
      $table->string('language')->nullable();
      $table->timestamp('from')->nullable();
      $table->timestamp('to')->nullable();
      $table->integer('status')->default(0);
      $table->integer('room_id')->unique()->default(0);
      $table->string('created_id')->nullable();
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
    Schema::dropIfExists('sessions');
  }
}
