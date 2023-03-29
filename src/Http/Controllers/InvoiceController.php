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

use ErmirShehaj\DevPos\Events\InvoiceCreated;

class InvoiceController extends Controller
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

            $items = DevPos::invoice()->get();
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

        //get clients from devpos
        $customers = DevPos::customer()->get();

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
        
        //get products
        $products = DB::select('select * from price_list where Status = \'Active\'');

        
        return view('devpos::invoices', [

            'title' => __('Invoices'),
            'breadcrumb' => [

                __('Invoices') => route('devpos.invoices.index')
            ],
            'menu' => 'devpos.invoices',
            //'items' => $items,
            'tcrs' => $tcrs,
            'paymentMethods' => $paymentMethods,
            'feeTypes' => $feeTypes,
            'customers' => $customers,
            'clientCardTypes' => $clientCardTypes,
            'typesOfSelfIssuing' => $typesOfSelfIssuing,
            'currencies' => $currencies,
            'countries' => $countries,
            'cities' => $cities,
            'banks' => $banks,
            'idTypes' => $idTypes,
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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

        //return $request->all();
        //return $item = DevPos::invoice()->create($request->all());
        try {
            
            $item = DevPos::invoice()->create($request->all());

            //if invoice is created we fire the event
            event(new InvoiceCreated($item));
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
                'ErrorMsg' => $error->getMessage(),
                'Errors' => $error->response->json(),
                'Data' => $request->all()
            ];
        }
        catch(\Symfony\Component\HttpKernel\Exception\HttpException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $request->all()
            ];
        }
        catch(\Illuminate\Auth\AuthenticationException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Authentication' => 'Unauthorized 401',
                'Data' => $request->all()
            ];
        }
        catch(\Exception $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $request->all(),
                'Exception' => 'Test',
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

        $item = DevPos::invoice()->show($id);

        $startPoints = DevPos::enum()->getStartPoints();
        $vehicleOwnershipTypes = DevPos::enum()->getVehicleOwnershipTypes();
        
        return view('devpos::invoice-show', [

            'title' => __('View Invoice'),
            'breadcrumb' => [

                __('Invoices') => route('devpos.invoices.index'),
                __('Invoice') .': '. $id => route('devpos.invoices.show', $id)
            ],
            'menu' => 'devpos.invoices',
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
    public function destroy($id) {

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

    public function cancel($iic) {

        //cancel will return the invoice
        $invoice = DevPos::invoice()->cancel($iic);
        if ($invoice['isCorrectiveInvoice']) {

            return [

                'Status' => 'OK',
                'Data' => $invoice,
            ];
        }

        return [

            'Status' => 'error',
        ];

    }

    public function resend($iic) {

        //cancel will return the invoice
        $invoice = DevPos::invoice()->resend($iic);
        if ($invoice['isCorrectiveInvoice']) {

            return [

                'Status' => 'OK',
                'Data' => $invoice,
            ];
        }

        return [

            'Status' => 'error',
        ];

    }

    public function correct(Request $request, $iic) {
        
        try {
            
            $parameters = $request->all();

            //put on parameters the iic
            $parameters['iicReference'] = $iic;
            $parameters['correctiveInvType'] = 0;
            $invoice = DevPos::invoice()->correct($parameters);
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
        catch(\Illuminate\Http\Client\Exception $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $request->all()
            ];
        }

        //fire event
        //event(\ErmirShehaj\DevPos\Events\InvoiceCorrected::class);

        return [

            'Status' => 'OK',
            'Data' => $invoice,
            'Msg' => 'Invoice corrected successfully'
        ];
    }


    public function export(Request $request) {

        //delete _method=GET
        $parameters = $request->all();
        unset($parameters['_method']);

        //run export
        $content = DevPos::invoice()->export($parameters);

        return $content;
    }

    public function exportSalesBook(Request $request) {

        //delete _method=GET
        $parameters = $request->all();
        unset($parameters['_method']);

        //run export
        $content = DevPos::invoice()->exportSalesBook($parameters);

        return $content;
    }



}
