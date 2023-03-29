@extends('layouts.keen.template')

@section('subheader-buttons')

    <div class="k-subheader__toolbar">
        <div class="k-subheader__wrapper">

            @can('create', App\Models\TCR::class)
                <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="Edit" data-placement="top" onClick="DevPos.TCR.create();">
                    <i class="fa fa-plus"></i> <span class="d-none d-md-inline"> {{ __('TCR') }}</span>
                </a>
            @endcan

            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="Open balance" data-placement="top" onClick="TCR.openBalance();">
                <i class="fa fa-plus"></i> <span class="d-none d-md-inline"> {{ __('Open Balance') }}</span>
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
                            {{ __('TCRs') }}
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
                                {{ __('Filter') }}
                                </h3>
                                
                            </div>
                        </div>

                        <div class="k-portlet__body">
                            <div class="row" id="filterForm" data-filter-itemType="tcrs">

                                <form name="filter" class="col-12" onsubmit="event.preventDefault();DevPos.TCR.load();">

                                    <div class="form-group">
                                        <label class="">{{ __('Name') }}</label>
                                        <input class="form-control" name="name" type="text" placeholder="Search by name">
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
        Cache.put('tcrs', @php echo json_encode($items) @endphp);
        Cache.put('business', @php echo json_encode($business) @endphp);
        Cache.put('pos', @php echo json_encode($pos) @endphp);
        
        Cache.put('devpos_access_token', '{{Cache::get('devpos.access_token')}}' );

        let choosedTCR = '{{Session::get('tcr.fiscalizationNumber')}}';

        $(document).ready(function(){

            DevPos.TCR.load();
        });

    </script>
@endsection