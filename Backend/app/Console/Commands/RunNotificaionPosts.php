<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use App\Models\PostedNotification;

class RunNotificaionPosts extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'run:notification';
  
  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'publish the notification posts';
  
  /**
   * Create a new command instance.
   *
   * @return void
   */
  public function __construct()
  {
    parent::__construct();
  }
  
  /**
   * Execute the console command.
   *
   * @return int
   */
  public function handle()
  {
    //Begin delete Post a week ago
    // Carbon::now()->subMonth()->delete() , subWeekdays(7);
    PostedNotification::where('from', '<=', Carbon::now()->subWeekdays(10))->delete();
    return 0;
  }
}
