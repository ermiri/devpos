Templates = Object.assign({}, Templates, {

    
    devpos: {
        
        accounts: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},

                    banks: [],
                    centerTypes: [],
                    currencies: [],
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Number',
                                    input: {

                                        name: 'number',
                                        value: item.number,
                                        placeholder: 'Enter number',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'currency',
                                    selectpicker: {

                                        name: 'currency',
                                        value: item.currency,
                                        options: function(value) {

                                            return Cache.get('currencies').map(row => {
    
                                                return `<option value="${row.currencyCode}" ${value == row.currencyCode ? 'selected':''}>${row.currencyCode}</option>`;
                                            }).join('');
                                        },
                                        attributes: {'data-live-search': true}
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Center Type',
                                    select: {

                                        name: 'centerType',
                                        value: item.centerType,
                                        options: opts.centerTypes,
                                        required: true,
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Account Name',
                                    input: {

                                        name: 'accountName1',
                                        value: item.accountName1,
                                        placeholder: 'Enter accountName1',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Account Name 2',
                                    input: {

                                        name: 'accountName2',
                                        value: item.accountName2,
                                        placeholder: 'Enter accountName2',
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Bank')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Bank',
                                    select: {

                                        name: 'selectedBank',
                                        options: opts.banks,
                                        options: function(value) {

                                            return `<option value=""></option>`+ Cache.get('banks').map(row => {
    
                                                return `<option value="${row.BankName}" ${value == row.BankName ? 'selected':''}>${row.BankName}</option>`;
                                            }).join('');
                                        },
                                        shown: function(elm) {

                                            $(elm).on('change', function(){

                                                let bankName = $(elm).val();

                                                //get bank object from banks
                                                let bank = Cache.get('banks').find(row => row.BankName == bankName);
                                                if (empty(bank))
                                                    return;

                                                //fill all fields
                                                $(elm).closest('form').find('[name="bankName"]').val(bank.BankName);
                                                $(elm).closest('form').find('[name="bankCity"]').val(bank.BankCity);
                                                $(elm).closest('form').find('[name="bankCountry"]').val(bank.BankCountry);
                                                $(elm).closest('form').find('[name="bankCountryCode"]').val(bank.BankCountryCode);
                                                $(elm).closest('form').find('[name="bankSwift"]').val(bank.BankSwift);

                                                $(elm).closest('form').find('[name="bankBuildingName"]').val(bank.BankBuildingName);
                                                $(elm).closest('form').find('[name="bankBuildingNumber"]').val(bank.BankBuildingNumber);
                                                $(elm).closest('form').find('[name="bankPostalCode"]').val(bank.BankPostalCode);
                                                $(elm).closest('form').find('[name="bankAddressLine"]').val(bank.BankAddressLine);
                                                
                                            });
                                        }
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Bank Name',
                                    input: {

                                        name: 'bankName',
                                        value: item.bankName,
                                        placeholder: 'Enter bank Name',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'City',
                                    input: {

                                        name: 'bankCity',
                                        value: item.bankCity,
                                        placeholder: 'Enter city',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Country',
                                    input: {

                                        name: 'bankCountry',
                                        value: item.bankCountry,
                                        placeholder: 'Enter country',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Country Code',
                                    input: {

                                        name: 'bankCountryCode',
                                        value: item.bankCountryCode,
                                        placeholder: 'Enter country code',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Swift',
                                    input: {

                                        name: 'bankSwift',
                                        value: item.bankSwift,
                                        placeholder: 'Enter swift',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Bank Address')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Building Name',
                                    input: {

                                        name: 'bankBuildingName',
                                        value: item.bankBuildingName,
                                        placeholder: 'Enter building name',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Building Number',
                                    input: {

                                        name: 'bankBuildingNumber',
                                        value: item.bankBuildingNumber,
                                        placeholder: 'Enter building number',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Street',
                                    input: {

                                        name: 'bankStreet',
                                        value: item.bankStreet,
                                        placeholder: 'Enter street',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Postal Code',
                                    input: {

                                        name: 'bankPostalCode',
                                        value: item.bankPostalCode,
                                        placeholder: 'Enter postal code',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Address Line',
                                    input: {

                                        name: 'bankAddressLine',
                                        value: item.bankAddressLine,
                                        placeholder: 'Enter address line',
                                    },
                                    hint: ''
                                    
                                })}

                            </div>
    
                        </div>
                    </form>`
                ;
            },
        },
        'bank-payments': {

            template: function(opts = {}) {

                let defaults = {

                    item: {

                        isInvestment: 0,
                        pymtNotItems: []
                    },

                    banks: [],
                    centerTypes: [],
                    currencies: [],
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Reference Code',
                                    input: {

                                        name: 'refCode',
                                        value: item.refCode,
                                        placeholder: 'Enter refCode',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Payer',
                                    input: {

                                        name: 'payerNipt',
                                        value: item.payerNipt,
                                        placeholder: 'Enter payerNipt',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm d-flex-inline"> 
                                ${__('Add Invoice Payment')}
                                <div class="d-flex-inline pull-right"><a class="k-link" href="javascript:void(0);" onclick="DevPos.BankPayment.payments.add()"><i class="fa fa-plus"></i> ${__('Add')}</a></div>
                            </div>
                                
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row not-parameters newPayment">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'EIC',
                                    input: {

                                        name: 'einFic',
                                        value: item.einFic,
                                        placeholder: 'Enter eic',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Date',
                                    date: {

                                        name: 'paymentDateTime',
                                        value: item.paymentDateTime,
                                        placeholder: 'Enter date',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Paid Amount',
                                    input: {

                                        name: 'paidAmt',
                                        value: item.paidAmt,
                                        placeholder: 'Enter street',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Paid Currency',
                                    input: {

                                        name: 'paidCur',
                                        value: item.paidCur,
                                        placeholder: 'Enter currency',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Payment Type',
                                    select: {

                                        name: 'pymtType',
                                        value: item.pymtType,
                                        options: [{id: 0, name: 'Cash'}, {id: 1, name: 'Non-cash'}],
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Payment Status',
                                    select: {

                                        name: 'pymtStatus',
                                        value: item.pymtType,
                                        options: [{id: 0, name: 'PAYMENT'}, {id: 1, name: 'CORRECTION'}, {id: 2, name: 'CANCELLATION'}, {id: 3, name: 'ACCEPTED'}, {id: 4, name: 'REFUSED'}],
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Transaction Code',
                                    input: {

                                        name: 'transactionCode',
                                        value: item.transactionCode,
                                        placeholder: 'Enter code',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Overpaid Amount',
                                    input: {

                                        name: 'overpaidAmount',
                                        value: item.overpaidAmount,
                                        placeholder: 'Enter overpaid amount',
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Invoice Payments')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row paymentsList">

                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>${__('No')}</th>
                                            <th>${__('EIC')}</th>
                                            <th>${__('Date')}</th>
                                            <th>${__('Amount')}</th>
                                            <th>${__('Currency')}</th>
                                            <th>${__('Payment Type')}</th>
                                            <th>${__('Payment Status')}</th>
                                            <th>${__('Transaction')}</th>
                                            <th>${__('OverPaid Amount')}</th>
                                            <th>${__('Actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        ${item.pymtNotItems.map(x => {

                                            return DevPos.BankPayment.payments.row(x);
                                        }).join('')}
                                    </tbody>
                                </table>

                            </div>
    
                        </div>
                    </form>`
                ;
            },
        },
        carriers: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},

                    idTypes: [],
                    cities: [],
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Identification')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'ID type',
                                    select: {

                                        name: 'iDtype',
                                        value: item.iDtype,
                                        required: true,
                                        options: opts.idTypes
                                    },
                                    hint: ''
                                    
                                })}


                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Identification Number',
                                    input: {

                                        name: 'identificationNo',
                                        value: item.identificationNo,
                                        placeholder: 'Enter identification number',
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Address')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Town',
                                    input: {

                                        name: 'town',
                                        value: item.town,
                                        options: opts.town,
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}
                                

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Address',
                                    input: {

                                        name: 'address',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        vehicles: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Plate',
                                    input: {

                                        name: 'plate',
                                        value: item.plate,
                                        placeholder: 'Enter plate',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    textarea: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                            </div>
    
                        </div>
                    </form>`
                ;
            },
        },
        'client-cards': {

            template: function(opts = {}) {

                let defaults = {

                    item: {},

                    idTypes: [],
                    cities: [],
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Surname',
                                    input: {

                                        name: 'surname',
                                        value: item.surname,
                                        placeholder: 'Enter surname',
                                    },
                                    hint: ''
                                    
                                })}

                                

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Birthday',
                                    date: {

                                        name: 'birthday',
                                        value: moment(item.birthday).format('YYYY-MM-DD'),
                                        placeholder: 'Enter birthday',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Card')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Card Number',
                                    input: {

                                        name: 'cardNumber',
                                        value: item.cardNumber,
                                        placeholder: 'Enter card Number',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Client Card Type',
                                    select: {

                                        name: 'clientCardType',
                                        value: item.clientCardType,
                                        options: [{id: 0, name: 'Pikë'}, {id: 1, name: 'Përqindje'} ],
                                        required: true,
                                        shown: function(elm) {

                                            $(elm).change(function(){

                                                let val = $(elm).val();
                                                console.log(val);
                                                if (val == '1') { //perqindje

                                                    $(elm).closest('form').find('[name="points"]').closest('div').addClass('d-none');
                                                    $(elm).closest('form').find('[name="maxPoints"]').closest('div').addClass('d-none');
                                                    $(elm).closest('form').find('[name="percentage"]').closest('div').removeClass('d-none');
                                                }
                                                else {
                                                    
                                                    $(elm).closest('form').find('[name="points"]').closest('div').removeClass('d-none');
                                                    $(elm).closest('form').find('[name="maxPoints"]').closest('div').removeClass('d-none');
                                                    $(elm).closest('form').find('[name="percentage"]').closest('div').addClass('d-none');
                                                }
                                            }).change();
                                        }
                                    },
                                    hint: ''
                                    
                                })}


                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Percentage',
                                    input: {

                                        name: 'percentage',
                                        value: item.percentage,
                                        placeholder: 'Choose percentage',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Points',
                                    input: {

                                        name: 'points',
                                        value: item.points,
                                        placeholder: 'Choose points',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Max Points',
                                    input: {

                                        name: 'maxPoints',
                                        value: item.maxPoints,
                                        placeholder: 'Enter max points'
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Contact')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Contact',
                                    input: {

                                        name: 'contact',
                                        value: item.contact,
                                        placeholder: 'Enter contact',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Email',
                                    input: {

                                        name: 'email',
                                        value: item.email,
                                        placeholder: 'Enter email',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Customer',
                                    input: {

                                        name: 'customerId',
                                        value: item.customerId,
                                        placeholder: 'Choose customer',
                                        shown: function(elm) {

                                            return $(elm).customerSuggestion({});
                                        }
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Address')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'City',
                                    select: {

                                        name: 'cityId',
                                        value: item.cityId,
                                        options: opts.cities,
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}
                                

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Address',
                                    input: {

                                        name: 'address',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                            </div>
                            
                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Other')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Plate',
                                    input: {

                                        name: 'plate',
                                        value: item.plate,
                                        placeholder: 'Enter plate',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Driver',
                                    input: {

                                        name: 'driver',
                                        value: item.driver,
                                        placeholder: 'Enter driver',
                                    },
                                    hint: ''
                                    
                                })}
                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        customers: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},

                    idTypes: [],
                    countries: [],
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6  form-group-sub mb-3',
                                    label: 'Number',
                                    input: {

                                        name: 'idNumber',
                                        value: item.idNumber,
                                        placeholder: 'Enter number',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Type',
                                    select: {

                                        name: 'idType',
                                        value: item.idType,
                                        placeholder: 'Enter type',
                                        options: opts.idTypes,
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'code',
                                        value: item.code,
                                        placeholder: 'Enter code',
                                    },
                                    hint: ''
                                    
                                })}

                                

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Card Number',
                                    input: {

                                        name: 'cardNumber',
                                        value: item.cardNumber,
                                        placeholder: 'Enter cardNumber',
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Contact')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Phone',
                                    input: {

                                        name: 'phone',
                                        value: item.phone,
                                        placeholder: 'Enter phone',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Mail',
                                    input: {

                                        name: 'mail',
                                        value: item.mail,
                                        placeholder: 'Enter mail',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Fax',
                                    input: {

                                        name: 'fax',
                                        value: item.fax,
                                        placeholder: 'Enter fax',
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Address')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Country',
                                    select: {

                                        name: 'countryId',
                                        value: item.countryCode,
                                        options: function(value) {

                                            return Cache.get('countries').map(row => {
    
                                                return `<option value="${row.id}" ${value == row.countryCode ? 'selected':''}>${row.name}</option>`;
                                            }).join('');
                                        },
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Town',
                                    input: {

                                        name: 'town',
                                        value: item.town,
                                        placeholder: 'Enter town',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}
                                

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Street',
                                    input: {

                                        name: 'street',
                                        value: item.street,
                                        placeholder: 'Enter street',
                                    },
                                    hint: ''
                                    
                                })}
                                

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Address',
                                    input: {

                                        name: 'address',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                    },
                                    hint: ''
                                    
                                })}

                            </div>
                            
                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Building')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Building Name',
                                    input: {

                                        name: 'buildingName',
                                        value: item.buildingName,
                                        placeholder: 'Enter building name',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Building Number',
                                    input: {

                                        name: 'buildingNumber',
                                        value: item.buildingNumber,
                                        placeholder: 'Enter building number',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Registration Name',
                                    input: {

                                        name: 'registrationName',
                                        value: item.registrationName,
                                        placeholder: 'Enter registration name',
                                    },
                                    hint: ''
                                    
                                })}
                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        invoices: {

            template: function(opts = {}) {

                let defaults  = {
                    
                    item: {

                        payment_method: 'BANKNOTE',
                        exchangeRate: 1
                    },

                    idTypes: [],
                    countries: [],
                    taxes: [],
                    discounts: [],
                    
                    warehouses: [],
                    invoiceTypes: [{id: 0, name: 'Cash'}, {id: 1, name: 'NonCash'}],
                    paymentMethods: [

                        'BANKNOTE',
                        'CARD',
                        'CHECK',
                        'SVOUCHER',
                        'COMPANY',
                        'ORDER',
                        'ACCOUNT',
                        'FACTORING',
                        'COMPENSATION',
                        'TRANSFER',
                        'WAIVER',
                        'KIND',
                        'OTHER'
                    ],
                };

                opts = $.extend(true, defaults, opts);

                let item = opts.item;


                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="" name="newInvoice">
                        <div class="k-portlet__body">

                            <div class="form-group row mb-0 productsList not-parameters">

                                ${Html.element({

                                    html: `
                                    <div class=" col-md-8 offset-md-2 col-lg-6 offset-lg-3 mb-4 k-input-icon k-input-icon--left">
                                        <input type="text" class="form-control " placeholder="${__('Search products')} ..." id="productSearch" name="productSearch">
                                        <span class="k-input-icon__icon k-input-icon__icon--left">
                                            <span><i class="la la-search"></i></span>
                                        </span>
                                    </div>`,
                                    shown: function(elm) {

                                        $(elm).find('input[name="productSearch"]').productSuggestionThumb({

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
                                    }

                                })}

                                <div class="table-responsive">
                                    <table class="table" id="productsList">
                                        <thead class="thead-light">
                                            <tr>
                                                <th>${__('Product')}</th>
                                                <th>${__('Unit')}</th>
                                                <th>${__('Quantity')}</th>
                                                <th>${__('Price')}</th>
                                                <th>${__('Discount')}</th>
                                                <th>${__('Amount')}</th>
                                                <th>${__('TVSH')}</th>
                                                <th>${__('Options')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            <div class="input-group input-group-lg-group mb-3">
                                <div class="col-4 pr-0 invisible"></div>
                                <div class="col-3 pr-0 text-right k-font-bold k-heading--sm pr-2 " style="font-size: 1.5rem;">${__('Total')}</div>
                                <div class="col-2 text-right k-font-boldest total px-3" style="font-size: 1.5rem;"> 0.00</div>
                                <div class="col-2"></div>
                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm cursor collapsed" data-toggle="collapse" data-target="#Customer">${__('Customer')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                            <div class="form-group row collapse" id="Customer">

    
                                ${Html.formElement({

                                    class: 'col-md-6 col-lg-4 mb-3  not-parameters',
                                    label: 'Customer',
                                    input: {

                                        name: 'customer',
                                        placeholder: 'Enter name',
                                        attributes: {autocomplete: 'off'},
                                        shown: function(elm) {

                                            $(elm).customerSuggestion({

                                                onSelect: function(suggestion, instance) {

                                                    console.log(suggestion);
                                                }
                                            });
                                        }
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Id Number',
                                    input: {

                                        name: 'customer[idNumber]',
                                        value: item.idNumber,
                                        placeholder: 'Enter number',
                                        attributes: {'data-required-if': 'customer[name]'}
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Id Type',
                                    select: {

                                        name: 'customer[idType]',
                                        value: item.idType,
                                        placeholder: 'Enter number',
                                        options: opts.idTypes
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'customer[name]',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        attributes: {'data-required-if': 'customer[idNumber]'}
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Address',
                                    input: {

                                        name: 'customer[address]',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Town',
                                    input: {

                                        name: 'customer[town]',
                                        value: item.town,
                                        placeholder: 'Enter town',
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Country',
                                    selectpicker: {

                                        name: 'customer[country]',
                                        value: item.country,
                                        placeholder: 'Enter country',
                                        attributes: {'data-live-search': true},
                                        options: opts.countries
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'customer[code]',
                                        value: item.code,
                                        placeholder: 'Enter code'
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Phone',
                                    input: {

                                        name: 'customer[phone]',
                                        value: item.phone,
                                        placeholder: 'Enter phone'
                                    }
                                    
                                })}
    
                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub col-lg-4 mb-3',
                                    label: 'Customer Card',
                                    input: {

                                        name: 'clientCardCode',
                                        placeholder: 'Enter card',
                                    }
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm cursor collapsed" data-toggle="collapse" data-target="#Fee">${__('Fee')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                            <div class="form-group row collapse not-parameters" id="Fee">


                                <table class="table table-bordered table-hover" id="feesList">
                                    <thead class="thead-light">
                                        <tr>
                                            <th>${__('Fee Type')}</th>
                                            <th>${__('Amount')}</th>
                                            <th>${__('Remove')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                                                                                            
                                        <tr>
                                            <th scope="row" colspan="30">
                                                <button type="button" class="btn btn-primary btn-sm" onclick="DevPos.Invoice.order.fee.add()"><i class="fa fa-plus"></i> ${__('Fee')}</button>
                                            </th>
                                            
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm cursor collapsed" data-toggle="collapse" data-target="#PaymentMethods">${__('Payment Methods')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                            <div class="form-group row collapse not-parameters" id="PaymentMethods">

                                <table class="table table-bordered table-hover" id="paymentMethodsList">
                                    <thead class="thead-light">
                                        <tr>
                                            <th>${__('Payment Method')}</th>
                                            <th>${__('Amount')}</th>
                                            <th>${__('Remove')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                                                                                            
                                        <tr>
                                            <th scope="row" colspan="30">
                                                <button type="button" class="btn btn-primary btn-sm" onclick="DevPos.Invoice.order.paymentMethod.add()"><i class="fa fa-plus"></i> ${__('Payment Method')}</button>
                                            </th>
                                            
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm cursor collapsed" data-toggle="collapse" data-target="#Extra">${__('Extra')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                            <div class="form-group row collapse" id="Extra">

                                <div class="col-md-8 row">
                                
                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3',
                                        label: 'Invoice Type',
                                        select: {

                                            name: 'invoiceType',
                                            value: opts.item.invoiceType,
                                            options: opts.invoiceTypes
                                        },
                                        hint: 'Choose payment method'
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-6 mb-3',
                                        label: 'Warehouse Id',
                                        select: {

                                            name: 'warehouseId',
                                            value: opts.item.warehouseId,
                                            options: ['', ...opts.warehouses]
                                        },
                                        hint: 'Choose warehouse'
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-6 mb-3',
                                        label: 'Pay Deadline',
                                        date: {

                                            name: 'payDeadline',
                                            value: opts.item.payDeadline,
                                        },
                                        hint: 'Enter deadline'
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-6 mb-3',
                                        label: 'Supply Date Or Period Start',
                                        date: {

                                            name: 'supplyDateOrPeriodStart',
                                            value: opts.item.supplyDateOrPeriodStart,
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-6 mb-3',
                                        label: 'Supply Date Or Period End',
                                        date: {

                                            name: 'supplyDateOrPeriodEnd',
                                            value: opts.item.supplyDateOrPeriodEnd,
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-6 mb-3',
                                        label: 'Currency Code',
                                        select: {

                                            name: 'currencyCode',
                                            value: opts.item.currencyCode,
                                            options: [{id: '', name: ''}, ...Cache.get('currencies')],
                                            attributes: {'data-live-search': true}
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-6 mb-3',
                                        label: 'Exchange Rate',
                                        input: {

                                            name: 'exchangeRate',
                                            value: opts.item.exchangeRate,

                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3',
                                        label: 'Notes',
                                        textarea: {

                                            name: 'notes',
                                            value: opts.item.notes,
                                        },
                                        hint: ''
                                        
                                    })}

                                </div>
                                <div class="col-md-4 row px-5">
                                    
                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3',
                                        label: 'Self Issuing',
                                        checkbox: {

                                            name: 'selfIssuing',
                                            value: 1,
                                            checkeck: opts.item.selfIssuing == '1' ? true:false,
                                            shown: function (elm) {
                                                
                                                $(elm).statefire({

                                                    states: {

                                                        checked: function(val) {

                                                            $(elm).closest('form').find('[name="selfIssuingType"]').closest('div').removeClass('d-none');
                                                        },
                                                        unchecked: function(val) {

                                                            $(elm).closest('form').find('[name="selfIssuingType"]').closest('div').addClass('d-none');
                                                        }
                                                    }
                                                });
                                            }
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3 d-none not-parameters',
                                        label: 'Self Issuing Type',
                                        select: {

                                            name: 'selfIssuingType',
                                            value: opts.item.exchangeRate,
                                            attributes: {'data-required-if': 'selfIssuing:1'},
                                            options: ['Marrëveshja e mëparshme mes palëve.', 'Blerje nga fermerët e zonës.', 'Blerje nga shërbimet jashtë vendit.', 'Vet-konsumim', 'Të tjera']
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3',
                                        label: 'Is Export',
                                        checkbox: {

                                            name: 'isExport',
                                            value: 1,
                                            checkeck: opts.item.isExport == '1' ? true:false
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3',
                                        label: 'Is Export Services',
                                        checkbox: {

                                            name: 'isExportServices',
                                            value: 1,
                                            checkeck: opts.item.isExportServices == '1' ? true:false
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3',
                                        label: 'Is Reverse Charge',
                                        checkbox: {

                                            name: 'isReverseCharge',
                                            value: 1,
                                            checkeck: opts.item.isReverseCharge == '1' ? true:false
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3 not-parameters',
                                        label: 'Is Late Fiscalized',
                                        checkbox: {

                                            name: 'isLateFiscalized',
                                            value: 1,
                                            checkeck: opts.item.isReverseCharge == '1' ? true:false,
                                            shown: function (elm) {
                                                
                                                $(elm).statefire({

                                                    states: {

                                                        'checked': function(val) {

                                                            $(elm).closest('form').find('[name="subsequentDeliveryType"]').closest('div').removeClass('d-none');
                                                        },
                                                        unchecked: function(val) {

                                                            $(elm).closest('form').find('[name="subsequentDeliveryType"]').closest('div').addClass('d-none');
                                                        }
                                                    }
                                                });
                                            }
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3 not-parameters',
                                        label: 'Subsequent Delivery Type',
                                        select: {

                                            name: 'subsequentDeliveryType',
                                            value: opts.item.subsequentDeliveryType,
                                            options: ['Mungesë interneti', 'Arka është jashtë funksionit', 'Problem me sherbimin e fiskalizimit', 'Probleme teknike në arkë']
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3 not-parameters',
                                        label: 'Is Bad Debt',
                                        checkbox: {

                                            name: 'isBadDebt',
                                            value: 1,
                                            checkeck: opts.item.isBadDebt == '1' ? true:false,
                                            shown: function (elm) {
                                                
                                                $(elm).statefire({

                                                    states: {

                                                        'checked': function(val) {

                                                            $(elm).closest('form').find('[name="subsequentDeliveryType"]').closest('div').removeClass('d-none');
                                                        },
                                                        unchecked: function(val) {

                                                            $(elm).closest('form').find('[name="subsequentDeliveryType"]').closest('div').addClass('d-none');
                                                        }
                                                    }
                                                });
                                            }
                                        },
                                        hint: ''
                                        
                                    })}

                                    ${Html.formElement({
        
                                        class: 'col-md-12 mb-3',
                                        label: 'Bad Debt IIC Reference',
                                        input: {

                                            name: 'badDebtIICReference',
                                            value: opts.item.badDebtIICReference,
                                        },
                                        hint: ''
                                        
                                    })}
                                </div>


                            </div>
    
                        </div>
                    </form>`
                ;
            },
            paymentMethod: function(opts = {}) {

                let defaults = {

                    item: {},
                    paymentMethodTypes: Cache.get('paymentMethods')||[],
                    banks: Cache.get('banks')||[]
                };

                opts = $.extend(defaults, opts);
                console.log(opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({
                                    
                                    class: 'col-12 mb-3',
                                    label: 'Payment method type',
                                    select: {

                                        name: 'paymentMethodType',
                                        value: item.paymentMethodType,
                                        options: opts.paymentMethodTypes,
                                        shown: function(elm) {

                                            $(elm).change(function(){

                                                let value = $(elm).val();
                                                if (value == '6') {

                                                    $(elm).closest('form').find('[name="accountId"]').closest('div').removeClass('d-none');
                                                }
                                                else {

                                                    $(elm).closest('form').find('[name="accountId"]').closest('div').addClass('d-none');
                                                }

                                                //voucher
                                                if (value == '2') {

                                                    $(elm).closest('form').find('[name="voucher"]').closest('div').removeClass('d-none');
                                                }
                                                else {

                                                    $(elm).closest('form').find('[name="voucher"]').closest('div').addClass('d-none');
                                                }


                                            }).change();
                                        }
                                        
                                    }
                                })}

                                ${Html.formElement({
                                    
                                    class: 'col-12 mb-3 d-none',
                                    label: 'Bank Account',
                                    select: {

                                        class: 'form-control',
                                        name: 'accountId',
                                        value: item.accountId,
                                        options: function(value) {

                                            return Cache.get('banks').map(row => {
                
                                                return `<option value="${row.id}" ${value == row.bankName ? 'selected':''}>${row.bankName} - ${row.number}</option>`;
                                            }).join('');
                                        },
                                        attributes: {'data-required-if': 'paymentMethodType,6'}
                                    }
                                })}


                                ${Html.formElement({
                                    
                                    class: 'col-12 mb-3 d-none',
                                    label: 'Voucher',
                                    input: {

                                        class: 'form-control',
                                        name: 'voucher',
                                        value: item.voucher,
                                        attributes: {'data-required-if': 'paymentMethodType,2'}
                                        
                                    }
                                })}

                                ${Html.formElement({
                                    
                                    class: 'col-12 mb-3',
                                    label: 'Amount',
                                    input: {

                                        name: 'amount',
                                        value: item.amount
                                    }
                                })}

                            </div>
    
                        </div>
                    </form>`
            }
        },
        'roles': {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                    suppliers: []
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    input: {

                                        name: 'description',
                                        value: item.description,
                                        required: true
                                    }
                                    
                                })}

                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        pos: {

            template: function(opts = {}) {

                let defaults = {

                    item: {


                    },

                    idTypes: [],
                    cities: [],
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'code',
                                        value: item.code,
                                        placeholder: 'Enter code',
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Business Unit Code',
                                    input: {

                                        name: 'businessUnitCode',
                                        value: item.businessUnitCode,
                                        placeholder: 'Enter business unit code',
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Registration Date',
                                    datepicker: {

                                        name: 'registrationDate',
                                        value: item.registrationDate,
                                        placeholder: 'Enter registration date',
                                    }
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Address')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: 'City',
                                    input: {

                                        name: 'city',
                                        value: item.city,
                                        placeholder: 'Enter city',
                                    }
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: 'Address',
                                    input: {

                                        name: 'address',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                    }
                                })}
                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm cursor collapsed" data-toggle="collapse" data-target="#Location"> ${__('Location')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row collapse" id="Location">

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: 'Latitude',
                                    input: {

                                        name: 'latitude',
                                        value: item.latitude,
                                        placeholder: 'Enter latitude',
                                    }
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: 'Longitude',
                                    input: {

                                        name: 'longitude',
                                        value: item.longitude,
                                        placeholder: 'Enter longitude',
                                    }
                                })}
                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm cursor collapsed" data-toggle="collapse" data-target="#description"> ${__('Description')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row collapse" id="description">

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: '',
                                    textarea: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description',
                                    },
                                    hint: ''
                                })}
                            </div>
    
                        </div>
                    </form>`
                ;
            },
            item: function(item = {}) {

                let defaults = {

                    title: '',
                    url: '',
                };

                item = $.extend(defaults, item);

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            ${Html.formElement({

                                class: 'col-md-12 mb-3',
                                label: 'Title',
                                input: {

                                    name: 'title',
                                    value: item.title,
                                    required: true,
                                    placeholder: 'Enter title',
                                }
                                
                            })}

                            ${Html.formElement({

                                class: 'col-md-12 mb-3',
                                label: 'Url',
                                input: {

                                    name: 'url',
                                    value: item.url,
                                    required: true,
                                    placeholder: 'Enter url',
                                }
                                
                            })}
    
                        </div>
                    </form>`
                ;
            }
        },
        products: {

            template: function(opts = {}) {

                let defaults = {

                    item: {

                        name: '',
                        categoryId: '',
                        barcode: '',
                        code: '',
                        unitPrice: 0,
                        buyingPrice: 0,
                        productCost: 0,
                        vatRate: '',
                        profitMargin: 0,
                        consumptionTaxRate: 0,
                        minQuantity: 0,


                    },
                    categories: [],
                    suppliers: [],
                    units: [],
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Category',
                                    select: {

                                        name: 'productCategoryId',
                                        value: item.productCategoryId,
                                        options: opts.categories,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Barcode',
                                    input: {

                                        name: 'barcode',
                                        value: item.barcode,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'code',
                                        value: item.code,
                                    }
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Units')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Unit',
                                    select: {

                                        name: 'unitId',
                                        value: item.unitId,
                                        options: opts.units
                                    }
                                    
                                })}
                                
                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Input unit different from base unit',
                                    checkbox: {

                                        name: 'isDifFromBaseUnit',
                                        value: '1',
                                        checked: !(empty(item.entryUnitId) && empty(item.entryUnitRatio)) ? true:false,
                                        shown: function(elm) {

                                            $(elm).on('change', function(){

                                                if ($(elm).is(':checked')) {

                                                    $(elm).closest('form').find('[name="entryUnitId"]').closest('div').removeClass('d-none');
                                                    $(elm).closest('form').find('[name="entryUnitRatio"]').closest('div').removeClass('d-none');
                                                }
                                                else {

                                                    $(elm).closest('form').find('[name="entryUnitId"]').closest('div').addClass('d-none');
                                                    $(elm).closest('form').find('[name="entryUnitRatio"]').closest('div').addClass('d-none');
                                                }

                                            }).change();	
                                        }
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Entry Unit',
                                    select: {

                                        name: 'entryUnitId',
                                        value: item.entryUnitId,
                                        options: opts.units
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Entry Unit Ratio',
                                    input: {

                                        name: 'entryUnitRatio',
                                        value: item.entryUnitRatio,
                                    }
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Price')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Unit Price',
                                    input: {

                                        name: 'unitPrice',
                                        value: item.unitPrice,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Buying Price',
                                    input: {

                                        name: 'buyingPrice',
                                        value: item.buyingPrice,
                                        required: true
                                    }
                                    
                                })}

                            </div>

                            

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Profit & Taxes')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Product Cost',
                                    input: {

                                        name: 'productCost',
                                        value: item.productCost,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Profit Margin',
                                    input: {

                                        name: 'profitMargin',
                                        value: item.profitMargin,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Vat Rate',
                                    input: {

                                        name: 'vatRate',
                                        value: item.vatRate,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Consumption Tax Rate',
                                    input: {

                                        name: 'consumptionTaxRate',
                                        value: item.consumptionTaxRate,
                                    }
                                    
                                })}
                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Other')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Distributor',
                                    select: {

                                        name: 'distributorId',
                                        value: item.distributorId,
                                        options: [{id: '', name: ''}, ...opts.suppliers]
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Min Quantity',
                                    input: {

                                        name: 'minQuantity',
                                        value: item.minQuantity,
                                        required: true
                                    }
                                    
                                })}
                                
                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Is Sealable',
                                    checkbox: {

                                        name: 'isSealable',
                                        value: '1',
                                        checked: item.isSealable == '1' ? true:false
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Manage Stock',
                                    checkbox: {

                                        name: 'affectsWarehouse',
                                        value: '1',
                                        checked: item.affectsWarehouse == '1' ? true:false
                                    }
                                    
                                })}

                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        'product-categories': {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                    suppliers: []
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'code',
                                        value: item.code,
                                        required: true
                                    }
                                    
                                })}

                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        'product-groups': {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                    standardCodes: []
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'code',
                                        value: item.code,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Level',
                                    input: {

                                        name: 'level',
                                        value: item.level,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Group Parent Id',
                                    selectpicker: {

                                        name: 'groupParentId',
                                        value: item.groupParentId,
                                        attributes: {'data-live-search': true},
                                        options: Cache.get('product-groups'),
                                        required: true
                                    }
                                    
                                })}

                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        units: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                    standardCodes: []
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'code',
                                        value: item.code,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    input: {

                                        name: 'description',
                                        value: item.description,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Standart Code',
                                    selectpicker: {

                                        name: 'standardCode',
                                        value: item.standardCode,
                                        attributes: {'data-live-search': true},
                                        options: function(value) {

                                            return Cache.get('standardCodes').map(row => {

                                                return `<option value="${row.value}" ${value == row.value ? 'selected':''}>${row.viewValue}</option>`;
                                            }).join(''); 
                                        },
                                        required: true
                                    }
                                    
                                })}

                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        suppliers: {

            template: function(opts = {}) {

                let defaults = {

                    item: {}
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Nuis',
                                    input: {

                                        name: 'nuis',
                                        value: item.nuis,
                                        placeholder: 'Enter nuis',
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'code',
                                        value: item.code,
                                        placeholder: 'Enter code',
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Contact',
                                    input: {

                                        name: 'contact',
                                        value: item.contact,
                                        placeholder: 'Enter contact',
                                    }
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Address')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: '',
                                    textarea: {

                                        name: 'address',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                    },
                                    hint: ''
                                })}
                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        'supplier-lists': {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                    suppliers: []
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Nuis List',
                                    selectpicker: {

                                        name: 'nuisList',
                                        value: item.nuisList,
                                        attributes: {multiple: true},
                                        options: opts.suppliers.map(row => row.nuis),
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                    }
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Description')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: '',
                                    textarea: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description',
                                    },
                                    hint: ''
                                })}
                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        taxpayer: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},

                    idTypes: [],
                    cities: [],
                    countries: [],
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'businessName',
                                        value: item.businessName,
                                        placeholder: 'Enter name',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Id Number',
                                    input: {

                                        name: 'idNumber',
                                        value: item.idNumber,
                                        placeholder: 'Enter id number',
                                    },
                                    hint: ''
                                    
                                })}

                                

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Registration Name',
                                    input: {

                                        name: 'registrationName',
                                        value: item.registrationName,
                                        placeholder: 'Enter registration name',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Business Unit Code',
                                    input: {

                                        name: 'businessUnitCode',
                                        value: item.businessUnitCode,
                                        placeholder: 'Enter business unit code',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Tax Payer Type',
                                    input: {

                                        name: 'taxPayerType',
                                        value: item.taxPayerType,
                                        placeholder: 'Enter taxPayerType',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Address')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Address',
                                    input: {

                                        name: 'address',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Country',
                                    select: {

                                        name: 'countryCode',
                                        value: item.countryCode,
                                        options: function(value) {

                                            return Cache.get('countries').map(row => {
    
                                                return `<option value="${row.countryCode}" ${value == row.countryCode ? 'selected':''}>${row.name}</option>`;
                                            }).join('');
                                        },
                                        required: true,
                                    },
                                    hint: ''
                                    
                                })}


                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'City',
                                    select: {

                                        name: 'city',
                                        value: item.city,
                                        options: opts.cities,
                                        placeholder: 'Enter city',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Business Permission Code',
                                    input: {

                                        name: 'businessPermissionCode',
                                        value: item.businessPermissionCode,
                                        placeholder: 'Enter businessPermissionCode',
                                    },
                                    hint: ''
                                    
                                })}


                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Others')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Issuer In VAT',
                                    checkbox: {

                                        name: 'issuerInVAT',
                                        value: 1,
                                        checked: item.issuerInVAT == '1' ? true:false
                                    },
                                    hint: ''
                                    
                                })}

                                

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Different Prices Per POS',
                                    checkbox: {

                                        name: 'differentPricesPerPOS',
                                        value: 1,
                                        checked: item.differentPricesPerPOS == '1' ? true:false
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        tcrs: {

            template: function(opts = {}) {

                let self = this;

                let defaults = {

                    item: {

                        name: '',
                        description: '',
                        laboratory_id: '',
                    },

                    pos: []
                };
                

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        required: true,
                                        value: item.name,
                                        placeholder: 'Enter name'
                                    },
                                    hint: 'Please enter name'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Valid from',
                                    date: {

                                        name: 'validFromDate',
                                        value: item.validFromDate,
                                        minDate: moment().format('YYYY-MM-DD'),
                                        placeholder: 'Enter date'
                                    },
                                    hint: 'Please enter date'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Valid up to',
                                    date: {

                                        name: 'validToDate',
                                        value: item.validToDate,
                                        placeholder: 'Enter date'
                                    },
                                    hint: 'Please enter date'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Type',
                                    select: {

                                        name: 'type',
                                        value: item.type,
                                        options: [{id: '0', name: 'Regular cash register'}, {id: '1', name: 'Self-service cash register'}]
                                    },
                                    hint: 'Please enter date'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'POS',
                                    select: {

                                        name: 'pointsOfSaleId',
                                        value: item.pointsOfSaleId,
                                        options: opts.pos,
                                        options: function(value) {

                                            return (Cache.get('pos')||[]).map(model => {

                                                return `<option value="${model.id}" ${value == model.id ? 'selected':''}>${model.code}</option>`;
                                            }).join('');
                                        },
                                    },
                                    hint: 'Please choose pos'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Tcr number',
                                    input: {

                                        name: 'tcrIntID',
                                        value: item.tcrIntID,
                                        placeholder: 'Enter tcr id'
                                    },
                                    hint: 'Please enter tcr id'
                                })}

                            </div>
                        
                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm">
                                    ${__('Description')}
                                </div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>

                            <div class="form-group row mb-0">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: '',
                                    textarea: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description'
                                    },
                                    hint: 'Please enter description'
                                })}
                            
                            </div>

                        </div>
                    </form>
                `;
            },

            updateBalance: function(opts = {}) {

                let self = this;

                let defaults = {

                    item: {
                        tcrId: '',
                        value: '',
                        name: '',
                        description: '',
                        changeDateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    },

                    tcrs: [],
                    operations: [{'id': 1, 'name': 'Deklaratë Fillestare'}, {id: 2, name: 'Tërheqje'}, {id: 3, name: 'Depozitim'}]
                };
                

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'TCR',
                                    select: {

                                        name: 'tcrId',
                                        value: opts.item.tcrId,
                                        options: opts.tcrs,
                                        required: true,
                                    },
                                    hint: 'Please choose tcr'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Amount',
                                    input: {

                                        name: 'value',
                                        value: opts.item.value,
                                        placeholder: 'Enter amount',
                                        required: true,
                                    },
                                    hint: 'Please enter amount'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Change Datetime',
                                    datetime: {

                                        name: 'changeDateTime',
                                        value: opts.item.changeDateTime,
                                        placeholder: 'Enter date',
                                        required: true,
                                    },
                                    hint: 'Please enter date'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    textarea: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description'
                                    },
                                    hint: 'Please enter description'
                                })}
                                

                            </div>
                        </div>
                    </form>`;
            },
            openBalace: function(opts = {}) {

                let self = this;

                let defaults = {

                    item: {
                        name: '',
                        description: '',
                        laboratory_id: '',
                        changeDateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    },

                    tcrs: [],
                };
                

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'TCR',
                                    select: {

                                        name: 'tcrId',
                                        value: opts.item.tcrId,
                                        options: opts.tcrs,
                                        required: true,
                                    },
                                    hint: 'Please choose tcr'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Amount',
                                    input: {

                                        name: 'value',
                                        value: opts.item.value,
                                        placeholder: 'Enter amount',
                                        required: true,
                                    },
                                    hint: 'Please enter amount'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Change Datetime',
                                    datetime: {

                                        name: 'changeDateTime',
                                        value: opts.item.changeDateTime,
                                        placeholder: 'Enter date',
                                        required: true,
                                    },
                                    hint: 'Please enter date'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    textarea: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description'
                                    },
                                    hint: 'Please enter description'
                                })}
                                

                            </div>
                        </div>
                    </form>`;
            },
            cashInOut: function(opts = {}) {

                let self = this;

                let defaults = {

                    item: {

                        tcr_id: '',
                        operation: '1',
                        value: '',
                        description: '',
                    },

                    tcrs: [],
                };
                

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'TCR',
                                    select: {

                                        name: 'tcr_id',
                                        value: opts.item.tcr_id,
                                        options: opts.tcrs,
                                        required: true,
                                    },
                                    hint: 'Please choose tcr'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Operation',
                                    select: {

                                        name: 'operation',
                                        value: opts.item.operation,
                                        options: [{id: '1', name: 'Cash Out'}, {id: '2', name: 'Cash In'}],
                                        required: true,
                                    },
                                    hint: 'Please choose operation'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Amount',
                                    input: {

                                        name: 'value',
                                        value: opts.item.value,
                                        placeholder: 'Enter amount',
                                        required: true,
                                    },
                                    hint: 'Please enter amount'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    input: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description'
                                    },
                                    hint: 'Please enter description'
                                })}

                            </div>
                        </div>
                    </form>`;
            }
        },
        'tcr-balances': {

            template: function(opts = {}) {

                let self = this;

                let defaults = {

                    item: {

                        value: '',
                        description: '',
                        changeDateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    },

                    tcrs: [],
                    operations: [{'id': 1, 'name': 'Deklaratë Fillestare'}, {id: 2, name: 'Tërheqje'}, {id: 3, name: 'Depozitim'}]
                };
                

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'TCR',
                                    select: {

                                        name: 'tcrId',
                                        value: opts.item.tcrId,
                                        options: opts.tcrs,
                                        required: true,
                                    },
                                    hint: 'Please choose tcr'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Operation',
                                    select: {

                                        name: 'operation',
                                        value: opts.item.operation,
                                        options: opts.operations,
                                        required: true,
                                    },
                                    hint: 'Please choose tcr'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Amount',
                                    input: {

                                        name: 'value',
                                        value: opts.item.value,
                                        placeholder: 'Enter amount',
                                        required: true,
                                    },
                                    hint: 'Please enter amount'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Change Datetime',
                                    datetime: {

                                        name: 'changeDateTime',
                                        value: opts.item.changeDateTime,
                                        placeholder: 'Enter date',
                                        required: true,
                                    },
                                    hint: 'Please enter date'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    textarea: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description'
                                    },
                                    hint: 'Please enter description'
                                })}
                                

                            </div>
                        </div>
                    </form>`;
            },
            openBalace: function(opts = {}) {

                let self = this;

                let defaults = {

                    item: {
                        name: '',
                        description: '',
                        laboratory_id: '',
                        changeDateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    },

                    tcrs: [],
                };
                

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'TCR',
                                    select: {

                                        name: 'tcrId',
                                        value: opts.item.tcrId,
                                        options: opts.tcrs,
                                        required: true,
                                    },
                                    hint: 'Please choose tcr'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Amount',
                                    input: {

                                        name: 'value',
                                        value: opts.item.value,
                                        placeholder: 'Enter amount',
                                        required: true,
                                    },
                                    hint: 'Please enter amount'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Change Datetime',
                                    datetime: {

                                        name: 'changeDateTime',
                                        value: opts.item.changeDateTime,
                                        placeholder: 'Enter date',
                                        required: true,
                                    },
                                    hint: 'Please enter date'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    textarea: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description'
                                    },
                                    hint: 'Please enter description'
                                })}
                                

                            </div>
                        </div>
                    </form>`;
            },
            cashInOut: function(opts = {}) {

                let self = this;

                let defaults = {

                    item: {

                        tcr_id: '',
                        operation: '1',
                        value: '',
                        description: '',
                    },

                    tcrs: [],
                };
                

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'TCR',
                                    select: {

                                        name: 'tcr_id',
                                        value: opts.item.tcr_id,
                                        options: opts.tcrs,
                                        required: true,
                                    },
                                    hint: 'Please choose tcr'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Operation',
                                    select: {

                                        name: 'operation',
                                        value: opts.item.operation,
                                        options: [{id: '1', name: 'Cash Out'}, {id: '2', name: 'Cash In'}],
                                        required: true,
                                    },
                                    hint: 'Please choose operation'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Amount',
                                    input: {

                                        name: 'value',
                                        value: opts.item.value,
                                        placeholder: 'Enter amount',
                                        required: true,
                                    },
                                    hint: 'Please enter amount'
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    input: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description'
                                    },
                                    hint: 'Please enter description'
                                })}

                            </div>
                        </div>
                    </form>`;
            }
        },
        transporters: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                    suppliers: []
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Nuis',
                                    input: {

                                        name: 'nuis',
                                        value: item.nuis,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Name',
                                    input: {

                                        name: 'name',
                                        value: item.name,
                                        placeholder: 'Enter name',
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Phone',
                                    input: {

                                        name: 'phoneNo',
                                        value: item.phoneNo,
                                        placeholder: 'Enter phone',
                                        required: true
                                    }
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Address')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: '',
                                    textarea: {

                                        name: 'address',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                        required: true
                                    },
                                    hint: ''
                                })}
                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        users: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                    suppliers: [],
                    cities: [],
                    pos: [],
                    supplierList: [],
                    roles: [],
                    
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Full Name',
                                    input: {

                                        name: 'fullName',
                                        value: item.fullName,
                                        required: true
                                    },
                                    hint: ''
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Username',
                                    input: {

                                        name: 'userName',
                                        value: item.userName,
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Email',
                                    input: {

                                        name: 'email',
                                        value: item.email,
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Role',
                                    selectpicker: {

                                        name: 'roles',
                                        value: item.roles,
                                        attributes: {'data-live-search': true, multiple: true},
                                        required: true,
                                        options: opts.roles
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Job Title',
                                    input: {

                                        name: 'jobTitle',
                                        value: item.jobTitle,
                                        placeholder: 'Enter job title',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Phone',
                                    input: {

                                        name: 'phoneNumber',
                                        value: item.phoneNumber,
                                        placeholder: 'Enter phone',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'City',
                                    selectpicker: {

                                        name: 'city',
                                        value: item.city,
                                        attributes: {'data-live-search': true},
                                        options: [{id: '', name: ''}, ...opts.cities]
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Address',
                                    input: {

                                        name: 'address',
                                        value: item.address,
                                        placeholder: 'Enter address',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Is Enabled',
                                    checkbox: {

                                        name: 'isEnabled',
                                        value: '1',
                                        checked: item.isEnabled == '1' ? true:false
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Configurations')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Configuration',
                                    input: {

                                        name: 'configuration',
                                        value: item.configuration,
                                        placeholder: 'Enter configuration',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Operator Code',
                                    input: {

                                        name: 'operatorCode',
                                        value: item.operatorCode,
                                        placeholder: 'Enter operatorCode',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Points Of Sale Id',
                                    select: {

                                        name: 'pointsOfSaleId',
                                        value: item.pointsOfSaleId,
                                        options: function(value) {

                                            return (Cache.get('pos')||[]).map(model => {

                                                return `<option value="${model.id}" ${value == model.id ? 'selected':''}>${model.code}</option>`;
                                            }).join('');
                                        },
                                        required: true
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Sales Limit',
                                    input: {

                                        name: 'saleLimit',
                                        value: item.saleLimit,
                                        placeholder: 'Enter sales limit'
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Supplier Nuis List',
                                    selectpicker: {

                                        name: 'supplierNuisList',
                                        value: item.supplierNuisList,
                                        attributes: {'data-live-search': true, multiple: true},
                                        options: opts.supplierList
                                    },
                                    hint: ''
                                    
                                })}
                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Password')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3 not-parameters',
                                    label: 'Password',
                                    input: {

                                        name: 'newPassword',
                                        value: '',
                                    },
                                    hint: ''
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-6 form-group-sub mb-3',
                                    label: 'Retype Password',
                                    input: {

                                        name: 'newPasswordConfirm',
                                        value: '',
                                    },
                                    hint: ''
                                    
                                })}

                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
        warehouses: {

            template: function(opts = {}) {

                let defaults = {

                    item: {},
                    suppliers: []
                };

                opts = $.extend(defaults, opts);
                let item = opts.item;

                return `
                    <form class="k-form col-12" id="k_form_1" method="get" action="">
                        <div class="k-portlet__body">

                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Code',
                                    input: {

                                        name: 'code',
                                        value: item.code,
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Description',
                                    input: {

                                        name: 'description',
                                        value: item.description,
                                        placeholder: 'Enter description',
                                        required: true
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Phone',
                                    input: {

                                        name: 'phone',
                                        value: item.phone,
                                        placeholder: 'Enter phone',
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Email',
                                    input: {

                                        name: 'email',
                                        value: item.email,
                                        placeholder: 'Enter email',
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'WareHouse Type',
                                    select: {

                                        name: 'wareHouseType',
                                        value: item.wareHouseType,
                                        options: opts.warehouseTypes
                                    }
                                    
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 form-group-sub mb-3',
                                    label: 'Sort',
                                    input: {

                                        name: 'order',
                                        value: item.order,
                                        options: opts.order
                                    }
                                    
                                })}

                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Geolocation')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: 'Latitude',
                                    input: {

                                        name: 'latitude',
                                        value: item.latitude,
                                        placeholder: 'Enter latitude',
                                    },
                                    hint: ''
                                })}

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: 'Longitude',
                                    input: {

                                        name: 'longitude',
                                        value: item.longitude,
                                        placeholder: 'Enter longitude',
                                    },
                                    hint: ''
                                })}
                            </div>

                            <div class="mt-5">
                                <div class="k-heading k-heading--space-sm"> ${__('Notes')}</div>
                            </div>
                            <div class="k-separator k-separator--space-sm k-separator--border-solid k-separator--portlet-fit"></div>
                                
                            <div class="form-group row">

                                ${Html.formElement({

                                    class: 'col-md-12 mb-3',
                                    label: '',
                                    textarea: {

                                        name: 'notes',
                                        value: item.notes,
                                        placeholder: 'Enter notes',
                                    },
                                    hint: ''
                                })}
                            </div>

    
                        </div>
                    </form>`
                ;
            },
        },
    }
});