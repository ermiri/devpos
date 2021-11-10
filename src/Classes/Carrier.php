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
 * Carrier - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class Carrier extends Model {


    public function __construct() {

        parent::__construct();
        //$this->bypassCache();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Carrier');
    }

    public function create($parameters = []) {

        /**
         * 
         * Example:
         * {
                code: "1"
                id: 133
                name: "KOZMETIKE"
            }
         */


        //validate first
        $validation = Validator::make($parameters, [

            "name" => "required|string|max:60",
            "iDtype" => "required|numeric",
            "identificationNo" => "required|string|max:60",
            "town" => "required|string|max:60",
            "address" => "required|string|max:250",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        $parameters['iDtype'] = (int)$parameters['iDtype'];

        return $this->post('/api/v3/Carrier', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Carrier/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "id" => "required|numeric",
            "name" => "required|string|max:60",
            "iDtype" => "required|numeric",
            "identificationNo" => "required|string|max:60",
            "town" => "required|string|max:60",
            "address" => "required|string|max:250",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        $parameters['iDtype'] = (int)$parameters['iDtype'];

        return $this->put('/api/v3/Carrier/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Carrier/'. $id);
    }

}