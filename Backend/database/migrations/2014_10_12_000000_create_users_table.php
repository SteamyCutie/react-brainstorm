<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('email')->unique();
      $table->string('password');
      $table->boolean('pay_verified')->nullable();
      $table->timestamp('email_verified_at')->nullable();
      $table->string('avatar')->nullable();
      $table->integer('two_factor_code')->nullable();
      $table->integer('is_active')->nullable();
      $table->integer('expertise')->nullable();
      $table->integer('sub_count')->nullable();
      $table->timestamp('dob')->nullable();
      $table->string('tags_id')->default("");
      $table->integer('is_mentor')->nullable();
      $table->float('hourly_price')->nullable();
      $table->string('video_url')->nullable();
      $table->string('sub_page_name')->nullable();
      $table->float('sub_plan_fee')->nullable();
      $table->text('description')->nullable();
      $table->boolean('instant_call')->nullable();
      $table->integer('status')->nullable();
      $table->string('timezone')->nullable();
      $table->float('average_mark')->nullable();
      $table->string('origin_password')->nullable();
      $table->rememberToken();
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
    Schema::dropIfExists('users');
  }
}
