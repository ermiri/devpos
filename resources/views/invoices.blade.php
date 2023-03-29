@extends('layouts.keen.template')

@section('subheader-buttons')

    <div class="k-subheader__toolbar">
        <div class="k-subheader__wrapper">

            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="{{ __('Edit') }}" data-placement="top" onClick="DevPos.Invoice.create();">
                <i class="fa fa-plus"></i> <span class="d-none d-md-inline"> {{ __('Invoice') }}</span>
            </a>
            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="{{ __('Export') }}" data-placement="top" onClick="DevPos.Invoice.export();">
                <i class="fa fa-download"></i> <span class="d-none d-md-inline"> {{ __('Export') }}</span>
            </a>
            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="{{ __('Export') }}" data-placement="top" onClick="DevPos.Invoice.exportSalesBook();">
                <i class="fa fa-download"></i> <span class="d-none d-md-inline"> {{ __('Export Sales Book') }}</span>
            </a>
            
        </div>
    </div>

@endsection


@section('content')

    <!-- begin:: Content -->
    <div class="k-content  k-grid__item k-grid__item--fluid" id="k_content">

        <div class="row">

            <!-- start:: Sidebar -->	
            <div class="col-md-12 float-left">
                                    
                <!-- start:: Filter -->	
                <div class="w-100 float-left">
                    <div class="k-portlet k-portlet--mobile" id="quickSearchPortlet">
                        <div class="k-portlet__head k-portlet__head--lg">
                            <div class="k-portlet__head-label">
                                <h3 class="k-portlet__head-title">
                                {{ __('Filter') }}
                                </h3>
                                
                            </div>
                        </div>

                        <div class="k-portlet__body">
                            <div class="row" id="filterForm" data-filter-itemType="invoices">

                                <form name="main_filter" class="col-12" onsubmit="event.preventDefault();DevPos.Invoice.load();">

                                    <div class="form-group row mb-0">

                                        <div class="col-md-4 col-xl-2">
                                            <label class="">{{ __('Customer') }}</label>
                                            <select name="client" class="form-control">
                                                <option value=""></option>
                                                @foreach($customers as $customer)

                                                <option value="{{$customer['id']}}">{{ $customer['name'] }}</option>

                                                @endforeach
                                            </select>
                                        </div>

                                        <div class="col-md-6 col-xl-4">
                                            <label class="">{{ __('Created at') }}</label>
                                            
                                            <div class="input-daterange input-group" id="k_datepicker_5">
                                                <input type="text" class="form-control " name="startDate" autocomplete="off" value="{{date('Y-m-d')}}" placeholder="{{ __('Min date') }} ...">
                                                <div class="input-group-append">
                                                    <span class="input-group-text"><i class="la la-ellipsis-h"></i></span>
                                                </div>
                                                <input type="text" class="form-control" name="endDate" autocomplete="off" value="{{date('Y-m-d')}}" placeholder="{{ __('Max date') }} ...">
                                            </div>
                                            
                                        </div>
                                        <div class="col-md-4 col-xl-2">
                                            <label class="">{{ __('TCR') }}</label>
                                            <select name="tcrCode" class="form-control">
                                                <option value=""></option>
                                                @foreach($tcrs as $tcr)

                                                    <option value="{{$tcr['fiscalizationNumber']}}">{{ $tcr['name'] }}</option>

                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="col-md-4 col-xl-2">
                                            <label class="">{{ __('Payment Method') }}</label>
                                            <select name="PaymentMethodType" class="form-control">
                                                <option value=""></option>
                                                @foreach($paymentMethods as $method)

                                                    <option value="{{$method['id']}}">{{ $method['name'] }}</option>

                                                @endforeach
                                            </select>
                                        </div>
                                        
                                        <div class="col-md-4 col-xl-2 k-input-icon k-input-icon--left mt-4">
                                            <label class=""></label>
                                            <button type="submit" class="btn btn-primary btn-sm mt-2" name="name" value=""><i class="fa fa-filter"></i> {{ __('Filter') }}</button>
                                        </div>

                                    </div>
                                    

                                </form>
                            
                            </div>
                            <div class="row" id="quickSearch" data-filter-itemType="receptions">
                            
                            
                            
                            </div>
                        </div>
                    </div>
                </div>
                <!-- end:: Filter -->	
            
            </div>
            <!-- end:: Sidebar -->	

            <div class="col-md-10 float-left reportAndListing order-xs-2 order-md-1" id="reportAndListing" style="overflow-x: hidden;">
                <div class="k-portlet k-portlet--mobile">
                    <div class="k-portlet__head k-portlet__head--lg">
                        <div class="k-portlet__head-label">
                            <h3 class="k-portlet__head-title">
                            {{ __('Invoices') }}
                                <small></small>
                            </h3>
                        </div>
                    </div>
                    <div class="k-portlet__body k-portlet__body--fit">

                        <!--begin: Datatable -->
                        <div class="k_datatable" id="api_events"></div>
                        <!--end: Datatable -->
                    </div>
                </div>
            </div>

            <!-- start:: Sidebar -->	
            <div class="col-md-2 float-left order-xs-1 order-sm-1 order-md-2">
                                    
                <!-- start:: Filter -->	
                <div class="w-100 float-left">
                    <div class="k-portlet k-portlet--mobile" id="quickSearchPortlet">
                        <div class="k-portlet__head k-portlet__head--lg">
                            <div class="k-portlet__head-label">
                                <h3 class="k-portlet__head-title">
                                {{ __('Filter Results') }}
                                </h3>
                                
                            </div>
                        </div>

                        <div class="k-portlet__body">
                            <div class="row" id="filterForm" data-filter-itemType="tcrs">

                                <form name="filter" class="col-12" onsubmit="event.preventDefault();DevPos.Invoice.load();">

                                    <div class="form-group">
                                        <label class="">{{ __('Operator') }}</label>
                                        <input class="form-control" name="operatorName" type="text" placeholder="Search by operator">
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Customer Business Name') }}</label>
                                        <input class="form-control" name="customerBusinessName" type="text" placeholder="Search by business">
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Invoice Number') }}</label>
                                        <input class="form-control" name="invoiceNumber" type="text" placeholder="Search by invoice number">
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Invoice Type') }}</label>
                                        <select class="form-control" name="invoiceType">
                                            <option value=""></option>
                                            <option value="0">Cash</option>
                                            <option value="1">Non Cash</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Invoice Category') }}</label>
                                        <select class="form-control" name="invoiceCategory">
                                            <option value=""></option>
                                            <option value="Invoice">Invoice</option>
                                            <option value="EInvoice">EInvoice</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Invoice Status') }}</label>
                                        <select class="form-control" name="invoiceStatus">
                                            <option value=""></option>
                                            <option value="sended_to_state">Fiscalized</option>
                                            <option value="not_sended_to_state">Not sended to state</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Product') }}</label>
                                        <select class="form-control selectpicker" name="products" multiple data-live-search="true">
                                       
                                            @foreach($products as $product) 

                                                <option value="{{$product->title}}">{{$product->title}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Patient') }}</label>
                                        <input class="form-control" name="patient" type="text" placeholder="Search by patient">
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Invoice') }}</label>
                                        <input class="form-control" name="invoice_id" type="text" placeholder="Search by invoice">
                                    </div>
                                    <div class="form-group">
                                        <label class="">{{ __('Note') }}</label>
                                        <input class="form-control" name="note" type="text" placeholder="Search by note">
                                    </div>

                                    <div class="form-group">

                                        <label class="">{{ __('Total') }}</label>
                                        
                                        <div class="input-daterange input-group" id="k_datepicker_5">
                                            <input type="text" class="form-control " name="total_min" placeholder="{{ __('Min total') }} ...">
                                            <div class="input-group-append">
                                                <span class="input-group-text"><i class="la la-ellipsis-h"></i></span>
                                            </div>
                                            <input type="text" class="form-control" name="total_max" placeholder="{{ __('Max total') }} ...">
                                        </div>
                                        <span class="form-text text-muted">{{ __('Enter min and max date range') }}</span> 
                                        
                                    </div>
                                    <div class="k-input-icon k-input-icon--left">
                                        <input type="submit" class="btn btn-primary btn-sm w-100" name="name" value="{{ __('Filter') }}">
                                    </div>
                                    

                                </form>
                            
                            </div>
                            <div class="row" id="quickSearch" data-filter-itemType="receptions">
                            
                            
                            
                            </div>
                        </div>
                    </div>
                </div>
                <!-- end:: Filter -->	
            
            </div>
            <!-- end:: Sidebar -->	

        </div>
    </div>
    <!-- end:: Content -->	

@endsection

@section('js-local')

    <script src="{{asset('ermirshehaj/devpos/js/devpos.js')}}"></script>
    <script src="{{asset('ermirshehaj/devpos/js/templates.js')}}"></script>

    <script>

        //put all tcrs to cache
        //Cache.put('invoices', @php echo json_encode($items) @endphp);

        Cache.put('paymentMethods', @php echo json_encode($paymentMethods) @endphp);
        Cache.put('feeTypes', @php echo json_encode($feeTypes) @endphp);
        Cache.put('clientCardTypes', @php echo json_encode($clientCardTypes) @endphp);
        Cache.put('typesOfSelfIssuing', @php echo json_encode($typesOfSelfIssuing) @endphp);
        Cache.put('currencies', @php echo json_encode($currencies) @endphp);
        Cache.put('countries', @php echo json_encode($countries) @endphp);
        Cache.put('cities', @php echo json_encode($cities) @endphp);
        Cache.put('banks', @php echo json_encode($banks) @endphp);
        Cache.put('idTypes', @php echo json_encode($idTypes) @endphp);
        
        Cache.put('products', @php echo json_encode($products) @endphp);

        Cache.put('devpos_access_token', '{{Cache::get('devpos.access_token')}}' );

        let choosedTCR = '{{Session::get('tcr_code')}}';

        $(document).ready(function(){

            $('[name="startDate"]').datepicker({format: 'yyyy-mm-dd'});
            $('[name="endDate"]').datepicker({format: 'yyyy-mm-dd'});

            DevPos.Invoice.load();

        });

    </script>
@endsection