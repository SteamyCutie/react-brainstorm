<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLibrariesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('libraries', function (Blueprint $table) {
      $table->id();
      $table->string('media_url')->nullable();
      $table->string('mentor_name')->nullable();
      $table->integer('student_id')->nullable();
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
    Schema::dropIfExists('libraries');
  }
}
