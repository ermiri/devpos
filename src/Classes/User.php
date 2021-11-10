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
 * User - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->list();
 */

class User extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/Account/users');
    }

    public function create($parameters = []) {

        /**
         * user object example: 
        {
            "id": null,
            "userName" => "Endri",
            "fullName" => "Endri Asllani",
            "email" => "endri@gmail.com",
            "newPassword" => "12345",
            "newPasswordConfirm" => "12345",
            "roles": [
                "shites"
            ],
            "jobTitle" => "Recepsionist",
            "city" => "Tirane",
            "address" => "Farmacia nr 10",
            "phoneNumber" => "068547123",
            "configuration" => "",
            "isEnabled": true,
            "operatorCode" => "0145",
            "pointsOfSaleId": 30,
            "supplierNuisList": [],
            "saleLimit": 50
        }

        */

        //validate first
        $validation = Validator::make($parameters, [

            "id" => 'nullable',
            "userName" => "required|max:40",
            "fullName" => "required|max:60",
            "email" => "required|email|max:40",
            "newPassword" => "nullable|string|between:6,40",
            "newPasswordConfirm" => "required_with:newPassword|same:newPassword",
            "roles" => "nullable|array",
            "jobTitle" => "nullable|string|max:60",
            "city" => "nullable|string|max:60",
            "address" => "nullable|string|max:60",
            "phoneNumber" => "nullable|string|max:30",
            "configuration" => "nullable|string|max:60",
            "isEnabled" => "nullable|in:0,1",
            "isLockedOut" => "nullable|in:0,1",
            "operatorCode" => "nullable|string|max:30",
            "pointsOfSaleId" => "required|numeric",
            "supplierNuisList" => "nullable|array",
            "saleLimit" => "nullable|numeric",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //remove id from parameters
        unset($parameters['id']);
        $parameters['pointsOfSaleId'] = (int)$parameters['pointsOfSaleId'];
        $parameters['supplierNuisList'] = (array)$parameters['supplierNuisList'];
        $parameters['isEnabled'] = boolval((int)$parameters['isEnabled']);
        $parameters['isLockedOut'] = boolval((int)$parameters['isLockedOut'] ?? 0);

        //add taxPayerId
        //$parameters['taxPayerId'] = 1;

        //add taxPayerId
        $me = $this->me();
        $parameters['taxPayerId'] = $me['taxPayerId'];

        return $this->post('/api/v3/Account/users', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Account/users/'. $id);
    }

    //show my account
    public function me() {

        return $this->show('me');
        //return $this->httpGet('/api/v3/Account/users/me');
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            "id" => 'nullable',
            "userName" => "required|max:40",
            "fullName" => "required|max:60",
            "email" => "required|email|max:40",
            "newPassword" => "nullable|string|between:6,40",
            "newPasswordConfirm" => "required_with:newPassword|same:newPassword",
            "roles" => "nullable|array",
            "jobTitle" => "nullable|string|max:60",
            "city" => "nullable|string|max:60",
            "address" => "nullable|string|max:60",
            "phoneNumber" => "nullable|string|max:30",
            "configuration" => "nullable|string|max:60",
            "isEnabled" => "nullable|in:0,1",
            "isLockedOut" => "nullable|in:0,1",
            "operatorCode" => "nullable|string|max:30",
            "pointsOfSaleId" => "required|numeric",
            "supplierNuisList" => "nullable|array",
            "saleLimit" => "nullable|numeric",
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //remove id from parameters
        unset($parameters['id']);
        $parameters['pointsOfSaleId'] = (int)$parameters['pointsOfSaleId'];
        $parameters['supplierNuisList'] = (array)$parameters['supplierNuisList'];
        $parameters['isEnabled'] = boolval((int)$parameters['isEnabled']);
        $parameters['isLockedOut'] = boolval((int)$parameters['isLockedOut'] ?? 0);

        //add taxPayerId
        //$parameters['taxPayerId'] = 1;

        //add taxPayerId
        $me = $this->me();
        $parameters['taxPayerId'] = $me['taxPayerId'];


        return $this->put('/api/v3/Account/users/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Account/users/'. $id);
    }

}