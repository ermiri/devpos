<?php

namespace ErmirShehaj\DevPos\Classes;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use ErmirShehaj\DevPos\Classes\Model;

/**
 * Cache:
 * $tcr->cache()->get(); //list all tcr and cache them
 * $tcr->cache()->onFailCached()->get();
 */


/**
 * TaxPayer - is the class that will contain all methods for tcr
 * Default we will cache get() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::taxpayer()->setCacheKey('key')->get();
 */

class TaxPayer extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/TaxPayer');
    }

    public function create($params = []) {

        return;
    }

    public function show($id) {

        return $this->httpGet('/api/v3/TaxPayer');
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "idNumber" => "required|string|max:30",
            "idType" => "nullable|numeric",
            "businessName" => "nullable|string|max:50",
            "address" => "required|string|max:150",
            "country" => "required|string|max:60",
            "countryCode" => "required|string|max:10",
            "city" => "required|string|max:50",
            "businessPermissionCode" => "nullable|string|max:30",
            "businessUnitCode" => "required|string|max:30",
            "issuerInVAT" => "required|boolean",
            "certFileName" => "nullable|string|max:100",
            "certFilePass" => "nullable|string|max:100",
            "taxPayerType" => "nullable|numeric",
            "registrationName" => "required|string|max:80",
            "differentPricesPerPOS" => "nullable|boolean",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast
        $parameters['issuerInVAT'] = boolval($parameters['issuerInVAT']);
        $parameters['differentPricesPerPOS'] = boolval($parameters['differentPricesPerPOS']);
        $parameters['idType'] = (int)($parameters['idType']);
        $parameters['taxPayerType'] = (int)($parameters['taxPayerType']);

        return $this->put('/api/v3/TaxPayer', $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/TaxPayer/'. $id);
    }

}