<?php 

    //print_r($item->doctors);

?>
@extends('layouts.keen.template')

@section('subheader-buttons')

    <div class="k-subheader__toolbar">
        <div class="k-subheader__wrapper">

            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="Edit" data-placement="top" onClick="DevPos.TaxPayer.edit({{ $item->id }});">
                <i class="fa fa-edit"></i> <span class="d-none d-md-inline"> {{ __('Edit') }}</span>
            </a>
            
        </div>
    </div>

@endsection


@section('content')
						
    <!-- begin:: Content -->
    <div class="k-content  k-grid__item k-grid__item--fluid" id="k_content">

        <!-- begin:: Portlet -->
        <div class="k-portlet k-profile">
            

            <div class="k-portlet__body  k-profile__content">
                
                <h1 class="display-2 mb-5"><?php echo $item->businessName; ?></h1>
                            
                    <div class="row px-5">

                        <div class="form-group col-md-6 row border-left">	
                            <div class="w-100 mb-1">
                                <label class="col-6 col-lg-4 attribute">{{ __('NIPT') }}</label>
                                <span class="k-font-bold">{{ $item->idNumber }}</span>
                            </div>
                            <div class="w-100 mb-1">
                                <label class="col-6 col-lg-4 attribute">{{ __('Registration Name') }}</label>
                                <span class="k-font-bold">{{ $item->registrationName }}</span>
                            </div>
                            <div class="w-100 mb-1">
                                <label class="col-6 col-lg-4 attribute">{{ __('Business Unit Code') }}</label>
                                <span class="k-font-bold">{{ $item->businessUnitCode }}</span>
                            </div>
                            <div class="w-100 mb-1">
                                <label class="col-6 col-lg-4 attribute">{{ __('Tax Payer Type') }}</label>
                                <span class="k-font-bold">{{ $item->taxPayerType }}</span>
                            </div>
                            <div class="w-100 mb-1">
                                <label class="col-6 col-lg-4 attribute">{{ __('Different Prices Per POS') }}</label>
                                <span class="k-font-bold"><i class="fa <?php echo $item->differentPricesPerPOS === 'false' ? 'fa-times k-font-danger':'fa-check k-font-success'; ?>"> </i></span>
                            </div>

                        </div>
                        <div class="form-group col-md-6 row border-left">	
                            
                        
                            <div class="w-100 mb-1">
                                <label class="col-6 col-lg-4 attribute">{{ __('Issuer In VAT') }}</label>
                                <span class="k-font-bold"><i class="fa <?php echo $item->issuerInVAT === 'false' ? 'fa-times k-font-danger':'fa-check k-font-success'; ?>"> </i></span>
                            </div>
                            
                            <div class="w-100 mb-1">
                                <label class="col-6 col-lg-4 attribute">{{ __('Address') }}</label>
                                <span class="k-font-bold">{{ $item->address }}</span>
                            </div>

                            <div class="w-100 mb-1">
                                <label class="col-6  col-lg-4 attribute">{{ __('Country') }}</label>
                                <span class="k-font-bold">{{ $item->country }}</span>
                            </div>

                            <div class="w-100 mb-1">
                                <label class="col-6  col-lg-4 attribute">{{ __('City') }}</label>
                                <span class="k-font-bold">{{ $item->city }}</span>
                            </div>
                            <div class="w-100 mb-1">
                                <label class="col-6  col-lg-4 attribute">{{ __('Business Permission Code') }}</label>
                                <span class="k-font-bold">{{ $item->businessPermissionCode }}</span>
                            </div>

                        </div>
                        
                    </div>
                
                
            </div>

            
        </div>

        
        
    </div>
    <!-- end:: Content -->	


@endsection

@section('js-local')

    <link rel="stylesheet" href="{{ asset('assets\custom\user\profile-v1.css') }}">

    <script>

        Cache.put('taxpayer', @php echo json_encode($item) @endphp);
        Cache.put('countries', @php echo json_encode($countries) @endphp);
        Cache.put('cities', @php echo json_encode($cities) @endphp);

		$(document).ready(function(){
			
            
            

		});
	
    </script>
@endsection
	
	