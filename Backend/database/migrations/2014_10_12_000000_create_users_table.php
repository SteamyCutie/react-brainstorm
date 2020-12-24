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
      $table->string('channel_name')->nullable()->unique();
      $table->string('tags_id')->default("");
      $table->string('languages_id')->default("");
      $table->boolean('is_mentor')->default(false);
      $table->string('phone')->nullable();
      
      $table->string('customer_id')->nullable();
      $table->string('connected_account')->nullable();
  
      $table->string('sub_product_id')->default("");
      $table->string('sub_plan_id')->default("");
      $table->float('sub_plan_fee')->default(0);
      
      $table->float('life_time_earnings')->default(0);
      $table->float('pending_balance')->default(0);
      $table->float('available_balance')->default(0);
      
      $table->integer('primary_card')->default(0);
      $table->integer('primary_plan_card')->default(0);
      
      $table->float('hourly_price')->default(0);
      $table->boolean('pay_verified')->default(false);
      $table->boolean('instant_call')->default(false);
      $table->enum('provider', ['Manual', 'Google', 'Facebook']);
      $table->string('provider_id')->nullable();
      $table->string('avatar')->nullable();
      $table->integer('is_active')->default(0);
      $table->integer('expertise')->default(1);
      $table->string('category')->default("");
      $table->string('subcategory')->default("");
      $table->string('minimum_age')->default("");
      $table->integer('sub_count')->default(0);
      $table->string('sub_page_name')->default("");
      $table->timestamp('dob')->nullable();
      $table->string('video_url')->nullable();
      $table->text('description')->nullable();
      $table->integer('status')->default(0);
      $table->string('timezone')->default("");
      $table->string('alias')->default("");
      $table->float('average_mark')->default(0);
      $table->integer('review_count')->default(0);
      $table->timestamp('email_verified_at')->nullable();
      $table->integer('two_factor_code')->default(0);
      $table->string('origin_password')->default("");
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
