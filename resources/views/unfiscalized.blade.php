@extends('layouts.keen.template')

@section('subheader-buttons')

    <div class="k-subheader__toolbar">
        <div class="k-subheader__wrapper">

            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="{{ __('Edit') }}" data-placement="top" onClick="DevPos.Invoice.create();">
                <i class="fa fa-plus"></i> <span class="d-none d-md-inline"> {{ __('Invoice') }}</span>
            </a>
            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="{{ __('Export') }}" data-placement="top" onClick="DevPos.Unfiscalized.export();">
                <i class="fa fa-download"></i> <span class="d-none d-md-inline"> {{ __('Export') }}</span>
            </a>
            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="{{ __('Import') }}" data-placement="top" onClick="DevPos.Invoice.create();">
                <i class="fa fa-upload"></i> <span class="d-none d-md-inline"> {{ __('Import') }}</span>
            </a>
            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="{{ __('Fiscalize') }}" data-placement="top" onClick="DevPos.Invoice.create();">
                <i class="fa fa-upload"></i> <span class="d-none d-md-inline"> {{ __('Fiscalize invoices') }}</span>
            </a>
            
        </div>
    </div>

@endsection


@section('content')

    <!-- begin:: Content -->
    <div class="k-content  k-grid__item k-grid__item--fluid" id="k_content">

        <div class="row">

            <div class="col-md-10 float-left reportAndListing order-xs-2 order-md-1" id="reportAndListing" style="overflow-x: hidden;">
                <div class="k-portlet k-portlet--mobile">
                    <div class="k-portlet__head k-portlet__head--lg">
                        <div class="k-portlet__head-label">
                            <h3 class="k-portlet__head-title">
                                {{ __('Unfiscalized Invoices') }}
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
                                    <div class="form-group">

                                        <label class="">{{ __('Created at') }}</label>
                                        
                                        <div class="input-daterange input-group" id="k_datepicker_5">
                                            <input type="text" class="form-control " name="created_min" placeholder="{{ __('Min date') }} ...">
                                            <div class="input-group-append">
                                                <span class="input-group-text"><i class="la la-ellipsis-h"></i></span>
                                            </div>
                                            <input type="text" class="form-control" name="created_max" placeholder="{{ __('Max date') }} ...">
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

        Cache.put('invoiceTypes', @php echo json_encode($invoiceTypes) @endphp);

        Cache.put('devpos_access_token', '{{Cache::get('devpos.access_token')}}' );

        let choosedTCR = '{{Session::get('tcr_code')}}';

        $(document).ready(function(){

            $('[name="startDate"]').datepicker();
            $('[name="endDate"]').datepicker();

            DevPos.Unfiscalized.load();

        });

    </script>
@endsection