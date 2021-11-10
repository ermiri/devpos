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
 * ClientCard - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class ClientCard extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/ClientCard');
    }

    public function create($parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'name' => 'required|string|max:40',
            'surname' => 'nullable|string|max:60',
            'birthday' => 'required|date',
            
            'cardNumber' => 'required|string|max:60',
            'clientCardType' => 'required|numeric',
            'maxPoints' => 'nullable|numeric',
            'percentage' => 'nullable|numeric',
            'points' => 'nullable|numeric',
            'totalPoints' => 'nullable|numeric',

            'contact' => 'required|string|max:40',
            'email' => 'nullable|string|max:60',
            'customer' => 'required|string|max:40',
            'customerId' => 'required|numeric',
            
            'city' => 'required|string|max:60',
            'cityId' => 'required|numeric',
            'address' => 'required|string|max:250',

            'plate' => 'nullable|string|max:60',

            'driver' => 'nullable|string|max:60',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        
        $parameters['idType'] = (int)$parameters['registrationDate'];

        return $this->post('/api/v3/ClientCard', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/ClientCard/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'name' => 'required|string|max:40',
            'surname' => 'nullable|string|max:60',
            'birthday' => 'required|date',
            
            'cardNumber' => 'required|string|max:60',
            'clientCardType' => 'required|numeric',
            'maxPoints' => 'nullable|numeric',
            'percentage' => 'nullable|numeric',
            'points' => 'nullable|numeric',
            'totalPoints' => 'nullable|numeric',

            'contact' => 'required|string|max:40',
            'email' => 'nullable|string|max:60',
            'customer' => 'required|string|max:40',
            'customerId' => 'required|numeric',
            
            'city' => 'nullable|string|max:60',
            'cityId' => 'required|numeric',
            'address' => 'required|string|max:250',

            'plate' => 'nullable|string|max:60',

            'driver' => 'nullable|string|max:60',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        $parameters['idType'] = (int)$parameters['registrationDate'];

        return $this->put('/api/v3/ClientCard/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/ClientCard/'. $id);
    }

}