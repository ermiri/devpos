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
 * WareHouse - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::supplier()->setCacheKey('key')->list();
 */

class WareHouse extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/WareHouse');
    }

    public function create($parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'code' => 'required|max:100',
            'description' => 'nullable|string|max:60',
            'email' => 'nullable|max:250',
            'latitude' => 'nullable|max:50',
            'longitude' => 'nullable|max:50',
            'notes' => 'nullable|string|max:250',
            'order' => 'required|numeric',
            'phone' => 'nullable|string|max:50',
            'wareHouseType' => 'required|numeric',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast
        $parameters['wareHouseType'] = (int)$parameters['wareHouseType'];
        $parameters['order'] = (int)$parameters['order'];
        $parameters['latitude'] = (double)$parameters['latitude'];
        $parameters['longitude'] = (double)$parameters['longitude'];

        return $this->post('/api/v3/WareHouse', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/WareHouse/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'code' => 'required|max:100',
            'description' => 'nullable|string|max:60',
            'email' => 'nullable|max:250',
            'latitude' => 'nullable|max:50',
            'longitude' => 'nullable|max:50',
            'notes' => 'nullable|string|max:250',
            'order' => 'required|numeric',
            'phone' => 'nullable|string|max:50',
            'wareHouseType' => 'required|numeric',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast
        $parameters['wareHouseType'] = (int)$parameters['wareHouseType'];
        $parameters['order'] = (int)$parameters['order'];
        $parameters['latitude'] = (double)$parameters['latitude'];
        $parameters['longitude'] = (double)$parameters['longitude'];

        return $this->put('/api/v3/WareHouse/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/WareHouse/'. $id);
    }

}