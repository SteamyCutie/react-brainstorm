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
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar');
            $table->integer('two_factor_code');
            $table->integer('is_active');
            $table->integer('expertise');
            $table->timestamp('dob')->nullable();
            $table->float('hourly_price');
            $table->string('video_url')->nullable();
            $table->string('sub_page_name');
            $table->float('sub_plan_fee');
            $table->text('description')->nullable();
            $table->boolean('instant_call');
            $table->integer('status');
            $table->string('timezone')->nullable();
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
