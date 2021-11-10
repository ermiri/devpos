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
 * TCRBalance - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::supplier()->setCacheKey('key')->list();
 */

class TCRBalance extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        //validate first
        $validation = Validator::make(['tcrCode' => session()->get('tcr.fiscalizationNumber')], [

            'tcrCode' => 'required',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->httpGet('/api/v3/TCRBalance/TCR/'. session()->get('tcr.fiscalizationNumber'));
    }

    public function create($parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'tcrId' => 'required|numeric',
            'operation' => 'required|numeric',
            'value' => 'required|numeric',
            'changeDateTime' => 'required|date',
            'description' => 'nullable|max:250',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast
        $parameters['operation'] = (int)$parameters['operation'];
        $parameters['changeDateTime'] = date("c", strtotime($parameters['changeDateTime']));

        return $this->post('/api/v3/TCRBalance', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/TCRBalance/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'tcrId' => 'required|numeric',
            'operation' => 'required|numeric',
            'value' => 'required|numeric',
            'changeDateTime' => 'required|date',
            'description' => 'nullable|max:250',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast
       $parameters['operation'] = (double)$parameters['operation'];
       $parameters['changeDateTime'] = date("c", strtotime($parameters['changeDateTime']));

        return $this->put('/api/v3/TCRBalance/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/TCRBalance/'. $id);
    }

    //list all unfiscalized balances
    public function unfiscalized() {

        return $this->httpGet('/api/v3/TCRBalance/GetUnfiscalizedBalances');
    }

    
    //fiscalize a balance
    public function fiscalize($balanceID) {

        //validate first
        $validation = Validator::make(['balanceID' => $balanceID], [

            'balanceID' => 'required|numeric',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }
        return $this->put('/api/v3/TCRBalance/FiscalizeTCRBalance/'. $balanceID, []);
    }

}