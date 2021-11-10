<?php

namespace ErmirShehaj\DevPos\Facades;

use Illuminate\Support\Facades\Facade;

class DevPos extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'devpos';
    }
}