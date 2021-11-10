<?php

use Illuminate\Support\Facades\Route;
use ErmirShehaj\DevPos\Http\Controllers\POSController;
use ErmirShehaj\DevPos\Http\Controllers\SupplierController;
use ErmirShehaj\DevPos\Http\Controllers\SupplierListController;
use ErmirShehaj\DevPos\Facades\DevPos;

    /**
     * DevPos routes
     */

    Route::put('/invoices/{iic}/cancel', '\ErmirShehaj\DevPos\Http\Controllers\InvoiceController@cancel', ['as' => 'devpos']);
    Route::put('/invoices/{iic}/correct', '\ErmirShehaj\DevPos\Http\Controllers\InvoiceController@correct', ['as' => 'devpos']);
    Route::get('/invoices/export', '\ErmirShehaj\DevPos\Http\Controllers\InvoiceController@export', ['as' => 'devpos']);
    Route::resource('/invoices', \ErmirShehaj\DevPos\Http\Controllers\InvoiceController::class, ['as' => 'devpos']);
    Route::resource('/einvoices', \ErmirShehaj\DevPos\Http\Controllers\EInvoiceController::class, ['as' => 'devpos']);
    
    Route::get('/unfiscalized/export', '\ErmirShehaj\DevPos\Http\Controllers\UnfiscalizedController@export', ['as' => 'devpos']);
    Route::resource('/unfiscalized', \ErmirShehaj\DevPos\Http\Controllers\UnfiscalizedController::class, ['as' => 'devpos']);

    Route::resource('/accompanying-invoices', \ErmirShehaj\DevPos\Http\Controllers\AccompanyingInvoiceController::class, ['as' => 'devpos']);

    Route::resource('/products', \ErmirShehaj\DevPos\Http\Controllers\ProductController::class, ['as' => 'devpos']);
    Route::resource('/product-categories', \ErmirShehaj\DevPos\Http\Controllers\ProductCategoryController::class, ['as' => 'devpos']);
    Route::resource('/units', \ErmirShehaj\DevPos\Http\Controllers\UnitController::class, ['as' => 'devpos']);
    Route::resource('/product-groups', \ErmirShehaj\DevPos\Http\Controllers\ProductGroupController::class, ['as' => 'devpos']);

    Route::resource('/customers', \ErmirShehaj\DevPos\Http\Controllers\CustomerController::class, ['as' => 'devpos']);
    Route::resource('/client-cards', \ErmirShehaj\DevPos\Http\Controllers\ClientCardController::class, ['as' => 'devpos']);

    Route::resource('/users', \ErmirShehaj\DevPos\Http\Controllers\UserController::class, ['as' => 'devpos']);
    Route::resource('/roles', \ErmirShehaj\DevPos\Http\Controllers\RoleController::class, ['as' => 'devpos']);

    //Route::get('/tcrs/{tcr}/choose', [\ErmirShehaj\DevPos\Http\Controllers\TCRController::class, 'choose'], ['as' => 'devpos'])->name('tcrs.choose');
    Route::post('/tcrs/choose', [\ErmirShehaj\DevPos\Http\Controllers\TCRController::class, 'choose'], ['as' => 'devpos'])->name('tcrs.choose');
    Route::resource('/tcrs', \ErmirShehaj\DevPos\Http\Controllers\TCRController::class, ['as' => 'devpos']);

    Route::put('/tcr-balances/{balanceID}/fiscalize', '\ErmirShehaj\DevPos\Http\Controllers\TCRBalanceController@fiscalize')->name('devpos.tcr-balances.fiscalize');
    Route::get('/tcr-balances/unfiscalized', '\ErmirShehaj\DevPos\Http\Controllers\TCRBalanceController@unfiscalized')->name('devpos.tcr-balances.unfiscalized');
    Route::resource('/tcr-balances', \ErmirShehaj\DevPos\Http\Controllers\TCRBalanceController::class, ['as' => 'devpos']);

    Route::resource('/pos', POSController::class, ['as' => 'devpos']);
    Route::resource('/suppliers', SupplierController::class, ['as' => 'devpos']);
    Route::resource('/supplier-lists', \ErmirShehaj\DevPos\Http\Controllers\SupplierListController::class, ['as' => 'devpos']);
    Route::resource('/accounts', \ErmirShehaj\DevPos\Http\Controllers\AccountController::class, ['as' => 'devpos']);
    Route::resource('/branchs', \ErmirShehaj\DevPos\Http\Controllers\BranchController::class, ['as' => 'devpos']);
    Route::resource('/transporters', \ErmirShehaj\DevPos\Http\Controllers\TransporterController::class, ['as' => 'devpos']);
    Route::resource('/carriers', \ErmirShehaj\DevPos\Http\Controllers\CarrierController::class, ['as' => 'devpos']);
    Route::resource('/vehicles', \ErmirShehaj\DevPos\Http\Controllers\VehicleController::class, ['as' => 'devpos']);
    Route::resource('/warehouses', \ErmirShehaj\DevPos\Http\Controllers\WareHouseController::class, ['as' => 'devpos']);
    Route::resource('/currencies', \ErmirShehaj\DevPos\Http\Controllers\CurrencyController::class, ['as' => 'devpos']);
    Route::resource('/taxpayer', \ErmirShehaj\DevPos\Http\Controllers\TaxPayerController::class, ['as' => 'devpos']);

    Route::get('/test', function() {


        //text tcr
        return DevPos::supplier()->cache(false)->list();

        //test if access_token is saved to cache after authorized
        //return Cache::get('devpos.pos');
        //return Cache::forget('devpos.tcrtcr');

        //test if access_token is saved to cache after authorized
        //return Cache::get('devpos.access_token');

        //authorize
        //return DevPos::authorize();
    });
