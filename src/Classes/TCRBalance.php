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
        
        /////api/v3/TCRBalance/TCR/
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

    

    //Update TCR Balance
    public function updateTCRBalance($array = []) {

        //do some validations
        $validation = Validator::make($array, [

            'tcrCode' => 'required|string|max:50', //ab750tb427
            'operatorCode' => 'required|string|max:50', //emri i userit te sistemit, psh: vq961go132

            'value' => 'required|numeric', //vlera
            'changeDateTime' => 'required|datetime', //2021-04-21T11:21:45+02:00
            'operation' => 'required|in:0,1,2', //0 : Deklarimi i arkës në fillim të ditës, 1 : Tërheqje e parave nga arka, 2 : depozitim i parave në arkë
            'subsequentDeliveryType' => 'string|max:250',
        ]);

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }

        //now continue to perform the request
        $response = $this->call($array);
    }
    

    public function openBalance($parameters = []) {

        //and example from devpos: {tcrId: 212, value: 2000, description: null, operation: 0, changeDateTime: "2021-10-22T00:38:34+02:00", subsequentDeliveryType: null}

        //do some validations
        $validation = Validator::make($parameters, [

            'tcrId' => 'required|numeric', //tcr id not tcr_code
            //'operatorCode' => 'required|string|max:50', //emri i userit te sistemit, psh: vq961go132

            'value' => 'required|numeric', //vlera
            'changeDateTime' => 'required|date', //2021-04-21T11:21:45+02:00
            //'operation' => 'required|in:0,1,2', //0 : Deklarimi i arkës në fillim të ditës, 1 : Tërheqje e parave nga arka, 2 : depozitim i parave në arkë
            'subsequentDeliveryType' => 'string|max:250',
        ]);

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }

        //fix changeDateTime
        $parameters['changeDateTime'] = date("c", strtotime($parameters['changeDateTime']));

        //in this situation we have operation = 0
        $parameters['operation'] = 0;
 
        //now continue to perform the request
        return $this->post('/api/v3/TCRBalance', $parameters);

        /** 
         * We expect to return an object like below:
         * 
         * {
         *   "id": 8136,
         *  "value": 5000,
         *   "operatorCode": "wk477lv989",
         *   "operation": 0,
         *   "tcr": {
         *     "id": 238,
         *     "name": "ARKA 20",
         *     "tcrIntID": 20,
         *     "fiscalizationNumber": "kz243yq652",
         *     "validFromDate": "2021-09-15T00:00:00",
         *     "type": 0,
         *     "tcrBalance": 0,
         *     "wareHouseId": 83,
         *     "pointsOfSaleId": 23,
         *     "isActive": false
         *   },
         *   "tcrCode": "kz243yq652",
         *   "changeDateTime": "2021-10-22T11:48:59+02:00",
         *   "fcdc": "13e036f3-4971-4d07-b1a5-819ef00be258"
         * }
         */
    }
    

    public function cashOut($array = []) {

        //do some validations
        $validation = Validator::make($array, [

            'tcrCode' => 'required|string|max:50', //ab750tb427
            'operatorCode' => 'required|string|max:50', //emri i userit te sistemit, psh: vq961go132

            'value' => 'required|numeric', //vlera
            'changeDateTime' => 'required|datetime', //2021-04-21T11:21:45+02:00
            //'operation' => 'required|in:0,1,2', //0 : Deklarimi i arkës në fillim të ditës, 1 : Tërheqje e parave nga arka, 2 : depozitim i parave në arkë
            'subsequentDeliveryType' => 'string|max:250',
        ]);

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }

        //in this situation we have operation = '0'
        $array['operation'] = '1';
 
        //now continue to perform the request
        return $this->updateTCRBalance($array);
    }
    

    public function cashIn($array = []) {

        //do some validations
        $validation = Validator::make($array, [

            'tcrCode' => 'required|string|max:50', //ab750tb427
            'operatorCode' => 'required|string|max:50', //emri i userit te sistemit, psh: vq961go132

            'value' => 'required|numeric', //vlera
            'changeDateTime' => 'required|datetime', //2021-04-21T11:21:45+02:00
            //'operation' => 'required|in:0,1,2', //0 : Deklarimi i arkës në fillim të ditës, 1 : Tërheqje e parave nga arka, 2 : depozitim i parave në arkë
            'subsequentDeliveryType' => 'in:0,1,2,3',
        ]);

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }

        //in this situation we have operation = '2'
        $array['operation'] = '2';
 
        //now continue to perform the request
        return $this->updateTCRBalance($array);
    }

}