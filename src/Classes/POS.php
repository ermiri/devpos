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
 * POS - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class POS extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/PointsOfSale');
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

        return $this->post('/api/v3/PointsOfSale', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/PointsOfSale/'. $id);
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

        return $this->put('/api/v3/PointsOfSale/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/PointsOfSale/'. $id);
    }

}