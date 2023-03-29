@extends('layouts.keen.template')

@section('subheader-buttons')

    <div class="k-subheader__toolbar">
        <div class="k-subheader__wrapper">

            <a href="javascript:void(0)" class="btn btn-label btn-label-brand btn-bold" title="{{__('Print')}}" data-placement="top" onClick="DevPos.Invoice.print();">
                <i class="fa fa-print"></i> <span class="d-none d-md-inline"> {{ __('Print') }}</span>
            </a>
            <a href="javascript:void(0)" class="btn btn-label btn-label-brand btn-bold" title="{{__('Download as pdf')}}" data-placement="top" onClick="DevPos.Invoice.download({{$item->id}});">
                <i class="fa fa-download"></i> <span class="d-none d-md-inline"> {{ __('Download') }}</span>
            </a>
            <a href="javascript:void(0)" class="btn btn-label btn-label-danger btn-bold" title="{{__('Cancel')}}" data-placement="top" onClick="DevPos.Invoice.cancel('{{$item->iic}}');">
                <i class="fa fa-times"></i> <span class="d-none d-md-inline"> {{ __('Cancel Invoice') }}</span>
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
                            {{ __('Invoice') }}
                                <small></small>
                            </h3>
                        </div>
                    </div>
                    <div class="k-portlet__body ">

                        <div class="row">
                            <div class="col-lg-8 offset-lg-2" style="border: 1px solid #ebedf2;padding: 20px;" id="invoiceContent">

                                

                                <table style="border: 0;margin-bottom: 20px;width: 100%" border="1">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Name')}}</td>
                                            <td style="padding: 5px;"><strong>{{__($item->sellerName)}}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Registration Name')}}</td>
                                            <td style="padding: 5px;"><strong>{{__($item->sellerRegistrationName)}}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Nuis')}}</td>
                                            <td style="padding: 5px;"><strong>{{__($item->sellerNuis)}}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Address')}}</td>
                                            <td style="padding: 5px;"><strong>{{__($item->sellerAddress)}}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <table style="border: 0;margin-bottom: 20px;width: 100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 5px; text-align: center;">
                                                <h2>{{__('Invoice')}}<h2>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table style="border: 0;margin-bottom: 20px;width: 100%" border="1">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Date')}}</td>
                                            <td style="padding: 5px;"><strong>{{ date('Y-m-d H:i', strtotime($item->dateTimeCreated)) }}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Invoice Number')}}</td>
                                            <td style="padding: 5px;"><strong>{{__($item->invoiceNumber)}}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Operator Code')}}</td>
                                            <td style="padding: 5px;"><strong>{{__($item->operatorCode)}}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Vendi i ushtrimit të veprimtarisë')}}</td>
                                            <td style="padding: 5px;"><strong>{{__($item->businessUnitCode)}}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 5px;">{{__('Payment Method')}}</td>
                                            <td style="padding: 5px;"><strong></strong></td>
                                        </tr>
                                    </tbody>
                                </table>


                                <table style="border: 0;margin-bottom: 20px;width: 100%" border="1">
                                    <head>
                                        <th style="padding: 5px 10px;text-align: center;">#</th>
                                        <th style="padding: 5px 10px;text-align: center;text-transform: uppercase">{{__('Name')}}</th>
                                        <th style="padding: 5px 10px;text-align: center;text-transform: uppercase">{{__('Barcode')}}</th>
                                        <th style="padding: 5px 10px;text-align: center;text-transform: uppercase">{{__('Price')}}</th>
                                        <th style="padding: 5px 10px;text-align: right;text-transform: uppercase">{{__('Sasia')}}</th>
                                        <th style="padding: 5px 10px;text-align: center;text-transform: uppercase">{{__('Unit')}}</th>
                                        <th style="padding: 5px 10px;text-align: right;text-transform: uppercase">{{__('Cmimi me TVSH')}}</th>
                                        <th style="padding: 5px 10px;text-align: right;text-transform: uppercase">{{__('Vlefta pa TVSH')}}</th>
                                        <th style="padding: 5px 10px;text-align: right;text-transform: uppercase">{{__('TVSH')}}</th>
                                        <th style="padding: 5px 10px;text-align: right;text-transform: uppercase">{{__('Amount')}}</th>
                                    </head>
                                    <tbody>

                                        @foreach($item->invoiceProducts as $product) 

                                            <tr>
                                                <td style="padding: 5px;text-align: center;">{{$loop->index + 1}}</td>
                                                <td style="padding: 5px 10px;text-align: center;">{{$product['name']}}</td>
                                                <td style="padding: 5px 10px;text-align: center;">{{$product['barcode']}}</td>
                                                <td style="padding: 5px 10px;text-align: center;">{{$product['unitPrice']}}</td>
                                                <td style="padding: 5px 10px;text-align: right;">{{$product['quantity']}}</td>
                                                <td style="padding: 5px 10px;text-align: center;">{{$product['unit']}}</td>
                                                <td style="padding: 5px 10px;text-align: right;">{{priceNum($product['priceAfterVAT'])}}</td>
                                                <td style="padding: 5px 10px;text-align: right;">{{priceNum($product['totalPriceBeforeVAT'])}}</td>
                                                <td style="padding: 5px 10px;text-align: right;">{{priceNum($product['totalPriceAfterVAT'] - $product['totalPriceBeforeVAT'])}}</td>
                                                <td style="padding: 5px 10px;text-align: right;">{{priceNum($product['totalPriceAfterVAT'])}}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>

                                <div style="font-weight: bold; width: 100%;text-align: right;font-size: 20px;">{{__('Total pa TVSH')}}: {{ priceNum($item->totalPriceWithoutVAT) }}</div>
                                <div style="font-weight: bold; width: 100%;text-align: right;font-size: 20px;">{{__('TVSH')}}: {{ priceNum($item->totalVATAmount) }}</div>
                                <div style="font-weight: bold; width: 100%;text-align: right;font-size: 20px;">{{__('Total')}}: {{priceNum($item->totalPrice)}}</div>
                                

                                <table style="border: 0;margin-bottom: 20px;margin-top: 30px;width: 100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 5px;text-align: left">
                                                {{__('IIC')}}: {{$item->iic}} </br>
                                                {{__('Fiscalization Number')}}: {{$item->fiscNumber}}
                                            </td>
                                            <td style="padding: 5px;text-align: right">

                                                <div id="qrcode"></div>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>
    <!-- end:: Content -->	

@endsection

@section('js-local')

    <script src="/api/dev/public/devpos\assets\js\jquery-qrcode\jquery.qrcode.js" type="text/javascript"></script>
    <script src="/api/dev/public/devpos\assets\js\jquery-qrcode\qrcode.js" type="text/javascript"></script>

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

        Cache.put('devpos_access_token', '{{Cache::get('devpos.access_token')}}' );

        let choosedTCR = '{{Session::get('tcr_code')}}';

        $(document).ready(function(){

            $('#qrcode').qrcode({
                render: "canvas",
                width: 150, 
                height: 150, 
                text: '{{$item->verificationUrl}}',
                typeNumber: -1,   //Computing mode generally defaults to -1
                correctLevel: 2, //Error Correction Level for 2D Code
                background: "#ffffff ", //Background color
                foreground: "#000000 "//QR Code Colors
            });

        });

    </script>
@endsection