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
      $table->boolean('pay_verified')->default(false);
      $table->timestamp('email_verified_at')->nullable();
      $table->string('avatar')->nullable();
      $table->integer('two_factor_code')->default(0);
      $table->integer('is_active')->default(0);
      $table->integer('expertise')->default(1);
      $table->integer('sub_count')->default(0);
      $table->timestamp('dob')->nullable();
      $table->string('tags_id')->default("");
      $table->integer('is_mentor')->default(0);
      $table->float('hourly_price')->default(0);
      $table->string('video_url')->nullable();
      $table->string('sub_page_name')->default("");
      $table->float('sub_plan_fee')->default(0);
      $table->string('description')->default("")->nullable();
      $table->boolean('instant_call')->default(false);
      $table->integer('status')->default(0);
      $table->string('timezone')->default("");
      $table->float('average_mark')->default(0);
      $table->string('origin_password')->default("");
      $table->enum('provider', ['Manual', 'Google', 'Facebook']);
      $table->string('provider_id')->nullable();
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
