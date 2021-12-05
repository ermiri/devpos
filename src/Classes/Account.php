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
 * Account - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class Account extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Accounts');
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

            "number" => "required|string|max:60",
            "currency" => "required|string|max:60",
            "centerType" => "required|numeric",

            "accountName1" => "required|string|max:60",
            "accountName2" => "nullable|string|max:60",

            "bankName" => "required|string|max:60",
            "bankCity" => "required|string|max:60",
            "bankCountry" => "required|string|max:60",
            "bankCountryCode" => "required|string|max:60",
            "bankSwift" => "required|string|max:60",

            "bankBuildingName" => "nullable|string|max:60",
            "bankBuildingNumber" => "nullable|string|max:60",
            "bankStreet" => "nullable|string|max:120",
            "bankPostalCode" => "nullable|string|max:60",
            "bankAddressLine" => "nullable|string|max:250"
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast
        $parameters['centerType'] = (int)$parameters['centerType'];

        return $this->post('/api/v3/Accounts', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Accounts/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "id" => "required|numeric",
            "number" => "required|string|max:60",
            "currency" => "required|string|max:60",
            "centerType" => "required|string|max:60",

            "accountName1" => "required|string|max:60",
            "accountName2" => "nullable|string|max:60",

            "bankName" => "required|string|max:60",
            "bankCity" => "required|string|max:60",
            "bankCountry" => "required|string|max:60",
            "bankCountryCode" => "required|string|max:60",
            "bankSwift" => "required|string|max:60",

            "bankBuildingName" => "nullable|string|max:60",
            "bankBuildingNumber" => "nullable|string|max:60",
            "bankStreet" => "nullable|string|max:120",
            "bankPostalCode" => "nullable|string|max:60",
            "bankAddressLine" => "nullable|string|max:250"
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        //$parameters['registrationDate'] = date("c", strtotime($parameters['registrationDate']));

        return $this->put('/api/v3/Accounts/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Accounts/'. $id);
    }

}