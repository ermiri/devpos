<?php

namespace ErmirShehaj\DevPos\Classes;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use ErmirShehaj\DevPos\Classes\Model;

/**
 * Cache:
 * $tcr->cache()->list(); //list all tcr and cache them
 * $tcr->cache()->onFailCached()->list();
 */


/**
 * Vehicle - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class Vehicle extends Model {


    public function __construct() {

        parent::__construct();
        //$this->bypassCache();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Vehicle');
    }

    public function create($parameters = []) {


        //validate first
        $validation = Validator::make($parameters, [

            "description" => "required|string|max:250",
            "plate" => "required|string|max:50",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        $parameters['iDtype'] = (int)$parameters['iDtype'];

        return $this->post('/api/v3/Vehicle', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Vehicle/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "description" => "required|string|max:250",
            "plate" => "required|string|max:50",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->put('/api/v3/Vehicle/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Vehicle/'. $id);
    }

}