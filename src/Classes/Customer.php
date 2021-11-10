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
 * Customer - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class Customer extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Customer');
    }

    public function create($parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'idNumber' => 'required|string|max:30',
            'idType' => 'required|numeric',

            'name' => 'required|string|max:40',

            'address' => 'nullable|string|max:250',
            'town' => 'required|string|max:60',
            'countryId' => 'required|numeric',
            'countryCode' => 'required|string|max:40',
            'code' => 'required|string|max:60',

            'phone' => 'nullable|string|max:60',
            'street' => 'nullable|string|max:60',
            'buildingName' => 'nullable|string|max:60',
            'buildingNumber' => 'nullable|string|max:60',
            'registrationName' => 'nullable|string|max:60',
            'fax' => 'nullable|string|max:60',
            'mail' => 'nullable|string|max:60',
            'cardNumber' => 'nullable|string|max:60',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        
        $parameters['idType'] = (int)$parameters['registrationDate'];

        return $this->post('/api/v3/Customer', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Customer/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'idNumber' => 'required|string|max:30',
            'idType' => 'required|numeric',

            'name' => 'required|string|max:40',

            'address' => 'nullable|string|max:250',
            'town' => 'required|string|max:60',
            'countryId' => 'required|numeric',
            'countryCode' => 'required|string|max:40',
            'code' => 'required|string|max:60',

            'phone' => 'nullable|string|max:60',
            'street' => 'nullable|string|max:60',
            'buildingName' => 'nullable|string|max:60',
            'buildingNumber' => 'nullable|string|max:60',
            'registrationName' => 'nullable|string|max:60',
            'fax' => 'nullable|string|max:60',
            'mail' => 'nullable|string|max:60',
            'cardNumber' => 'nullable|string|max:60',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        $parameters['idType'] = (int)$parameters['registrationDate'];

        return $this->put('/api/v3/Customer/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Customer/'. $id);
    }

}