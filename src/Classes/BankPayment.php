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
 * BankPayment - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class BankPayment extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/PaymentNotification');
    }

    public function create($parameters = []) {

        
        //add default data
        $parameters['datTimSend'] = date('Y-m-dTH:i:s');

        //validate first
        $validation = Validator::make($parameters, [

            'bankNipt' => 'nullable|string|max:30',
            'datTimSend' => 'required|date',

            'payerNipt' => 'required|string|max:40',
            'refCode' => 'nullable|string|max:250',

            'pymtNotItems.*.einFic' => 'required|string|max:60',
            'pymtNotItems.*.id' => 'nullable|numeric',
            'pymtNotItems.*.overpaidAmount' => 'nullable|numeric',
            'pymtNotItems.*.paidAmt' => 'nullable|numeric',
            'pymtNotItems.*.paidCur' => 'required|string|max:10',
            'pymtNotItems.*.paymentDateTime' => 'required|date',
            'pymtNotItems.*.pymtStatus' => 'required|numeric',
            'pymtNotItems.*.pymtType' => 'required|numeric',
            'pymtNotItems.*.transactionCode' => 'nullable|string|max:20',
            
        ]);

        if ($validation->fails()) {

            //dd($validation->errors());
            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast parameters        
        //$parameters['idType'] = (int)$parameters['registrationDate'];
        foreach($parameters['pymtNotItems'] as $ind => &$array) {

            //$array['id'] = (int)$array['id'];
            $array['overpaidAmount'] = (float)$array['overpaidAmount'];
            $array['paidAmt'] = (float)$array['paidAmt'];
            //$array['paidCur'] = $array['paidCur'];
            $array['pymtStatus'] = (int)$array['pymtStatus'];
            $array['pymtType'] = (int)$array['pymtType'];
        }

        return $this->post('/api/v3/PaymentNotification', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/PaymentNotification/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //add default data
        $parameters['datTimSend'] = date('Y-m-dTH:i:s');

        //validate first
        $validation = Validator::make($parameters, [

            'bankNipt' => 'nullable|string|max:30',
            'datTimSend' => 'required|date',

            'payerNipt' => 'required|string|max:40',
            'refCode' => 'nullable|string|max:250',

            'pymtNotItems.*.einFic' => 'required|string|max:60',
            'pymtNotItems.*.id' => 'required|numeric',
            'pymtNotItems.*.overpaidAmount' => 'required|numeric',
            'pymtNotItems.*.paidAmt' => 'required|numeric',
            'pymtNotItems.*.paidCur' => 'required|string|max:10',
            'pymtNotItems.*.paymentDateTime' => 'required|date',
            'pymtNotItems.*.pymtStatus' => 'required|numeric',
            'pymtNotItems.*.pymtType' => 'required|numeric',
            'pymtNotItems.*.transactionCode' => 'required|string|max:20',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast parameters        
        //$parameters['idType'] = (int)$parameters['registrationDate'];
        foreach($parameters['pymtNotItems'] as $ind => &$array) {

            $array['id'] = (int)$array['id'];
            $array['overpaidAmount'] = (float)$array['overpaidAmount'];
            $array['paidAmt'] = (float)$array['paidAmt'];
            $array['paidCur'] = (int)$array['paidCur'];
            $array['pymtStatus'] = (int)$array['pymtStatus'];
            $array['pymtType'] = (int)$array['pymtType'];
        }

        return $this->put('/api/v3/PaymentNotification/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/PaymentNotification/'. $id);
    }

}