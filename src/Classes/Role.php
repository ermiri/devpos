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
 * Role - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class Role extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Account/roles');
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
            "description" => "required|string|max:60",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->post('/api/v3/Account/roles', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Account/roles/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "name" => "required|string|max:60",
            "description" => "required|string|max:250",
            "permissions" => "required|array",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->put('/api/v3/Account/roles/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Account/roles/'. $id);
    }

}