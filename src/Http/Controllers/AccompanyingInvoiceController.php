<?php

namespace ErmirShehaj\DevPos\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use ErmirShehaj\DevPos\Facades\DevPos;

use App\Http\Requests\PosRequest;
use \App\Models\Pos;
use DateTime;

use ErmirShehaj\DevPos\Events\AccompanyingInvoiceCreated;

class AccompanyingInvoiceController extends Controller
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

            $items = DevPos::accompanyingInvoice()->get();
            return [
                
                'Status' => 'OK',
                'Data' => $items
            ];
        }   

        // //get supplierList from devpos
        // $warehouseTypes = DevPos::enum()->getAccompanyingInvoiceType();

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

        
        return view('devpos::accompanying-invoices', [

            'title' => __('Accompanying Invoices'),
            'breadcrumb' => [

                __('Accompanying Invoices') => route('devpos.accompanying-invoices.index')
            ],
            'menu' => 'devpos.accompanying-invoices',
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
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {


        //get cities from devpos
        $startPoints = DevPos::enum()->getStartPoints();
        $destinationPoints = DevPos::enum()->getDestinationPoints();
        
        //get subsequentDeliveryTypes from devpos
        $subsequentDeliveryTypes = DevPos::enum()->getSubsequentDeliveryType();
        $vehicleOwnershipTypes = DevPos::enum()->getVehicleOwnershipTypes();
        $wtnTypes = DevPos::enum()->getWtnTypes();
       // print_r($wtnTypes);
        $transactions = DevPos::enum()->getTransactionTypes();

        $pos = DevPos::pos()->get();
        //print_r($pos);
        $warehouses = DevPos::warehouse()->get();
        
        //get products
        $products = DB::select('select * from price_list where Status = \'Active\'');

        return view('devpos::accompanying-invoice-new', [

            'title' => __('Accompanying Invoice'),
            'breadcrumb' => [

                __('Accompanying Invoice') => route('devpos.accompanying-invoices.index'),
               'New Accompanying Invoice' => route('devpos.accompanying-invoices.create')
            ],
            'menu' => 'devpos.accompanying-invoices',

            'startPoints' => $startPoints,
            'destinationPoints' => $destinationPoints,
            'pos' => $pos,
            'warehouses' => $warehouses,
            'subsequentDeliveryTypes' => $subsequentDeliveryTypes,
            'vehicleOwnershipTypes' => $vehicleOwnershipTypes,
            'wtnTypes' => $wtnTypes,
            'transactions' => $transactions,
            'products' => $products,
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
            
            $item = DevPos::accompanyingInvoice()->create($request->all());

            //if invoice is created we fire the event
            //event(new AccompanyingInvoiceCreated($item));
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
    public function show($id) {

        $item = DevPos::accompanyingInvoice()->show($id);

        $startPoints = DevPos::enum()->getStartPoints();
        $vehicleOwnershipTypes = DevPos::enum()->getVehicleOwnershipTypes();
        
        return view('devpos::accompanying-invoice', [

            'title' => __('Accompanying Invoice'),
            'breadcrumb' => [

                __('Accompanying Invoices') => route('devpos.accompanying-invoices.index'),
                __('Accompanying Invoices') => route('devpos.accompanying-invoices.show', $id)
            ],
            'menu' => 'devpos.accompanying-invoices',
            'item' => (object)$item,
            'startPoints' => $startPoints,
            'vehicleOwnershipTypes' => $vehicleOwnershipTypes,
        ]);
        
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
            $item = DevPos::accompanyingInvoice()->update($id, $request->all());
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
            $item = DevPos::accompanyingInvoice()->destroy($id);
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
            'Msg' => $deleted == 0 ? 'AccompanyingInvoice deleted successfully':'AccompanyingInvoice didn\'t deleted successfully!'
        ]);
    }



}
