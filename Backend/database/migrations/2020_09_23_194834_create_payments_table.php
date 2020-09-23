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
      $table->string('user_id')->default("");
      $table->string('card_name')->default("");
      $table->string('card_number')->default("")->unique();;
      $table->timestamp('card_expiration')->nullable();
      $table->integer('cvc_code')->default(0);
      $table->boolean('is_primary')->default(false);
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
