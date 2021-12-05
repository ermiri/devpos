<?php

namespace ErmirShehaj\DevPos\Classes;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use ErmirShehaj\DevPos\Facades\DevPos;

use ErmirShehaj\DevPos\Classes\Model;

/**
 * Cache:
 * $tcr->cache()->list(); //list all tcr and cache them
 * $tcr->cache()->onFailCached()->list();
 */


/**
 * TCR - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class TCR extends Model {


    public function __construct() {

        parent::__construct();

        // //we will use 'tcr' as cache key for TCR.|||| Dont forget that we use prefix: devpos
        // $this->setCache(true);
        // $this->setCacheKey('tcr');
    }

    public function get() {

        return $this->httpGet('/api/v3/TCR');
    }

    public function create($parameters = []) {

        //add default data
        $parameters['businessUnitCode'] = DevPos::taxpayer()->get()['businessUnitCode'];
        
        //first we validate the tcr
        //do some validations
        $validation = Validator::make($parameters, [

            'name' => 'required|string|max:50',
            'validFromDate' => 'nullable|date',

            'validToDate' => 'nullable|date',
            'type' => 'required|in:0,1', //['Regular Cash', 'Self-service cash box']
            'businessUnitCode' => 'required|string|max:40', //tr758ei942
            'tcrIntID' => 'required|numeric',
            'pointsOfSaleId' => 'required|numeric',
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast type to number
        $parameters['type'] = (int)$parameters['type'];
        $parameters['tcrIntID'] = (int)$parameters['tcrIntID'];

        if (!empty($parameters['validFromDate']))
            $parameters['validFromDate'] = date("c", strtotime($parameters['validFromDate']));
            
        if (!empty($parameters['validToDate']))
        $parameters['validToDate'] = date("c", strtotime($parameters['validToDate']));

        return $this->post('/api/v3/TCR', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/TCR/'. $id);
    }

    public function update($id, $parameters = []) {

        //first we validate the tcr
        //do some validations
        $validation = Validator::make($parameters, [

            'name' => 'required|string|max:50',
            'validFromDate' => 'nullable|date',

            'validToDate' => 'nullable|date',
            'type' => 'required|in:0,1', //['Regular Cash', 'Self-service cash box']
            //'businessUnitCode' => 'required|string|max:40', //tr758ei942
            'tcrIntID' => 'required|numeric',
            'pointsOfSaleId' => 'required|numeric',
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast type to number
        $parameters['type'] = (int)$parameters['type'];
        $parameters['tcrIntID'] = (int)$parameters['tcrIntID'];

        //default data
        //$parameters['businessUnitCode'] = DevPos::taxpayer()->get()['businessUnitCode'];

        return $this->put('/api/v3/TCR/ChangeTCRValidTo', $parameters);
    }
    
    public function destroy($id) {

        return $this->delete('/api/v3/TCR/'. $id);
    }

    public function fiscalizeTCR($id) {

        return $this->delete('/api/v3/TCR/FiscalizeTCR/'. $id);
    }
    
    //list all tcr
    public function listActiveTCR() {

        $this->httpGet('/api/v3/TCR/activeTCR');
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



    /**
     * Here we will put three helpers
     * openBalance(), cashOut(), cashIn() 
     */


    public function isBalanceDeclared($tcr_code = null) {

        ///where $tcr_code is something like: fu087lt613

        if (is_null($tcr_code)) {

            //check for choosed tcr, saved on cache
            $tcr_code = session()->get('tcr.fiscalizationNumber');
        }

        if (empty($tcr_code))
            throw new \Exception('You have to choose first the tcr than check if it is declare!');

        $response = $this->httpGet('/api/v3/TCR/IsBalanceDeclared/'. $tcr_code);

        if ($response == 'true')
            return true;
        return false;
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

    public function tcrReport($tcr_code) {

        /**
         * This method will return 
         * 
         *   correctiveInvoices: 0
         *   tcrBalance: 2500
         *   totalInvoices: 0
         *   unfiscalizedInvoices: 0
         *
         */

        return $this->httpGet('/api/v3/Report/'. $tcr_code);
    }

    public function unfiscalizedBalances() {

        return $this->httpGet('/api/v3/TCRBalance/GetUnfiscalizedBalances');
    }

}