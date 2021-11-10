<?php

    namespace ErmirShehaj\DevPos;

    use Illuminate\Support\ServiceProvider;
    use Illuminate\Support\Facades\Route;

    include_once(__DIR__.'/helpers.php');

    class DevPosServiceProvider extends ServiceProvider {


        //to publish devpos.php configuration you have to run the cvommand below:
        //php artisan vendor:publish --provider="ErmirShehaj\DevPos\DevPosServiceProvider" --tag="config"

        //publish all configurations
        //php artisan vendor:publish --tag=config //publish configurations

        //publish all things
        //just php artisan vendor:publish

        public function boot() {

            // $this->publishes([
            //     __DIR__.'/../config/config.php' => config_path('devpos.php'),
            // ]);

            if ($this->app->runningInConsole()) {

                $this->publishes([
                  __DIR__.'/../config/config.php' => config_path('devpos.php'),
                ], 'config');
            
            }

            //routes
            //$this->loadRoutesFrom(__DIR__.'/../routes/web.php');
            $this->registerRoutes();


            //views
            $this->loadViewsFrom(__DIR__.'/../resources/views', 'devpos');
        }

        protected function registerRoutes() {

            Route::group($this->routeConfiguration(), function () {
                $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
            });
        }

        protected function routeConfiguration() {

            return [
                'prefix' => config('devpos.route_prefix'),
                'middleware' => config('devpos.middleware'),
            ];
        }

        public function register() {

            $this->app->bind('devpos', function($app) {

                return new DevPos();
            });
        }

    }