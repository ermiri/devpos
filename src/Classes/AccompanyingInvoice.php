<?php

namespace ErmirShehaj\DevPos\Classes;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use ErmirShehaj\DevPos\Facades\DevPos;

use ErmirShehaj\DevPos\Classes\Model;



/**
 * POS - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class AccompanyingInvoice extends Model {


    public function __construct() {

        parent::__construct();

        $this->setCache(false);
        $this->bypassCache();
        
    }

    //list all tcr saved on devpos
    public function get() {
        
        $path = '/api/v3/WTN';
        $query = http_build_query(request()->all());
       
        $query = !empty($query) ? '?'. $query:$query;

       // echo $path . $query;

        return $this->httpGet($path . $query);
    
    }

    public function create($parameters = []) {

        /**
         * Example:
         * {
            "id": 0,
            "wtnType": 0,
            "transaction": 0,
            "vehicleOwnershipType": 0,
            "vehiclePlate": "aa930gz",
            "startAddress": "Tirane",
            "startCity": "Tirane",
            "startPoint": 2,
            "destinationAddress": "Rruga Llambi Ganiu",
            "destinationCity": "Fier",
            "destinationPoint": 3,
            "isGoodsFlammable": false,
            "isEscortRequired": false,
            "packType": "Qese",
            "affectsWarehouse": true,
            "exitWarehouseId": 112,
            "destinationWarehouseId": 112,
            "packNumber": 1223548,
            "itemsNumber": 25,
            "carrierId": 0,
            "isAfterDelivery": false,
            "subsequentDeliveryType": 2,
            "valueOfGoods": 600,
            "buyer": null,
            "carrier": null,
            "wtnProduct": [
                {
                "name": "BAYLEYS   12 X  0.7 lit",
                "barcode": "BAYLEYS   12 X  0.7 lit",
                "quantity": 1,
                "isRebateReducingBasePrice": true,
                "unit": "vlere monetare",
                "vatRate": 20,
                "invoiceId": 0,
                "productId": 32150,
                "packNumber": 0,
                "price": 600
                }
            ],
            "businessUnitCode": "ux640ut831",
            "startDateTime": "2021-11-10",
            "destinationDateTime": "2021-11-27"
            }
         */


        //default values


        //do some validations
        $validation = Validator::make($parameters, [

            "businessUnitCode" => 'required|string',
            "wtnType" => 'required|numeric',
            "transaction" => 'required|numeric',
            "vehicleOwnershipType" => 'required|numeric',
            "vehiclePlate" => 'required|string|max:30',

            "startAddress" => 'required|string|max:250',
            "startCity" => 'required|string|max:50',
            "startPoint" => 'required|numeric',
            "startDateTime" => 'required|date',

            "destinationDateTime" => 'required|date',
            "destinationAddress" => 'required|string|max:250',
            "destinationCity" => 'required|string|max:50',
            "destinationPoint" => 'required|numeric',

            "isGoodsFlammable" => 'required|boolean',
            "isEscortRequired" => 'required|boolean',
            "packType" => 'nullable|string',
            "affectsWarehouse" => 'nullable|boolean',
            "exitWarehouseId" => 'nullable|numeric',
            "destinationWarehouseId" => 'nullable|numeric',
            "packNumber" => 'nullable|numeric',
            "itemsNumber" => 'nullable|numeric',
            "carrierId" => 'nullable|numeric',
            "isAfterDelivery" => 'nullable|boolean',
            "subsequentDeliveryType" => 'nullable|numeric',
            "valueOfGoods" => 'nullable|numeric',
            "buyer" => 'nullable|string',
            "carrier" => 'nullable|string',
            "wtnProduct" => 'required|array',
            
                "wtnProduct.*.name" => "required_with:wtnProduct|string|max:50",
                "wtnProduct.*.barcode" => "nullable|string|max:50",
                "wtnProduct.*.quantity" => "required_with:wtnProduct|numeric",
                "wtnProduct.*.isRebateReducingBasePrice" => "required_with:wtnProduct|boolean",
                "wtnProduct.*.unit" => "required_with:wtnProduct|string|max:50",
                "wtnProduct.*.vatRate" => "nullable|numeric",
                "wtnProduct.*.invoiceId" => "nullable|numeric",
                "wtnProduct.*.productId" => "required_with:wtnProduct|numeric",
                "wtnProduct.*.packNumber" => "nullable|numeric",
                "wtnProduct.*.price" => "required_with:wtnProduct|numeric",
                
        ]);

       // print_r($parameters);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast columns boolean
        $parameters['isGoodsFlammable'] = boolval($parameters['isGoodsFlammable']) ?? 0;
        $parameters['isEscortRequired'] = boolval($parameters['isEscortRequired'] ?? 0);
        $parameters['affectsWarehouse'] = boolval($parameters['affectsWarehouse'] ?? 0);
        $parameters['isAfterDelivery'] = boolval($parameters['isAfterDelivery'] ?? 0);

        //cast numeric columns
        $parameters['wtnType'] = (int)$parameters['wtnType'];
        $parameters['transaction'] = (int)$parameters['transaction'];
        $parameters['vehicleOwnershipType'] = (int)$parameters['vehicleOwnershipType'];
        $parameters['startPoint'] = (int)$parameters['startPoint'];
        $parameters['destinationPoint'] = (int)$parameters['destinationPoint'];
        $parameters['itemsNumber'] = (int)$parameters['itemsNumber'];

        foreach($parameters['wtnProduct'] as $ind => $product) {

            //boolean
            $parameters['wtnProduct'][$ind]['isRebateReducingBasePrice'] = boolval($product['isRebateReducingBasePrice'] ?? 0);

            //numeric
            $parameters['wtnProduct'][$ind]['quantity'] = (float)$parameters['wtnProduct'][$ind]['quantity'];
            $parameters['wtnProduct'][$ind]['vatRate'] = (float)$parameters['wtnProduct'][$ind]['vatRate'];
            $parameters['wtnProduct'][$ind]['packNumber'] = (float)$parameters['wtnProduct'][$ind]['packNumber'];
            $parameters['wtnProduct'][$ind]['price'] = (float)$parameters['wtnProduct'][$ind]['price'];

            unset($parameters['wtnProduct'][$ind]['productId']);
        }

        return $this->post('/api/v3/WTN', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/WTN/'. $id);
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

        return $this->put('/api/v3/WTN/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        //return $this->delete('/api/v3/WTN/'. $id);
    }

}