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
 * SupplierList - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::supplier()->setCacheKey('key')->list();
 */

class SupplierList extends Model {


    public function __construct() {

        parent::__construct();
    }

    //list all tcr saved on devpos
    public function get() {

        return $this->httpGet('/api/v3/SupplierLists');
    }

    public function create($parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'nuisList' => 'required|max:100',
            'name' => 'required|max:40',
            'description' => 'required|max:250',
            
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

        return $this->post('/api/v3/SupplierLists', $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/SupplierLists/'. $id);
    }

    //update pos on devpos
    public function update($id, $parameters = []) {

        //validate first
        $validation = Validator::make($parameters, [

            'id' => 'required|numeric',
            'nuisList' => 'required|max:100',
            'name' => 'required|max:40',
            'description' => 'required|max:250',
            
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->put('/api/v3/SupplierLists/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/SupplierLists/'. $id);
    }

}