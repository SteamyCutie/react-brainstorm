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
      $table->integer('user_id');
      $table->string('email');
      $table->string('customer_id');
      $table->string('card_token')->nullable();
      $table->string('bank_token')->nullable();
      $table->enum('payment_type', ['Card', 'Bank']);
      $table->string('card_src')->nullable();
      $table->string('bank_src')->nullable();
      $table->string('card_name')->nullable();
      $table->string('card_number')->nullable()->unique();
      $table->integer('card_type')->nullable();
      $table->timestamp('card_expiration')->nullable();
      $table->integer('cvc_code')->nullable();
      $table->boolean('is_primary')->nullable();;
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
