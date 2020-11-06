<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('payments', function (Blueprint $table) {
      $table->id();
      $table->integer('user_id')->default(0);
      $table->string('email')->default("");
      $table->string('customer_id')->default("");
      $table->string('card_src')->default("");
      $table->string('connected_account')->default("");
      $table->string('oauth_code')->default("");
      $table->string('card_name')->default("");
      $table->tinyInteger('card_type')->default(0);
      $table->string('card_number')->default("");
      $table->timestamp('card_expiration')->nullable();
      $table->boolean('is_primary')->default(false);
      $table->integer('cvc_code')->default(0);
      $table->enum('payment_type', ['Card', 'Bank'])->nullable();
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
    Schema::dropIfExists('payments');
  }
}
