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
 * Transporter - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::supplier()->setCacheKey('key')->list();
 */

class Transporter extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Transporter');
    }

    public function create($parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'nuis' => 'required|max:100',
            'name' => 'required|max:60',
            'address' => 'required|max:250',
            'phoneNo' => 'required|max:50',
            
        ]);

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->post('/api/v3/Transporter', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Transporter/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'id' => 'required|numeric',
            'nuis' => 'required|max:100',
            'name' => 'required|max:60',
            'address' => 'required|max:250',
            'phoneNo' => 'required|max:50',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->put('/api/v3/Transporter/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Transporter/'. $id);
    }

}