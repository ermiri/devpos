<?php

namespace ErmirShehaj\DevPos;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

use Illuminate\Http\Request;

use ErmirShehaj\DevPos\Classes\TCR;
use ErmirShehaj\DevPos\Classes\POS;
use ErmirShehaj\DevPos\Classes\Supplier;

class DevPos {

    protected $tokenEndPoint;

    protected $tenant;
    protected $authorization;

    protected $username;
    protected $password;
    protected $grant_type;
    
    protected $token;

    public function __construct() {

        //set token endpoint
        $this->setTokenEndPoint(config('devpos.tokenEndPoint'));

        $this->setTenant(config('devpos.tenant'));
        $this->setAuthorization(config('devpos.authorization'));

        $this->setUsername(config('devpos.username'));
        $this->setPassword(config('devpos.password'));
        $this->setGrantType(config('devpos.grant_type'));
        
    }

    public function setEndPoint($url) {

        $this->endPoint = $url;
        return $this;
    }
    public function getEndPoint() {

        return $this->endPoint;
    }

    public function setEndPointBase($url) {

        $this->endPointBase = $url;
        return $this;
    }
    public function getEndPointBase($relativePath = null) {

        return $this->endPointBase . $relativePath;
    }

    public function setTokenEndPoint($url) {

        $this->tokenEndPoint = $url;
        return $this;
    }
    public function getTokenEndPoint() {

        return $this->tokenEndPoint;
    }

    public function setUsername($username) {

        $this->username = $username;
        return $this;
    }
    public function getUsername() {

        return $this->username;
    }

    public function setPassword($password) {

        $this->password = $password;
        return $this;
    }
    public function getPassword() {

        return $this->password;
    }

    public function setGrantType($grant_type) {

        $this->grant_type = $grant_type;
        return $this;
    }
    public function getGrantType() {

        return $this->grant_type;
    }

    public function setTenant($tenant) {

        $this->tenant = $tenant;
        return $this;
    }
    public function getTenant() {

        return $this->tenant;
    }

    public function setAuthorization($authorization) {

        $this->authorization = $authorization;
        return $this;
    }
    public function getAuthorization() {

        return $this->authorization;
    }

    public function setToken($token) {

        $this->token = $token;

        return $this;
    }
    public function getToken() {

        return $this->token;
    }


    /**
     * Authentications methods
     */

    protected static function fetchAccessTokenFromSettings() {

        /**
         * To login we have to send credentials to take the token
         * So we have to query db settings for devpos settings
         */

        $settings = Setting::select('name', 'value')->where('category', 'devpos')->get()->toArray()->pluck('value', 'name');

        //do some validations
        $validation = Validator::make($settings, [

            'dev_pos_tenant' => 'required',
            'dev_pos_authorization' => 'required',

            'dev_pos_username' => 'required',
            'dev_pos_password' => 'required',
            'dev_pos_grant_type' => 'required',
        ]);

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }

        //create the object
        return (new static)->setTenant($settings['dev_pos_tenant'])
            ->setAuthorization($settings['dev_pos_authorization'])
            ->setUsername($settings['dev_pos_username'])
            ->setPassword($settings['dev_pos_password'])
            ->setGrantType($settings['dev_pos_grant_type'])
                ->getToken();

        // //continue
        // return $this->getToken();
    }

    public function useApplicationDefaultCredentials() {

        /**
         * We will load credentials(username, password, tenant, ...) from database.settings
         */

        $settings = Setting::select('name', 'value')->where('category', 'devpos')->get()->pluck('value', 'name')->toArray();

        //do some validations
        $validation = Validator::make($settings, [

            'dev_pos_tenant' => 'required',
            'dev_pos_authorization' => 'required',

            'dev_pos_username' => 'required',
            'dev_pos_password' => 'required',
            'dev_pos_grant_type' => 'required',
        ]);

        if ($validation->fails()) {

            throw new \Illuminate\Validation\ValidationException($validation);

            // return [

            //     'Status' => 'error',
            //     'Errors' => $validation->errors()
            // ];
        }

        //create the object
        return $this->setTenant($settings['dev_pos_tenant'])
            ->setAuthorization($settings['dev_pos_authorization'])
            ->setUsername($settings['dev_pos_username'])
            ->setPassword($settings['dev_pos_password'])
            ->setGrantType($settings['dev_pos_grant_type']);

    }


    //controller class has an authorize method with $ability and $arguments arguments, so we have to keep them in order to override it.
    public function authorize() {

        /**
         * Authorize is the method when we try to get the token after sending credentials
         * It will generate a response containing the token
         */

        //if credentials details are not loaded, then we have to load them from DevPos::useApplicationDefaultCredentials();
        if (empty($this->getTenant()) || empty($this->getAuthorization()) || empty($this->getUsername()) || empty($this->getPassword()) || empty($this->getGrantType())) {

            //$res = $this->useApplicationDefaultCredentials();
           
        }
        
        $response = Http::asForm()->withHeaders([

                    'tenant' => $this->getTenant(),
                    'authorization' => $this->getAuthorization()
                ])->post($this->getTokenEndPoint(), [

                    'username' => $this->getUsername(),
                    'password' => $this->getPassword(),
                    'grant_type' => $this->getGrantType()
                ]
            )->throw(function ($response, $e) {
                
                return [

                    'Status' => 'error',
                    'Authorize' => 'Impossible to authorize!',
                    'Msg' => $e->getMessage(),
                    'Response' => $response
                ];
                
            })->json();

        // {
        //     "access_token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IkVGODYzRjNENTg3QzI1NTE4Rjg5NTdDNzZBOTFCNjRFNzBGMkFCRjFSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6Ijc0WV9QVmg4SlZHUGlWZkhhcEcyVG5EeXFfRSJ9.eyJuYmYiOjE2MzQ2NzYwNTUsImV4cCI6MTYzNDcwNDg1NSwiaXNzIjoiaHR0cHM6Ly9kZW1vLmRldnBvcy5hbCIsImF1ZCI6ImZpc2thbGl6aW1pX2FwaSIsImNsaWVudF9pZCI6ImZpc2thbGl6aW1pX3NwYSIsInN1YiI6IjE4ZjQ2MjdkLTg0Y2QtNDNkMi1iY2UzLWQyMjQyYjU5YWNmNiIsImF1dGhfdGltZSI6MTYzNDY3NjA1NSwiaWRwIjoibG9jYWwiLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsInBlcm1pc3Npb24iOlsiZGlzY291bnQubWFuYWdlIiwiZXhjaGFuZ2VSYXRlLm1hbmFnZSIsImludm9pY2UubWFuYWdlIiwiYWNjb3VudHMudmlldyIsImJhbmsubWFuYWdlIiwiY2xpZW50cy5tYW5hZ2UiLCJjb25maWd1cmF0aW9uLm1hbmFnZSIsInBvcy5tYW5hZ2UiLCJwcm9kdWN0Y2F0ZWdvcnkubWFuYWdlIiwicm9sZXMuYXNzaWduIiwicm9sZXMubWFuYWdlIiwic2FsZXNhZ2VudC5tYW5hZ2UiLCJzdXBwbGllci5tYW5hZ2UiLCJ0Y3IubWFuYWdlIiwidGNyQmFsYW5jZS5tYW5hZ2UiLCJ0cmFuc2Zlci5tYW5hZ2UiLCJ0cmFuc3BvcnRlci5tYW5hZ2UiLCJ0cmFuc3BvcnRlci52aWV3IiwidW5pdHMubWFuYWdlIiwidXNlcnMubWFuYWdlIiwidXNlcnMudmlldyIsInZlaGljbGVzLm1hbmFnZSIsInZvdWNoZXIubWFuYWdlIiwid2FyZWhvdXNlY29zdHMubWFuYWdlIiwid2FyZWhvdXNlcy5tYW5hZ2UiLCJ3YXJlaG91c2VzLnZpZXciLCJ3dG4ubWFuYWdlIiwiY2hhbmdlcHJpY2UuYWxsb3ciLCJpbnZlbnRvcmllcy5saXN0IiwiZGFzaGJvYXJkLm1hbmFnZSIsImRyaXZlcnMubWFuYWdlIiwiZ3JvdXBzLm1hbmFnZSIsImludmVudG9yeS5tYW5hZ2UiLCJpbnZlbnRvcnkudmlldyIsImFjY291bnRzLm1hbmFnZSIsImFsbEludm9pY2VzLm1hbmFnZSIsImJ1c2luZXNEZXRhaWxzLm1hbmFnZSIsImNsaWVudGNhcmQubWFuYWdlIiwiY2xpZW50cy52aWV3IiwiY3VycmVuY3kubWFuYWdlIiwicHJvZHVjdC5tYW5hZ2UiLCJwcm9kdWN0LnZpZXciLCJyb2xlcy52aWV3IiwiYmFydGFibGVzLm1hbmFnZSIsImJhcnRhYmxlcy5saXN0IiwiY2hhcmdlc2hlZXQubWFuYWdlIiwidGNyLnZpZXciLCJhbGxJbnZvaWNlcy52aWV3IiwiZWludm9pY2UubWFuYWdlIl0sIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiaW5mb0B0ZXN0LmFsIiwiVGF4UGF5ZXJUeXBlIjoiMCIsImZ1bGxuYW1lIjoiYWRtaW4iLCJjb25maWd1cmF0aW9uIjoiIiwib3BlcmF0b3JDb2RlIjoid2s0Nzdsdjk4OSIsIl9fdGVuYW50X18iOiJBMDAwMDAwMDBCIiwianRpIjoiMjY5QkZGMEU1RjBFNzBDNkFGM0REREVDOEY2RDRGMTQiLCJpYXQiOjE2MzQ2NzYwNTUsInNjb3BlIjpbImVtYWlsIiwiZmlza2FsaXppbWlfYXBpIiwib3BlbmlkIiwicGhvbmUiLCJwcm9maWxlIiwicm9sZXMiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.i-eK0G1UqnEZzU6UK3Cp0JLnWbmdZrkeSW6svq5YIuLXzs5oDElNKaDonf1CdDwM2LULMvmtbtAlM018y77CufGPKouYmY-cB4kOZ01PfJAoUJK161YJkDO6iIE1EgiPGakn8QKB35vqHPYMfL703MXPS9oRDIEO88W6bauG2yZi1LVU0r1vOYamj9Pd-T9-0jyw5Wo1pPoQVh5aP_BPqblaRIpRz9_Yipg5p1eDNZSkKfvA8DEOh0oedIADEPNw4mQBJ4uVE3fifpAAoi7uR3x_CR4iI4xCJdx55FlNAj9YjtrZouYij9fdGChTUAktUGFW9-iek9qO_589T2uVzA",
        //     "expires_in":28800,
        //     "token_type":"Bearer",
        //     "refresh_token":"0DC6D89AE80C70858B1F3DD26F6DE3DD786F08D1A049182AF28D2E81C49DFDC7",
        //     "scope":"email fiskalizimi_api offline_access openid phone profile roles"
        // }



        //save the token to the object and to the cache
        $this->setToken($response['access_token']);

        Cache::put('devpos.access_token', $response['access_token'], (int)$response['expires_in']);
        
        return $response;
    }

    public function isConnectedToServer() {

        $res = $this->get('/api/v3/Utilities/IsConnectedToServer');
        return $res['isConnected'];
    }


    /**
     * Here are the models we can run get/post/put/destroy
     */

    public function invoice() {

        return new \ErmirShehaj\DevPos\Classes\Invoice();
    }
    public function einvoice() {

        return new \ErmirShehaj\DevPos\Classes\EInvoice();
    }
    public function accompanyingInvoice() {

        return new \ErmirShehaj\DevPos\Classes\AccompanyingInvoice();
    }


    public function product() {

        return new \ErmirShehaj\DevPos\Classes\Product();
    }
    public function productCategory() {

        return new \ErmirShehaj\DevPos\Classes\ProductCategory();
    }
    public function unit() {

        return new \ErmirShehaj\DevPos\Classes\Unit();
    }
    public function productGroup() {

        return new \ErmirShehaj\DevPos\Classes\ProductGroup();
    }


    public function customer() {

        return new \ErmirShehaj\DevPos\Classes\Customer();
    }
    public function clientCard() {

        return new \ErmirShehaj\DevPos\Classes\ClientCard();
    }


    public function user() {

        return new \ErmirShehaj\DevPos\Classes\User();
    }
    public function role() {

        return new \ErmirShehaj\DevPos\Classes\Role();
    }

    //create tcr object
    public function tcr() {

        return new \ErmirShehaj\DevPos\Classes\TCR();
    }
    public function tcrBalance() {

        return new \ErmirShehaj\DevPos\Classes\TCRBalance();
    }

    //create pos object
    public function pos() {

        return new POS();
    }

    //create operatore object
    public function account() {

        return new \ErmirShehaj\DevPos\Classes\Account();
    }
    public function branche() {

        return new \ErmirShehaj\DevPos\Classes\Branche();
    }
    public function supplier() {

        return new \ErmirShehaj\DevPos\Classes\Supplier();
    }
    public function supplierList() {

        return new \ErmirShehaj\DevPos\Classes\SupplierList();
    }
    public function transporter() {

        return new \ErmirShehaj\DevPos\Classes\Transporter();
    }
    public function carrier() {

        return new \ErmirShehaj\DevPos\Classes\Carrier();
    }
    public function vehicle() {

        return new \ErmirShehaj\DevPos\Classes\Vehicle();
    }
    public function warehouse() {

        return new \ErmirShehaj\DevPos\Classes\WareHouse();
    }
    public function taxpayer() {

        return new \ErmirShehaj\DevPos\Classes\TaxPayer();
    }
    public function currency() {

        return new \ErmirShehaj\DevPos\Classes\Currency();
    }
    public function enum() {

        return new \ErmirShehaj\DevPos\Classes\Enum();
    }

    //create operatore object
    public function operatore() {

        return new Operatore();
    }

}