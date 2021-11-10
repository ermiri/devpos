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
 * Unit - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class Unit extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Unit');
    }

    public function create($parameters = []) {

        /**
         * 
         * Example:
         * {
                code: "22"
                description: "dite1"
                id: 174
                name: "dite1"
                standardCode: "5E"
            }
         */


        //validate first
        $validation = Validator::make($parameters, [

            "name" => "required|string|max:60",
            "description" => "required|string|max:250",
            "code" => "required|string|max:60",
            "standardCode" => "required|string|max:60",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->post('/api/v3/Unit', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Unit/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "id" => "required|numeric",
            "name" => "required|string|max:60",
            "description" => "required|string|max:250",
            "code" => "required|string|max:60",
            "standardCode" => "nullable|string|max:60",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        $parameters['registrationDate'] = date("c", strtotime($parameters['registrationDate']));

        return $this->put('/api/v3/Unit/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Unit/'. $id);
    }

}