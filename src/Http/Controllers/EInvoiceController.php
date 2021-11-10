<?php

namespace ErmirShehaj\DevPos\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use ErmirShehaj\DevPos\Facades\DevPos;

use App\Http\Requests\PosRequest;
use \App\Models\Pos;
use DateTime;

class EInvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {

        //authorize first
        //$this->authorize('menu', Pos::class);

        if (request()->ajax()) {

            $items = DevPos::einvoice()->get();
            return [
                
                'Status' => 'OK',
                'Data' => $items
            ];
        }   

        // //get supplierList from devpos
        // $warehouseTypes = DevPos::enum()->getInvoiceType();

        //get supplierList from devpos
        $tcrs = DevPos::tcr()->get();
  
        
        //get supplierList from devpos
        $paymentMethods = DevPos::enum()->getPaymentMethodTypes();

        //get feeTypes from devpos
        $feeTypes = DevPos::enum()->getFeeTypes();

        //get feeTypes from devpos
        $clientCardTypes = DevPos::enum()->getClientCardTypes();

        //get typeOfSelfIssuing from devpos
        $typesOfSelfIssuing = DevPos::enum()->getTypesOfSelfIssuing();

        //get currencies from devpos
        $currencies = DevPos::enum()->getCurrencies();

        //get countries from devpos
        $countries = DevPos::enum()->getCountries();

        //get cities from devpos
        $cities = DevPos::enum()->getCities();

        //get cities from devpos
        $banks = DevPos::account()->get();

        //get cities from devpos
        $idTypes = DevPos::enum()->getIdTypes();

        //get cities from devpos
        $eInvoiceStatuses = DevPos::enum()->getEInvoiceStatuses();

        
        return view('devpos::einvoices', [

            'title' => __('EInvoices'),
            'breadcrumb' => [

                __('EInvoices') => route('devpos.einvoices.index')
            ],
            'menu' => 'devpos.einvoices',
            //'items' => $items,
            'tcrs' => $tcrs,
            'paymentMethods' => $paymentMethods,
            'feeTypes' => $feeTypes,
            'clientCardTypes' => $clientCardTypes,
            'typesOfSelfIssuing' => $typesOfSelfIssuing,
            'currencies' => $currencies,
            'countries' => $countries,
            'cities' => $cities,
            'banks' => $banks,
            'idTypes' => $idTypes,
            'eInvoiceStatuses' => $eInvoiceStatuses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {

        //get supplierList from devpos
        $tcrs = DevPos::tcr()->get();
        
        //get supplierList from devpos
        $paymentMethods = DevPos::enum()->getPaymentMethodTypesEinvoice();

        //get feeTypes from devpos
        $feeTypes = DevPos::enum()->getFeeTypes();

        //get feeTypes from devpos
        $clientCardTypes = DevPos::enum()->getClientCardTypes();

        //get typeOfSelfIssuing from devpos
        $typesOfSelfIssuing = DevPos::enum()->getTypesOfSelfIssuing();

        //get currencies from devpos
        $currencies = DevPos::enum()->getCurrencies();

        //get countries from devpos
        $countries = DevPos::enum()->getCountries();

        //get cities from devpos
        $cities = DevPos::enum()->getCities();

        //get cities from devpos
        $banks = DevPos::account()->get();

        //get cities from devpos
        $idTypes = DevPos::enum()->getIdTypes();

        //get cities from devpos
        $eInvoiceStatuses = DevPos::enum()->getEInvoiceStatuses();

        //get cities from devpos
        $einvoiceProcesses = DevPos::enum()->getEInvoiceProcesses();

        //get cities from devpos
        $envoiceDocumentTypes = DevPos::enum()->getEInvoiceDocumentTypes();

        //get cities from devpos
        $subsequentDeliveryTypes = DevPos::enum()->getSubsequentDeliveryType();

        //get cities from devpos
        $warehouses = DevPos::warehouse()->get();

        return view('devpos::einvoice-new', [

            'title' => __('EInvoices'),
            'breadcrumb' => [

                __('EInvoices') => route('devpos.einvoices.index'),
               'New EInvoice' => route('devpos.einvoices.create')
            ],
            'menu' => 'devpos.einvoices',
            //'items' => $items,
            'tcrs' => $tcrs,
            'paymentMethods' => $paymentMethods,
            'feeTypes' => $feeTypes,
            'clientCardTypes' => $clientCardTypes,
            'typesOfSelfIssuing' => $typesOfSelfIssuing,
            'currencies' => $currencies,
            'countries' => $countries,
            'cities' => $cities,
            'banks' => $banks,
            'idTypes' => $idTypes,
            'eInvoiceStatuses' => $eInvoiceStatuses,
            'warehouses' => $warehouses,
            'einvoiceProcesses' => $einvoiceProcesses,
            'envoiceDocumentTypes' => $envoiceDocumentTypes,
            'subsequentDeliveryTypes' => $subsequentDeliveryTypes,
        ]); 
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {

        //authorize first
        //$this->authorize('create', Pos::class);

        try {
            
            $item = DevPos::einvoice()->create($request->all());
        }
        catch(\Illuminate\Validation\ValidationException $error) {

            return [

                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $request->all(),
                'Errors' => $error->errors(),
            ];
        }
        catch(\Illuminate\Http\Client\RequestException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->response->json()['message'],
                'Errors' => $error->response->json(),
                'Data' => $request->all()
            ];
        }
        catch(\Symfony\Component\HttpKernel\Exception\HttpException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $parameters
            ];
        }
        catch(\Illuminate\Auth\AuthenticationException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Authentication' => 'Unauthorized 401',
                'Data' => $parameters
            ];
        }
        catch(\Exception $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $parameters
            ];
        }

        return response()->json([

            'Status' => 'OK',
            'Data' => $item,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {

        try {

            //update supplier on devpos
            $item = DevPos::invoice()->update($id, $request->all());
        }
        catch(\Illuminate\Http\Client\RequestException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage()
            ];
        }
        

        return response()->json([

            'Status' => 'OK',
            'DevPos' => ['updated' => $item],
            'Data' => ['updated' => $updated]
        ]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //authorize action
        //$this->authorize('delete', Pos::class);

        try {

            //delete supplier on devpos
            $item = DevPos::invoice()->destroy($id);
        }
        catch(\Illuminate\Http\Client\RequestException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage()
            ];
        }


        return response()->json([

            'Status' => 'OK',
            'DevPos' => $item,
            'Data' => $deleted,
            'Msg' => $deleted == 0 ? 'Invoice deleted successfully':'Invoice didn\'t deleted successfully!'
        ]);
    }



}
