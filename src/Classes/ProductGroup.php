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
 * ProductGroup - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class ProductGroup extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/ProductGroup'); //GetAllParents
    }

    public function create($parameters = []) {

        /**
         * 
         * Example:
         * {
                code: "g13"
                groupParentId: 118
                id: 119
                level: 4
                name: "g13"
            }
         */


        //validate first
        $validation = Validator::make($parameters, [

            "name" => "required|string|max:60",
            "level" => "required|numeric",
            "groupParentId" => "required|numeric",
            "code" => "required|string|max:60",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->post('/api/v3/ProductGroup', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/ProductGroup/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "id" => "required|numeric",
            "name" => "required|string|max:60",
            "level" => "required|numeric",
            "groupParentId" => "required|numeric",
            "code" => "required|string|max:60",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        $parameters['registrationDate'] = date("c", strtotime($parameters['registrationDate']));

        return $this->put('/api/v3/ProductGroup/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/ProductGroup/'. $id);
    }

}