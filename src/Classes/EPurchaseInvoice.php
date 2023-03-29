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

class EPurchaseInvoice extends Model {


    public function __construct() {

        parent::__construct();

        $this->setCache(false);
        $this->bypassCache();
        
    }

    //list all tcr saved on devpos
    public function get() {
        
        $path = '/api/v3/EInvoice/GetPurchaseInvoice';
       
        $query = http_build_query(request()->all());
       
        $query = !empty($query) ? '?'. $query:$query;

        return $this->httpGet($path . $query);
    
    }

    public function create($parameters = []) {

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

        //get taxpayer
        $taxPayer = DevPos::taxPayer()->list();

        //add businessUnitCode
        $parameters['businessUnitCode'] = $taxPayer['businessUnitCode'];

        //add tcr_code
        $parameters['tcrCode'] = session()->httpGet('tcr.fiscalizationNumber');
        $parameters['tcrId'] = session()->httpGet('tcr.id');

        //isEInvoice is required, so we put it manually
        $parameters['isEInvoice'] = boolval($parameters['isEInvoice'] ?? 1);
        $parameters['invoiceType'] = 1;
        $parameters['isReverseCharge'] = false;

        //do some validations
        $validation = Validator::make($parameters, [

            'invoiceType' => 'required|boolean', //in:cash,non cash
            'isEInvoice' => 'required|boolean', //in:electronic or not

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

            'invoiceFees' => 'nullable|array',
                'invoiceFees.*.feeType' => 'required_with:invoiceFees',
                'invoiceFees.*.amount' => 'required_with:invoiceFees|numeric',

            'invoicePayments' => 'nullable|array',
                'invoicePayments.*.accountId' => 'nullable|numeric',
                'invoicePayments.*.paymentMethodType' => 'required_with:invoicePayments|string|max:100',
                'invoicePayments.*.amount' => 'required_with:invoicePayments|string|max:100',
                'invoicePayments.*.companyCard' => 'nullable|string|max:100',
                'invoicePayments.*.Voucher' => 'nullable|max:100',
                'invoicePayments.*.accountDetails' => 'array',
                    'invoicePayments.*.accountDetails.bankName' => 'required_with:invoicePayments.*.accountDetails|string|max:100',
                    'invoicePayments.*.accountDetails.bankCity' => 'required_with:invoicePayments.*.accountDetails|string|max:100',
                    'invoicePayments.*.accountDetails.accountNumber' => 'required_with:invoicePayments.*.accountDetails|string|max:100',
                    'invoicePayments.*.accountDetails.bankSwift' => 'required_with:invoicePayments.*.accountDetails|string|max:100',
                    'invoicePayments.*.accountDetails.bankAddress' => 'required_with:invoicePayments.*.accountDetails|string|max:100',

            'proces' => 'nullable|string|max:100',

            'documentType' => 'nullable|string|max:100',
            'attachments' => 'nullable|array',
                'attachments.*.file' => 'required_with:attachments|string:65532',
                'attachments.*.name' => 'required_with:attachments|string:100',

            'eInvoiceDetails' => 'array',
                'eInvoiceDetails.paymentMeans' => 'nullable|string|max:100',
                'eInvoiceDetails.paymentTerms' => 'nullable|string|max:100',
                'eInvoiceDetails.buyerReference' => 'nullable|string|max:100',
                'eInvoiceDetails.buyerAccountReference' => 'nullable|string|max:100',
                'eInvoiceDetails.projectReference' => 'nullable|string|max:100',
                'eInvoiceDetails.contractReference' => 'nullable|string|max:100',
                'eInvoiceDetails.purchaseOrderReference' => 'nullable|string|max:100',
                'eInvoiceDetails.saleOrderReference' => 'nullable|string|max:100',
                'eInvoiceDetails.receivingAdviceReference' => 'nullable|string|max:100',
                'eInvoiceDetails.despatchAdviceReference' => 'nullable|string|max:100',
                'eInvoiceDetails.tenderOrLotReference' => 'nullable|string|max:100',
                'eInvoiceDetails.invoicedObjectReference' => 'nullable|string|max:100',
                'eInvoiceDetails.deliveryTransporterName' => 'nullable|string|max:100',
                'eInvoiceDetails.deliveryAddress' => 'nullable|string|max:100',
                'eInvoiceDetails.deliveryTown' => 'nullable|string|max:100',
                'eInvoiceDetails.deliveryCountryCode' => 'nullable|string|max:100',
                'eInvoiceDetails.country' => 'nullable|string|max:100',
                'eInvoiceDetails.customerContactPoint' => 'nullable|string|max:100',
                'eInvoiceDetails.customerPhone' => 'nullable|string|max:100',
                'eInvoiceDetails.customerMail' => 'nullable|string|max:100',
                'eInvoiceDetails.sellerContactPoint' => 'nullable|string|max:100',
                'eInvoiceDetails.sellerPhone' => 'nullable|string|max:100',
                'eInvoiceDetails.sellerMail' => 'nullable|string|max:100',
                'eInvoiceDetails.deliveryDate' => 'nullable|date'
                
        ]);

       // print_r($parameters);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);
        }

        //cast columns
        $parameters['isBadDebt'] = boolval($parameters['isBadDebt']) ?? 0;
        
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

        //invoicePayments
        foreach($parameters['invoicePayments'] as $ind => $payment) {

            $parameters['invoicePayments'][$ind]['paymentMethodType'] = (int)$payment['paymentMethodType'];
            $parameters['invoicePayments'][$ind]['amount'] = (float)$payment['amount'];
        }

        return $this->post('/api/v3/Invoice', $parameters);
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

        //return $this->delete('/api/v3/Invoice/'. $id);
    }

}