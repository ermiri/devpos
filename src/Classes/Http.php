<?php

namespace ErmirShehaj\DevPos\Classes;

use Illuminate\Support\Facades\Http as BaseHttp;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use ErmirShehaj\DevPos\Classes\Model;


class Http {

    //list all tcr saved on devpos
    public static function get() {

        return $this->httpGet('/api/v3/Accounts');
    }

    public function post() {

        return $this->httpGet('/api/v3/Accounts');
    }

    public function put() {

        return $this->httpGet('/api/v3/Accounts');
    }

    public function delete() {

        return $this->httpGet('/api/v3/Accounts');
    }

}