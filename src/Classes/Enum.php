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

        return ['D??rguar', 'Refuzuar', 'Pranuar', 'Paguar', 'Paguar Pjes??risht'];
    }

    public function getEInvoiceProcesses() {

        return [

            'P1' => 'Faturimi i d??rgesave t?? mallrave dhe sh??rbimeve kundrejt porosive t?? blerjes, bazuar n?? nj?? kontrat??',
            'P2' => 'Faturimi i d??rgesave t?? mallrave dhe sh??rbimeve bazuar n?? nj?? kontrat??',
            'P3' => 'Faturimi i dor??zimit t?? porosis?? s?? blerjes s?? rast??sishme',
            'P4' => 'Pagesa paraprake',
            'P5' => 'Pagesa n?? vend',
            'P6' => 'Pagesa para dor??zimit',
            'P7' => 'Faturat me referenca n?? sh??nimin e d??rgimit',
            'P8' => 'Faturat me referenca n?? sh??nimin e d??rgimit dhe sh??nimin e marrjes',
            'P9' => 'Not?? kredie ose fatura me shuma negative, t?? l??shuara p??r nj?? s??r?? arsyesh, p??rfshir?? kthimin e paketimit
            bosh',
            'P10' => 'Faturimi korrigjues (anulimi / korrigjimi i nj?? fature)',
            'P11' => 'Faturimi i pjessh??m dhe p??rfundimtar'
        ];
    }

    public function getEInvoiceDocumentTypes() {

        return [
            
            388 => 'Fatur?? tatimore',
            211 => 'Aplikimi i nd??rmjet??m p??r pages??',
            633 => 'Dokumentet e detyrimeve portuale',
            395 => 'Fatura e d??rges??s',
            384 => 'Fatura e d??rges??s',
            295 => 'Fatura e ndryshimit t?? ??mimit',
            623 => 'Fatura e shp??rndar??sit',
            82 => 'Fatura e sh??rbimeve t?? matura',
            575 => 'Fatura e siguruesit',
            390 => 'Fatur?? Delcredere',
            935 => 'Fatur?? doganore',
            393 => 'Fatur?? e faktorizuar',
            385 => 'Fatur?? p??rmbledh??se',
            326 => 'Fatur?? e pjesshme',
            780 => 'Fatur?? mallrash',
            386 => 'Fatur?? parapagimi',
            325 => 'Fatur?? paraprake',
            387 => 'Fatur?? pune',
            394 => 'Fatur?? qiraje',
            380 => 'Fatur?? tregtare',
            389 => 'Fatur?? vet??-faturimi',
            130 => 'Fleta e t?? dh??nave t?? faturimit',
            751 => 'Informacione fature p??r q??llime t?? kontabilitetit',
            383 => 'Not?? debiti',
            527 => 'Not?? debiti e vet??-faturuar',
            80 => 'Not?? debiti t?? lidhura me mallrat ose sh??rbimet',
            84 => 'Not?? debiti t?? lidhura me rregullimet financiare',
            308 => 'Not?? kredie Delcredere',
            381 => 'Not?? krediti',
            396 => 'Not?? krediti e faktorizuar',
            261 => 'Not?? krediti e vet??- faturuar',
            532 => 'Not?? krediti i p??rcjell??sve',
            81 => 'Not?? krediti lidhur me mallra ose sh??rbime',
            83 => 'Not?? krediti lidhur me rregullime financiare',
            420 => 'Not?? krediti pagese p??r Leximin e Karakterit Optik (OCR)',
            296 => 'Not?? krediti p??r ndryshim ??mimi',
            262 => 'Not?? krediti p??rmbledh??se - mallra dhe sh??rbime',
            457 => 'Shk??mbim debiti',
            458 => 'Shk??mbim krediti',
            204 => 'Vler??simi i pages??s',
            202 => 'Vler??simi i pages??s direkte',
            203 => 'Vler??simi i pages??s s?? provigjonit'
        ];
    }

    public function getSubsequentDeliveryType() {

        return [

            0 => 'Munges?? interneti',
            1 => 'Arka ??sht?? jasht?? funksionit',
            2 => 'Probleme me sh??rbimin e fiskalizimit',
            3 => 'Probleme teknike n?? ark??',
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
            "3" => 'Shitje der?? m?? der??'
        ];
    }

    public function getWtnTypes() {

        return [

            '0' => 'Fatur?? Shoq??ruese pa ndryshuar pron??sin??',
            '1' => 'Fatur?? shoq??ruese me ndryshim pron??sie'
        ];
    }

    public function getStartPoints() {

        return $this->httpGet('/assets/json/startPoint.json');
    }

    public function getDestinationPoints() {

        return $this->httpGet('/assets/json/destinationPoint.json');
    }


}