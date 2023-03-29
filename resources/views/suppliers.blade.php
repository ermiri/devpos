@extends('layouts.keen.template')

@section('subheader-buttons')

    <div class="k-subheader__toolbar">
        <div class="k-subheader__wrapper">

            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="Edit" data-placement="top" onClick="DevPos.Supplier.create();">
                <i class="fa fa-plus"></i> <span class="d-none d-md-inline"> {{ __('Supplier') }}</span>
            </a>
            
        </div>
    </div>

@endsection


@section('content')

    <!-- begin:: Content -->
    <div class="k-content  k-grid__item k-grid__item--fluid" id="k_content">

        <div class="row">

            <div class="col-md-9 float-left reportAndListing order-xs-2 order-md-1" id="reportAndListing" style="overflow-x: hidden;">
                <div class="k-portlet k-portlet--mobile">
                    <div class="k-portlet__head k-portlet__head--lg">
                        <div class="k-portlet__head-label">
                            <h3 class="k-portlet__head-title">
                                {{ __('Supplier') }}
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
            <div class="col-md-3 float-left order-xs-1 order-sm-1 order-md-2">
                                    
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
                            <div class="row" id="filterForm" data-filter-itemType="pos">

                                <form name="filter" class="col-12" onsubmit="event.preventDefault();POS.load();">

                                    <div class="form-group">
                                        <label class="">{{ __('Code') }}</label>
                                        <input class="form-control" name="code" type="text" placeholder="Search by code">
                                    </div>

                                    <div class="form-group">
                                        <label class="">{{ __('Business Unit Code') }}</label>
                                        <input class="form-control" name="businessUnitCode" type="text" placeholder="Search by business unit code">
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

        //put all suppliers to cache
        Cache.put('suppliers', @php echo json_encode($items) @endphp);

        DevPos.Supplier.load();
    </script>
@endsection