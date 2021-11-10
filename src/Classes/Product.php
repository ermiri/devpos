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
 * Product - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class Product extends Model {


    public function __construct() {

        parent::__construct();

        // //we will use 'pos' as cache key for TCR.|||| Dont forget that we use prefix: devpos
        // $this->setCache(true);
        // $this->setCacheKey('products');
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Product');
    }

    public function create($parameters = []) {

        /**
         * 
         * Example:
         * {
                "id": 32053,
                "name" => "Cigare",
                "barcode" => "123",
                "unitPrice": 0,
                "buyingPrice": 0,
                "rebatePrice": 0,
                "isRebateReducingBasePrice": false,
                "vatRate": 0,
                "consumptionTaxRate": 0,
                "rowVersion" => "2021-10-25T12:28:57.185079",
                "productCategoryName" => "Produkte",
                "productCategoryId": 125,
                "unitName" => "cope",
                "unitId": 165,
                "productCost": 0,
                "profitMargin": 0,
                "minQuantity": 0,
                "isSealable": true,
                "affectsWarehouse": true,
                "productType": 0,
                "amount": 0,
                "refund": 0
            }
         */


        //validate first
        $validation = Validator::make($parameters, [

            "name" => "required|string|max:60",
            "barcode" => "required|string|max:60",
            "unitPrice" => "required|numeric",
            "buyingPrice" => "required|numeric",
            "rebatePrice" => "nullabe|numeric",
            "isRebateReducingBasePrice" => "nullable|in:0,1",
            "vatRate" => "required|numeric",
            "consumptionTaxRate" => "required|numeric",
            "rowVersion" => "2021-10-25T12:28:57.185079",
            "productCategoryName" => "Produkte",
            "productCategoryId" => "required|numeric",
            "unitName" => "cope",
            "unitId" => "required|numeric",
            "productCost" => "required|numeric",
            "profitMargin" => "required|numeric",
            "minQuantity" => "required|numeric",
            "entryUnitId" => "sometimes|required_if:isDifFromBaseUnit,1|numeric",
            "entryUnitRatio" => "sometimes|required_if:isDifFromBaseUnit,1|numeric",
            "isSealable" => "required|in:0,1",
            "affectsWarehouse" => "required|in:0,1",
            "productType" => "nullable|numeric",
            "amount" => "nullable|numeric",
            "refund" => "nullable|numeric",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        //$parameters['registrationDate'] = date("c", strtotime($parameters['registrationDate']));
        $parameters['affectsWarehouse'] = boolval($parameters['affectsWarehouse']);
        $parameters['isSealable'] = boolval($parameters['isSealable']);
        $parameters['isRebateReducingBasePrice'] = boolval($parameters['isRebateReducingBasePrice'] ?? '0');
        $parameters['refund'] = $parameters['refund'] ?? 0;
        $parameters['productType'] = $parameters['productType'] ?? 0;

        return $this->post('/api/v3/Product', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Product/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "id" => "required|numeric",
            "name" => "required|string|max:60",
            "barcode" => "required|string|max:60",
            "unitPrice" => "required|numeric",
            "buyingPrice" => "required|numeric",
            "rebatePrice" => "nullabe|numeric",
            "isRebateReducingBasePrice" => "nullable|in:0,1",
            "vatRate" => "required|numeric",
            "consumptionTaxRate" => "required|numeric",
            "rowVersion" => "2021-10-25T12:28:57.185079",
            "productCategoryName" => "Produkte",
            "productCategoryId" => "required|numeric",
            "unitName" => "cope",
            "unitId" => "required|numeric",
            "productCost" => "required|numeric",
            "profitMargin" => "required|numeric",
            "minQuantity" => "required|numeric",
            "entryUnitId" => "sometimes|required_if:isDifFromBaseUnit,1|numeric",
            "entryUnitRatio" => "sometimes|required_if:isDifFromBaseUnit,1|numeric",
            "isSealable" => "required|in:0,1",
            "affectsWarehouse" => "required|in:0,1",
            "productType" => "nullable|numeric",
            "amount" => "nullable|numeric",
            "refund" => "nullable|numeric",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //fix registrationDate
        //$parameters['registrationDate'] = date("c", strtotime($parameters['registrationDate']));
        $parameters['affectsWarehouse'] = boolval($parameters['affectsWarehouse']);
        $parameters['isSealable'] = boolval($parameters['isSealable']);
        $parameters['isRebateReducingBasePrice'] = boolval($parameters['isRebateReducingBasePrice'] ?? '0');
        $parameters['refund'] = $parameters['refund'] ?? 0;
        $parameters['productType'] = $parameters['productType'] ?? 0;

        return $this->put('/api/v3/Product/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Product/'. $id);
    }

}