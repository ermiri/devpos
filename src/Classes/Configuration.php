<?php

namespace ErmirShehaj\DevPos\Classes;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use ErmirShehaj\DevPos\Classes\Model;

/**
 * Cache:
 * $tcr->cache()->list(); //list all tcr and cache them
 * $tcr->cache()->onFailCached()->list();
 */


/**
 * Configuration - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class Configuration extends Model {


    public function __construct() {

        parent::__construct();

        //we will use 'pos' as cache key for TCR.|||| Dont forget that we use prefix: devpos
        $this->setCache(true);
        $this->setCacheKey('configurations');
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Configuration');
    }

    public function create($parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'code' => 'required|max:40',
            'businessUnitCode' => 'required|max:40',

            'registrationDate' => 'date',
            
            'latitude' => 'nullable|max:40',
            'longitude' => 'nullable|max:40',

            'address' => 'required|max:120',
            'city' => 'required|max:120',

            'description' => 'nullable|max:250',
            
        ]);

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }

        return $this->post('/api/v3/Configuration', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Configuration/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'code' => 'required|max:40',
            'businessUnitCode' => 'required|max:40',

            'registrationDate' => 'required|date',
            
            'latitude' => 'nullable|max:40',
            'longitude' => 'nullable|max:40',

            'address' => 'required|max:120',
            'city' => 'required|max:120',

            'description' => 'nullable|max:250',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        $parameters['registrationDate'] = date("c", strtotime($parameters['registrationDate']));

        return $this->put('/api/v3/Configuration/'. $id, $parameters);
    }

    //delete pos on devpos
    public function delete($id) {

        return $this->delete('/api/v3/Configuration/'. $id);
    }

}