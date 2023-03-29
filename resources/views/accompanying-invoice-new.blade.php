@extends('layouts.keen.template')

@section('subheader-buttons')

    <div class="k-subheader__toolbar">
        <div class="k-subheader__wrapper">

            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="Edit" data-placement="top" onClick="DevPos.AccompanyingInvoice.save();">
                <i class="fa fa-save"></i> <span class="d-none d-md-inline"> {{ __('Save invoice') }}</span>
            </a>
            
        </div>
    </div>

@endsection


@section('content')

    <!-- begin:: Content -->
    <div class="k-content  k-grid__item k-grid__item--fluid" id="k_content">

        <div class="row">	

            <div class="col-md-12 float-left reportAndListing order-xs-2 order-md-1" id="reportAndListing" style="overflow-x: hidden;">
                <div class="k-portlet k-portlet--mobile">
                    <div class="k-portlet__head k-portlet__head--lg">
                        <div class="k-portlet__head-label">
                            <h3 class="k-portlet__head-title">
                                {{ __('New invoice') }}
                                <small></small>
                            </h3>
                        </div>
                    </div>
                    <div class="k-portlet__body k-portlet__body--fit">

                    
						<form class="k-form col-12 px-0" id="k_form_1" name="newInvoice" method="get" action="">
							<div class="k-portlet__body">
	
								<div class="form-group row mb-0 productsList not-parameters">
									
                                    <div class=" col-md-8 offset-md-2 col-lg-6 offset-lg-3 mb-4 k-input-icon k-input-icon--left">
                                        <input type="text" class="form-control " placeholder="{{__('Search products')}} ..." id="productSearch" name="productSearch">
                                        <span class="k-input-icon__icon k-input-icon__icon--left">
                                            <span><i class="la la-search"></i></span>
                                        </span>
                                    </div>

									<div class="table-responsive">
										<table class="table" id="productsList">
											<thead class="thead-light">
												<tr>
													<th>{{__('Product')}}</th>
													<th>{{__('Unit')}}</th>
													<th style="width: 12%;">{{__('Quantity')}}</th>
													<th>{{__('Price')}}</th>
													<th style="width: 12%;">{{__('Discount')}}</th>
													<th>{{__('Amount')}}</th>
													<th>{{__('TVSH')}}</th>
													<th class="text-center">{{__('Options')}}</th>
												</tr>
											</thead>
											<tbody>
											</tbody>
										</table>
									</div>
	
								</div>
	
								<div class="input-group input-group-lg-group my-4">
									<div class="col-5 pr-0 invisible"></div>
									<div class="col-3 pr-0 text-right k-font-bold k-heading--sm pr-2 " style="font-size: 1.5rem;">{{__('Total')}}</div>
									<div class="col-2 text-right k-font-boldest total px-3" style="font-size: 1.5rem;"> 0.00</div>
									<div class="col-2"></div>
								</div>  

                                <div class="mt-5">
                                    <div class="k-heading k-heading--space-sm cursor mb-0">{{__('Options')}}</div>
                                </div>
                                <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                                <div class="form-group row">

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "POS *",
                                        "select" => [

                                            "name" => "businessUnitCode",
                                            "value" => $item->businessUnitCode,
                                            "options" => (function($poses) {

                                                $options = '';
                                                foreach($poses as $pos) {

                                                    $options .= '<option value="'. $pos['businessUnitCode'].'">'. $pos['code'] . ' - '. $pos['description'] .'</option>';
                                                }

                                                return $options;

                                            })($pos)
                                        ],
                                        "hint" => "Choose pos"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Type *",
                                        "select" => [

                                            "name" => "wtnType",
                                            "value" => $item->wtnType,
                                            "options" => (function($items) {

                                                $options = '';
                                                foreach($items as $key => $item) {

                                                    $options .= '<option value="'. $key .'">'. $item .'</option>';
                                                }

                                                return $options;

                                            })($wtnTypes)
                                        ],
                                        "hint" => "Choose type"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Transaction *",
                                        "select" => [

                                            "name" => "transaction",
                                            "value" => $item->transaction,
                                            "options" => (function($items) {

                                                $options = '';
                                                foreach($items as $key => $item) {

                                                    $options .= '<option value="'. $key .'">'. $item .'</option>';
                                                }

                                                return $options;

                                            })($transactions)
                                        ],
                                        "hint" => "Choose transaction"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Vehicle Ownership Type",
                                        "select" => [

                                            "name" => "vehicleOwnershipType",
                                            "value" => $item->vehicleOwnershipType,
                                            "options" => [['id' => '0', 'name' => 'Pronar'], ['id' => '1', 'name' => 'Pale e trete']]
                                        ],
                                        "hint" => "Choose type"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Vehicle Plate *",
                                        "input" => [

                                            "name" => "vehiclePlate",
                                            "value" => $item->vehiclePlate,
                                        ],
                                        "hint" => "Enter plate"
                                        
                                    ])!!}

                                </div>
                                

                                <div class="mt-5">
                                    <div class="k-heading k-heading--space-sm cursor mb-0">{{__('Start')}}</div>
                                </div>
                                <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                                <div class="form-group row">
                                    

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Start Address *",
                                        "input" => [

                                            "name" => "startAddress",
                                            "value" => $item->startAddress,
                                        ],
                                        "hint" => "Enter address"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Start City *",
                                        "input" => [

                                            "name" => "startCity",
                                            "value" => $item->startCity,
                                        ],
                                        "hint" => "Enter city"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Start Point *",
                                        "select" => [

                                            "name" => "startPoint",
                                            "value" => $item->startPoint,
                                            "options" => $startPoints
                                        ],
                                        "hint" => "Enter city"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Start Date Time *",
                                        "date" => [

                                            "name" => "startDateTime",
                                            "value" => date('Y-m-d'),
                                        ],
                                        "hint" => "Enter city"
                                        
                                    ])!!}

                                </div>

                                <div class="mt-5">
                                    <div class="k-heading k-heading--space-sm mb-0">{{__('Destination')}}</div>
                                </div>
                                <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                                <div class="form-group row">
                                    

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Destination Address *",
                                        "input" => [

                                            "name" => "destinationAddress",
                                            "value" => $item->destinationAddress,
                                        ],
                                        "hint" => "Enter address"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Destination City *",
                                        "input" => [

                                            "name" => "destinationCity",
                                            "value" => $item->destinationCity,
                                        ],
                                        "hint" => "Enter city"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Destination Point *",
                                        "select" => [

                                            "name" => "destinationPoint",
                                            "value" => $item->destinationPoint,
                                            "options" => $destinationPoints
                                        ],
                                        "hint" => "Choose point"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-3 mb-3",
                                        "label" => "Destination Date Time *",
                                        "date" => [

                                            "name" => "destinationDateTime",
                                            "value" => date('Y-m-d'),
                                        ],
                                        "hint" => "Enter date"
                                        
                                    ])!!}

                                </div>

                                <div class="mt-5">
                                    <div class="k-heading k-heading--space-sm mb-0">{{__('Other')}}</div>
                                </div>
                                <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                                <div class="form-group row">


                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-4 mb-3",
                                        "label" => "Pack Type",
                                        "input" => [

                                            "name" => "packType",
                                            "value" => $item->packType,
                                        ],
                                        "hint" => "Enter packType"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-4 mb-3",
                                        "label" => "Pack Number",
                                        "input" => [

                                            "name" => "packNumber",
                                            "value" => $item->packNumber,
                                        ],
                                        "hint" => "Enter packNumber"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-4 mb-3",
                                        "label" => "Items Number",
                                        "input" => [

                                            "name" => "itemsNumber",
                                            "value" => $item->itemsNumber,
                                        ],
                                        "hint" => "Enter itemsNumber"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-12 mb-3",
                                        "label" => "is Goods Flammable *",
                                        "checkbox" => [

                                            "name" => "isGoodsFlammable",
                                            "value" => 1,
                                            "checked" => false,
                                        ],
                                        "hint" => ""
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-12 mb-3",
                                        "label" => "Is Escort Required *",
                                        "checkbox" => [

                                            "name" => "isEscortRequired",
                                            "value" => 1,
                                            "checked" => false,
                                        ],
                                        "hint" => ""
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-12 mb-3",
                                        "label" => "Is After Delivery",
                                        "checkbox" => [

                                            "name" => "isAfterDelivery",
                                            "value" => 1,
                                            "checked" => false,
                                        ],
                                        "hint" => ""
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-12 mb-3 not-parameters",
                                        "label" => "Subsequent Delivery",
                                        "checkbox" => [

                                            "name" => "subsequentDelivery",
                                            "value" => 1,
                                            "checked" => false,
                                            "shown" => "function(elm){

                                                $(elm).change(function(){

                                                    if ($(elm).is(':checked')) {

                                                        $(elm).closest('form').find('[name=\"subsequentDeliveryType\"]').closest('div').removeClass('d-none');
                                                    }
                                                    else {

                                                        $(elm).closest('form').find('[name=\"subsequentDeliveryType\"]').closest('div').addClass('d-none');
                                                    }
                                                    
                                                }).change();
                                            }"
                                        ],
                                        "hint" => ""
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 mb-3 d-none",
                                        "label" => "Subsequent Delivery Type",
                                        "select" => [

                                            "name" => "subsequentDeliveryType",
                                            "value" => $item->subsequentDeliveryType,
                                            "options" => $subsequentDeliveryTypes
                                        ],
                                        "hint" => ""
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-12 mb-3",
                                        "label" => "Affects Warehouse",
                                        "checkbox" => [

                                            "name" => "affectsWarehouse",
                                            "value" => 1,
                                            "checked" => false,
                                            "shown" => "function(elm){

                                                $(elm).change(function(){

                                                    if ($(elm).is(':checked')) {

                                                        $(elm).closest('form').find('[name=\"exitWarehouseId\"]').closest('div').removeClass('d-none');
                                                        $(elm).closest('form').find('[name=\"destinationWarehouseId\"]').closest('div').removeClass('d-none');
                                                    }
                                                    else {

                                                        $(elm).closest('form').find('[name=\"exitWarehouseId\"]').closest('div').addClass('d-none');
                                                        $(elm).closest('form').find('[name=\"destinationWarehouseId\"]').closest('div').addClass('d-none');

                                                    }
                                                    
                                                }).change();
                                            }"
                                        ], 
                                        "hint" => ""
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-6 mb-3 d-none",
                                        "label" => "Exit Warehouse",
                                        "select" => [

                                            "name" => "exitWarehouseId",
                                            "value" => $item->exitWarehouseId,
                                            "options" => (function($warehouses) {

                                                $options = '';
                                                foreach($warehouses as $warehouse) {

                                                    $options .= '<option value="'. $warehouse['id'].'">'. $warehouse['description'] .'</option>';
                                                }

                                                return $options;

                                            })($warehouses)
                                        ],
                                        "hint" => ""
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-6 mb-3 d-none",
                                        "label" => "Destination Warehouse",
                                        "select" => [

                                            "name" => "destinationWarehouseId",
                                            "value" => $item->destinationWarehouseId,
                                            "options" => (function($warehouses) {

                                                $options = '';
                                                foreach($warehouses as $warehouse) {

                                                    $options .= '<option value="'. $warehouse['id'].'">'. $warehouse['description'] .'</option>';
                                                }

                                                return $options;

                                            })($warehouses)
                                        ],
                                        "hint" => ""
                                        
                                    ])!!}
                                    
                                </div>
		
							</div>
						</form>


                    </div>
                </div>
            </div>

        </div>
    </div>
    <!-- end:: Content -->	

@endsection

@section('js-local')

    <script src="{{asset('ermirshehaj/devpos/js/devpos.js')}}"></script>
    <script src="{{asset('ermirshehaj/devpos/js/templates.js')}}"></script>


    <script>

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

        Cache.put("devpos_access_token", '{{Cache::get('devpos.access_token')}}' );

        let choosedTCR = '{{Session::get('tcr_code')}}';

        $(document).ready(function(){

            $('[name="fromDate"]').datepicker({

                "format": "yyyy-mm-dd"
            });
            $('[name="toDate"]').datepicker({

                "format": "yyyy-mm-dd"
            });

            $('#productSearch').productSuggestionThumb({
                
                display: 'title',
                source: function(instance, query, sync, async) {

                    return async(Cache.get('products').filter(row => row.title.toLowerCase().startsWith(query)));
                },
                template: function(data) {

                    return '<a href="javascript:void(0)" title="Add unit" class="k-nav__link" onClick=""><i class="k-nav__link-icon fa fa-plus "></i><span class="k-nav__link-text"> '+ data.title +'</span></a>';
                },
                onSelect: function(suggestion, instance) {

                    //add product to List
                    //first check if it exists
                    if ($('#productsList [data-product-id="'+ suggestion.id +'"]')?.length) {

                        //exists, so we just increment the quantity
                        let quantity = parseFloat($('#productsList [data-product-id="'+ suggestion.id +'"] [name="quantity"]').val());

                        //set new value
                        $('#productsList [data-product-id="'+ suggestion.id +'"] [name="quantity"]').val(quantity + 1).change();
                    }
                    else { //we append it as new row
                        suggestion.name = suggestion.title;
                        suggestion.rate = suggestion.price;
                        $(instance).closest('form').find('#productsList tbody').append(DevPos.Invoice.order.product.row(suggestion));
                    }

                    //fire trigger
                    $(instance).closest('form').trigger('order.changed');

                },

            });

            //listen to order.changed event to re calculate summaries
            //fire trigger
            $('form[name="newInvoice"]').on('order.changed', function() {

                DevPos.Invoice.order.summaries.calculate();
            });

        });

    </script>
@endsection