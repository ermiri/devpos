@extends('layouts.keen.template')

@section('subheader-buttons')

    <div class="k-subheader__toolbar">
        <div class="k-subheader__wrapper">

            <a href="javascript:void(0);" class="btn btn-label btn-label-brand btn-bold" title="Edit" data-placement="top" onClick="DevPos.EInvoice.save();">
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
                                    <div class="k-heading k-heading--space-sm cursor collapsed mb-0" data-toggle="collapse" data-target="#InvoiceDetails">{{__('Invoice Details')}}</div>
                                </div>
                                <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                                <div class="form-group row collapse" id="InvoiceDetails">

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-6 mb-3",
                                        "label" => "Process",
                                        "select" => [

                                            "name" => "process",
                                            "value" => $item->process,
                                            "options" => $einvoiceProcesses
                                        ],
                                        "hint" => "Choose payment method"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-4 mb-3",
                                        "label" => "Document Type",
                                        "select" => [

                                            "name" => "documentType",
                                            "value" => $item->documentType,
                                            "options" => $envoiceDocumentTypes
                                        ],
                                        "hint" => "Choose document type"
                                        
                                    ])!!}

                                    {!! Html::formElement([
			
                                        "class" => "col-md-6 col-lg-4 col-xl-2 mb-3",
                                        "label" => "Pay Deadline",
                                        "date" => [

                                            "name" => "payDeadline",
                                            "value" => date('Y-m-d', strtotime('+1 month')),
                                        ],
                                        "hint" => "Enter date"
                                        
                                    ])!!}
                                    
                                </div>

                                <div class="mt-5">
                                    <div class="k-heading k-heading--space-sm cursor collapsed mb-0" data-toggle="collapse" data-target="#PaymentMethods">{{__('Payment Methods')}}</div>
                                </div>
                                <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                                <div class="form-group row collapse not-parameters" id="PaymentMethods">

                                    <table class="table table-bordered table-hover" id="paymentMethodsList">
                                        <thead class="thead-light">
                                            <tr>
                                                <th>{{__('Payment Method')}}</th>
                                                <th>{{__('Amount')}}</th>
                                                <th>{{__('Remove')}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                                                                                
                                            <tr>
                                                <th scope="row" colspan="30">
                                                    <button type="button" class="btn btn-primary btn-sm" onclick="DevPos.Invoice.order.paymentMethod.add()"><i class="fa fa-plus"></i> {{__('Payment Method')}}</button>
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> 
                                

								<div class="mt-5">
									<div class="k-heading k-heading--space-sm cursor collapsed mb-0" data-toggle="collapse" data-target="#Customer">{{__('Customer')}}</div>
								</div>
								<div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

								<div class="form-group row collapse" id="Customer">


									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Id Number",
										"input" => [

											"name" => "customer[idNumber]",
											"value" => $item->idNumber,
											"placeholder" => "Enter number",
											"attributes" => ['data-required-if' => "customer[name]"]
										]
										
									])!!}
		
									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Id Type",
										"select" => [

											"name" => "customer[idType]",
											"value" => $item->idType,
											"placeholder" => "Enter number",
											"options" => $idTypes ?? []
										]
										
									])!!}
		
									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Name",
										"input" => [

											"name" => "customer[name]",
											"value" => $item->name,
											"placeholder" => "Enter name",
											"attributes" => ['data-required-if' => "customer[idNumber]"]
										]
										
									])!!}
		
									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Address",
										"input" => [

											"name" => "customer[address]",
											"value" => $item->address,
											"placeholder" => "Enter address",
										]
										
									])!!}
		
									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Town",
										"input" => [

											"name" => "customer[town]",
											"value" => $item->town,
											"placeholder" => "Enter town",
										]
										
									])!!}
		
									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Country",
										"select" => [

											"name" => "customer[country]",
											"value" => $item->country,
											"placeholder" => "Enter country",
											"attributes" => ['data-live-search' => true],
											"options" => $countries ?? []
										]
										
									]) !!}
		
									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Code",
										"input" => [

											"name" => "customer[code]",
											"value" => $item->code,
											"placeholder" => "Enter code"
										]
										
									])!!}
		
									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Phone",
										"input" => [

											"name" => "customer[phone]",
											"value" => $item->phone,
											"placeholder" => "Enter phone"
										]
										
									])!!}
		
									{!! Html::formElement([

										"class" => "col-md-6 form-group-sub col-lg-4 mb-3",
										"label" => "Customer Card",
										"input" => [

											"name" => "clientCardCode",
											"placeholder" => "Enter card",
										]
										
									])!!}

								</div>
                                

								<div class="mt-5">
									<div class="k-heading k-heading--space-sm cursor collapsed mb-0" data-toggle="collapse" data-target="#Extra">{{__('Extra')}}</div>
								</div>
								<div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

								<div class="form-group row collapse" id="Extra">

                                    <ul class="nav nav-tabs nav-tabs-line  w-100" role="tablist">
                                        <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#tab_general" role="tab">{{__('General')}}</a> </li>
                                        <li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#tab_reference" role="tab">{{__('Reference')}}</a> </li>
                                        <li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#tab_payment_details" role="tab">{{__('Payment Details')}}</a> </li>
                                        <li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#tab_shipping" role="tab">{{__('Shipping')}}</a> </li>
                                        <li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#tab_buyer_seller" role="tab">{{__('Buyer')}} / {{__('Seller')}}</a> </li>
                                    </ul>

                                    <div class="tab-content col">
                                        <div class="tab-pane active" id="tab_general" role="tabpanel"> 
                                            
                                            <div class="row">

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub mb-3",
                                                    "label" => "Warehouse",
                                                    "select" => [

                                                        "name" => "warehouseId",
                                                        "value" => $item->warehouseId,
                                                        "placeholder" => "Information payment means",
                                                        "options" => $warehouses
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub mb-3",
                                                    "label" => "Supply Date Or Period Start",
                                                    "date" => [

                                                        "name" => "supplyDateOrPeriodStart",
                                                        "value" => $item->supplyDateOrPeriodStart,
                                                        "placeholder" => "Enter date",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub mb-3",
                                                    "label" => "Supply Date Or Period End",
                                                    "date" => [

                                                        "name" => "supplyDateOrPeriodEnd",
                                                        "value" => $item->supplyDateOrPeriodEnd,
                                                        "placeholder" => "Enter date",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub mb-3",
                                                    "label" => "Currency Code",
                                                    "input" => [

                                                        "name" => "currencyCode",
                                                        "value" => $item->currencyCode,
                                                        "placeholder" => "Enter currency",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub mb-3",
                                                    "label" => "Exchange Rate",
                                                    "input" => [

                                                        "name" => "exchangeRate",
                                                        "value" => $item->exchangeRate,
                                                        "placeholder" => "Enter exchange rate",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-12 form-group-sub mb-3",
                                                    "label" => "Deklarim i vonuar",
                                                    "checkbox" => [

                                                        "name" => "isLateFiscalized",
                                                        "value" => $item->isLateFiscalized,
                                                        "shown" => "function(elm){

                                                            $(elm).on('change', function(){

                                                                if ($(this).is(':checked')) {

                                                                    $('[name=\"subsequentDeliveryType\"]').closest('div').removeClass('d-none');
                                                                }
                                                                else {
                                                                    
                                                                    $('[name=\"subsequentDeliveryType\"]').closest('div').addClass('d-none');
                                                                }
                                                            }).change();
                                                        }"
                                                    ],
                                                    "hint" => ''

                                                ])!!}
                                                

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub mb-4 d-none not-parameters",
                                                    "label" => "Reason",
                                                    "select" => [

                                                        "name" => "subsequentDeliveryType",
                                                        "value" => $item->subsequentDeliveryType,
                                                        "options" => $subsequentDeliveryTypes
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-12 form-group-sub mb-3",
                                                    "label" => "Borxh i keq",
                                                    "checkbox" => [

                                                        "name" => "isBadDebt",
                                                        "value" => $item->isBadDebt,
                                                    ],
                                                    "hint" => ''

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-12 form-group-sub mb-3",
                                                    "label" => "Notes",
                                                    "textarea" => [

                                                        "name" => "notes",
                                                        "value" => $item->notes,
                                                        "placeholder" => "Enter notes",
                                                    ]

                                                ])!!}

                                            </div>

                                        </div>
                                        <div class="tab-pane" id="tab_reference" role="tabpanel"> 
                                            <div class="row">

                                
                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Buyer Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[buyerReference]",
                                                        "value" => $item->buyerReference,
                                                        "placeholder" => "Information for buyer",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Project Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[projectReference]",
                                                        "value" => $item->projectReference,
                                                        "placeholder" => "Information for project",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Contract Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[contractReference]",
                                                        "value" => $item->contractReference,
                                                        "placeholder" => "Information for contract",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Purchase Order Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[purchaseOrderReference]",
                                                        "value" => $item->purchaseOrderReference,
                                                        "placeholder" => "Information for purchase",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Sale Order Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[saleOrderReference]",
                                                        "value" => $item->saleOrderReference,
                                                        "placeholder" => "Information for order",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Receiving Advice Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[receivingAdviceReference]",
                                                        "value" => $item->receivingAdviceReference,
                                                        "placeholder" => "Information for order",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Despatch Advice Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[despatchAdviceReference]",
                                                        "value" => $item->despatchAdviceReference,
                                                        "placeholder" => "Information for order",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Tender Or Lot Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[tenderOrLotReference]",
                                                        "value" => $item->tenderOrLotReference,
                                                        "placeholder" => "Information for tender",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Invoiced Object Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[invoicedObjectReference]",
                                                        "value" => $item->invoicedObjectReference,
                                                        "placeholder" => "Information for invoice",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Buyer Account Reference",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[buyerAccountReference]",
                                                        "value" => $item->buyerAccountReference,
                                                        "placeholder" => "Information for buyer account",
                                                    ]

                                                ])!!}

                                            </div>
                                            
                                        </div>
                                        <div class="tab-pane" id="tab_payment_details" role="tabpanel"> 
                                                    
                                            <div class="row">

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Payment Means",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[paymentMeans]",
                                                        "value" => $item->paymentMeans,
                                                        "placeholder" => "Information payment means",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Payment Terms",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[paymentTerms]",
                                                        "value" => $item->paymentTerms,
                                                        "placeholder" => "Information payment terms",
                                                    ]

                                                ])!!}

                                            </div>
                                            

                                        </div>
                                        <div class="tab-pane" id="tab_shipping" role="tabpanel"> 
                                            <div class="row">

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Name of receiver",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails",
                                                        "value" => $item->eInvoiceDetails,
                                                        "placeholder" => "Name of receiver",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Delivery Date",
                                                    "date" => [

                                                        "name" => "eInvoiceDetails[deliveryDate]",
                                                        "value" => $item->deliveryDate,
                                                        "placeholder" => "Enter date",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Delivery Address",
                                                    "date" => [

                                                        "name" => "eInvoiceDetails[deliveryAddress]",
                                                        "value" => $item->deliveryAddress,
                                                        "placeholder" => "Enter address",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Delivery Town",
                                                    "date" => [

                                                        "name" => "eInvoiceDetails[deliveryTown]",
                                                        "value" => $item->deliveryTown,
                                                        "placeholder" => "Enter town",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 col-xl-3 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Country",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[deliveryCountryCode]",
                                                        "value" => $item->deliveryCountryCode,
                                                        "placeholder" => "Enter country",
                                                    ]

                                                ])!!}

                                            </div>
                                            
                                        </div>
                                        <div class="tab-pane" id="tab_buyer_seller" role="tabpanel">
                                            <div class="row">

                                                <h4 class="col-12">{{__('Buyers')}}</h4>
                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Name of receiver",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[customerContactPoint]",
                                                        "value" => $item->customerContactPoint,
                                                        "placeholder" => "Name of receiver",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Customer Phone",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[customerPhone]",
                                                        "value" => $item->customerPhone,
                                                        "placeholder" => "Enter phone",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Customer Mail",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[customerMail]",
                                                        "value" => $item->customerMail,
                                                        "placeholder" => "Enter mail",
                                                    ]

                                                ])!!}

                                                <h4 class="col-12">{{__('Seller')}}</h4>
                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Seller Contact Point",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[sellerContactPoint]",
                                                        "value" => $item->sellerContactPoint,
                                                        "placeholder" => "Enter contact point",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Seller Phone",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[sellerPhone]",
                                                        "value" => $item->sellerPhone,
                                                        "placeholder" => "Enter phone",
                                                    ]

                                                ])!!}

                                                {!! Html::formElement([

                                                    "class" => "col-md-6 col-lg-4 form-group-sub col-lg-4 mb-3",
                                                    "label" => "Seller Mail",
                                                    "input" => [

                                                        "name" => "eInvoiceDetails[sellerMail]",
                                                        "value" => $item->sellerMail,
                                                        "placeholder" => "Enter mail",
                                                    ]

                                                ])!!}
                                            </div>
                                        </div>
                                    </div>

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