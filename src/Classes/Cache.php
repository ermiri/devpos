<?php

namespace ErmirShehaj\DevPos\Classes;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache as CacheFacade;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use ErmirShehaj\DevPos\Facades\DevPos;

class Cache {

    protected $cache = false;
    protected $cache_key; //the key we will cache data.If empty => it will use the request url
    protected $cache_prefix = 'devpos';
    protected $cache_timeout = 100;

    public function __construct() {


    }


    public function setCacheKey($key = true) {

        $this->cache_key = $key;
        return $this;
    }
    public function getCacheKey($absolute = false) {

        if ($absolute)
            return $this->getCachePrefix() .'.'. $this->cache_key;

        return $this->cache_key;
    }

    public function setCachePrefix($key = true) {

        $this->cache_prefix = $key;
        return $this;
    }
    public function getCachePrefix() {

        return $this->cache_prefix;
    }
    
    public function getCachePath($key = null) {

        return $this->getCacheKey($absolute = true) . $key;
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
     */

    public function put($key, $val = null, $timeout = null) {

        echo 'we are putting on: '. $this->getCachePath($key);
        CacheFacade::put($this->getCachePath($key), $val, $timeout ?? $this->getCacheTimeout());
        return $this;
    }

    public function get($key, $val = null) {

        $key = $this->getCachePath($key);
        return CacheFacade::get($this->getCachePath($key));
    }

    public function forget($key) {

        return CacheFacade::forget($this->getCachePath($key));
    }
}