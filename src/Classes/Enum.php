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
 * Transporter - is the class that will contain all methods for tcr
 * Default we will cache list() methods results on 'tcr' key under 'devpos' prefix, but you can change it as:
 * DevPos::supplier()->setCacheKey('key')->list();
 */

class Enum extends Model {


    public function __construct() {

        parent::__construct();

        //we will cache everything from this class
        //$this->setCache(true);
    }

    //list all tcr saved on devpos
    public function get() {

        return [];
    }

    public function update($id, $parameters = []) {

    }
    public function create($parameters = []) {

    }
    public function destroy($id) {

    }

    public function getWareHouseType() {

        return $this->httpGet('/api/v3/Enum/GetWareHouseType');
    }

    public function getPaymentMethodTypes() {

        return $this->httpGet('/assets/json/paymentMethodType.json');
    }

    public function getPaymentMethodTypesEinvoice() {

        return $this->httpGet('/assets/json/paymentMethodTypeEinvoice.json');
    }

    public function getFeeTypes() {

        return $this->httpGet('/assets/json/feeTypes.json');
    }
    
    public function getBanks() {

        return $this->httpGet('/assets/json/banks.json');
    }
    public function getCenterType() {

        return $this->httpGet('/api/v3/Enum/GetCenterType');
    }
    
    public function getCurrencies() {

        return $this->httpGet('/assets/json/currencies.json');
    }
    
    public function getCities() {

        return $this->httpGet('/assets/json/cities.json');
    }
    public function getCountries() {

        return $this->httpGet('/assets/json/country.json');
    }
    
    public function getClientCardTypes() {

        return $this->httpGet('/assets/json/clientCardTypes.json');
    }
    
    public function getTypesOfSelfIssuing() {

        return $this->httpGet('/assets/json/typeOfSelfIssuing.json');
    }
    
    public function getIdTypes() {

        return $this->httpGet('/assets/json/idTypes.json');
    }
    public function getUnits() {

        return $this->httpGet('/assets/json/units.json');
    }

    public function getEInvoiceStatuses() {

        return ['Dërguar', 'Refuzuar', 'Pranuar', 'Paguar', 'Paguar Pjesërisht'];
    }

    public function getEInvoiceProcesses() {

        return [

            'P1' => 'Faturimi i dërgesave të mallrave dhe shërbimeve kundrejt porosive të blerjes, bazuar në një kontratë',
            'P2' => 'Faturimi i dërgesave të mallrave dhe shërbimeve bazuar në një kontratë',
            'P3' => 'Faturimi i dorëzimit të porosisë së blerjes së rastësishme',
            'P4' => 'Pagesa paraprake',
            'P5' => 'Pagesa në vend',
            'P6' => 'Pagesa para dorëzimit',
            'P7' => 'Faturat me referenca në shënimin e dërgimit',
            'P8' => 'Faturat me referenca në shënimin e dërgimit dhe shënimin e marrjes',
            'P9' => 'Notë kredie ose fatura me shuma negative, të lëshuara për një sërë arsyesh, përfshirë kthimin e paketimit
            bosh',
            'P10' => 'Faturimi korrigjues (anulimi / korrigjimi i një fature)',
            'P11' => 'Faturimi i pjesshëm dhe përfundimtar'
        ];
    }

    public function getEInvoiceDocumentTypes() {

        return [
            
            388 => 'Faturë tatimore',
            211 => 'Aplikimi i ndërmjetëm për pagesë',
            633 => 'Dokumentet e detyrimeve portuale',
            395 => 'Fatura e dërgesës',
            384 => 'Fatura e dërgesës',
            295 => 'Fatura e ndryshimit të çmimit',
            623 => 'Fatura e shpërndarësit',
            82 => 'Fatura e shërbimeve të matura',
            575 => 'Fatura e siguruesit',
            390 => 'Faturë Delcredere',
            935 => 'Faturë doganore',
            393 => 'Faturë e faktorizuar',
            385 => 'Faturë përmbledhëse',
            326 => 'Faturë e pjesshme',
            780 => 'Faturë mallrash',
            386 => 'Faturë parapagimi',
            325 => 'Faturë paraprake',
            387 => 'Faturë pune',
            394 => 'Faturë qiraje',
            380 => 'Faturë tregtare',
            389 => 'Faturë vetë-faturimi',
            130 => 'Fleta e të dhënave të faturimit',
            751 => 'Informacione fature për qëllime të kontabilitetit',
            383 => 'Notë debiti',
            527 => 'Notë debiti e vetë-faturuar',
            80 => 'Notë debiti të lidhura me mallrat ose shërbimet',
            84 => 'Notë debiti të lidhura me rregullimet financiare',
            308 => 'Notë kredie Delcredere',
            381 => 'Notë krediti',
            396 => 'Notë krediti e faktorizuar',
            261 => 'Notë krediti e vetë- faturuar',
            532 => 'Notë krediti i përcjellësve',
            81 => 'Notë krediti lidhur me mallra ose shërbime',
            83 => 'Notë krediti lidhur me rregullime financiare',
            420 => 'Notë krediti pagese për Leximin e Karakterit Optik (OCR)',
            296 => 'Notë krediti për ndryshim çmimi',
            262 => 'Notë krediti përmbledhëse - mallra dhe shërbime',
            457 => 'Shkëmbim debiti',
            458 => 'Shkëmbim krediti',
            204 => 'Vlerësimi i pagesës',
            202 => 'Vlerësimi i pagesës direkte',
            203 => 'Vlerësimi i pagesës së provigjonit'
        ];
    }

    public function getSubsequentDeliveryType() {

        return [

            0 => 'Mungesë interneti',
            1 => 'Arka është jashtë funksionit',
            2 => 'Probleme me shërbimin e fiskalizimit',
            3 => 'Probleme teknike në arkë',
        ];
    }

    public function getVehicleOwnershipTypes() {

        return [

            '0' => 'Owner',
            '1' => 'Third Party'
        ];
    }

    public function getInvoiceTypes() {

        return [

            '0' => 'Cash',
            '1' => 'Non Cash'
        ];
    }

    public function getTransactionTypes() {

        return [

            "0" => 'Shitje',
            "1" => 'Ekzaminim',
            "2" => 'Transferim',
            "3" => 'Shitje derë më derë'
        ];
    }

    public function getWtnTypes() {

        return [

            '0' => 'Faturë Shoqëruese pa ndryshuar pronësinë',
            '1' => 'Faturë shoqëruese me ndryshim pronësie'
        ];
    }

    public function getStartPoints() {

        return $this->httpGet('/assets/json/startPoint.json');
    }

    public function getDestinationPoints() {

        return $this->httpGet('/assets/json/destinationPoint.json');
    }


}