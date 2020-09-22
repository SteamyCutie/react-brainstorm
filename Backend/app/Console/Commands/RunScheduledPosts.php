<?php

namespace App\Console\Commands;

use App\Models\Session;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Log;

class RunScheduledPosts extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'run:scheduled';
  
  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Publish the scheduled posts';
  
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
   * @return mixed
   */
  public function handle()
  {
    echo "qqqqqqqqqqqqqqqqqqq echo";
    Log::debug('qqqqqqqqqqqqqqqqqqq log:debug');
    error_log('qqqqqqqqqqqqqqqqqqq error.log');
    Log::info('qqqqqqqqqqqqqqqqqqqqThis is some useful information.');
    
//    $scheduled_session = Session::where('posted', 0)->where('from', )

//    $scheduledPosts = ScheduledPost::where('posted', 0)
//      ->where('scheduled_at', '<=', Carbon::now())
//      ->whereNull('status')->get();
//    $ids = $scheduledPosts->pluck('id');
//    ScheduledPost::whereIn('id', $ids)->updatae(['posted' => 1]);
//    multiRequest(route('test'), $scheduledPosts);
  }
}
