<?php

namespace ErmirShehaj\DevPos\Classes;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use ErmirShehaj\DevPos\Facades\DevPos;

abstract class Model {

    protected $endPointBase = 'https://demo.devpos.al';
    protected $endPoint = 'https://demo.devpos.al/api/v3';
    protected $tokenEndPoint = 'https://demo.devpos.al/connect/token';
    protected $path;

    /**
     * Configurations
     * Later we will create devpos.config with some configurations for default behaviour.
     */
    //protected $cache_everything = false; //to cache or not the list actions
    protected $cache = false;
    protected $cache_key; //the key we will cache data.If empty => it will use the request url
    protected $cache_prefix;
    protected $cache_timeout = 100;
    protected $bypass_cache = false; //if we have data in cache => it mean we will read from it => st bypass_cache to false to bypass it and read directly from source.

    protected $on_fail_cached = false; //if we can't get/fetch data from devpos then we will serve our cache data.

    public function __construct() {

        //load config data
        $this->setEndPointBase(config('devpos.endPointBase'));
        $this->setEndPoint(config('devpos.endPoint'));


        //cache settings from config.php
        $this->setCache(config('devpos.cache'));
        $this->setCachePrefix(config('devpos.cache_prefix'));
        $this->setCacheTimeout(config('devpos.cache_timeout'));
        
    }
    

    abstract public function get();
    abstract public function create($parameters = []);
    abstract public function update($id, $parameters = []);
    abstract public function destroy($id);
    

    public function setEndPoint($url) {

        $this->endPoint = $url;
        return $this;
    }
    public function getEndPoint() {

        return $this->endPoint;
    }

    public function setEndPointBase($url) {

        $this->endPointBase = $url;
        return $this;
    }
    public function getEndPointBase($relativePath = null) {

        return $this->endPointBase . $relativePath;
    }

    public function setPath($path) {

        $this->path = $path;
        return $this;
    }
    public function getPath() { // e.g: /api/v3/Customer

        return $this->path;
    }
    public function getAbsolutePath($path = null) {  // e.g: https://demo.devpos.al/api/v3/Customer

        $path = $path ?? $this->getPath();
        if (empty(parse_url($path, PHP_URL_HOST))) {

            $path = $this->getEndPointBase($path);
        }

        return $path;
    }



    /**
     * Cache getters and setters
     * @setCacheEverything - boolean - set it true/false if this class will cache data or not by default
     * @getCacheKey - string - will return absolute key(prefix + key)
     */

    public function setCacheEverything($boolean = true) {

        $this->cache_everything = $boolean;
        return $this;
    }
    public function getCacheEverything() {

        return $this->cache_everything;
    }

    public function setCache($boolean = true) {

        $this->cache = $boolean;
        return $this;
    }

    //cache: boolean
    public function getCache() {

        return $this->cache;
    }

    public function cache() {

        $this->setCache(true);
        return $this;
    }

    public function noCache() {

        $this->setCache(false);
        return $this;
    }

    public function mustCacheData() {

        return $this->cache;
    }

    public function setBypassCache($boolean) {

        $this->bypass_cache = $boolean;
        return $this;
    }
    public function bypassCache() { //helper for setBypassCache(true);

        $this->setBypassCache(true);
        return $this;
    }
    public function getBypassCache() {

        return $this->bypass_cache;
    }

    public function onFailCached($boolean = true) {

        $this->on_fail_cached = $boolean;
    }

    public function setCacheKey($key = true) {

        $this->cache_key = $key;
        return $this;
    }
    public function getCacheKey() { //return key or md5(absolute path) 

        return $this->cache_key ?? md5($this->getAbsolutePath());
    }

    public function getCacheKeyWithPrefix($key = null) { //if $key is mostly used on custom need like when we delete specifc/custom url from cache

        return ($this->getCachePrefix() ? $this->getCachePrefix() .'.':'') . ($key ?? $this->getCacheKey());
    }

    public function setCachePrefix($key = true) {

        $this->cache_prefix = $key;
        return $this;
    }
    public function getCachePrefix() {

        return $this->cache_prefix;
    }
    
    //is same as getCacheKeyWithPrefix but if we provide a $key => it will append it
    public function getCachePath($key = null) {

        return $this->getCacheKeyWithPrefix() . $key;
    }

    public function setCacheTimeout($time = true) {

        $this->cache_timeout = $time;
        return $this;
    }
    public function getCacheTimeout() {

        return $this->cache_timeout;
    }


    /**
     * Cache operations: put, get, forget
     * 
     * 
     */

    /**
     * putCache - will store cache data
     * @param $key - string - is the relative key we want to save data.It will transform it to prefix + key.
     */
    protected function writeCache($val = null) {

        //echo 'we are putting on: '. $key;

        //lets get the key we will store 
        $key = $this->getCacheKeyWithPrefix();
        //echo 'We are putting in the cache with key: '. $key;

        Cache::put($key, $val, $this->getCacheTimeout());
        return $this;
    }

    protected function readCache($key) {

        return Cache::get($key);
    }

    protected function existsCache($key) {

        return Cache::has($key);
    }

    protected function forgetCache($key) {

        return Cache::forget($key);
    }



    /**
     * Http methods: post, put, delete, get
     * In fact we need the 'get' method for the model and not for the Http request.
     * So we will replace it with: httpGet($path);
     */

    protected function post($path, $parameters = []) {

        return $this->setPath($path)->call('post', $parameters);
    }

    protected function put($path, $parameters = []) {

        return $this->setPath($path)->call('put', $parameters);
    }

    protected function delete($path) {

        return $this->setPath($path)->call('delete');
    }

    protected function httpGet($path) {

        return $this->setPath($path)->call('get', []);
    }

    // protected function get($path) {

    //     return $this->setPath($path)->call('get', []);
    // }

    protected function download($path) {

        return $this->setPath($path)->call('download', []);
    }

    protected function call($action, $parameters = []) {

        /**
         * $path - we can pass as absolute url or a relative one 
         * if it is relative => we will transform it to an absolute one. 
         */


        //always check for token bc it is mandatory
        if (empty(DevPos::getToken())) {

            //load it from cache
            if (!empty(Cache::get('devpos.access_token')))
                DevPos::setToken(Cache::get('devpos.access_token'));
            else {

                //echo 'authorize first, then go!';
                //we must load it from authorizing
                DevPos::authorize();
            }
        }

        
        //get path
        $path = $this->getAbsolutePath();

        if ($action == 'post') {

            $response = Http::withToken(DevPos::getToken())->post($path, $parameters);

            //we clear cache if there exists one
            //we clear cache if there exists one
            $directory = pathinfo($path, PATHINFO_DIRNAME); //path without: /id
            $key = md5($directory);
            if ($this->existsCache($this->getCacheKeyWithPrefix($key))) {

                $this->forgetCache($this->getCacheKeyWithPrefix($key));
            }

            if ($response->status() == 201)
                return $response->json();

        }
        else if($action == 'put') {

            $response = Http::withToken(DevPos::getToken())->put($path, $parameters);

            //we clear cache if there exists one
            $directory = pathinfo($path, PATHINFO_DIRNAME); //path without: /id
            $key = md5($directory);
            if ($this->existsCache($this->getCacheKeyWithPrefix($key))) {

                $this->forgetCache($this->getCacheKeyWithPrefix($key));
            }

            if ($response->status() == 200)
                return $response->json();
        }
        else if($action == 'delete') {

            $response = Http::withToken(DevPos::getToken())->delete($path, $parameters);

            //we clear cache if there exists one
            $directory = pathinfo($path, PATHINFO_DIRNAME); //path without: /id
            $key = md5($directory);
            if ($this->existsCache($this->getCacheKeyWithPrefix($key))) {

                $this->forgetCache($this->getCacheKeyWithPrefix($key));
            }
        }
        
        elseif ($action == 'get') {

            //before we run http request to our api endpoint, we check if we have them on cache
            
            if (!$this->getBypassCache() && $this->existsCache($this->getCacheKeyWithPrefix())) {

                //echo $this->getCachePrefix();
                //echo 'We are reading from cache on key: '. $this->getCacheKeyWithPrefix();
                return $this->readCache($this->getCacheKeyWithPrefix());
            }


            $response = Http::withToken(DevPos::getToken())->get($path);

        }
        
        elseif ($action == 'download') {

            $response = Http::withToken(DevPos::getToken())->get($path);

            return $response->getBody()->getContents();
        }

        // Determine if the response has a 500 level status code...\

        
        if ($response->serverError() || $response->clientError()) {

            if ($response->status() == 401) {
            
                //print_r($response->headers());
                throw new \Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException($response->headers()['WWW-Authenticate'][0]);
            }

            throw new \Illuminate\Http\Client\RequestException($response);
        }

        /**
         * Caching results
         */

        if ($action == 'get' && $response->status() == 200 && $this->mustCacheData()) {
            
            //echo 'putting in cache: '. $this->getCachePath();
            $this->writeCache($response->json());
            
        }

        return $response->json();

    }

}