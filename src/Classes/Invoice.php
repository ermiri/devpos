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
 * Default we will cache get() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::tcr()->setCacheKey('key')->get();
 */

class Invoice extends Model {


    public function __construct() {

        parent::__construct();

        $this->setCache(false);
    }

    //list all tcr saved on devpos
    public function get() {

        $path = '/api/v3/Invoice/GetInvoices?startDate='. (request()->query('startDate') ?? date('Y-m-d', strtotime("-1 month"))) .'&endDate='. (request()->query('endDate') ?? date('Y-m-d'));

        if (!empty(request()->query('client')))
            $path .= '&client='. request()->query('client');

        if (!empty(request()->query('tcrCode')))
            $path .= '&tcrCode='. request()->query('tcrCode');

        return $this->httpGet($path);
    }

    public function create($parameters = [], $path = '/api/v3/Invoice') {

        $defaults = [

            'id' => 0,
            'invoiceType' => 0,
            'warehouseId' => NULL,
            'selfIssuingType' => NULL,
            'isSimplifiedInvoice' => false,
            'tcrCode' => 'wi923ef455',
            'markUpAmount' => 0,
            'goodsExport' => 0,
            'isReverseCharge' => false,
            'isSelfIssuingAffectWareHouse' => false,
            'isBadDebt' => false,
            'payDeadline' => NULL,
            'badDebtIICReference' => NULL,
            'supplyDateOrPeriodStart' => NULL,
            'supplyDateOrPeriodEnd' => NULL,
            'currencyCode' => NULL,
            'exchangeRate' => 1,
            'tcrId' => 263,
            'notes' => NULL,
            'clientCardCode' => NULL,
            'customer' => NULL,
            'subsequentDeliveryType' => NULL,
            'printInvoice' => true,
            'invoiceProducts' => [],
            'invoiceFees' => [],
            'invoicePayments' => [],
            'clientApplication' => 0,
            'isEinvoice' => false,
            'valuesAreInForeignCurrency' => false,
          ];

          $parameters = array_extend($defaults, $parameters);



        /**
         * 
         * Payload example:
         * {
            "id": 0,
            "invoiceType": 0,
            "warehouseId": null,
            "selfIssuingType": null,
            "isSimplifiedInvoice": false,
            "tcrCode": "wi923ef455",
            "markUpAmount": 0,
            "goodsExport": 0,
            "isReverseCharge": false,
            "isSelfIssuingAffectWareHouse": false,
            "isBadDebt": false,
            "payDeadline": null,
            "badDebtIICReference": null,
            "supplyDateOrPeriodStart": null,
            "supplyDateOrPeriodEnd": null,
            "currencyCode": null,
            "exchangeRate": 1,
            "tcrId": 263,
            "notes": null,
            "clientCardCode": null,
            "customer": null,
            "subsequentDeliveryType": null,
            "printInvoice": true,
            "invoiceProducts": [
                {
                    "name": "Amaro Montenegro 0.03 Lx30 PZ",
                    "barcode": "Amaro Montenegro 0.03 Lx30 PZ",
                    "unitPrice": 50,
                    "quantity": 1,
                    "rebatePrice": 0,
                    "isRebateReducingBasePrice": true,
                    "unit": "vlere monetare",
                    "vatRate": 20,
                    "invoiceId": 0,
                    "productId": 32160,
                    "isInvestment": false,
                    "expirationDate": null
                }
            ],
            "invoiceFees": [],
            "invoicePayments": [],
            "clientApplication": 0,
            "isEinvoice": false,
            "valuesAreInForeignCurrency": false
        }
         */

        /**
         * Example:
         * {
            "id": 9600,
            "invoiceType": 0,
            "dateTimeCreated": "2021-10-26T12:15:07.3980726+02:00",
            "sellerRegistrationName": "Rruga Stean Kaçulini",
            "sellerName": "NOE sh.p.k.",
            "sellerNuis": "L01511027P",
            "sellerAddress": "Tirane",
            "invoiceNumber": "81/2021/wi923ef455",
            "invoiceOrderNumber": 81,
            "tcrCode": "wi923ef455",
            "taxFreeAmount": 0,
            "markUpAmount": 0,
            "goodsExport": 0,
            "totalPriceWithoutVAT": 200,
            "totalVATAmount": 0,
            "totalPrice": 200,
            "operatorCode": "wk477lv989",
            "operatorName": "admin",
            "businessUnitCode": "ux640ut831",
            "softCode": "zn944ww414",
            "iic": "D086B1A4E89A84955F6EB0D258730EE6",
            "isEInvoice": false,
            "orderIICRef": [],
            "isSubsequentDelivery": false,
            "isReverseCharge": false,
            "valuesAreInForeignCurrency": false,
            "exchangeRate": 1,
            "tcrName": "Arka Test",
            "fiscNumber": "749c1353-1d2f-4460-8fa0-a99f6caa016f",
            "verificationUrl": "https://efiskalizimi-app-test.tatime.gov.al/invoice-check/#verify?iic=D086B1A4E89A84955F6EB0D258730EE6&tin=L01511027P&crtd=2021-10-26T12:15:07+02:00&ord=81&bu=ux640ut831&cr=wi923ef455&sw=zn944ww414&prc=200",
            "isCorrectiveInvoice": false,
            "isACorrectedInvoice": false,
            "warehouseId": 83,
            "isSentAsEInvoice": false,
            "clientApplication": 0,
            "sameTaxItems": [
                {
                    "description": "TVSH",
                    "vatRate": 0,
                    "totalBeforeVat": 200,
                    "totalVatAmount": 0,
                    "exemptedFromVat": false
                }
            ],
            "invoiceProducts": [
                {
                    "id": 13744,
                    "name": "Cigare",
                    "barcode": "123",
                    "quantity": 1,
                    "rebatePrice": 0,
                    "isRebateReducingBasePrice": true,
                    "unitPrice": 200,
                    "unit": "cope",
                    "vatRate": 0,
                    "priceAfterVAT": 200,
                    "priceBeforeVAT": 200,
                    "vatAmount": 0,
                    "invoiceId": 9600,
                    "productId": 32053,
                    "isInvestment": false,
                    "totalPriceBeforeVAT": 200,
                    "totalPriceAfterVAT": 200,
                    "total": 0
                }
            ],
            "invoicePayments": [
                {
                    "id": 9428,
                    "invoiceId": 9600,
                    "paymentMethodType": 0,
                    "amount": 200,
                    "voucher": []
                }
            ],
            "invoiceFees": [],
            "totalDiscount": 0,
            "isSelfIssuingAffectWareHouse": false,
            "transporterIdType": 0
        }
         */

        //first we have to check if tcr_code is declared 
      
        if (!DevPos::tcr()->isBalanceDeclared()) {

            throw new Exception('You have to declare first the tcr!');
        }


        //get taxpayer
        $taxPayer = DevPos::taxPayer()->get();

        //add businessUnitCode
        $parameters['businessUnitCode'] = $taxPayer['businessUnitCode'];

        //add tcr_code
        $parameters['tcrCode'] = session()->get('tcr.fiscalizationNumber');
        $parameters['tcrId'] = session()->get('tcr.id');
        


        //do some validations
        $validation = Validator::make($parameters, [

            'invoiceType' => 'required|boolean', //in:cash,non cash
            'isEInvoice' => 'nullable|boolean', //in:electronik or not

            'selfIssuingType' => 'nullable|in:0,1,2,3', //['Marrëveshja e mëparshme mes palëve', 'Purchase from area farmers', 'Purchases from services abroad', 'Other']
            'isSimplifiedInvoice' => 'nullable|boolean', //
            
            'tcrCode' => 'required|string|max:50', //ab750tb427
            'tcrId' => 'required|numeric', //ab750tb427
            'businessUnitCode' => 'required|string|max:50', 
            'operatorCode' => 'nullable|string|max:50', //emri i userit te sistemit, psh: vq961go132

            'markUpAmount' => 'nullable|numeric',
            'goodsExport' => 'nullable|numeric',
            'isReverseCharge' => 'required|boolean',
            'isBadDebt' => 'nullable|boolean',
            'badDebtIICReference' => 'nullable|boolean', //IIC e faturës që do të përcaktohet si borxh i keq
            'payDeadline' => 'nullable|date', 
            'supplyDateOrPeriodStart' => 'nullable|date', 
            'supplyDateOrPeriodEnd' => 'nullable|date', 
            'sellerAddress' => 'nullable|string|max:400', 
            'sellerTown' => 'nullable|string|max:100', 
            'currencyCode' => 'nullable|string|max:3', 
            'exchangeRate' => 'nullable|numeric', 
            'orderIICRef' => 'nullable|list:string', 
            'notes' => 'nullable|string|max:100', 

            'customer' => 'required_with:isEInvoice,selfIssuingType|array', 
                'customer.idNumber' => 'required_with:customer|string|max:20',
                'customer.idType' => 'required_with:customer|numeric', //['NIPT', 'Kartë identiteti', 'Numri i pasaportës', 'Numri i TVSH', 'Numri i Tatimit', 'Numri i sigurimeve shoqërore']
                'customer.name' => 'required_with:customer|string|max:200',
                'customer.address' => 'required_with:customer|string|max:400',
                'customer.town' => 'required_with:customer|string|max:200',
                
            'subsequentDeliveryType' => 'in:0,1,2,3', //['Mungesë interneti', 'Arka është jashtë funksionit', 'Probleme me shërbimin e fiskalizimit', 'Probleme teknike në arkë']

            'invoiceProducts' => 'required|array',
                'invoiceProducts.*.name' => 'required|string|max:100',
                'invoiceProducts.*.barcode' => 'nullable|string|max:100',
                'invoiceProducts.*.unitPrice' => 'required|string|max:100',
                'invoiceProducts.*.quantity' => 'required|numeric',
                'invoiceProducts.*.rebatePrice' => 'nullable|numeric',
                'invoiceProducts.*.isRebateReducingBasePrice' => 'nullable|boolean',
                'invoiceProducts.*.unit' => 'required|string|max:50',
                'invoiceProducts.*.vatRate' => 'nullable|numeric',
                'invoiceProducts.*.isInvestment' => 'nullable|boolean',
                'invoiceProducts.*.exemptFromVatType' => 'nullable|numeric',

            'invoiceFees' => 'array',
                'invoiceFees.*.feeType' => 'required_with:invoiceFees',
                'invoiceFees.*.amount' => 'required_with:invoiceFees|numeric',

            'invoicePayments' => 'nullable|array',
                'invoicePayments.paymentMethodType' => 'required_with:invoicePayments|string|max:100',
                'invoicePayments.amount' => 'required_with:invoicePayments|string|max:100',
                'invoicePayments.companyCard' => 'required_with:invoicePayments|string|max:100',
                'invoicePayments.Voucher' => 'required_with:invoicePayments|max:100',
                'invoicePayments.accountDetails' => 'array',
                    'invoicePayments.accountDetails.bankName' => 'required_with:invoicePayments.accountDetails|string|max:100',
                    'invoicePayments.accountDetails.bankCity' => 'required_with:invoicePayments.accountDetails|string|max:100',
                    'invoicePayments.accountDetails.accountNumber' => 'required_with:invoicePayments.accountDetails|string|max:100',
                    'invoicePayments.accountDetails.bankSwift' => 'required_with:invoicePayments.accountDetails|string|max:100',
                    'invoicePayments.accountDetails.bankAddress' => 'required_with:invoicePayments.accountDetails|string|max:100',

            'proces' => 'nullable|string|max:100',

            'documentType' => 'nullable|string|max:100',
            'attachments' => 'nullable|array',
                'attachments.*.file' => 'required_with:attachments|string:65532',
                'attachments.*.name' => 'required_with:attachments|string:100',
                
        ]);

        if($validation->fails()) {


            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast columns
        $parameters['invoiceType'] = (int)$parameters['invoiceType'];
        $parameters['isBadDebt'] = boolval($parameters['isBadDebt']) ?? 0;
        $parameters['isEinvoice'] = boolval($parameters['isEinvoice'] ?? 0);
        
        $parameters['isReverseCharge'] = boolval($parameters['isReverseCharge'] ?? 0);
        $parameters['isSelfIssuingAffectWareHouse'] = boolval($parameters['isSelfIssuingAffectWareHouse'] ?? 0);
        $parameters['isSimplifiedInvoice'] = boolval($parameters['isSimplifiedInvoice'] ?? 0);
        $parameters['selfIssuing'] = (int)$parameters['selfIssuing'];
        $parameters['valuesAreInForeignCurrency'] = boolval($parameters['valuesAreInForeignCurrency'] ?? 0);

        //customer
        if (empty($parameters['customer']['idNumber']) && empty($parameters['customer']['name']))
            unset($parameters['customer']);
        elseif (!empty($parameters['customer'])) {

            $parameters['customer']['idType'] = (int)$parameters['customer']['idType'];
        }

        foreach($parameters['invoiceProducts'] as $ind => $product) {

            $parameters['invoiceProducts'][$ind]['isRebateReducingBasePrice'] = boolval($product['isRebateReducingBasePrice'] ?? 0);
            $parameters['invoiceProducts'][$ind]['vatRate'] = 0;

            unset($parameters['invoiceProducts'][$ind]['productId']);
        }


        //print_r($parameters);

        return $this->post($path, $parameters);
    }

    public function show($id) {

        return $this->httpGet('/api/v3/Invoice/'. $id);
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

        return $this->put('/api/v3/Invoice/'. $id, $parameters);
    }

    //delete pos on devpos
    public function destroy($id) {

        return $this->delete('/api/v3/Invoice/'. $id);
    }


    public function cancel($iic) {

        //do some validations
        $validation = Validator::make(['iic' => $iic], [

            'iic' => 'required|string|min:3|max:60', 
        ]);

        if($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->put('/api/v3/Invoice/CancelInvoice?IIC='. $iic, []);
    }

    public function resendeinvoice($iic) {

        //do some validations
        $validation = Validator::make(['iic' => $iic], [

            'iic' => 'required|string|min:3|max:60', 
        ]);

        if($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        return $this->put('/api/v3/Invoice/resendeinvoice/'. $iic, []);
    }

    //list unfiscalized invoices
    public function unfiscalized() {

        return $this->httpGet('/api/v3/invoice/unficalized');
    }


    //when correct an invoice , we must post on this method
    public function correct($parameters = []) {

        return $this->create($parameters, '/api/v3/Invoice/CorrectInvoice');
        //return $this->post('/api/v3/Invoice/CorrectInvoice', $parameters);
    }

    //if download is true it will download it otherwise it will return its content
    public function export($params = [], $download = true) {

        $queryString = http_build_query($params);
        $path = '/api/v3/Invoice/export'. (!empty($queryString) ? '?'. $queryString:'');
        //echo $this->download($path);


        if ($download) {

            $file = $this->download($path);
            $headers = [
                'Content-Disposition' => 'attachment; filename=invoices.csv;'
            ];

            return response()->stream(function () use ($file)  { 
                echo $file;
            }, 200, $headers);

            // return response()->streamDownload(function () {

            //     echo $this->download($path);
            // }, 'invoices.csv');
        }
        else {

            return file_get_contents($path);
        }
    }

    //if download is true it will download it otherwise it will return its content
    public function exportUnfiscalized($download = true) {

        $path = '/api/v3/Invoice/GetZipFile?';

        $file = $this->download($path);
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=invoices.csv',
        ];

        return response()->stream(function () use ($file)  { 

        echo trim($file);
        }, 200, $headers);
        
    }

}