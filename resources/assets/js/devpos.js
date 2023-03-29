

var DevPos = {

    Account: {

        itemType: 'accounts',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    accountName1: {field: 'accountName1', title: __('Account Name')},  
                    bankAddressLine: {field: 'bankAddressLine', title: __('Bank Address Line')},  
                    bankCity: {field: 'bankCity', title: __('Bank City')},  
                    bankCountry: {field: 'bankCountry', title: __('Bank Country')},  
                    bankCountryCode: {field: 'bankCountryCode', title: __('Bank Country Code')},  
                    bankName: {field: 'bankName', title: __('Bank Name')},  
                    bankSwift: {field: 'bankSwift', title: __('Bank Swift')},  
                    centerType: {field: 'centerType', title: __('Center Type')},  
                    currency: {field: 'currency', title: __('Currency')},  
                    number: {field: 'number', title: __('number')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'number', 'currency', 'accountName1', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'lg',
                template: templates()[self.prefix][self.itemType].template({
                    item: opts.item, 
                    banks: Cache.get('banks'), 
                    currencies: Cache.get('currencies'), 
                    centerTypes: Cache.get('centerTypes') 
                }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);


                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    BankPayment: {

        itemType: 'bank-payments',
        prefix: 'devpos',
        cancel: function(iic) {

            let self = this;
            
            swalConfirm({
			
                text: '',
                type: 'question',
                confirm: function(opts) {
                    
                    
                    new Route(self.itemType).prefix(self.prefix).whereId(iic).action('cancel').put({}, function(res) {

                        //Page.reload(2000);
                        opts.callback();

                    }, function(res) {

                        generalError();
                    });

                }
            }); 

        },
        create: function() {
                
            return this.modal();
        },
        correct: function(iic) {
    
            return this.modal({iic: iic});
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        download: function(eic) {

            return Export.html2pdf({

                html: this.replaceCanvasWithImage($('#invoiceContent')).html(),
                withHeader: false
            });
        },
        edit(itemID) {

            let self = this;

            let item = Cache.get(this.itemType).find(x => x.id == itemID);
    
            //first get it from db
            return self.modal({item: item});
           
        },
        export: function() {

            //download it
            window.location.href = '/'+ this.prefix +'/'+ this.itemType +'/export?'+  $.param(this.queryParameters());
        },
        filter(source = []) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);
    
            let filtered = source?.slice()||[];
            
            // we add other filter condition here
            if(!empty(parameters.operatorName)) {

                filtered = filtered.filter(row => { 

                    return row.operatorName.toLowerCase().startsWith(parameters.operatorName.toLowerCase()); 
                });
            }if(!empty(parameters.customerBusinessName)) {

                filtered = filtered.filter(row => { 
                    
                    if (!empty(row.customerBusinessName))
                        return row.customerBusinessName.toLowerCase().startsWith(parameters.customerBusinessName.toLowerCase()); 
                });
            }
            if(!empty(parameters.name)) {

                filtered = filtered.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }
            if(!empty(parameters.total_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.totalPrice >= parseFloat(parameters.total_min); 
                });
            }
            if(!empty(parameters.total_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.totalPrice <= parseFloat(parameters.total_max); 
                });
            }
            if(!empty(parameters.created_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dateTimeCreated >= parameters.created_min; 
                });
            }
            if(!empty(parameters.created_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dateTimeCreated <= parameters.created_max; 
                });
            }

            //and in the end we return it
            return filtered;
        },
        queryParameters() { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="main_filter"]') , true);

            return parameters;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'refCode', 'payerNipt', 'datTimSend', 'bankNipt', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    refCode: {field: 'refCode', title: __('Reference Code')},  
                    payerNipt: {field: 'payerNipt', title: __('Payer')},  
                    datTimSend: {field: 'datTimSend', title: __('Date Time')},   
                    bankNipt: {field: 'bankNipt', title: __('Bank Nipt')}, 
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'refCode', 'payerNipt', 'datTimSend', 'bankNipt', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'lg',
                template: templates()[self.prefix][self.itemType].template({item: opts.item}),
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add products
                    parameters.pymtNotItems = [];
                    $('.paymentsList tbody tr').each(function() {

                        parameters.pymtNotItems.push({

                            einFic: $(this).attr('data-einFic'),
                            barcode: $(this).attr('data-overpaidAmount'),
                            isInvestment: $(this).attr('data-isInvestment'),
                            paidCur: $(this).attr('data-paidCur'),
                            paymentDateTime: $(this).attr('data-paymentDateTime'),
                            pymtStatus: $(this).attr('data-pymtStatus'),
                            pymtType: $(this).attr('data-pymtType'),
                            transactionCode: $(this).attr('data-transactionCode')
                        });

                    });
                    

                    return parameters;
                },
                save: function(opts) {

                    if (empty(opts.iic)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        //opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.iic).action('correct').put(opts.parameters, function(res) {

                            // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                },
                shown: function($modal) {

                    //listen to order.changed event to re calculate summaries
                    //fire trigger
                    $('form[name="newInvoice"]').on('order.changed', function() {

                        DevPos.Invoice.order.summaries.calculate();
                    });
                }
            };

            opts = $.extend(defaults, opts);

            console.log(opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            else if (opts.iic) 
                return Modal.edit({ ...opts,  title: __('Correct') +': '+ opts.iic });
            return Modal.create(opts);

            
        },
        payments: {

            add: function() {

                let parameters = {

                    einFic: $('.vModal:visible [name="einFic"]').val(),
                    barcode: $('.vModal:visible [name="barcode"]').val(),
                    isInvestment: $('.vModal:visible [name="isInvestment"]').val(),
                    paymentDateTime: $('.vModal:visible [name="paymentDateTime"]').val(),
                    paidAmt: $('.vModal:visible [name="paidAmt"]').val(),
                    paidCur: $('.vModal:visible [name="paidCur"]').val(),
                    pymtStatus: $('.vModal:visible [name="pymtStatus"]').val(),
                    pymtType: $('.vModal:visible [name="pymtType"]').val(),
                    transactionCode: $('.vModal:visible [name="transactionCode"]').val(),
                    overpaidAmount: $('.vModal:visible [name="overpaidAmount"]').val(),
                };

                let nr = $('.paymentsList tbody tr').length + 1;
                parameters.nr = nr;

                $('.paymentsList tbody').append(this.row(parameters));

                //clear all inputs
                $('.vModal:visible .newPayment input').val('');
            },
            remove: function(elm) {

                $(elm).closest('tr').remove();
            },
            row: function(parameters = {}) {

                return `
                <tr 
                    data-einFic="${parameters.einFic}" 
                    data-barcode="${parameters.barcode}" 
                    data-paymentDateTime="${parameters.paymentDateTime}" 
                    data-isInvestment="${parameters.isInvestment}" 
                    data-paidAmt="${parameters.paidAmt}" 
                    data-paidCur="${parameters.paidCur}" 
                    data-pymtStatus="${parameters.pymtStatus}" 
                    data-pymtType="${parameters.pymtType}" 
                    data-transactionCode="${parameters.eintransactionCodeFic}"
                > 
                    <td>${parameters.nr}</td>
                    <td>${parameters.einFic}</td>
                    <td>${parameters.paymentDateTime}</td>
                    <td>${parameters.paidAmt}</td>
                    <td>${parameters.paidCur}</td>
                    <td>${parameters.pymtStatus}</td>
                    <td>${parameters.pymtType}</td>
                    <td>${parameters.transactionCode}</td>
                    <td>${parameters.overpaidAmount}</td>
                    <td><i class="fa fa-trash k-font-danger" onclick="DevPos.BankPayment.payments.remove(this)"></i></td>
                    
                </tr>`;
            }
        },
        print: function() {

            //first we have to replace the canvas with image
            var can = document.querySelector('#qrcode canvas');
            var ctx = can.getContext('2d');

            //ctx.fillRect(50,50,50,50);

            var img = new Image();
            img.src = can.toDataURL();
            document.body.appendChild(img);

            let div = $('<div />').html($('#invoiceContent').parent().html());
            div.find('canvas').replaceWith(img);

            //print it
            Printer.print(div.html());
        },
        replaceCanvasWithImage: function($element) { 

            //first we have to replace the canvas with image
            var cans = $element[0].querySelectorAll('canvas');

            cans.forEach(function(can) {

                var ctx = can.getContext('2d');
    
                var img = new Image();
                img.src = can.toDataURL();
                document.body.appendChild(img);
    
                //replace it
                can.replaceWith(img);

            });

            return $element;
            
        },
        search: function() {

            return new Model(this.itemType);
        },
        url: function(itemID) {

            return `/devpos/invoices/${itemID}`;
        },
        view: function(itemID) {
            
            window.location.href = this.url(itemID);
        }
    },
    Carrier: {

        itemType: 'carriers',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    name: {field: 'name', title: __('Name')},  
                    address: {field: 'address', title: __('Address')},  
                    iDtype: {field: 'iDtype', title: __('ID Type')},   
                    identificationNo: {field: 'identificationNo', title: __('Identification No')}, 
                    town: {field: 'town', title: __('Town')}, 
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'cardNumber', 'name', 'surname', 'contact', 'address', 'clientCardType', 'email',  'customer', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'lg',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, idTypes: Cache.get('idTypes'), cities: Cache.get('cities') }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);


                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    Customer: {

        itemType: 'customers',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    name: {field: 'name', title: __('Name')},  
                    address: {field: 'address', title: __('Address')},  
                    code: {field: 'code', title: __('Code')},   
                    country: {field: 'country', title: __('Country')}, 
                    countryCode: {field: 'countryCode', title: __('Country Code')}, 
                    idNumber: {field: 'idNumber', title: __('Number')},  
                    idType: {field: 'idType', title: __('Type')},   
                    town: {field: 'town', title: __('Town')},    
                    street: {field: 'street', title: __('Street')},  
                    
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                    
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'address', 'idNumber', 'idType', 'code', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'lg',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, idTypes: Cache.get('idTypes'), countries: Arr.pluck(Cache.get('countries'), 'name', 'countryCode') }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add countryCode
                    parameters.countryCode = Cache.get('countries').find(row => row.id == parameters.countryId)?.countryCode;

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    ClientCard: {

        itemType: 'client-cards',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    name: {field: 'name', title: __('Name')},  
                    address: {field: 'address', title: __('Address')},  
                    birthday: {field: 'birthday', title: __('Birthday')},   
                    cardNumber: {field: 'cardNumber', title: __('Card Number')}, 
                    clientCardType: {field: 'clientCardType', title: __('Client Card Type')}, 
                    contact: {field: 'contact', title: __('Contact')},  
                    percentage: {field: 'percentage', title: __('Percentage')},   
                    points: {field: 'points', title: __('Points')},    
                    surname: {field: 'surname', title: __('Surname')},  
                    totalPoints: {field: 'totalPoints', title: __('Total Points')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'cardNumber', 'name', 'surname', 'contact', 'address', 'clientCardType', 'email',  'customer', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'lg',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, idTypes: Cache.get('idTypes'), cities: Cache.get('cities') }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);


                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    AccompanyingInvoice: {

        itemType: 'accompanying-invoices',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source = []) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);
    
            let filtered = source?.slice()||[];
            
            // we add other filter condition here
            if(!empty(parameters.documentNumber)) {

                filtered = filtered.filter(row => { 

                    return row.documentNumber.toLowerCase().startsWith(parameters.documentNumber.toLowerCase()); 
                });
            }if(!empty(parameters.buyerName)) {

                filtered = filtered.filter(row => { 
                    
                    if (!empty(row.buyerName))
                        return row.buyerName.toLowerCase().startsWith(parameters.buyerName.toLowerCase()); 
                });
            }
            if(!empty(parameters.buyerNuis)) {

                filtered = filtered.filter(row => { 
                    
                    return row.buyerNuis.toLowerCase().startsWith(parameters.buyerNuis.toLowerCase()); 
                });
            }
            if(!empty(parameters.eic)) {

                filtered = filtered.filter(row => { 
                    
                    return row.eic.toLowerCase().startsWith(parameters.eic.toLowerCase()); 
                });
            }
            if(!empty(parameters.invoiceStatus)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceStatus.toLowerCase().startsWith(parameters.invoiceStatus.toLowerCase()); 
                });
            }
            if(!empty(parameters.statusCanBeChanged)) {

                filtered = filtered.filter(row => { 
                    
                    return row.statusCanBeChanged.toLowerCase().startsWith(parameters.statusCanBeChanged.toLowerCase()); 
                });
            }
            if(!empty(parameters.amount_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.amount >= parseFloat(parameters.amount_min); 
                });
            }
            if(!empty(parameters.amount_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.amount <= parseFloat(parameters.amount_max); 
                });
            }
            if(!empty(parameters.dueDate_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dueDate >= parameters.dueDate_min; 
                });
            }
            if(!empty(parameters.dueDate_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dueDate <= parameters.dueDate_max; 
                });
            }
            if(!empty(parameters.created_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceCreatedDate >= parameters.created_min; 
                });
            }
            if(!empty(parameters.created_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceCreatedDate <= parameters.created_max; 
                });
            }

            //and in the end we return it
            return filtered;
        },
        queryParameters() { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="main_filter"]') , true);

            return parameters;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  

                    businessUnit: {field: 'businessUnit', title: __('businessUnit')}, 
                    startAddress: {field: 'startAddress', title: __('Start Address')}, 
                    startCity: {field: 'startCity', title: __('Start City')}, 
                    destinationAddress: {field: 'destinationAddress', title: __('Destination Address')}, 
                    destinationCity: {field: 'destinationCity', title: __('Destination City')}, 
                    dateTimeCreated: {field: 'dateTimeCreated', title: __("Created Date"), type: "date", template: function(row){ return moment(row.dateTimeCreated).format("MM/DD/YYYY hh:mm"); }},
                    

                    vehiclePlate: {field: 'vehiclePlate', title: __('Vehicle Plate')},  
                    businessUnit: {field: 'businessUnit', title: __('businessUnit')},  
                    destinationPoint: {field: 'destinationPoint', title: __('destinationPoint')}, 
                    fwtnic: {field: 'fwtnic', title: __('fwtnic')},  
                    fwtnic: {field: 'isAfterDelivery', title: __('isAfterDelivery')}, 
                    isEscortRequired: {field: 'isEscortRequired', title: __('isEscortRequired')},  
                    isGoodsFlammable: {field: 'isGoodsFlammable', title: __('isGoodsFlammable')},  
                    issuerAddress: {field: 'issuerAddress', title: __('issuerAddress')},  
                    issuerName: {field: 'issuerName', title: __('issuerName')},  
                    issuerNuis: {field: 'issuerNuis', title: __('issuerNuis')},  
                    issuerTown: {field: 'issuerTown', title: __('issuerTown')},  
                    operatorCode: {field: 'operatorCode', title: __('operatorCode')},  
                    packNumber: {field: 'packNumber', title: __('packNumber')},  
                    softwareNumber: {field: 'softwareNumber', title: __('softwareNumber')},  
                    startAddress: {field: 'startAddress', title: __('startAddress')},  
                    startCity: {field: 'startCity', title: __('startCity')},  
                    startDateTime: {field: 'startDateTime', title: __('startDateTime')},  
                    startPoint: {field: 'startPoint', title: __('startPoint')},  
                    total: {field: 'total', title: __('total')},  
                    vehicleOwnershipType: {field: 'vehicleOwnershipType', title: __('vehicleOwnershipType')},  
                    vehiclePlate: {field: 'vehiclePlate', title: __('vehiclePlate')},  
                    verificationUrl: {field: 'verificationUrl', title: __('verificationUrl')},  
                    wtnNumber: {field: 'wtnNumber', title: __('wtnNumber')},   
                    wtnProduct: {field: 'wtnProduct', title: __('wtnProduct')},   
                    wtnType: {field: 'wtnType', title: __('wtnType')},   
                    wtnic: {field: 'wtnic', title: __('wtnic')},  
                  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" target="_blank" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('View')}" data-id="${row.id}" ><i class="la la-eye"></i> </a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-eye').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        window.location.href = self.url(itemID);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            new Route(this.itemType).prefix(this.prefix).query(this.queryParameters()).get(function(res) {
    
                self.list({
    
                    columns: ['id', 'startCity', 'startAddress', 'destinationCity', 'destinationAddress', 'dateTimeCreated', 'amount', 'buyerName', 'buyerNuis', 'actions'],
                    source: res.Data,
                    filter: function(source = []) {
    
                        return self.filter(source);
                    }
                });

            });

        },
        modal: function(opts = {}) {
            
            let self = this;

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'xl',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, tcrs: Cache.get('tcrs')}),
                
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //set invoiceType = 1
                    parameters.invoiceType = 1;
                    parameters.isEinvoice = true;

                    //add customer
                    if (empty(parameters.customer.idNumber) && empty(parameters.customer.name)) 
                        delete parameters.customer;

                    //add products
                    parameters.invoiceProducts = [];
                    $('#productsList tbody tr').each(function() {

                        parameters.invoiceProducts.push({

                            productId: $(this).attr('data-product-id'),
                            barcode: $(this).attr('data-barcode'),
                            isInvestment: $(this).attr('data-investment'),
                            name: $(this).find('[data-attribute="name"]').text().trim(),

                            isRebateReducingBasePrice: 1,
                            rebatePrice: 0,

                            unit: $(this).find('[data-attribute="unit"]').text().trim(),
                            quantity: $(this).find('[name="quantity"]').val().trim(),
                            unitPrice: parseFloat($(this).find('[name="unitPrice"]').val()?.trim()||0),
                            vatRate: $(this).find('[data-attribute="vatRate"]').text().trim(),

                        });

                    });

                    //add fees
                    parameters.invoiceFees = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        parameters.invoiceFees.push({

                            feeType: $(this).find('[name="feeType"]').val(),
                            amount: $(this).find('[name="amount"]').val(),
                        });
                    });

                    //add invoicePayments
                    parameters.invoicePayments = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        let payment = {

                            paymentMethodType: $(this).find('[name="paymentMethodType"]').val(),
                            amount: $(this).find('[name="amount"]').val()
                        };

                        if (payment.paymentMethodType == '2') {
                            payment.voucher = $(this).find('[name="voucher"]').val();
                        }

                        if (payment.paymentMethodType == '6') {
                            payment.accountId = $(this).find('[name="accountId"]').val();
                        }

                        parameters.invoicePayments.push(payment);
                    });

                    //extra
                    if (parameters.selfIssuing == '1') {

                        parameters.selfIssuingType = $modal.find('[name="selfIssuingType"]').val();
                    }

                    if ($modal.find('[name="isLateFiscalized"]').is(':checked')) {

                        parameters.subsequentDeliveryType = $modal.find('[name="subsequentDeliveryType"]').val();
                    }
                    

                    return parameters;
                },
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        print: function() {

            //first we have to replace the canvas with image
            var can = document.querySelector('#qrcode canvas');
            var ctx = can.getContext('2d');

            //ctx.fillRect(50,50,50,50);

            var img = new Image();
            img.src = can.toDataURL();
            document.body.appendChild(img);

            let div = $('<div />').html($('#invoiceContent').parent().html());
            div.find('canvas').replaceWith(img);

            //print it
            Printer.print(div.html());
        },
        product: {

            add($modal) {

                if(typeof $modal == 'undefined')
                    $modal = $('.modal:visible');

                $modal.find('.productLine:last').after( DevPos.Invoice.product.component() );

                //focus input
                $modal.find('.productLine:last input.tt-input').focus();
            },
            calculateTax: function(opts = {}) {

                let defaults = {

                    tax: {},
                    rate: 0,
                    discount: 0,
                    productLine: null
                };

                opts = $.extend(defaults, opts);

                if (!empty(opts.productLine)) {

                    opts.rate = parseFloat(opts.productLine.find('[name="rate"]').attr('data-rate')||0);
                    opts.discount = parseFloat(opts.productLine.find('[name="discount"]').val()||0);
                }

                console.log(opts);

                //now we calculate the tax value based on it configuration, rate and discount
                let tax = 0;

                if (opts.tax.type == 'On Net Total') {

                    tax = (opts.rate - opts.discount) * opts.tax.rate / 100;
                }
                else if (opts.tax.type == 'Actual') {

                    tax = opts.tax.amount ;
                }

                return parseFloat(tax);
                
            },
            component: function(first = false, doctors = []) {

                let self = this;

                let defaults = Cache.get('doctors');
                doctors = $.extend(defaults, doctors);

                let html = 
                `<div class="input-group input-group-lg-group productLine mb-3">

                    <div class="col-3 px-0">
                        ${Html.input({

                            name: 'product_id',
                            class: 'form-control mb-3',
                            placeholder: __('Choose product'),
                            shown: function(elm) {

                                $(elm).productSuggestion({

                                    source: function(instance, query, sync, async) {

                                        //filter all products that is not selected on any other line
                                        let selected = [];
                                        // $(instance).closest('form').find('[name="product_id"]').each(function(){

                                        //     let id = $(this).attr('data-suggest-id');
                                        //     if (!empty(id)) {

                                        //         selected.push(id);
                                        //     }
                                        // });

                                        return new Model('products').select('id', 'name').where('name', 'like', query +'%').when(selected.length, function($query){

                                            $query.whereNotIn('id', selected);
                                        }).limit(5).get(function(res) { 
                            
                                            async(res.Data); 
                                        });
                                    },

                                    onSelect: function(suggestion, instance) {

                                        //when we choose the product => we load doctors and rate with their pricing rules
                                        let parameters = Modal.parameters($('.vModal:visible'));
                                        let patient_id = parameters.patient_id;
                                        let price_list_id = parameters.price_list_id;
                                        let applyPricingRules = parameters.disable_pricing_rules ? 0:1;
                                        let discount_id = parameters.discount_id;

                                        let products_id = $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get();
                                        let total_products_quantity = $('.vModal:visible').find('[name="product_id"].is-valid').length;
                                        let subtotal = $('.vModal:visible').find('.subtotal').text().trim();


                                        new MAPI(

                                            new Model('users').select('users.id', 'users.name', 'product_doctor.rate').join('product_doctor', 'users.id', '=', 'user_id'),
                                            new Model('products').method('getRates').parameters({product_id: suggestion.id, patient_id, discount_id, products_id, total_products_quantity, subtotal, price_list_id, applyPricingRules}),
                                            new Model('products').method('pricingRules').parameters({product_id: suggestion.id, patient_id: patient_id}),
                                            new Model('taxes').whereHas('productes', function($query) {

                                                return $query.where('id', suggestion.id);
                                            }).limit(1)
                                            
                                        ).call(function(doctors, rates, pricingRules, tax) {

                                            $(instance).closest('.productLine').find('select[name="doctor_id"]').html(doctors.map(x => {

                                                return '<option value="'+ x.id +'" data-rate="'+ rates.Rate +'">'+ x.name +'</option>';
                                            }).join(''));


                                            //set rate
                                            let rate = $(instance).closest('.productLine').find('select[name="doctor_id"] option:selected').attr('data-rate');
                                            $(instance).closest('.productLine').find('[name="rate"]').val(rates.Rate).attr('data-rate', rates.Rate);
                                            

                                            //set tax
                                            if (!empty(rates.Tax)) { 

                                                let tax_amount = DevPos.Invoice.product.calculateTax({tax: rates.Tax, productLine: $(instance).closest('.productLine')});
                                                $(instance).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                                            }


                                            //fire trigger
                                            $(instance).closest('form').trigger('invoice.change');

                                            //lastly we load the pricing rules for this product
                                            Invoice.pricing_rules.add(pricingRules);
                                        
                                        });
                                    },
                                    onDeselect: function(instance) {

                                        $(instance).closest('.productLine').find('[name="doctor_id"]').html('');
                                        $(instance).closest('.productLine').find('[name="rate"]').val('').attr('data-rate', '');

                                        //fire trigger
                                        $(instance).closest('form').trigger('invoice.change');
                                        
                                    }

                                });
                            }
                        })}
                    </div>

                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="rate" placeholder="${__('price')}" disabled>
                    </div>
                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="discount" placeholder="${__('discount')}" disabled>
                    </div>
                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="tax" placeholder="${__('tax')}" disabled>
                    </div>

                    <div class="col-2 float-left px-0 input-group-append">

                        ${Html.select({

                            name: 'doctor_id',
                            class: 'form-control',
                            options: [__('Choose doctor')],
                            onChange: function(elm) {

                                let rate = $(elm).find('option:selected').attr('data-rate');

                                //set rate
                                $(elm).closest('.productLine').find('input[name="rate"]').val(rate).attr('data-rate', rate);

                                //re calculate summaries
                                $(elm).closest('form').trigger('invoice.change');
                            },
                        })}
                        
                    
                    </div>
                    
                    ${(first == true ? ``:`<div class="input-group-append col-1 px-0">
                        <a href="javascript:void(0)" class="input-group-text" id="basic-addon1" onClick="Invoice.product.remove(this);"><i class="fa fa-trash k-font-danger"></i></a>
                    </div>`)}

                </div>`;

                return html;
            },
            reloadRates: function(opts = {}) {

                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

                let parameters = Modal.parameters($('.vModal:visible'));
            
                $('.vModal:visible').find('[name="product_id"]').each(function(){

                    if (empty($(this).attr('data-suggest-id')))
                        return;
                        
                    let self = this;
                    let product_id = $(this).attr('data-suggest-id');
                    new Model('products').method('getRates').parameters({

                        product_id: product_id, 

                        patient_id: parameters.patient_id, 
                        discount_id: parameters.discount_id,
                        products_id: $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get(),
                        total_products_quantity: $('.vModal:visible').find('[name="product_id"].is-valid').length,
                        subtotal: $('.vModal:visible').find('.subtotal').text().trim(),

                        price_list_id: parameters.price_list_id,
                        applyPricingRules: parameters.disable_pricing_rules ? 0:1,
                        
                    }).call(function(res) {

                        $(self).closest('.productLine').find('[name="rate"]').val(res.Data.Rate).attr('data-rate', res.Data.Rate).change();
                        $(self).closest('.productLine').find('[name="discount"]').val(priceNum(res.Data.DiscountAmount)).attr('data-discount', res.Data.DiscountAmount).change();
                        
                        //set tax
                        if (!empty(res.Data.Tax)) { 

                            let tax_amount = Invoice.product.calculateTax({tax: res.Data.Tax, productLine: $(self).closest('.productLine')});
                            console.log(tax_amount);
                            $(self).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                        }

                        //fire invoice change
                        Invoice.summaries.calculate();
                        //new Buffer('reCalculateSummaries', Invoice.summaries.calculate, 600);
                    });
                });

            },
            reloadTaxes: function(opts = {}) {

                //if there aren't any product -> we skip this fn
                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;


                let parameters = Modal.parameters($('.vModal:visible'));

                let defaults = {

                    tax_id: parameters.tax_id
                };

                opts = $.extend(defaults, opts);

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

            
                //first we have to load tax from db
                new MAPI(

                    new Model('taxes').where('id', opts.tax_id).limit(1)

                ).call(function(tax) {

                    $('.vModal:visible').find('[name="product_id"]').each(function(){

                        if (empty($(this).attr('data-suggest-id')))
                            return;
                            
                        //we have to get tax for each product to check 
                        let self = this;
                        let product_id = $(this).attr('data-suggest-id');
                        new Model('products').method('getRates').parameters({

                            product_id: product_id, 

                            patient_id: parameters.patient_id, 
                            discount_id: parameters.discount_id,
                            products_id: $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get(),
                            total_products_quantity: $('.vModal:visible').find('[name="product_id"].is-valid').length,
                            subtotal: $('.vModal:visible').find('.subtotal').text().trim(),

                            price_list_id: parameters.price_list_id,
                            applyPricingRules: parameters.disable_pricing_rules ? 0:1,
                            
                        }).call(function(res) {

                            $(self).closest('.productLine').find('[name="rate"]').val(res.Data).attr('data-rate', res.Data).change();
                            $(self).closest('.productLine').find('[name="discount"]').val(priceNum(res.DiscountAmount)).attr('data-discount', res.DiscountAmount).change();
                            
                            //set tax
                            if (!empty(res.Tax)) { 

                                let tax_amount = Invoice.product.calculateTax({tax: res.Tax, productLine: $(self).closest('.productLine')});
                                $(self).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                            }

                            //fire invoice change
                            Invoice.summaries.calculate();
                            //new Buffer('reCalculateSummaries', Invoice.summaries.calculate, 600);
                        });
                    });
                
                });

            },
            loadDiscount: function(opts = {}) {

                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

                let parameters = Modal.parameters($('.vModal:visible'));
            
                $('.vModal:visible').find('[name="product_id"]').each(function() {

                    if (empty($(this).attr('data-suggest-id')))
                        return;
                        
                    let self = this;
                    let product_id = $(this).attr('data-suggest-id');
                    new Model('products').method('getDiscount').parameters({

                        product_id: product_id, 
                        patient_id: parameters.patient_id, 
                        price_list_id: parameters.price_list_id,
                        applyPricingRules: parameters.disable_pricing_rules ? 0:1
                    }).call(function(res) {

                        $(self).closest('.productLine').find('[name="rate"]').val(res.Data).attr('data-rate', res.Data).change();

                        //fire invoice change
                        Invoice.summaries.calculate();
                    });
                });

            },
            remove(elm) {
                
                let $form = $(elm).closest('form');
                $(elm).closest('.productLine').remove();

                //fire trigger
                $form.trigger('invoice.change');

                
                //after resetting summaries we reload the rates bc we have to send new subtotal to server
                //reload Rates for products present already
                this.reloadRates();
            },
            removeLast($modal) {

                //remove last
                if ($modal.find('.productLine').length == 1)
                    return;
                
                $modal.find('.productLine:last').remove();

                //fire trigger
                $modal.find('form').trigger('invoice.change');
            }
        },
        save: function() {

            let self = this;

            let parameters = function($modal) {

                let parameters = Modal.parameters($modal);

                //subsequentDelivery
                if (!parameters.subsequentDelivery) {

                    delete parameters.subsequentDeliveryType;
                }

                if (!parameters.affectWarehouse) {

                    delete parameters.exitWarehouseId;
                    delete parameters.destinationWarehouseId;
                }

                //add products
                parameters.wtnProduct = [];
                $('#productsList tbody tr').each(function() {

                    parameters.wtnProduct.push({

                        productId: $(this).attr('data-product-id'),
                        barcode: $(this).attr('data-barcode'),
                        isInvestment: $(this).attr('data-investment'),
                        name: $(this).find('[data-attribute="name"]').text().trim(),

                        isRebateReducingBasePrice: 1,
                        rebatePrice: 0,

                        unit: $(this).find('[data-attribute="unit"]').text().trim(),
                        quantity: $(this).find('[name="quantity"]').val().trim(),
                        price: parseFloat($(this).find('[name="unitPrice"]').val()?.trim()||0),
                        vatRate: $(this).find('[data-attribute="vatRate"]').text().trim(),

                    });

                });


                return parameters;
            };

            //if (empty(this.item)) {

                let params = parameters($('form#k_form_1'));
                new Route(self.itemType).prefix(self.prefix).store(params, function(res) {

                    // //Page.reload(2000);
                    // opts.callback();

                }, function(res) {

                    generalError(res.Msg||'Something went wrong!');
                });
            //}
            // else {

            //     //add id
            //     opts.parameters.id = parseInt(opts.item.id);
            //     new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

            //        // Page.reload(2000);
            //         opts.callback();

            //     }, function(res) {

            //         generalError();
            //     });
            // }
        },
        search() {

            return new Model(this.itemType);
        },
        url: function(itemID, action = 'view') {

            return `/devpos/accompanying-invoices/`+ itemID + (action == 'edit' ? '/edit':'');
        },
        view: function(eic) {


            
            //window.location.href = 'blob:https://demo.devpos.al/'+ eic;
        },
        download: function(eic) {

            let downloadPDF = function (pdf) {

                const linkSource = `data:application/pdf;base64,${pdf}`;
                const downloadLink = document.createElement("a");
                const fileName = "abc.pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }

            const b64toBlob = (b64Data, contentType='', sliceSize=512) => {

                const byteCharacters = atob(b64Data);
                const byteArrays = [];
              
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  const slice = byteCharacters.slice(offset, offset + sliceSize);
              
                  const byteNumbers = new Array(slice.length);
                  for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                  }
              
                  const byteArray = new Uint8Array(byteNumbers);
                  byteArrays.push(byteArray);
                }
              
                const blob = new Blob(byteArrays, {type: contentType});
                return blob;
              }

            new Route(this.itemType).prefix(this.prefix).query({eic: eic}).get(function(res) {

                let pdfBase64 = res.Data[0].pdf;

                //download it
                //downloadPDF(pdfBase64);

                window.open(URL.createObjectURL(b64toBlob(pdfBase64, 'application/pdf')));
            });
            //window.location.href = 'blob:https://demo.devpos.al/'+ eic;
        }
    },
    EInvoice: {

        itemType: 'einvoices',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source = []) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);
    
            let filtered = source?.slice()||[];
            
            // we add other filter condition here
            if(!empty(parameters.documentNumber)) {

                filtered = filtered.filter(row => { 

                    return row.documentNumber.toLowerCase().startsWith(parameters.documentNumber.toLowerCase()); 
                });
            }if(!empty(parameters.buyerName)) {

                filtered = filtered.filter(row => { 
                    
                    if (!empty(row.buyerName))
                        return row.buyerName.toLowerCase().startsWith(parameters.buyerName.toLowerCase()); 
                });
            }
            if(!empty(parameters.buyerNuis)) {

                filtered = filtered.filter(row => { 
                    
                    return row.buyerNuis.toLowerCase().startsWith(parameters.buyerNuis.toLowerCase()); 
                });
            }
            if(!empty(parameters.eic)) {

                filtered = filtered.filter(row => { 
                    
                    return row.eic.toLowerCase().startsWith(parameters.eic.toLowerCase()); 
                });
            }
            if(!empty(parameters.invoiceStatus)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceStatus.toLowerCase().startsWith(parameters.invoiceStatus.toLowerCase()); 
                });
            }
            if(!empty(parameters.statusCanBeChanged)) {

                filtered = filtered.filter(row => { 
                    
                    return row.statusCanBeChanged.toLowerCase().startsWith(parameters.statusCanBeChanged.toLowerCase()); 
                });
            }
            if(!empty(parameters.amount_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.amount >= parseFloat(parameters.amount_min); 
                });
            }
            if(!empty(parameters.amount_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.amount <= parseFloat(parameters.amount_max); 
                });
            }
            if(!empty(parameters.dueDate_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dueDate >= parameters.dueDate_min; 
                });
            }
            if(!empty(parameters.dueDate_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dueDate <= parameters.dueDate_max; 
                });
            }
            if(!empty(parameters.created_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceCreatedDate >= parameters.created_min; 
                });
            }
            if(!empty(parameters.created_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceCreatedDate <= parameters.created_max; 
                });
            }

            //and in the end we return it
            return filtered;
        },
        queryParameters() { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="main_filter"]') , true);

            return parameters;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    amount: {field: 'amount', title: __('Amount')}, 
                    buyerName: {field: 'buyerName', title: __('Buyer Name')}, 
                    buyerNuis: {field: 'buyerNuis', title: __('Buyer Nuis')},  
                    documentNumber: {field: 'documentNumber', title: __('Document Number')},  
                    dueDate: {field: 'dueDate', title: __("Due Date"), type: "date", template: function(row){ return moment(row.invoiceCreatedDate).format("MM/DD/YYYY hh:mm"); }},
                    eic: {field: 'eic', title: __('EIC')},   
                    invoiceCreatedDate: {field: 'invoiceCreatedDate', title: __("Created Date"), type: "date", template: function(row){ return moment(row.invoiceCreatedDate).format("MM/DD/YYYY hh:mm"); }},
                    
                    invoiceStatus: {field: 'invoiceStatus', title: __('Invoice Status')},  
                    partyType: {field: 'partyType', title: __('Party Type')},  
                    sellerName: {field: 'sellerName', title: __('Seller Name')}, 
                    sellerNuis: {field: 'sellerNuis', title: __('Seller Nuis')},  
                    statusCanBeChanged: {field: 'statusCanBeChanged', title: __('Status Can Be Changed')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="${'blob:https://demo.devpos.al/'+ row.eic}" target="_blank" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('View')}" data-id="${row.eic}" ><i class="la la-eye"></i> </a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-eye').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.view(itemID);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            new Route(this.itemType).prefix(this.prefix).query(this.queryParameters()).get(function(res) {
    
                self.list({
    
                    columns: ['id', 'documentNumber', 'partyType', 'invoiceCreatedDate', 'dueDate', 'invoiceStatus', 'amount', 'buyerName', 'buyerNuis', 'actions'],
                    source: res.Data,
                    filter: function(source = []) {
    
                        return self.filter(source);
                    }
                });

            });

        },
        modal: function(opts = {}) {
            
            let self = this;

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'xl',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, tcrs: Cache.get('tcrs')}),
                
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //set invoiceType = 1
                    parameters.invoiceType = 1;
                    parameters.isEinvoice = true;

                    //add customer
                    if (empty(parameters.customer.idNumber) && empty(parameters.customer.name)) 
                        delete parameters.customer;

                    //add products
                    parameters.invoiceProducts = [];
                    $('#productsList tbody tr').each(function() {

                        parameters.invoiceProducts.push({

                            productId: $(this).attr('data-product-id'),
                            barcode: $(this).attr('data-barcode'),
                            isInvestment: $(this).attr('data-investment'),
                            name: $(this).find('[data-attribute="name"]').text().trim(),

                            isRebateReducingBasePrice: 1,
                            rebatePrice: 0,

                            unit: $(this).find('[data-attribute="unit"]').text().trim(),
                            quantity: $(this).find('[name="quantity"]').val().trim(),
                            unitPrice: parseFloat($(this).find('[name="unitPrice"]').val()?.trim()||0),
                            vatRate: $(this).find('[data-attribute="vatRate"]').text().trim(),

                        });

                    });

                    //add fees
                    parameters.invoiceFees = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        parameters.invoiceFees.push({

                            feeType: $(this).find('[name="feeType"]').val(),
                            amount: $(this).find('[name="amount"]').val(),
                        });
                    });

                    //add invoicePayments
                    parameters.invoicePayments = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        let payment = {

                            paymentMethodType: $(this).find('[name="paymentMethodType"]').val(),
                            amount: $(this).find('[name="amount"]').val()
                        };

                        if (payment.paymentMethodType == '2') {
                            payment.voucher = $(this).find('[name="voucher"]').val();
                        }

                        if (payment.paymentMethodType == '6') {
                            payment.accountId = $(this).find('[name="accountId"]').val();
                        }

                        parameters.invoicePayments.push(payment);
                    });

                    //extra
                    if (parameters.selfIssuing == '1') {

                        parameters.selfIssuingType = $modal.find('[name="selfIssuingType"]').val();
                    }

                    if ($modal.find('[name="isLateFiscalized"]').is(':checked')) {

                        parameters.subsequentDeliveryType = $modal.find('[name="subsequentDeliveryType"]').val();
                    }
                    

                    return parameters;
                },
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        product: {

            add($modal) {

                if(typeof $modal == 'undefined')
                    $modal = $('.modal:visible');

                $modal.find('.productLine:last').after( DevPos.Invoice.product.component() );

                //focus input
                $modal.find('.productLine:last input.tt-input').focus();
            },
            calculateTax: function(opts = {}) {

                let defaults = {

                    tax: {},
                    rate: 0,
                    discount: 0,
                    productLine: null
                };

                opts = $.extend(defaults, opts);

                if (!empty(opts.productLine)) {

                    opts.rate = parseFloat(opts.productLine.find('[name="rate"]').attr('data-rate')||0);
                    opts.discount = parseFloat(opts.productLine.find('[name="discount"]').val()||0);
                }

                console.log(opts);

                //now we calculate the tax value based on it configuration, rate and discount
                let tax = 0;

                if (opts.tax.type == 'On Net Total') {

                    tax = (opts.rate - opts.discount) * opts.tax.rate / 100;
                }
                else if (opts.tax.type == 'Actual') {

                    tax = opts.tax.amount ;
                }

                return parseFloat(tax);
                
            },
            component: function(first = false, doctors = []) {

                let self = this;

                let defaults = Cache.get('doctors');
                doctors = $.extend(defaults, doctors);

                let html = 
                `<div class="input-group input-group-lg-group productLine mb-3">

                    <div class="col-3 px-0">
                        ${Html.input({

                            name: 'product_id',
                            class: 'form-control mb-3',
                            placeholder: __('Choose product'),
                            shown: function(elm) {

                                $(elm).productSuggestion({

                                    source: function(instance, query, sync, async) {

                                        //filter all products that is not selected on any other line
                                        let selected = [];
                                        // $(instance).closest('form').find('[name="product_id"]').each(function(){

                                        //     let id = $(this).attr('data-suggest-id');
                                        //     if (!empty(id)) {

                                        //         selected.push(id);
                                        //     }
                                        // });

                                        return new Model('products').select('id', 'name').where('name', 'like', query +'%').when(selected.length, function($query){

                                            $query.whereNotIn('id', selected);
                                        }).limit(5).get(function(res) { 
                            
                                            async(res.Data); 
                                        });
                                    },

                                    onSelect: function(suggestion, instance) {

                                        //when we choose the product => we load doctors and rate with their pricing rules
                                        let parameters = Modal.parameters($('.vModal:visible'));
                                        let patient_id = parameters.patient_id;
                                        let price_list_id = parameters.price_list_id;
                                        let applyPricingRules = parameters.disable_pricing_rules ? 0:1;
                                        let discount_id = parameters.discount_id;

                                        let products_id = $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get();
                                        let total_products_quantity = $('.vModal:visible').find('[name="product_id"].is-valid').length;
                                        let subtotal = $('.vModal:visible').find('.subtotal').text().trim();


                                        new MAPI(

                                            new Model('users').select('users.id', 'users.name', 'product_doctor.rate').join('product_doctor', 'users.id', '=', 'user_id'),
                                            new Model('products').method('getRates').parameters({product_id: suggestion.id, patient_id, discount_id, products_id, total_products_quantity, subtotal, price_list_id, applyPricingRules}),
                                            new Model('products').method('pricingRules').parameters({product_id: suggestion.id, patient_id: patient_id}),
                                            new Model('taxes').whereHas('productes', function($query) {

                                                return $query.where('id', suggestion.id);
                                            }).limit(1)
                                            
                                        ).call(function(doctors, rates, pricingRules, tax) {

                                            $(instance).closest('.productLine').find('select[name="doctor_id"]').html(doctors.map(x => {

                                                return '<option value="'+ x.id +'" data-rate="'+ rates.Rate +'">'+ x.name +'</option>';
                                            }).join(''));


                                            //set rate
                                            let rate = $(instance).closest('.productLine').find('select[name="doctor_id"] option:selected').attr('data-rate');
                                            $(instance).closest('.productLine').find('[name="rate"]').val(rates.Rate).attr('data-rate', rates.Rate);
                                            

                                            //set tax
                                            if (!empty(rates.Tax)) { 

                                                let tax_amount = DevPos.Invoice.product.calculateTax({tax: rates.Tax, productLine: $(instance).closest('.productLine')});
                                                $(instance).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                                            }


                                            //fire trigger
                                            $(instance).closest('form').trigger('invoice.change');

                                            //lastly we load the pricing rules for this product
                                            Invoice.pricing_rules.add(pricingRules);
                                        
                                        });
                                    },
                                    onDeselect: function(instance) {

                                        $(instance).closest('.productLine').find('[name="doctor_id"]').html('');
                                        $(instance).closest('.productLine').find('[name="rate"]').val('').attr('data-rate', '');

                                        //fire trigger
                                        $(instance).closest('form').trigger('invoice.change');
                                        
                                    }

                                });
                            }
                        })}
                    </div>

                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="rate" placeholder="${__('price')}" disabled>
                    </div>
                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="discount" placeholder="${__('discount')}" disabled>
                    </div>
                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="tax" placeholder="${__('tax')}" disabled>
                    </div>

                    <div class="col-2 float-left px-0 input-group-append">

                        ${Html.select({

                            name: 'doctor_id',
                            class: 'form-control',
                            options: [__('Choose doctor')],
                            onChange: function(elm) {

                                let rate = $(elm).find('option:selected').attr('data-rate');

                                //set rate
                                $(elm).closest('.productLine').find('input[name="rate"]').val(rate).attr('data-rate', rate);

                                //re calculate summaries
                                $(elm).closest('form').trigger('invoice.change');
                            },
                        })}
                        
                    
                    </div>
                    
                    ${(first == true ? ``:`<div class="input-group-append col-1 px-0">
                        <a href="javascript:void(0)" class="input-group-text" id="basic-addon1" onClick="Invoice.product.remove(this);"><i class="fa fa-trash k-font-danger"></i></a>
                    </div>`)}

                </div>`;

                return html;
            },
            reloadRates: function(opts = {}) {

                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

                let parameters = Modal.parameters($('.vModal:visible'));
            
                $('.vModal:visible').find('[name="product_id"]').each(function(){

                    if (empty($(this).attr('data-suggest-id')))
                        return;
                        
                    let self = this;
                    let product_id = $(this).attr('data-suggest-id');
                    new Model('products').method('getRates').parameters({

                        product_id: product_id, 

                        patient_id: parameters.patient_id, 
                        discount_id: parameters.discount_id,
                        products_id: $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get(),
                        total_products_quantity: $('.vModal:visible').find('[name="product_id"].is-valid').length,
                        subtotal: $('.vModal:visible').find('.subtotal').text().trim(),

                        price_list_id: parameters.price_list_id,
                        applyPricingRules: parameters.disable_pricing_rules ? 0:1,
                        
                    }).call(function(res) {

                        $(self).closest('.productLine').find('[name="rate"]').val(res.Data.Rate).attr('data-rate', res.Data.Rate).change();
                        $(self).closest('.productLine').find('[name="discount"]').val(priceNum(res.Data.DiscountAmount)).attr('data-discount', res.Data.DiscountAmount).change();
                        
                        //set tax
                        if (!empty(res.Data.Tax)) { 

                            let tax_amount = Invoice.product.calculateTax({tax: res.Data.Tax, productLine: $(self).closest('.productLine')});
                            console.log(tax_amount);
                            $(self).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                        }

                        //fire invoice change
                        Invoice.summaries.calculate();
                        //new Buffer('reCalculateSummaries', Invoice.summaries.calculate, 600);
                    });
                });

            },
            reloadTaxes: function(opts = {}) {

                //if there aren't any product -> we skip this fn
                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;


                let parameters = Modal.parameters($('.vModal:visible'));

                let defaults = {

                    tax_id: parameters.tax_id
                };

                opts = $.extend(defaults, opts);

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

            
                //first we have to load tax from db
                new MAPI(

                    new Model('taxes').where('id', opts.tax_id).limit(1)

                ).call(function(tax) {

                    $('.vModal:visible').find('[name="product_id"]').each(function(){

                        if (empty($(this).attr('data-suggest-id')))
                            return;
                            
                        //we have to get tax for each product to check 
                        let self = this;
                        let product_id = $(this).attr('data-suggest-id');
                        new Model('products').method('getRates').parameters({

                            product_id: product_id, 

                            patient_id: parameters.patient_id, 
                            discount_id: parameters.discount_id,
                            products_id: $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get(),
                            total_products_quantity: $('.vModal:visible').find('[name="product_id"].is-valid').length,
                            subtotal: $('.vModal:visible').find('.subtotal').text().trim(),

                            price_list_id: parameters.price_list_id,
                            applyPricingRules: parameters.disable_pricing_rules ? 0:1,
                            
                        }).call(function(res) {

                            $(self).closest('.productLine').find('[name="rate"]').val(res.Data).attr('data-rate', res.Data).change();
                            $(self).closest('.productLine').find('[name="discount"]').val(priceNum(res.DiscountAmount)).attr('data-discount', res.DiscountAmount).change();
                            
                            //set tax
                            if (!empty(res.Tax)) { 

                                let tax_amount = Invoice.product.calculateTax({tax: res.Tax, productLine: $(self).closest('.productLine')});
                                $(self).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                            }

                            //fire invoice change
                            Invoice.summaries.calculate();
                            //new Buffer('reCalculateSummaries', Invoice.summaries.calculate, 600);
                        });
                    });
                
                });

            },
            loadDiscount: function(opts = {}) {

                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

                let parameters = Modal.parameters($('.vModal:visible'));
            
                $('.vModal:visible').find('[name="product_id"]').each(function() {

                    if (empty($(this).attr('data-suggest-id')))
                        return;
                        
                    let self = this;
                    let product_id = $(this).attr('data-suggest-id');
                    new Model('products').method('getDiscount').parameters({

                        product_id: product_id, 
                        patient_id: parameters.patient_id, 
                        price_list_id: parameters.price_list_id,
                        applyPricingRules: parameters.disable_pricing_rules ? 0:1
                    }).call(function(res) {

                        $(self).closest('.productLine').find('[name="rate"]').val(res.Data).attr('data-rate', res.Data).change();

                        //fire invoice change
                        Invoice.summaries.calculate();
                    });
                });

            },
            remove(elm) {
                
                let $form = $(elm).closest('form');
                $(elm).closest('.productLine').remove();

                //fire trigger
                $form.trigger('invoice.change');

                
                //after resetting summaries we reload the rates bc we have to send new subtotal to server
                //reload Rates for products present already
                this.reloadRates();
            },
            removeLast($modal) {

                //remove last
                if ($modal.find('.productLine').length == 1)
                    return;
                
                $modal.find('.productLine:last').remove();

                //fire trigger
                $modal.find('form').trigger('invoice.change');
            }
        },
        save: function() {

            let self = this;

            let parameters = function($modal) {

                let parameters = Modal.parameters($modal);

                //set invoiceType = 1
                parameters.invoiceType = 1;
                parameters.isEInvoice = true;

                //add customer
                if (empty(parameters.customer.idNumber) && empty(parameters.customer.name)) 
                    delete parameters.customer;

                //add products
                parameters.invoiceProducts = [];
                $('#productsList tbody tr').each(function() {

                    parameters.invoiceProducts.push({

                        productId: $(this).attr('data-product-id'),
                        barcode: $(this).attr('data-barcode'),
                        isInvestment: $(this).attr('data-investment'),
                        name: $(this).find('[data-attribute="name"]').text().trim(),

                        isRebateReducingBasePrice: 1,
                        rebatePrice: 0,

                        unit: $(this).find('[data-attribute="unit"]').text().trim(),
                        quantity: $(this).find('[name="quantity"]').val().trim(),
                        unitPrice: parseFloat($(this).find('[name="unitPrice"]').val()?.trim()||0),
                        vatRate: $(this).find('[data-attribute="vatRate"]').text().trim(),

                    });

                });

                //add fees
                parameters.invoiceFees = [];
                $('#feesList tbody tr:not(:last)').each(function() {

                    parameters.invoiceFees.push({

                        feeType: $(this).find('[name="feeType"]').val(),
                        amount: $(this).find('[name="amount"]').val(),
                    });
                });

                //add invoicePayments
                parameters.invoicePayments = [];
                $('#paymentMethodsList tbody tr:not(:last)').each(function() {

                    let payment = {

                        paymentMethodType: $(this).find('[name="paymentMethodType"]').val(),
                        amount: $(this).find('[name="amount"]').val()
                    };

                    if (payment.paymentMethodType == '2') {
                        payment.voucher = $(this).find('[name="voucher"]').val();
                    }

                    if (payment.paymentMethodType == '6') {
                        payment.accountId = $(this).find('[name="accountId"]').val();
                    }

                    parameters.invoicePayments.push(payment);
                });

                //extra
                if (parameters.selfIssuing == '1') {

                    parameters.selfIssuingType = $modal.find('[name="selfIssuingType"]').val();
                }
                if ($modal.find('[name="isLateFiscalized"]').is(':checked')) {

                    parameters.subsequentDeliveryType = $modal.find('[name="subsequentDeliveryType"]').val();
                }

                return parameters;
            };

            //if (empty(this.item)) {

                let params = parameters($('form#k_form_1'));
                new Route(self.itemType).prefix(self.prefix).store(params, function(res) {

                    // //Page.reload(2000);
                    // opts.callback();

                }, function(res) {

                    generalError(res.Msg||'Something went wrong!');
                });
            //}
            // else {

            //     //add id
            //     opts.parameters.id = parseInt(opts.item.id);
            //     new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

            //        // Page.reload(2000);
            //         opts.callback();

            //     }, function(res) {

            //         generalError();
            //     });
            // }
        },
        search() {

            return new Model(this.itemType);
        },
        view: function(eic) {

            let downloadPDF = function (pdf) {

                const linkSource = `data:application/pdf;base64,${pdf}`;
                const downloadLink = document.createElement("a");
                const fileName = "abc.pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }

            const b64toBlob = (b64Data, contentType='', sliceSize=512) => {

                const byteCharacters = atob(b64Data);
                const byteArrays = [];
              
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  const slice = byteCharacters.slice(offset, offset + sliceSize);
              
                  const byteNumbers = new Array(slice.length);
                  for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                  }
              
                  const byteArray = new Uint8Array(byteNumbers);
                  byteArrays.push(byteArray);
                }
              
                const blob = new Blob(byteArrays, {type: contentType});
                return blob;
              }

            new Route(this.itemType).prefix(this.prefix).query({eic: eic}).get(function(res) {

                let pdfBase64 = res.Data[0].pdf;

                //download it
                //downloadPDF(pdfBase64);

                window.open(URL.createObjectURL(b64toBlob(pdfBase64, 'application/pdf')));
            });
            //window.location.href = 'blob:https://demo.devpos.al/'+ eic;
        }
    },
    EPurchaseInvoice: {

        itemType: 'epurchase-invoices',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source = []) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);
    
            let filtered = source?.slice()||[];
            
            // we add other filter condition here
            if(!empty(parameters.documentNumber)) {

                filtered = filtered.filter(row => { 

                    return row.documentNumber.toLowerCase().startsWith(parameters.documentNumber.toLowerCase()); 
                });
            }if(!empty(parameters.buyerName)) {

                filtered = filtered.filter(row => { 
                    
                    if (!empty(row.buyerName))
                        return row.buyerName.toLowerCase().startsWith(parameters.buyerName.toLowerCase()); 
                });
            }
            if(!empty(parameters.buyerNuis)) {

                filtered = filtered.filter(row => { 
                    
                    return row.buyerNuis.toLowerCase().startsWith(parameters.buyerNuis.toLowerCase()); 
                });
            }
            if(!empty(parameters.eic)) {

                filtered = filtered.filter(row => { 
                    
                    return row.eic.toLowerCase().startsWith(parameters.eic.toLowerCase()); 
                });
            }
            if(!empty(parameters.invoiceStatus)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceStatus.toLowerCase().startsWith(parameters.invoiceStatus.toLowerCase()); 
                });
            }
            if(!empty(parameters.statusCanBeChanged)) {

                filtered = filtered.filter(row => { 
                    
                    return row.statusCanBeChanged.toLowerCase().startsWith(parameters.statusCanBeChanged.toLowerCase()); 
                });
            }
            if(!empty(parameters.amount_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.amount >= parseFloat(parameters.amount_min); 
                });
            }
            if(!empty(parameters.amount_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.amount <= parseFloat(parameters.amount_max); 
                });
            }
            if(!empty(parameters.dueDate_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dueDate >= parameters.dueDate_min; 
                });
            }
            if(!empty(parameters.dueDate_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dueDate <= parameters.dueDate_max; 
                });
            }
            if(!empty(parameters.created_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceCreatedDate >= parameters.created_min; 
                });
            }
            if(!empty(parameters.created_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.invoiceCreatedDate <= parameters.created_max; 
                });
            }

            //and in the end we return it
            return filtered;
        },
        queryParameters() { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="main_filter"]') , true);

            return parameters;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    amount: {field: 'amount', title: __('Amount')}, 
                    buyerName: {field: 'buyerName', title: __('Buyer Name')}, 
                    buyerNuis: {field: 'buyerNuis', title: __('Buyer Nuis')},  
                    documentNumber: {field: 'documentNumber', title: __('Document Number')},  
                    dueDate: {field: 'dueDate', title: __("Due Date"), type: "date", template: function(row){ return moment(row.invoiceCreatedDate).format("MM/DD/YYYY hh:mm"); }},
                    eic: {field: 'eic', title: __('EIC')},   
                    invoiceCreatedDate: {field: 'invoiceCreatedDate', title: __("Created Date"), type: "date", template: function(row){ return moment(row.invoiceCreatedDate).format("MM/DD/YYYY hh:mm"); }},
                    
                    invoiceStatus: {field: 'invoiceStatus', title: __('Invoice Status')},  
                    partyType: {field: 'partyType', title: __('Party Type')},  
                    sellerName: {field: 'sellerName', title: __('Seller Name')}, 
                    sellerNuis: {field: 'sellerNuis', title: __('Seller Nuis')},  
                    statusCanBeChanged: {field: 'statusCanBeChanged', title: __('Status Can Be Changed')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="${'blob:https://demo.devpos.al/'+ row.eic}" target="_blank" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('View')}" data-id="${row.eic}" ><i class="la la-eye"></i> </a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-eye').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.view(itemID);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            new Route(this.itemType).prefix(this.prefix).query(this.queryParameters()).get(function(res) {
    
                self.list({
    
                    columns: ['id', 'documentNumber', 'partyType', 'invoiceCreatedDate', 'dueDate', 'invoiceStatus', 'amount', 'buyerName', 'buyerNuis', 'actions'],
                    source: res.Data,
                    filter: function(source = []) {
    
                        return self.filter(source);
                    }
                });

            });

        },
        modal: function(opts = {}) {
            
            let self = this;

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'xl',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, tcrs: Cache.get('tcrs')}),
                
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //set invoiceType = 1
                    parameters.invoiceType = 1;
                    parameters.isEinvoice = true;

                    //add customer
                    if (empty(parameters.customer.idNumber) && empty(parameters.customer.name)) 
                        delete parameters.customer;

                    //add products
                    parameters.invoiceProducts = [];
                    $('#productsList tbody tr').each(function() {

                        parameters.invoiceProducts.push({

                            productId: $(this).attr('data-product-id'),
                            barcode: $(this).attr('data-barcode'),
                            isInvestment: $(this).attr('data-investment'),
                            name: $(this).find('[data-attribute="name"]').text().trim(),

                            isRebateReducingBasePrice: 1,
                            rebatePrice: 0,

                            unit: $(this).find('[data-attribute="unit"]').text().trim(),
                            quantity: $(this).find('[name="quantity"]').val().trim(),
                            unitPrice: parseFloat($(this).find('[name="unitPrice"]').val()?.trim()||0),
                            vatRate: $(this).find('[data-attribute="vatRate"]').text().trim(),

                        });

                    });

                    //add fees
                    parameters.invoiceFees = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        parameters.invoiceFees.push({

                            feeType: $(this).find('[name="feeType"]').val(),
                            amount: $(this).find('[name="amount"]').val(),
                        });
                    });

                    //add invoicePayments
                    parameters.invoicePayments = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        let payment = {

                            paymentMethodType: $(this).find('[name="paymentMethodType"]').val(),
                            amount: $(this).find('[name="amount"]').val()
                        };

                        if (payment.paymentMethodType == '2') {
                            payment.voucher = $(this).find('[name="voucher"]').val();
                        }

                        if (payment.paymentMethodType == '6') {
                            payment.accountId = $(this).find('[name="accountId"]').val();
                        }

                        parameters.invoicePayments.push(payment);
                    });

                    //extra
                    if (parameters.selfIssuing == '1') {

                        parameters.selfIssuingType = $modal.find('[name="selfIssuingType"]').val();
                    }

                    if ($modal.find('[name="isLateFiscalized"]').is(':checked')) {

                        parameters.subsequentDeliveryType = $modal.find('[name="subsequentDeliveryType"]').val();
                    }
                    

                    return parameters;
                },
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        product: {

            add($modal) {

                if(typeof $modal == 'undefined')
                    $modal = $('.modal:visible');

                $modal.find('.productLine:last').after( DevPos.Invoice.product.component() );

                //focus input
                $modal.find('.productLine:last input.tt-input').focus();
            },
            calculateTax: function(opts = {}) {

                let defaults = {

                    tax: {},
                    rate: 0,
                    discount: 0,
                    productLine: null
                };

                opts = $.extend(defaults, opts);

                if (!empty(opts.productLine)) {

                    opts.rate = parseFloat(opts.productLine.find('[name="rate"]').attr('data-rate')||0);
                    opts.discount = parseFloat(opts.productLine.find('[name="discount"]').val()||0);
                }

                console.log(opts);

                //now we calculate the tax value based on it configuration, rate and discount
                let tax = 0;

                if (opts.tax.type == 'On Net Total') {

                    tax = (opts.rate - opts.discount) * opts.tax.rate / 100;
                }
                else if (opts.tax.type == 'Actual') {

                    tax = opts.tax.amount ;
                }

                return parseFloat(tax);
                
            },
            component: function(first = false, doctors = []) {

                let self = this;

                let defaults = Cache.get('doctors');
                doctors = $.extend(defaults, doctors);

                let html = 
                `<div class="input-group input-group-lg-group productLine mb-3">

                    <div class="col-3 px-0">
                        ${Html.input({

                            name: 'product_id',
                            class: 'form-control mb-3',
                            placeholder: __('Choose product'),
                            shown: function(elm) {

                                $(elm).productSuggestion({

                                    source: function(instance, query, sync, async) {

                                        //filter all products that is not selected on any other line
                                        let selected = [];
                                        // $(instance).closest('form').find('[name="product_id"]').each(function(){

                                        //     let id = $(this).attr('data-suggest-id');
                                        //     if (!empty(id)) {

                                        //         selected.push(id);
                                        //     }
                                        // });

                                        return new Model('products').select('id', 'name').where('name', 'like', query +'%').when(selected.length, function($query){

                                            $query.whereNotIn('id', selected);
                                        }).limit(5).get(function(res) { 
                            
                                            async(res.Data); 
                                        });
                                    },

                                    onSelect: function(suggestion, instance) {

                                        //when we choose the product => we load doctors and rate with their pricing rules
                                        let parameters = Modal.parameters($('.vModal:visible'));
                                        let patient_id = parameters.patient_id;
                                        let price_list_id = parameters.price_list_id;
                                        let applyPricingRules = parameters.disable_pricing_rules ? 0:1;
                                        let discount_id = parameters.discount_id;

                                        let products_id = $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get();
                                        let total_products_quantity = $('.vModal:visible').find('[name="product_id"].is-valid').length;
                                        let subtotal = $('.vModal:visible').find('.subtotal').text().trim();


                                        new MAPI(

                                            new Model('users').select('users.id', 'users.name', 'product_doctor.rate').join('product_doctor', 'users.id', '=', 'user_id'),
                                            new Model('products').method('getRates').parameters({product_id: suggestion.id, patient_id, discount_id, products_id, total_products_quantity, subtotal, price_list_id, applyPricingRules}),
                                            new Model('products').method('pricingRules').parameters({product_id: suggestion.id, patient_id: patient_id}),
                                            new Model('taxes').whereHas('productes', function($query) {

                                                return $query.where('id', suggestion.id);
                                            }).limit(1)
                                            
                                        ).call(function(doctors, rates, pricingRules, tax) {

                                            $(instance).closest('.productLine').find('select[name="doctor_id"]').html(doctors.map(x => {

                                                return '<option value="'+ x.id +'" data-rate="'+ rates.Rate +'">'+ x.name +'</option>';
                                            }).join(''));


                                            //set rate
                                            let rate = $(instance).closest('.productLine').find('select[name="doctor_id"] option:selected').attr('data-rate');
                                            $(instance).closest('.productLine').find('[name="rate"]').val(rates.Rate).attr('data-rate', rates.Rate);
                                            

                                            //set tax
                                            if (!empty(rates.Tax)) { 

                                                let tax_amount = DevPos.Invoice.product.calculateTax({tax: rates.Tax, productLine: $(instance).closest('.productLine')});
                                                $(instance).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                                            }


                                            //fire trigger
                                            $(instance).closest('form').trigger('invoice.change');

                                            //lastly we load the pricing rules for this product
                                            Invoice.pricing_rules.add(pricingRules);
                                        
                                        });
                                    },
                                    onDeselect: function(instance) {

                                        $(instance).closest('.productLine').find('[name="doctor_id"]').html('');
                                        $(instance).closest('.productLine').find('[name="rate"]').val('').attr('data-rate', '');

                                        //fire trigger
                                        $(instance).closest('form').trigger('invoice.change');
                                        
                                    }

                                });
                            }
                        })}
                    </div>

                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="rate" placeholder="${__('price')}" disabled>
                    </div>
                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="discount" placeholder="${__('discount')}" disabled>
                    </div>
                    <div class="col-2 float-left px-0 input-group-append">
                        <input class="form-control text-right" name="tax" placeholder="${__('tax')}" disabled>
                    </div>

                    <div class="col-2 float-left px-0 input-group-append">

                        ${Html.select({

                            name: 'doctor_id',
                            class: 'form-control',
                            options: [__('Choose doctor')],
                            onChange: function(elm) {

                                let rate = $(elm).find('option:selected').attr('data-rate');

                                //set rate
                                $(elm).closest('.productLine').find('input[name="rate"]').val(rate).attr('data-rate', rate);

                                //re calculate summaries
                                $(elm).closest('form').trigger('invoice.change');
                            },
                        })}
                        
                    
                    </div>
                    
                    ${(first == true ? ``:`<div class="input-group-append col-1 px-0">
                        <a href="javascript:void(0)" class="input-group-text" id="basic-addon1" onClick="Invoice.product.remove(this);"><i class="fa fa-trash k-font-danger"></i></a>
                    </div>`)}

                </div>`;

                return html;
            },
            reloadRates: function(opts = {}) {

                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

                let parameters = Modal.parameters($('.vModal:visible'));
            
                $('.vModal:visible').find('[name="product_id"]').each(function(){

                    if (empty($(this).attr('data-suggest-id')))
                        return;
                        
                    let self = this;
                    let product_id = $(this).attr('data-suggest-id');
                    new Model('products').method('getRates').parameters({

                        product_id: product_id, 

                        patient_id: parameters.patient_id, 
                        discount_id: parameters.discount_id,
                        products_id: $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get(),
                        total_products_quantity: $('.vModal:visible').find('[name="product_id"].is-valid').length,
                        subtotal: $('.vModal:visible').find('.subtotal').text().trim(),

                        price_list_id: parameters.price_list_id,
                        applyPricingRules: parameters.disable_pricing_rules ? 0:1,
                        
                    }).call(function(res) {

                        $(self).closest('.productLine').find('[name="rate"]').val(res.Data.Rate).attr('data-rate', res.Data.Rate).change();
                        $(self).closest('.productLine').find('[name="discount"]').val(priceNum(res.Data.DiscountAmount)).attr('data-discount', res.Data.DiscountAmount).change();
                        
                        //set tax
                        if (!empty(res.Data.Tax)) { 

                            let tax_amount = Invoice.product.calculateTax({tax: res.Data.Tax, productLine: $(self).closest('.productLine')});
                            console.log(tax_amount);
                            $(self).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                        }

                        //fire invoice change
                        Invoice.summaries.calculate();
                        //new Buffer('reCalculateSummaries', Invoice.summaries.calculate, 600);
                    });
                });

            },
            reloadTaxes: function(opts = {}) {

                //if there aren't any product -> we skip this fn
                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;


                let parameters = Modal.parameters($('.vModal:visible'));

                let defaults = {

                    tax_id: parameters.tax_id
                };

                opts = $.extend(defaults, opts);

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

            
                //first we have to load tax from db
                new MAPI(

                    new Model('taxes').where('id', opts.tax_id).limit(1)

                ).call(function(tax) {

                    $('.vModal:visible').find('[name="product_id"]').each(function(){

                        if (empty($(this).attr('data-suggest-id')))
                            return;
                            
                        //we have to get tax for each product to check 
                        let self = this;
                        let product_id = $(this).attr('data-suggest-id');
                        new Model('products').method('getRates').parameters({

                            product_id: product_id, 

                            patient_id: parameters.patient_id, 
                            discount_id: parameters.discount_id,
                            products_id: $('.vModal:visible').find('[name="product_id"].is-valid').map(function(){ return this.getAttribute('data-suggest-id') }).get(),
                            total_products_quantity: $('.vModal:visible').find('[name="product_id"].is-valid').length,
                            subtotal: $('.vModal:visible').find('.subtotal').text().trim(),

                            price_list_id: parameters.price_list_id,
                            applyPricingRules: parameters.disable_pricing_rules ? 0:1,
                            
                        }).call(function(res) {

                            $(self).closest('.productLine').find('[name="rate"]').val(res.Data).attr('data-rate', res.Data).change();
                            $(self).closest('.productLine').find('[name="discount"]').val(priceNum(res.DiscountAmount)).attr('data-discount', res.DiscountAmount).change();
                            
                            //set tax
                            if (!empty(res.Tax)) { 

                                let tax_amount = Invoice.product.calculateTax({tax: res.Tax, productLine: $(self).closest('.productLine')});
                                $(self).closest('.productLine').find('[name="tax"]').val(tax_amount).attr('data-value', tax_amount);
                            }

                            //fire invoice change
                            Invoice.summaries.calculate();
                            //new Buffer('reCalculateSummaries', Invoice.summaries.calculate, 600);
                        });
                    });
                
                });

            },
            loadDiscount: function(opts = {}) {

                if ($('.vModal:visible').find('[name="product_id"]').length < 1)
                    return;

                //we will run this method every time a trait of invoice is changed: patient_id/price_list_id/disable pricing rules...

                let parameters = Modal.parameters($('.vModal:visible'));
            
                $('.vModal:visible').find('[name="product_id"]').each(function() {

                    if (empty($(this).attr('data-suggest-id')))
                        return;
                        
                    let self = this;
                    let product_id = $(this).attr('data-suggest-id');
                    new Model('products').method('getDiscount').parameters({

                        product_id: product_id, 
                        patient_id: parameters.patient_id, 
                        price_list_id: parameters.price_list_id,
                        applyPricingRules: parameters.disable_pricing_rules ? 0:1
                    }).call(function(res) {

                        $(self).closest('.productLine').find('[name="rate"]').val(res.Data).attr('data-rate', res.Data).change();

                        //fire invoice change
                        Invoice.summaries.calculate();
                    });
                });

            },
            remove(elm) {
                
                let $form = $(elm).closest('form');
                $(elm).closest('.productLine').remove();

                //fire trigger
                $form.trigger('invoice.change');

                
                //after resetting summaries we reload the rates bc we have to send new subtotal to server
                //reload Rates for products present already
                this.reloadRates();
            },
            removeLast($modal) {

                //remove last
                if ($modal.find('.productLine').length == 1)
                    return;
                
                $modal.find('.productLine:last').remove();

                //fire trigger
                $modal.find('form').trigger('invoice.change');
            }
        },
        save: function() {

            let self = this;

            let parameters = function($modal) {

                let parameters = Modal.parameters($modal);

                //set invoiceType = 1
                parameters.invoiceType = 1;
                parameters.isEInvoice = true;

                //add customer
                if (empty(parameters.customer.idNumber) && empty(parameters.customer.name)) 
                    delete parameters.customer;

                //add products
                parameters.invoiceProducts = [];
                $('#productsList tbody tr').each(function() {

                    parameters.invoiceProducts.push({

                        productId: $(this).attr('data-product-id'),
                        barcode: $(this).attr('data-barcode'),
                        isInvestment: $(this).attr('data-investment'),
                        name: $(this).find('[data-attribute="name"]').text().trim(),

                        isRebateReducingBasePrice: 1,
                        rebatePrice: 0,

                        unit: $(this).find('[data-attribute="unit"]').text().trim(),
                        quantity: $(this).find('[name="quantity"]').val().trim(),
                        unitPrice: parseFloat($(this).find('[name="unitPrice"]').val()?.trim()||0),
                        vatRate: $(this).find('[data-attribute="vatRate"]').text().trim(),

                    });

                });

                //add fees
                parameters.invoiceFees = [];
                $('#feesList tbody tr:not(:last)').each(function() {

                    parameters.invoiceFees.push({

                        feeType: $(this).find('[name="feeType"]').val(),
                        amount: $(this).find('[name="amount"]').val(),
                    });
                });

                //add invoicePayments
                parameters.invoicePayments = [];
                $('#paymentMethodsList tbody tr:not(:last)').each(function() {

                    let payment = {

                        paymentMethodType: $(this).find('[name="paymentMethodType"]').val(),
                        amount: $(this).find('[name="amount"]').val()
                    };

                    if (payment.paymentMethodType == '2') {
                        payment.voucher = $(this).find('[name="voucher"]').val();
                    }

                    if (payment.paymentMethodType == '6') {
                        payment.accountId = $(this).find('[name="accountId"]').val();
                    }

                    parameters.invoicePayments.push(payment);
                });

                //extra
                if (parameters.selfIssuing == '1') {

                    parameters.selfIssuingType = $modal.find('[name="selfIssuingType"]').val();
                }
                if ($modal.find('[name="isLateFiscalized"]').is(':checked')) {

                    parameters.subsequentDeliveryType = $modal.find('[name="subsequentDeliveryType"]').val();
                }

                return parameters;
            };

            //if (empty(this.item)) {

                let params = parameters($('form#k_form_1'));
                new Route(self.itemType).prefix(self.prefix).store(params, function(res) {

                    // //Page.reload(2000);
                    // opts.callback();

                }, function(res) {

                    generalError(res.Msg||'Something went wrong!');
                });
            //}
            // else {

            //     //add id
            //     opts.parameters.id = parseInt(opts.item.id);
            //     new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

            //        // Page.reload(2000);
            //         opts.callback();

            //     }, function(res) {

            //         generalError();
            //     });
            // }
        },
        search() {

            return new Model(this.itemType);
        },
        view: function(eic) {

            let downloadPDF = function (pdf) {

                const linkSource = `data:application/pdf;base64,${pdf}`;
                const downloadLink = document.createElement("a");
                const fileName = "abc.pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }

            const b64toBlob = (b64Data, contentType='', sliceSize=512) => {

                const byteCharacters = atob(b64Data);
                const byteArrays = [];
              
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  const slice = byteCharacters.slice(offset, offset + sliceSize);
              
                  const byteNumbers = new Array(slice.length);
                  for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                  }
              
                  const byteArray = new Uint8Array(byteNumbers);
                  byteArrays.push(byteArray);
                }
              
                const blob = new Blob(byteArrays, {type: contentType});
                return blob;
              }

            new Route(this.itemType).prefix(this.prefix).query({eic: eic}).get(function(res) {

                let pdfBase64 = res.Data[0].pdf;

                //download it
                //downloadPDF(pdfBase64);

                window.open(URL.createObjectURL(b64toBlob(pdfBase64, 'application/pdf')));
            });
            //window.location.href = 'blob:https://demo.devpos.al/'+ eic;
        }
    },
    Invoice: {

        itemType: 'invoices',
        prefix: 'devpos',
        cancel: function(iic) {

            let self = this;
            
            swalConfirm({
			
                text: '',
                type: 'question',
                confirm: function(opts) {
                    
                    
                    new Route(self.itemType).prefix(self.prefix).whereId(iic).action('cancel').put({}, function(res) {

                        //Page.reload(2000);
                        opts.callback();

                    }, function(res) {

                        generalError();
                    });

                }
            }); 

        },
        create: function() {
                
            return this.modal();
        },
        correct: function(iic) {
    
            return this.modal({iic: iic});
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        download: function(eic) {

            return Export.html2pdf({

                html: this.replaceCanvasWithImage($('#invoiceContent')).html(),
                withHeader: false
            });
        },
        edit(iic) {

            let self = this;
    
            //first get it from db
            return self.modal({iic: iic});
           
        },
        export: function() {

            //download it
            window.location.href = '/'+ this.prefix +'/'+ this.itemType +'/export?'+  $.param(this.queryParameters());
        },
        filter(source = []) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);
    
            let filtered = source?.slice()||[];
            
            // we add other filter condition here
            if(!empty(parameters.operatorName)) {

                filtered = filtered.filter(row => { 

                    return row.operatorName.toLowerCase().startsWith(parameters.operatorName.toLowerCase()); 
                });
            }if(!empty(parameters.customerBusinessName)) {

                filtered = filtered.filter(row => { 
                    
                    if (!empty(row.customerBusinessName))
                        return row.customerBusinessName.toLowerCase().startsWith(parameters.customerBusinessName.toLowerCase()); 
                });
            }
            if(!empty(parameters.name)) {

                filtered = filtered.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }
            if(!empty(parameters.total_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.totalPrice >= parseFloat(parameters.total_min); 
                });
            }
            if(!empty(parameters.total_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.totalPrice <= parseFloat(parameters.total_max); 
                });
            }
            if(!empty(parameters.created_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dateTimeCreated >= parameters.created_min; 
                });
            }
            if(!empty(parameters.created_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dateTimeCreated <= parameters.created_max; 
                });
            }

            //and in the end we return it
            return filtered;
        },
        queryParameters() { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="main_filter"]') , true);

            return parameters;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    businessUnitCode: {field: 'businessUnitCode', title: __('Business Unit Code')}, 
                    clientApplication: {field: 'clientApplication', title: __('Client Application')}, 
                    customerAddress: {field: 'customerAddress', title: __('Customer Address')},  
                    customerBusinessName: {field: 'customerBusinessName', title: __('Customer')},  
                    customerCity: {field: 'customerCity', title: __('Customer City')},  
                    customerDetails: {field: 'customerDetails', title: __('Customer Details')},  
                    customerId: {field: 'customerId', title: __('Customer Id')},  
                    customerIdNumber: {field: 'customerIdNumber', title: __('Customer Id Number')},  
                    customerIdType: {field: 'customerIdType', title: __('Customer Id Type')},  
                     
                    documentType: {field: 'documentType', title: __('Document Type')},  
                    eic: {field: 'eic', title: __('EIC')},  
                    exchangeRate: {field: 'exchangeRate', title: __('Exchange Rate')},  
                    fiscNumber: {field: 'fiscNumber', title: __('Fisc Number')},  
                    iic: {field: 'iic', title: __('IIC')},  
                    invoiceNumber: {field: 'invoiceNumber', title: __('Invoice Number')},  
                    invoiceOrderNumber: {field: 'invoiceOrderNumber', title: __('Invoice Order Number')},  
                    invoiceType: {field: 'invoiceType', title: __('Invoice Type')},  
                    isACorrectedInvoice: {field: 'isACorrectedInvoice', title: __('Is A Corrected Invoice')},  
                    isCorrectiveInvoice: {field: 'isCorrectiveInvoice', title: __('Is Corrective Invoice')},  
                    isEInvoice: {field: 'isEInvoice', title: __('IsEInvoice')},  
                    isReverseCharge: {field: 'isReverseCharge', title: __('Is Reverse Charge')},  
                    isSelfIssuingAffectWareHouse: {field: 'isSelfIssuingAffectWareHouse', title: __('Is Self Issuing Affect WareHouse')},  
                    isSentAsEInvoice: {field: 'isSentAsEInvoice', title: __('Is Sent As EInvoice')},   
                    isSubsequentDelivery: {field: 'isSubsequentDelivery', title: __('Is Subsequent Delivery')},  
                    markUpAmount: {field: 'markUpAmount', title: __('Mark Up Amount')},  
                    notes: {field: 'notes', title: __('Notes')},  
                    operatorCode: {field: 'operatorCode', title: __('Operator Code')},  
                    operatorName: {field: 'operatorName', title: __('Operator Name')},  
                    payDeadline: {field: 'payDeadline', title: __('Pay Deadline')},  
                    process: {field: 'process', title: __('Process')},  
                    sellerAddress: {field: 'sellerAddress', title: __('Seller Address')},  
                    softCode: {field: 'softCode', title: __('Soft Code')},  
                    taxFreeAmount: {field: 'taxFreeAmount', title: __('Tax Free Amount')},  
                    tcrCode: {field: 'tcrCode', title: __('Tcr Code')},  
                    totalPrice: {field: 'totalPrice', title: __('Total Price'), template: function(row){ return priceNum(row.totalPrice); }},  
                    totalPriceWithoutVAT: {field: 'totalPriceWithoutVAT', title: __('Total Price Without VAT')},  
                    totalVATAmount: {field: 'totalVATAmount', title: __('Total VAT Amount')},  
                    transporterIdType: {field: 'transporterIdType', title: __('Transporter Id Type')},  
                    valuesAreInForeignCurrency: {field: 'valuesAreInForeignCurrency', title: __('Values Are In Foreign Currency')},  
                    verificationUrl: {field: 'verificationUrl', title: __('Verification Url')},  
                    warehouseId: {field: 'warehouseId', title: __('WarehouseId')},  
                    dateTimeCreated: {field: 'dateTimeCreated', title: __("Created Date"), type: "date", template: function(row){ return moment(row.dateTimeCreated).format("MM/DD/YYYY"); }},
                    
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.iic}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('View')}" data-id="${row.id}"><i class="la la-eye"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-eye').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.view(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;

            new Route(this.itemType).prefix(this.prefix).query(this.queryParameters()).get(function(res) {
    
                self.list({
    
                    columns: ['id', 'operatorName', 'invoiceNumber', 'dateTimeCreated', 'totalPrice', 'customerBusinessName', 'amount', 'notes', 'actions'],
                    additionalColumns: ['isCorrectiveInvoice', 'isACorrectedInvoice'],
                    source: res.Data,
                    filter: function(source = []) {
    
                        return self.filter(source);
                    }
                });

            });
        },
        modal: function(opts = {}) {
            
            let self = this;

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'xl',
                template: templates()[self.prefix][self.itemType].template({ 

                    item: opts.item, 
                    idTypes: Cache.get('idTypes'),
                    countries: Cache.get('countries'), 
                    tcrs: Cache.get('tcrs')
                }),
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add customer
                    if (empty(parameters.customer.idNumber) && empty(parameters.customer.name)) 
                        delete parameters.customer;

                    //add products
                    parameters.invoiceProducts = [];
                    $('#productsList tbody tr').each(function() {

                        parameters.invoiceProducts.push({

                            productId: $(this).attr('data-product-id'),
                            barcode: $(this).attr('data-barcode'),
                            isInvestment: $(this).attr('data-investment'),
                            name: $(this).find('[data-attribute="name"]').text().trim(),

                            isRebateReducingBasePrice: 1,
                            rebatePrice: 0,

                            unit: $(this).find('[data-attribute="unit"]').text().trim(),
                            quantity: $(this).find('[name="quantity"]').val().trim(),
                            unitPrice: parseFloat($(this).find('[name="unitPrice"]').val()?.trim()||0),
                            vatRate: $(this).find('[data-attribute="vatRate"]').text().trim(),

                        });

                    });

                    //add fees
                    parameters.invoiceFees = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        parameters.invoiceFees.push({

                            feeType: $(this).find('[name="feeType"]').val(),
                            amount: $(this).find('[name="amount"]').val(),
                        });
                    });

                    //add invoicePayments
                    parameters.invoicePayments = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        let payment = {

                            paymentMethodType: $(this).find('[name="paymentMethodType"]').val(),
                            amount: $(this).find('[name="amount"]').val()
                        };

                        if (payment.paymentMethodType == '2') {
                            payment.voucher = $(this).find('[name="voucher"]').val();
                        }

                        if (payment.paymentMethodType == '6') {
                            payment.accountId = $(this).find('[name="accountId"]').val();
                        }

                        parameters.invoicePayments.push(payment);
                    });

                    //extra
                    if (parameters.selfIssuing == '1') {

                        parameters.selfIssuingType = $modal.find('[name="selfIssuingType"]').val();
                    }

                    if ($modal.find('[name="isLateFiscalized"]').is(':checked')) {

                        parameters.subsequentDeliveryType = $modal.find('[name="subsequentDeliveryType"]').val();
                    }
                    

                    return parameters;
                },
                save: function(opts) {

                    if (empty(opts.iic)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        //opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.iic).action('correct').put(opts.parameters, function(res) {

                            // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                },
                shown: function($modal) {

                    //listen to order.changed event to re calculate summaries
                    //fire trigger
                    $('form[name="newInvoice"]').on('order.changed', function() {

                        DevPos.Invoice.order.summaries.calculate();
                    });
                }
            };

            opts = $.extend(defaults, opts);

            console.log(opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            else if (opts.iic) 
                return Modal.edit({ ...opts,  title: __('Correct') +': '+ opts.iic });
            return Modal.create(opts);

            
        },
        order: {

            fee: {

                add: function() {

                    $('#feesList tbody tr:last').before(this.row());
                },

                row: function(opts = {}) {

                    let defaults = {

                        amount: 0,
						feeTypes: Cache.get('feeTypes')||['Paketim', 'Shishe', 'Komision', 'Të tjera']
                    };

                    opts = $.extend(defaults, opts);

                    return `
                    <tr>
                        <td>
                            ${Html.select({

                                name: 'feeType',
                                value: opts.feeType,
                                options: opts.feeTypes
                                
                            })}
                        </td>
                        <td>

                            ${Html.input({

                                name: 'amount',
                                value: opts.amount
                            })}
                        </td>
                        <td class="text-center">
							<a href="javascript:void(0)" class="btn btn-danger btn-elevate btn-circle btn-icon btn-sm" onclick="$(this).closest('tr').remove()"><i class="fa fa-trash"></i></a>
						</td>
                    </tr>`;
                }
            },
            paymentMethod: {

                add: function() {

                    let self = this;

                    return Modal.create({

                        title: 'Add Payment Method',
                        modalID: 'addPaymentMethod',
                        size: 'md',
                        template: templates().devpos[DevPos.Invoice.itemType].paymentMethod(),
                        parameters: function($modal) {

                            let parameters = Modal.parameters($('.vModal:visible'));

                            if (parameters.paymentMethodType == '2')
                                parameters.voucher = $modal.find('[name="voucher"]').val();
                            if (parameters.paymentMethodType == '2')
                                parameters.accountId = $modal.find('[name="accountId"]').val();
                            

                            return parameters;
                        },
                        save: function(opts) {

                            closeVModal(function(){

                                $('#paymentMethodsList tbody tr:last').before(self.row(opts.parameters));
                            });
                        }
                    });

                    //$('#paymentMethodsList tbody tr:last').before(this.row());
                },
                row: function(opts = {}) {

                    let defaults = {

                        amount: 0,
						paymentMethodTypes: Cache.get('paymentMethods')||[
	
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
                        banks: Cache.get('banks')||[]
                    };

                    opts = $.extend(defaults, opts);

                    console.log(opts);

                    return `
                    <tr>
                        <td>
                            <div class="row px-2">
                                <div class="col">
                                    ${Html.select({

                                        name: 'paymentMethodType',
                                        value: opts.paymentMethodType,
                                        options: opts.paymentMethodTypes,
                                        shown: function(elm) {

                                            $(elm).change(function(){

                                                let value = $(elm).val();
                                                if (value == '6') {

                                                    $(elm).closest('tr').find('[name="accountId"]').closest('div').removeClass('d-none');
                                                }
                                                else {

                                                    $(elm).closest('tr').find('[name="accountId"]').closest('div').addClass('d-none');
                                                }

                                                //voucher
                                                if (value == '2') {

                                                    $(elm).closest('tr').find('[name="voucher"]').closest('div').removeClass('d-none');
                                                }
                                                else {

                                                    $(elm).closest('tr').find('[name="voucher"]').closest('div').addClass('d-none');
                                                }


                                            }).change();
                                        }
                                        
                                    })}
                                </div>
                                <div class="col d-none">

                                    ${Html.select({

                                        class: 'form-control',
                                        name: 'accountId',
                                        value: opts.accountId,
                                        options: function(value) {

                                            return Cache.get('banks').map(row => {
                
                                                return `<option value="${row.id}" ${value == row.accountId ? 'selected':''}>${row.bankName} - ${row.number}</option>`;
                                            }).join('');
                                        },
                                    })}
                                </div>
                                <div class="col d-none">

                                    ${Html.input({

                                        class: 'form-control',
                                        name: 'voucher',
                                        value: opts.voucher,
                                        
                                    })}
                                </div>
                            </div>

                        </td>
                        <td>

                            ${Html.input({

                                name: 'amount',
                                value: opts.amount
                            })}
                        </td>
                        <td class="text-center">
							<a href="javascript:void(0)" class="btn btn-danger btn-elevate btn-circle btn-icon btn-sm" onclick="$(this).closest('tr').remove()"><i class="fa fa-trash"></i></a>
						</td>
                    </tr>`;
                }
            },
            product: {

                add: function($modal) {

                    if(typeof $modal == 'undefined')
                        $modal = $('.modal:visible');

                    $modal.find('.productLine:last').after( DevPos.Invoice.product.component() );

                    //focus input
                    $modal.find('.productLine:last input.tt-input').focus();
                },
                calculateDiscount: function(opts = {}) {

                    let defaults = {

                        tax: {},
                        rate: 0,
                        discount: 0,
                        productLine: null
                    };

                    opts = $.extend(defaults, opts);

                    if (!empty(opts.productLine)) {

                        opts.rate = parseFloat(opts.productLine.find('[name="rate"]').attr('data-rate')||0);
                        opts.discount = parseFloat(opts.productLine.find('[name="discount"]').val()||0);
                    }

                    console.log(opts);

                    //now we calculate the tax value based on it configuration, rate and discount
                    let tax = 0;

                    if (opts.tax.type == 'On Net Total') {

                        tax = (opts.rate - opts.discount) * opts.tax.rate / 100;
                    }
                    else if (opts.tax.type == 'Actual') {

                        tax = opts.tax.amount ;
                    }

                    return parseFloat(tax);
                    
                },
                calculateTax: function(opts = {}) {

                    let defaults = {

                        tax: {},
                        rate: 0,
                        discount: 0,
                        productLine: null
                    };

                    opts = $.extend(defaults, opts);

                    if (!empty(opts.productLine)) {

                        opts.rate = parseFloat(opts.productLine.find('[name="rate"]').attr('data-rate')||0);
                        opts.discount = parseFloat(opts.productLine.find('[name="discount"]').val()||0);
                    }

                    console.log(opts);

                    //now we calculate the tax value based on it configuration, rate and discount
                    let tax = 0;

                    if (opts.tax.type == 'On Net Total') {

                        tax = (opts.rate - opts.discount) * opts.tax.rate / 100;
                    }
                    else if (opts.tax.type == 'Actual') {

                        tax = opts.tax.amount ;
                    }

                    return parseFloat(tax);
                    
                },
                parameters: function($tr) {

                    return {

                        quantity: parseFloat($tr.find('[name="quantity"]').val()||0),
                        unitPrice: parseFloat($tr.find('[name="unitPrice"]').val()||0),
                        discount: parseFloat($tr.find('[name="discount"]').val()||0),
                        amount: parseFloat($tr.find('td.amount').text().trim()||0),
                    };
                },
                row: function(row = {}) {

                    let defaults = {

                        id: '',
                        barcode: '',
                        isInvestment:'',
                        quantity: 1,
                        unit: 'cope',
                        unitPrice: '',
                        discount: '',
                        amount: '',
                        vatRate: '',

                    };

                    row = $.extend(defaults, row);

                    console.log(row);

                    let self = this;

                    let html = `
                    <tr data-barcode="${row.barcode}" data-investiment="${row.isInvestment}" data-product-id="${row.id}">
                        <td class="py-4" data-attribute="name">${row.name}</td>
                        <td class="total py-4" data-attribute="unit">${__(row.unit||'piece')}</td>
                        <td data-attribute="quantity">
                            ${Html.input({

                                name: 'quantity',
                                value: 1,
                                onChange: function(elm) {

                                    console.log('changed');
                                    DevPos.Invoice.order.product.reCalculate($(elm).closest('tr'));
                                }
                            })}
                        </td>
                        <td data-attribute="unitPrice">

                            ${Html.input({

                                name: 'unitPrice',
                                value: row.rate,
                                onChange: function(elm) {

                                    DevPos.Invoice.order.product.reCalculate($(elm).closest('tr'));
                                }
                            })}

                        </td>
                        <td data-attribute="rebatePrice">
                            
                            ${Html.input({

                                name: 'discount',
                                value: row.discount||0,
                                onChange: function(elm) {

                                    DevPos.Invoice.order.product.reCalculate($(elm).closest('tr'));
                                }
                            })}
                        </td>
                        <td class="py-4 total" data-attribute="amount"> ${row.amount||row.rate} </td>
                        <td class="vat py-4" data-attribute="vatRate"></td>
                        <td class="text-center"><a href="javascript:void(0)" class="ml-3 btn btn-outline-danger btn-elevate btn-icon btn-sm btn-label-danger" onclick="DevPos.Invoice.order.product.remove(this)"><i class="fa fa-trash"></i></a></td>
                        
                    </tr>`;

                    return html;
                },
                reCalculate: function($tr) {

                    let parameters = this.parameters($tr);

                    //calculate amount
                    let amount = parameters.quantity * parameters.unitPrice;
                    let discountValue = 0;
                    if (!empty(parameters.discount)) {

                        discountValue = parameters.discount * amount / 100;
                        amount = amount - discountValue;
                    }

                    $tr.find('[name="discount"]').attr('data-value', discountValue);

                    $tr.find('td[data-attribute="amount"]').text(amount);

                    //fire trigger
                    $tr.closest('form').trigger('order.changed');

                },
                remove: function(elm) {
                    
                    let $form = $(elm).closest('form');
                    $(elm).closest('tr').remove();

                    //fire trigger
                    $form.trigger('order.changed');
                    
                    //after resetting summaries we reload the rates bc we have to send new subtotal to server
                    //reload Rates for products present already
                    this.reloadRates();
                },
                removeLast: function($modal) {

                    //remove last
                    if ($modal.find('.productLine').length == 1)
                        return;
                    
                    $modal.find('.productLine:last').remove();

                    //fire trigger
                    $modal.find('form').trigger('order.changed');
                }
            },
            summaries: {

                discount() {

                    //discount is calculated based on coupon
                    let discount = 0;
                    $('#productsList tbody tr input[name="discount"]').each(function() {
                        
                        discount += parseFloat($(this).attr('data-value')||0);
                    });

                    return discount;
                },

                subtotal() {

                    let subtotal = 0;
                    $('#productsList tbody tr ').each(function(){

                        subtotal += parseFloat($(this).attr('data-value')||0);
                    });

                    return subtotal;
                },

                taxes() {

                    let taxes = 0;
                    $('.productsList .productLine input[name="tax"]').each(function(){

                        taxes += parseFloat($(this).attr('data-value')||0);
                    });

                    return taxes;
                },

                total() {

                    let total = 0;
                    $('#productsList tr td[data-attribute="amount"]').each(function(){

                        total += parseFloat($(this).text()?.trim()||0);
                    });

                    return total;
                },

                calculate() {

                    //set subtotal
                    //$('div.subtotal').text(priceNum(this.subtotal()));
                    
                    //set discount
                    //$('div.discount').text(priceNum(this.discount()));
                    
                    //set taxes
                    //$('div.taxes').text(priceNum(this.taxes()));
                    
                    console.log('caluclating total:');
                    //set total
                    $('div.total').text(priceNum(this.total()));
                    
                }
            },
        },
        print: function() {

            //first we have to replace the canvas with image
            var can = document.querySelector('#qrcode canvas');
            var ctx = can.getContext('2d');

            //ctx.fillRect(50,50,50,50);

            var img = new Image();
            img.src = can.toDataURL();
            document.body.appendChild(img);

            let div = $('<div />').html($('#invoiceContent').parent().html());
            div.find('canvas').replaceWith(img);

            //print it
            Printer.print(div.html());
        },
        replaceCanvasWithImage: function($element) { 

            //first we have to replace the canvas with image
            var cans = $element[0].querySelectorAll('canvas');

            cans.forEach(function(can) {

                var ctx = can.getContext('2d');
    
                var img = new Image();
                img.src = can.toDataURL();
                document.body.appendChild(img);
    
                //replace it
                can.replaceWith(img);

            });

            return $element;
            
        },
        search: function() {

            return new Model(this.itemType);
        },
        url: function(itemID) {

            return `/devpos/invoices/${itemID}`;
        },
        view: function(itemID) {
            
            window.location.href = this.url(itemID);
        }
    },
    Role: {

        itemType: 'roles',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'name', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    name: {field: 'name', title: __('Name')},  
                    description: {field: 'description', title: __('Description')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'description', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = opts.item.id;
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    if (!empty(opts.item)) {

                        //add permissions
                        parameters.permissions = Cache.get('roles').find(row => row.id == opts.item.id)?.permissions||[];
                    }

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    POS: {

        itemType: 'pos',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.code)) {

                filtered = source.filter(row => { 
                    
                    return row.code.toLowerCase().startsWith(parameters.code.toLowerCase()); 
                });
            }
            if(!empty(parameters.businessUnitCode)) {

                filtered = source.filter(row => { 
                    
                    return row.businessUnitCode.toLowerCase() == parameters.businessUnitCode.toLowerCase(); 
                });
            }
            if(!empty(parameters.created_min)) {

                filtered = source.filter(row => { 
                    
                    return row.registrationDate >= parameters.created_min; 
                });
            }
            if(!empty(parameters.created_max)) {

                filtered = source.filter(row => { 
                    
                    return row.registrationDate <= parameters.created_max + ' 23:59:59'; 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    address: {field: 'address', title: __('Address')},  
                    businessUnitCode: {field: 'businessUnitCode', title: __('Business Unit Code')},   
                    city: {field: 'city', title: __('City')}, 
                    code: {field: 'code', title: __('Code')}, 
                    description: {field: 'description', title: __('Description')},  
                    latitude: {field: 'latitude', title: __('Latitude')},   
                    longitude: {field: 'longitude', title: __('Longitude')},    
                    registrationDate: {field: 'registrationDate', title: __('Registration Date')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'code', 'description', 'address',  'city', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, idTypes: Cache.get('idTypes'), cities: Cache.get('cities') }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);


                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    Product: {

        itemType: 'products',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter() { //this method is used for filtering items based on filter form on the page

            let api = this.search();

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            // we add other filter condition here
            if(!empty(parameters.name)) {

                api.where('name', 'like', '%'+ parameters.name +'%');
            }

            //and in the end we return it
            return api;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    name: {field: 'name', title: __('Name')},  
                    barcode: {field: 'barcode', title: __('Barcode')},  
                    unitPrice: {field: 'unitPrice', title: __('Unit Price')},  
                    buyingPrice: {field: 'buyingPrice', title: __('Buying Price')},  
                    rebatePrice: {field: 'rebatePrice', title: __('Rebate Price')},  
                    isRebateReducingBasePrice: {field: 'isRebateReducingBasePrice', title: __('Is RebateReducing Base Price')},  
                    vatRate: {field: 'vatRate', title: __('Vat Rate')},  
                    consumptionTaxRate: {field: 'consumptionTaxRate', title: __('Consumption Tax Rate')},  
                    productCategoryName: {field: 'productCategoryName', title: __('Product Category Name')},  
                    unitName: {field: 'unitName', title: __('Unit Name')},  
                    productCost: {field: 'productCost', title: __('Product Cost')},  
                    profitMargin: {field: 'profitMargin', title: __('Profit Margin')},  
                    minQuantity: {field: 'minQuantity', title: __('Min Quantity')},   
                    isSealable: {field: 'isSealable', title: __('Is Sealable')},  
                    affectsWarehouse: {field: 'affectsWarehouse', title: __('Affects Warehouse')},  
                    productType: {field: 'productType', title: __('Product Type')},  
                    amount: {field: 'amount', title: __('Amount')},  
                    refund: {field: 'refund', title: __('Refund')},  
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                    
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'barcode', 'unitPrice', 'productCategoryName', 'productType', 'amount', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {

                    let parameters = Modal.parameters( $('form[name="filter"]') , true);

                    let filtered = source?.slice()||[];
                    
                    // we add other filter condition here
                    if(!empty(parameters.name)) {

                        filtered = source.filter(row => { 
                            
                            return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                        });
                    }

                    //and in the end we return it
                    return filtered;
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'lg',
                template: templates()[self.prefix][self.itemType].template({

                    item: opts.item, 
                    categories: Cache.get('categories'), 
                    suppliers: Cache.get('suppliers'), 
                    units: Cache.get('units')
                }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    if (parameters.isDifFromBaseUnit == '0') {

                        //delete entryUnitId and entryUnitRatio
                        delete parameters.entryUnitId;
                        delete parameters.entryUnitRatio;
                        
                    }

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    ProductCategory: {

        itemType: 'product-categories',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    name: {field: 'name', title: __('Name')},  
                    code: {field: 'code', title: __('Code')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'code', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, idTypes: Cache.get('idTypes'), cities: Cache.get('cities') }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);


                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    ProductGroup: {

        itemType: 'product-groups',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    name: {field: 'name', title: __('Name')},  
                    code: {field: 'code', title: __('Code')},  
                    groupParentId: {field: 'cogroupParentIdde', title: __('Group ParentId')},  
                    level: {field: 'level', title: __('Level')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'code', 'level', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);


                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    Unit: {

        itemType: 'units',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    name: {field: 'name', title: __('Name')},  
                    code: {field: 'code', title: __('Code')},  
                    description: {field: 'description', title: __('Description')},  
                    standardCode: {field: 'standardCode', title: __('Standard Code')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'code', 'description', 'standardCode', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item}),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);


                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    Supplier: {

        itemType: 'suppliers',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: 'website_'+ self.itemType,
                columns: ['id', 'name', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }}, 
                    name: {field: 'name', title: __('Name')},  
                    'nuis': {field: 'nuis', title: __("NUIS")},
                    address: {field: 'address', title: __("Address")},
                    contact: {field: 'contact', title: __("Contact")},
                    code: {field: 'code', title: __("Code")},
                    'creator:name': {field: 'created_by', title: __("Creator")},
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            this.list({

                columns: ['id', 'nuis', 'name', 'code', 'address', 'contact', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {

                    let parameters = Modal.parameters( $('form[name="filter"]') , true);

                    let filtered = source?.slice()||[];

                    console.log('whole length: '+ filtered.length);
                    // we add other filter condition here
                    if(!empty(parameters.name)) {

                        filtered = source.filter(row => { 
                            
                            return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                        });
                    }

                    console.log('filtered length: '+ filtered.length);

                    //and in the end we return it
                    return filtered;
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item}),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add thumbnail
                    parameters.thumbnail = $modal.find('.filebox img').attr('src');

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    SupplierList: {

        itemType: 'supplier-lists',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter() { //this method is used for filtering items based on filter form on the page

            let api = this.search();

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            // we add other filter condition here
            if(!empty(parameters.name)) {

                api.where('name', 'like', '%'+ parameters.name +'%');
            }

            //and in the end we return it
            return api;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: 'website_'+ self.itemType,
                columns: ['id', 'name', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }}, 
                    name: {field: 'name', title: __('Name')},  
                    nuisList: {field: 'nuisList', title: __("NUIS")},
                    description: {field: 'description', title: __("Description")},
                    'creator:name': {field: 'created_by', title: __("Creator")},
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            this.list({

                columns: ['id', 'nuisList', 'name', 'description', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {

                    let parameters = Modal.parameters( $('form[name="filter"]') , true);

                    let filtered = source?.slice()||[];

                    // we add other filter condition here
                    if(!empty(parameters.name)) {

                        filtered = source.filter(row => { 
                            
                            return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                        });
                    }

                    //and in the end we return it
                    return filtered;
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, suppliers: Cache.get('suppliers')}),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add thumbnail
                    parameters.thumbnail = $modal.find('.filebox img').attr('src');

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    TaxPayer: {

        itemType: 'taxpayer',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(this.itemType);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'lg',
                template: templates()[self.prefix][self.itemType].template({
                    item: opts.item, 
                    idTypes: Cache.get('idTypes'), 
                    cities: Arr.pluck(Cache.get('cities'), 'name').sort(),
                    countries: Arr.pluck(Cache.get('countries'), 'name', 'countryCode'),
                }),
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add country label
                    parameters.country = $modal.find('[name="countryCode"] option:selected').text().trim();

                    return parameters;
                },
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    Transporter: {

        itemType: 'transporters',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter() { //this method is used for filtering items based on filter form on the page

            let api = this.search();

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            // we add other filter condition here
            if(!empty(parameters.name)) {

                api.where('name', 'like', '%'+ parameters.name +'%');
            }

            //and in the end we return it
            return api;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'name', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }}, 
                    name: {field: 'name', title: __('Name')},  
                    nuis: {field: 'nuis', title: __("NUIS")},
                    address: {field: 'address', title: __("Address")},
                    phoneNo: {field: 'phoneNo', title: __("Phone")},
                    plate: {field: 'plate', title: __("Plate")},
                    'creator:name': {field: 'created_by', title: __("Creator")},
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            this.list({

                columns: ['id', 'nuis', 'name', 'address', 'phoneNo', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {

                    let parameters = Modal.parameters( $('form[name="filter"]') , true);

                    let filtered = source?.slice()||[];

                    // we add other filter condition here
                    if(!empty(parameters.name)) {

                        filtered = source.filter(row => { 
                            
                            return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                        });
                    }

                    //and in the end we return it
                    return filtered;
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, suppliers: Cache.get('suppliers')}),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add thumbnail
                    parameters.thumbnail = $modal.find('.filebox img').attr('src');

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    TCR: {

        itemType: 'tcrs',
        prefix: 'devpos',
        choose: function(itemID) {

            let self = this;
            swalConfirm({
			
                text: '',
                type: 'question',
                confirm: function(opts) {
                    
                    //from itemID find the tcr_code
                    let tcr = Cache.get('tcrs').find(row => row.id == itemID);

                    //run request
                    //new Route(self.itemType).prefix(self.prefix).action(tcr.fiscalizationNumber + '/choose').get(function(res){
                    new Route(self.itemType).prefix(self.prefix).action('choose').post(tcr, function(res){

                        generalSuccess();
                    });

                }
            }); 

            
        },  
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source = []) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);
    
            let filtered = source?.slice()||[];
            
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = filtered.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }
            if(!empty(parameters.created_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dateTimeCreated >= parameters.created_min; 
                });
            }
            if(!empty(parameters.created_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dateTimeCreated <= parameters.created_max; 
                });
            }

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }}, 
                    name: {field: 'name', title: __('Name')},  
                    code: {field: 'code', title: __('Code')},  
                    type: {field: 'type', title: __('Type'), template: function(row){ let types = {'0': 'Regular cash register', '1': 'Self-service cash register'}; return __(types[row.type]) }},  
                    businessUnitCode: {field: 'businessUnitCode', title: __('Business Unit Code')},  
                    description: {field: 'description', title: __('Description')},  
                    fiscalizationNumber: {field: 'fiscalizationNumber', title: __('Fiscalization Number')},  
                    tcrIntID: {field: 'tcrIntID', title: __('Sort')},  
                    pointsOfSaleCode: {field: 'pointsOfSaleCode', title: __('POS')},  
                    tcrBalance: {field: 'tcrBalance', title: __('Balance'), autoHide:!1, template: function(row) { return priceNum(row.tcrBalance); }},  
                    'pos:code': {field: 'pos_id', title: __('POS')},  
                    
                    validFromDate: {field: 'validFromDate', title: __("Valid from"), type: "date", template: function(row){ return row.validFromDate ? moment(row.validFromDate).format("MM/DD/YYYY"):''; }},
                    validToDate: {field: 'validToDate', title: __("Valid up to"), type: "date", template: function(row){ return row.validToDate ? moment(row.validToDate).format("MM/DD/YYYY"):''; }},
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                    
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-${(choosedTCR == row.fiscalizationNumber ? 'brand':'clean')} btn-icon btn-icon-md" title="${__('Choose')}" data-id="${row.id}"><i class="la la-check"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-check').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.choose(itemID);
                    });

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'tcrIntID', 'pointsOfSaleCode', 'type', 'validFromDate', 'validToDate', 'businessUnitCode', 'fiscalizationNumber', 'tcrBalance', 'created_at', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {

                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, warehouseTypes: Cache.get('warehouseTypes')}),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add thumbnail
                    parameters.thumbnail = $modal.find('.filebox img').attr('src');

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        updateBalance: function(itemID) {

            //get tcrCodes
            return Modal.create({

                title: 'Update balance',
                size: 'md',
                template: templates().tcrs.openBalace({tcrs: Cache.get('tcrs')}),
                save: function(opts) {

                    new Route('tcrs').whereId(opts.parameters.tcrId).action('open-balance').post(opts.parameters, function(res) {

                        closeVModal(function(){
                            
                            generalSuccess('Cash drawer open successfully with the initial balance: '+ res.Data.value, 2500);
                            Page.reload(2500);

                        });

                    }, function(res) { generalError(res.Msg) });
                }
            });
                
            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    TCRBalance: {

        itemType: 'tcr-balances',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter() { //this method is used for filtering items based on filter form on the page

            let api = this.search();

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            // we add other filter condition here
            if(!empty(parameters.name)) {

                api.where('name', 'like', '%'+ parameters.name +'%');
            }

            //and in the end we return it
            return api;
        },
        fiscalize: function(itemID) {

            swalConfirm({
			
                text: '',
                type: 'question',
                confirm: function(opts) {

                    new Route(self.itemType).prefix(self.prefix).whereId(itemID).put({}, function(res) {

                        generalSuccess();
                    });

                    console.log(parameters);
                }
            });             
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    code: {field: 'code', title: __('Code')},  
                    value: {field: 'value', title: __('Value')},  
                    description: {field: 'description', title: __('Description')},  
                    'tcr.name': {field: 'tcr.name', title: __('TCR'), template: function(row){ return row.tcr.name; }},  
                    operation: {field: 'operation', title: __('Operation'), template: function(row){

                        let operations = ['Deklaratë Fillestare', 'Tërheqje', 'Depozitim'];

                        return operations[row.operation];
                        
                    }},  
                    tcrBalance: {field: 'tcrBalance', title: __('Balance'), autoHide:!1, template: function(row) { return priceNum(row.tcrBalance); }},  
                    
                    changeDateTime: {field: 'changeDateTime', title: __("Change Date"), type: "date", template: function(row){ return moment(row.changeDateTime).format("MM/DD/YYYY"); }},
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                    
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'tcr.name', 'value', 'operation', 'changeDateTime', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {

                    let parameters = Modal.parameters( $('form[name="filter"]') , true);

                    let filtered = source?.slice()||[];
                    
                    // we add other filter condition here
                    if(!empty(parameters.name)) {

                        filtered = source.filter(row => { 
                            
                            return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                        });
                    }

                    //and in the end we return it
                    return filtered;
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, tcrs: Cache.get('tcrs')}),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add thumbnail
                    parameters.thumbnail = $modal.find('.filebox img').attr('src');

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    TCRUnfiscalizedBalance: {

        itemType: 'tcr-balances',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter() { //this method is used for filtering items based on filter form on the page

            let api = this.search();

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            // we add other filter condition here
            if(!empty(parameters.name)) {

                api.where('name', 'like', '%'+ parameters.name +'%');
            }

            //and in the end we return it
            return api;
        },
        fiscalize: function(itemID) {

            let self = this;

            swalConfirm({
			
                text: '',
                type: 'question',
                confirm: function(opts) {

                    new Route(self.itemType).prefix(self.prefix).whereId(itemID).action('fiscalize').put({}, function(res) {

                        generalSuccess();
                    });

                    console.log(parameters);
                }
            });             
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    code: {field: 'code', title: __('Code')},  
                    value: {field: 'value', title: __('Value')},  
                    description: {field: 'description', title: __('Description')},  
                    'tcr.name': {field: 'tcr.name', title: __('TCR'), template: function(row){ return row.tcr.name; }},  
                    operation: {field: 'operation', title: __('Operation'), template: function(row){

                        let operations = ['Deklaratë Fillestare', 'Tërheqje', 'Depozitim'];

                        return operations[row.operation];
                        
                    }},  
                    tcrBalance: {field: 'tcrBalance', title: __('Balance'), autoHide:!1, template: function(row) { return priceNum(row.tcrBalance); }},  
                    
                    changeDateTime: {field: 'changeDateTime', title: __("Change Date"), type: "date", template: function(row){ return moment(row.changeDateTime).format("MM/DD/YYYY"); }},
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                    
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Fiscalize')}" data-id="${row.id}"><i class="la la-upload"></i> </a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-upload').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.fiscalize(itemID);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'name', 'tcr.name', 'value', 'operation', 'changeDateTime', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {

                    let parameters = Modal.parameters( $('form[name="filter"]') , true);

                    let filtered = source?.slice()||[];
                    
                    // we add other filter condition here
                    if(!empty(parameters.name)) {

                        filtered = source.filter(row => { 
                            
                            return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                        });
                    }

                    //and in the end we return it
                    return filtered;
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, tcrs: Cache.get('tcrs')}),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add thumbnail
                    parameters.thumbnail = $modal.find('.filebox img').attr('src');

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    Unfiscalized: {

        itemType: 'unfiscalized',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        export: function() {

            //download it
            window.location.href = '/'+ this.prefix +'/'+ this.itemType +'/export';
        },
        filter(source = []) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);
    
            let filtered = source?.slice()||[];
            
            // we add other filter condition here
            if(!empty(parameters.operatorName)) {

                filtered = filtered.filter(row => { 

                    return row.operatorName.toLowerCase().startsWith(parameters.operatorName.toLowerCase()); 
                });
            }if(!empty(parameters.customerBusinessName)) {

                filtered = filtered.filter(row => { 
                    
                    if (!empty(row.customerBusinessName))
                        return row.customerBusinessName.toLowerCase().startsWith(parameters.customerBusinessName.toLowerCase()); 
                });
            }
            if(!empty(parameters.name)) {

                filtered = filtered.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }
            if(!empty(parameters.total_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.totalPrice >= parseFloat(parameters.total_min); 
                });
            }
            if(!empty(parameters.total_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.totalPrice <= parseFloat(parameters.total_max); 
                });
            }
            if(!empty(parameters.created_min)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dateTimeCreated >= parameters.created_min; 
                });
            }
            if(!empty(parameters.created_max)) {

                filtered = filtered.filter(row => { 
                    
                    return row.dateTimeCreated <= parameters.created_max; 
                });
            }

            //and in the end we return it
            return filtered;
        },
        queryParameters() { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="main_filter"]') , true);

            return parameters;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    businessUnitCode: {field: 'businessUnitCode', title: __('Business Unit Code')}, 
                    clientApplication: {field: 'clientApplication', title: __('Client Application')}, 
                    customerAddress: {field: 'customerAddress', title: __('Customer Address')},  
                    customerBusinessName: {field: 'customerBusinessName', title: __('Customer')},  
                    customerCity: {field: 'customerCity', title: __('Customer City')},  
                    customerDetails: {field: 'customerDetails', title: __('Customer Details')},  
                    customerId: {field: 'customerId', title: __('Customer Id')},  
                    customerIdNumber: {field: 'customerIdNumber', title: __('Customer Id Number')},  
                    customerIdType: {field: 'customerIdType', title: __('Customer Id Type')},  
                     
                    documentType: {field: 'documentType', title: __('Document Type')},  
                    eic: {field: 'eic', title: __('EIC')},  
                    exchangeRate: {field: 'exchangeRate', title: __('Exchange Rate')},  
                    fiscNumber: {field: 'fiscNumber', title: __('Fisc Number')},  
                    iic: {field: 'iic', title: __('IIC')},  
                    invoiceNumber: {field: 'invoiceNumber', title: __('Invoice Number')},  
                    invoiceOrderNumber: {field: 'invoiceOrderNumber', title: __('Invoice Order Number')},  
                    invoiceType: {field: 'invoiceType', title: __('Invoice Type'), template: function(row){ return Cache.get('invoiceTypes')[row.invoiceType]; }},  
                    isACorrectedInvoice: {field: 'isACorrectedInvoice', title: __('Is A Corrected Invoice')},  
                    isCorrectiveInvoice: {field: 'isCorrectiveInvoice', title: __('Is Corrective Invoice')},  
                    isEInvoice: {field: 'isEInvoice', title: __('IsEInvoice')},  
                    isReverseCharge: {field: 'isReverseCharge', title: __('Is Reverse Charge')},  
                    isSelfIssuingAffectWareHouse: {field: 'isSelfIssuingAffectWareHouse', title: __('Is Self Issuing Affect WareHouse')},  
                    isSentAsEInvoice: {field: 'isSentAsEInvoice', title: __('Is Sent As EInvoice')},   
                    isSubsequentDelivery: {field: 'isSubsequentDelivery', title: __('Is Subsequent Delivery')},  
                    markUpAmount: {field: 'markUpAmount', title: __('Mark Up Amount')},  
                    notes: {field: 'notes', title: __('Notes')},  
                    operatorCode: {field: 'operatorCode', title: __('Operator Code')},  
                    operatorName: {field: 'operatorName', title: __('Operator Name')},  
                    payDeadline: {field: 'payDeadline', title: __('Pay Deadline')},  
                    process: {field: 'process', title: __('Process')},  
                    sellerAddress: {field: 'sellerAddress', title: __('Seller Address')},  
                    softCode: {field: 'softCode', title: __('Soft Code')},  
                    taxFreeAmount: {field: 'taxFreeAmount', title: __('Tax Free Amount')},  
                    tcrCode: {field: 'tcrCode', title: __('Tcr Code')},  
                    totalPrice: {field: 'totalPrice', title: __('Total Price'), template: function(row){ return priceNum(row.totalPrice); }},  
                    totalPriceWithoutVAT: {field: 'totalPriceWithoutVAT', title: __('Total Price Without VAT')},  
                    totalVATAmount: {field: 'totalVATAmount', title: __('Total VAT Amount')},  
                    transporterIdType: {field: 'transporterIdType', title: __('Transporter Id Type')},  
                    valuesAreInForeignCurrency: {field: 'valuesAreInForeignCurrency', title: __('Values Are In Foreign Currency')},  
                    verificationUrl: {field: 'verificationUrl', title: __('Verification Url')},  
                    warehouseId: {field: 'warehouseId', title: __('WarehouseId')},  
                    dateTimeCreated: {field: 'dateTimeCreated', title: __("Created Date"), type: "date", template: function(row){ return moment(row.dateTimeCreated).format("MM/DD/YYYY"); }},
                    
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;

            new Route(this.itemType).prefix(this.prefix).query(this.queryParameters()).get(function(res) {
    
                self.list({
    
                    columns: ['id', 'invoiceType', 'operatorName', 'invoiceNumber', 'dateTimeCreated', 'totalPrice', 'customerBusinessName', 'amount', 'notes', 'actions'],
                    source: res.Data,
                    filter: function(source = []) {
    
                        return self.filter(source);
                    }
                });

            });
        },
        modal: function(opts = {}) {
            
            let self = this;

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'xl',
                template: templates()[self.prefix][self.itemType].template({ 

                    item: opts.item, 
                    idTypes: Cache.get('idTypes'),
                    countries: Cache.get('countries'), 
                    tcrs: Cache.get('tcrs')
                }),
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add customer
                    if (empty(parameters.customer.idNumber) && empty(parameters.customer.name)) 
                        delete parameters.customer;

                    //add products
                    parameters.invoiceProducts = [];
                    $('#productsList tbody tr').each(function() {

                        parameters.invoiceProducts.push({

                            productId: $(this).attr('data-product-id'),
                            barcode: $(this).attr('data-barcode'),
                            isInvestment: $(this).attr('data-investment'),
                            name: $(this).find('[data-attribute="name"]').text().trim(),

                            isRebateReducingBasePrice: 1,
                            rebatePrice: 0,

                            unit: $(this).find('[data-attribute="unit"]').text().trim(),
                            quantity: $(this).find('[name="quantity"]').val().trim(),
                            unitPrice: parseFloat($(this).find('[name="unitPrice"]').val()?.trim()||0),
                            vatRate: $(this).find('[data-attribute="vatRate"]').text().trim(),

                        });

                    });

                    //add fees
                    parameters.invoiceFees = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        parameters.invoiceFees.push({

                            feeType: $(this).find('[name="feeType"]').val(),
                            amount: $(this).find('[name="amount"]').val(),
                        });
                    });

                    //add invoicePayments
                    parameters.invoicePayments = [];
                    $('#feesList tbody tr:not(:last)').each(function() {

                        let payment = {

                            paymentMethodType: $(this).find('[name="paymentMethodType"]').val(),
                            amount: $(this).find('[name="amount"]').val()
                        };

                        if (payment.paymentMethodType == '2') {
                            payment.voucher = $(this).find('[name="voucher"]').val();
                        }

                        if (payment.paymentMethodType == '6') {
                            payment.accountId = $(this).find('[name="accountId"]').val();
                        }

                        parameters.invoicePayments.push(payment);
                    });

                    //extra
                    if (parameters.selfIssuing == '1') {

                        parameters.selfIssuingType = $modal.find('[name="selfIssuingType"]').val();
                    }

                    if ($modal.find('[name="isLateFiscalized"]').is(':checked')) {

                        parameters.subsequentDeliveryType = $modal.find('[name="subsequentDeliveryType"]').val();
                    }
                    

                    return parameters;
                },
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                },
                shown: function($modal) {

                    //listen to order.changed event to re calculate summaries
                    //fire trigger
                    $('form[name="newInvoice"]').on('order.changed', function() {

                        DevPos.Invoice.order.summaries.calculate();
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        order: {

            fee: {

                add: function() {

                    $('#feesList tbody tr:last').before(this.row());
                },

                row: function(opts = {}) {

                    let defaults = {

                        amount: 0,
						feeTypes: Cache.get('feeTypes')||['Paketim', 'Shishe', 'Komision', 'Të tjera']
                    };

                    opts = $.extend(defaults, opts);

                    return `
                    <tr>
                        <td>
                            ${Html.select({

                                name: 'feeType',
                                value: opts.feeType,
                                options: opts.feeTypes
                                
                            })}
                        </td>
                        <td>

                            ${Html.input({

                                name: 'amount',
                                value: opts.amount
                            })}
                        </td>
                        <td class="text-center">
							<a href="javascript:void(0)" class="btn btn-danger btn-elevate btn-circle btn-icon btn-sm" onclick="$(this).closest('tr').remove()"><i class="fa fa-trash"></i></a>
						</td>
                    </tr>`;
                }
            },
            paymentMethod: {

                add: function() {

                    let self = this;

                    return Modal.create({

                        title: 'Add Payment Method',
                        modalID: 'addPaymentMethod',
                        size: 'md',
                        template: templates().devpos[DevPos.Invoice.itemType].paymentMethod(),
                        parameters: function($modal) {

                            let parameters = Modal.parameters($('.vModal:visible'));

                            if (parameters.paymentMethodType == '2')
                                parameters.voucher = $modal.find('[name="voucher"]').val();
                            if (parameters.paymentMethodType == '2')
                                parameters.accountId = $modal.find('[name="accountId"]').val();
                            

                            return parameters;
                        },
                        save: function(opts) {

                            closeVModal(function(){

                                $('#paymentMethodsList tbody tr:last').before(self.row(opts.parameters));
                            });
                        }
                    });

                    //$('#paymentMethodsList tbody tr:last').before(this.row());
                },
                row: function(opts = {}) {

                    let defaults = {

                        amount: 0,
						paymentMethodTypes: Cache.get('paymentMethods')||[
	
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
                        banks: Cache.get('banks')||[]
                    };

                    opts = $.extend(defaults, opts);

                    console.log(opts);

                    return `
                    <tr>
                        <td>
                            <div class="row px-2">
                                <div class="col">
                                    ${Html.select({

                                        name: 'paymentMethodType',
                                        value: opts.paymentMethodType,
                                        options: opts.paymentMethodTypes,
                                        shown: function(elm) {

                                            $(elm).change(function(){

                                                let value = $(elm).val();
                                                if (value == '6') {

                                                    $(elm).closest('tr').find('[name="accountId"]').closest('div').removeClass('d-none');
                                                }
                                                else {

                                                    $(elm).closest('tr').find('[name="accountId"]').closest('div').addClass('d-none');
                                                }

                                                //voucher
                                                if (value == '2') {

                                                    $(elm).closest('tr').find('[name="voucher"]').closest('div').removeClass('d-none');
                                                }
                                                else {

                                                    $(elm).closest('tr').find('[name="voucher"]').closest('div').addClass('d-none');
                                                }


                                            }).change();
                                        }
                                        
                                    })}
                                </div>
                                <div class="col d-none">

                                    ${Html.select({

                                        class: 'form-control',
                                        name: 'accountId',
                                        value: opts.accountId,
                                        options: function(value) {

                                            return Cache.get('banks').map(row => {
                
                                                return `<option value="${row.id}" ${value == row.accountId ? 'selected':''}>${row.bankName} - ${row.number}</option>`;
                                            }).join('');
                                        },
                                    })}
                                </div>
                                <div class="col d-none">

                                    ${Html.input({

                                        class: 'form-control',
                                        name: 'voucher',
                                        value: opts.voucher,
                                        
                                    })}
                                </div>
                            </div>

                        </td>
                        <td>

                            ${Html.input({

                                name: 'amount',
                                value: opts.amount
                            })}
                        </td>
                        <td class="text-center">
							<a href="javascript:void(0)" class="btn btn-danger btn-elevate btn-circle btn-icon btn-sm" onclick="$(this).closest('tr').remove()"><i class="fa fa-trash"></i></a>
						</td>
                    </tr>`;
                }
            },
            product: {

                add: function($modal) {

                    if(typeof $modal == 'undefined')
                        $modal = $('.modal:visible');

                    $modal.find('.productLine:last').after( DevPos.Invoice.product.component() );

                    //focus input
                    $modal.find('.productLine:last input.tt-input').focus();
                },
                calculateDiscount: function(opts = {}) {

                    let defaults = {

                        tax: {},
                        rate: 0,
                        discount: 0,
                        productLine: null
                    };

                    opts = $.extend(defaults, opts);

                    if (!empty(opts.productLine)) {

                        opts.rate = parseFloat(opts.productLine.find('[name="rate"]').attr('data-rate')||0);
                        opts.discount = parseFloat(opts.productLine.find('[name="discount"]').val()||0);
                    }

                    console.log(opts);

                    //now we calculate the tax value based on it configuration, rate and discount
                    let tax = 0;

                    if (opts.tax.type == 'On Net Total') {

                        tax = (opts.rate - opts.discount) * opts.tax.rate / 100;
                    }
                    else if (opts.tax.type == 'Actual') {

                        tax = opts.tax.amount ;
                    }

                    return parseFloat(tax);
                    
                },
                calculateTax: function(opts = {}) {

                    let defaults = {

                        tax: {},
                        rate: 0,
                        discount: 0,
                        productLine: null
                    };

                    opts = $.extend(defaults, opts);

                    if (!empty(opts.productLine)) {

                        opts.rate = parseFloat(opts.productLine.find('[name="rate"]').attr('data-rate')||0);
                        opts.discount = parseFloat(opts.productLine.find('[name="discount"]').val()||0);
                    }

                    console.log(opts);

                    //now we calculate the tax value based on it configuration, rate and discount
                    let tax = 0;

                    if (opts.tax.type == 'On Net Total') {

                        tax = (opts.rate - opts.discount) * opts.tax.rate / 100;
                    }
                    else if (opts.tax.type == 'Actual') {

                        tax = opts.tax.amount ;
                    }

                    return parseFloat(tax);
                    
                },
                parameters: function($tr) {

                    return {

                        quantity: parseFloat($tr.find('[name="quantity"]').val()||0),
                        unitPrice: parseFloat($tr.find('[name="unitPrice"]').val()||0),
                        discount: parseFloat($tr.find('[name="discount"]').val()||0),
                        amount: parseFloat($tr.find('td.amount').text().trim()||0),
                    };
                },
                row: function(row = {}) {

                    let defaults = {

                        id: '',
                        barcode: '',
                        isInvestment:'',
                        quantity: 1,
                        unit: 'cope',
                        unitPrice: '',
                        discount: '',
                        amount: '',
                        vatRate: '',

                    };

                    row = $.extend(defaults, row);

                    console.log(row);

                    let self = this;

                    let html = `
                    <tr data-barcode="${row.barcode}" data-investiment="${row.isInvestment}" data-product-id="${row.id}">
                        <td class="py-4" data-attribute="name">${row.name}</td>
                        <td class="total py-4" data-attribute="unit">${__(row.unit||'piece')}</td>
                        <td data-attribute="quantity">
                            ${Html.input({

                                name: 'quantity',
                                value: 1,
                                onChange: function(elm) {

                                    console.log('changed');
                                    DevPos.Invoice.order.product.reCalculate($(elm).closest('tr'));
                                }
                            })}
                        </td>
                        <td data-attribute="unitPrice">

                            ${Html.input({

                                name: 'unitPrice',
                                value: row.rate,
                                onChange: function(elm) {

                                    DevPos.Invoice.order.product.reCalculate($(elm).closest('tr'));
                                }
                            })}

                        </td>
                        <td data-attribute="rebatePrice">
                            
                            ${Html.input({

                                name: 'discount',
                                value: row.discount||0,
                                onChange: function(elm) {

                                    DevPos.Invoice.order.product.reCalculate($(elm).closest('tr'));
                                }
                            })}
                        </td>
                        <td class="py-4 total" data-attribute="amount"> ${row.amount||row.rate} </td>
                        <td class="vat py-4" data-attribute="vatRate"></td>
                        <td class="text-center"><a href="javascript:void(0)" class="ml-3 btn btn-outline-danger btn-elevate btn-icon btn-sm btn-label-danger" onclick="DevPos.Invoice.order.product.remove(this)"><i class="fa fa-trash"></i></a></td>
                        
                    </tr>`;

                    return html;
                },
                reCalculate: function($tr) {

                    let parameters = this.parameters($tr);

                    //calculate amount
                    let amount = parameters.quantity * parameters.unitPrice;
                    let discountValue = 0;
                    if (!empty(parameters.discount)) {

                        discountValue = parameters.discount * amount / 100;
                        amount = amount - discountValue;
                    }

                    $tr.find('[name="discount"]').attr('data-value', discountValue);

                    $tr.find('td[data-attribute="amount"]').text(amount);

                    //fire trigger
                    $tr.closest('form').trigger('order.changed');

                },
                remove: function(elm) {
                    
                    let $form = $(elm).closest('form');
                    $(elm).closest('tr').remove();

                    //fire trigger
                    $form.trigger('order.changed');
                    
                    //after resetting summaries we reload the rates bc we have to send new subtotal to server
                    //reload Rates for products present already
                    this.reloadRates();
                },
                removeLast: function($modal) {

                    //remove last
                    if ($modal.find('.productLine').length == 1)
                        return;
                    
                    $modal.find('.productLine:last').remove();

                    //fire trigger
                    $modal.find('form').trigger('order.changed');
                }
            },
            summaries: {

                discount() {

                    //discount is calculated based on coupon
                    let discount = 0;
                    $('#productsList tbody tr input[name="discount"]').each(function() {
                        
                        discount += parseFloat($(this).attr('data-value')||0);
                    });

                    return discount;
                },

                subtotal() {

                    let subtotal = 0;
                    $('#productsList tbody tr ').each(function(){

                        subtotal += parseFloat($(this).attr('data-value')||0);
                    });

                    return subtotal;
                },

                taxes() {

                    let taxes = 0;
                    $('.productsList .productLine input[name="tax"]').each(function(){

                        taxes += parseFloat($(this).attr('data-value')||0);
                    });

                    return taxes;
                },

                total() {

                    let total = 0;
                    $('#productsList tr td[data-attribute="amount"]').each(function(){

                        total += parseFloat($(this).text()?.trim()||0);
                    });

                    return total;
                },

                calculate() {

                    //set subtotal
                    //$('div.subtotal').text(priceNum(this.subtotal()));
                    
                    //set discount
                    //$('div.discount').text(priceNum(this.discount()));
                    
                    //set taxes
                    //$('div.taxes').text(priceNum(this.taxes()));
                    
                    console.log('caluclating total:');
                    //set total
                    $('div.total').text(priceNum(this.total()));
                    
                }
            },
        },
        search: function() {

            return new Model(this.itemType);
        },
    },
    User: {

        itemType: 'users',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},   
                    configuration: {field: 'configuration', title: __('Configuration')},  
                    email: {field: 'email', title: __('Email')},  
                    fullName: {field: 'fullName', title: __('Full Name')},  
                    isEnabled: {field: 'isEnabled', title: __('Is Enabled')},  
                    isLockedOut: {field: 'isLockedOut', title: __('Is Locked Out')}, 
                    jobTitle: {field: 'jobTitle', title: __('Job Title')},   
                    operatorCode: {field: 'operatorCode', title: __('Operator Code')},   
                    percentage: {field: 'percentage', title: __('Percentage')},   
                    phoneNumber: {field: 'phoneNumber', title: __('Phone Number')},   
                    pointsOfSaleId: {field: 'pointsOfSaleId', title: __('Points Of Sale Id')},   
                    taxPayerId: {field: 'taxPayerId', title: __('Tax Payer Id')},  
                    userName: {field: 'userName', title: __('Username')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'userName', 'fullName', 'email', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({

                    item: opts.item, 
                    cities: Cache.get('cities')||[], 
                    supplierList: Cache.get('supplierList')||[], 
                    roles: Arr.pluck(Cache.get('roles'), 'name')||[]
                }),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = opts.item.id;
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);


                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    Vehicle: {

        itemType: 'vehicles',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter(source) { //this method is used for filtering items based on filter form on the page

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            let filtered = source?.slice()||[];

            console.log('whole length: '+ filtered.length);
            // we add other filter condition here
            if(!empty(parameters.name)) {

                filtered = source.filter(row => { 
                    
                    return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                });
            }

            console.log('filtered length: '+ filtered.length);

            //and in the end we return it
            return filtered;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 50, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    plate: {field: 'plate', title: __('Plate')},  
                    description: {field: 'description', title: __('Description')},  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            let self = this;
    
            this.list({
    
                columns: ['id', 'plate', 'description', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {
    
                    return self.filter(source);
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item}),
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    return parameters;
                },
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            //Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
    WareHouse: {

        itemType: 'warehouses',
        prefix: 'devpos',
        create: function() {
                
            return this.modal();
        },
        delete: function(itemID, callback) {

            let self = this;

            return swalDelete({ 

                path: self.prefix + '/'+ self.itemType +'/'+ itemID,
                itemID:  itemID,  
                callback: function() {  

                    return isFunction(callback) ? callback():'';  
                } 
            });
        },
        edit(itemID) {

            let self = this;
    
            //first get it from db
            let item = Cache.get(self.itemType).find(row => row.id == itemID);
            return self.modal({item: item});
           
        },
        filter() { //this method is used for filtering items based on filter form on the page

            let api = this.search();

            let parameters = Modal.parameters( $('form[name="filter"]') , true);

            // we add other filter condition here
            if(!empty(parameters.name)) {

                api.where('name', 'like', '%'+ parameters.name +'%');
            }

            //and in the end we return it
            return api;
        },
        list: function(opts = {}) {

            let self = this;

            let defaults = {

                target: '.k_datatable', //selector
                itemType: self.itemType,
                columns: ['id', 'code', 'created_at', 'actions'],
                attributes: {

                    id: {field: 'id', title: "#", sortable: !1, width: 30, type: "number", selector: !1, textAlign: "center", template:function(row, index, instance) { 
                            
                        //console.log(instance);
                        //console.log(instance.getData());
                        return (instance.API.params.pagination.page - 1) * instance.options.data.pageSize + (index + 1); 
                    }},  
                    code: {field: 'code', title: __("Code")},
                    description: {field: 'description', title: __("Description")},
                    email: {field: 'email', title: __("Email")},
                    latitude: {field: 'latitude', title: __("Latitude")},
                    longitude: {field: 'longitude', title: __("Longitude")},
                    notes: {field: 'notes', title: __("Notes")},
                    order: {field: 'order', title: __("Order")},
                    phone: {field: 'phone', title: __("Phone")},
                    wareHouseType: {field: 'wareHouseType', title: __("WareHouse Type")},
                    'creator:name': {field: 'created_by', title: __("Creator")},
                    created_at: {field: 'created_at', title: __("Created Date"), type: "date", template: function(row){ return moment(row.created_at).format("MM/DD/YYYY"); }},
                  
                    actions: {title: __('Actions'), sortable:!1, width: 150, overflow:"visible", autoHide:!1, template:function(row) {
                                
                        return `
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Edit')}" data-id="${row.id}"><i class="la la-pencil"></i> </a>
                            <a href="javascript:void(0);" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="${__('Delete')}" data-id="${row.id}"><i class="la la-trash"></i></a>
                        `;
                    }}
                },
                onUpdate: function(instance) {

                    $(instance).find('a[data-id] i.la.la-pencil').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.edit(itemID);
                    });
                    
                    $(instance).find('a[data-id] i.la.la-trash').closest('a').click(function(){
                        
                        let itemID = $(this).attr('data-id');
                        self.delete(itemID, function() {

                            $('a[data-id="'+ itemID +'"]').closest('tr').remove();
                        });
                    });
                }
            };

            opts = $.extend(defaults, opts);

            //run kdatatable
            return $(opts.target).kdatatableL(opts);

        },
        load: function(opts = {}) {

            this.list({

                columns: ['id', 'code', 'description', 'notes', 'phone', 'email',  'wareHouseType', 'actions'],
                source: Cache.get(this.itemType),
                filter: function(source = []) {

                    let parameters = Modal.parameters( $('form[name="filter"]') , true);

                    let filtered = source?.slice()||[];
                    
                    // we add other filter condition here
                    if(!empty(parameters.name)) {

                        filtered = source.filter(row => { 
                            
                            return row.name.toLowerCase().startsWith(parameters.name.toLowerCase()); 
                        });
                    }

                    //and in the end we return it
                    return filtered;
                }
            });
        },
        modal: function(opts = {}) {
            
            let self = this;
           

            let defaults = {

                itemType: self.itemType,
                item: opts.item||{},
                size: 'md',
                template: templates()[self.prefix][self.itemType].template({item: opts.item, warehouseTypes: Cache.get('warehouseTypes')}),
                save: function(opts) {

                    if (empty(opts.item)) {

                        new Route(self.itemType).prefix(self.prefix).store(opts.parameters, function(res) {

                            Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                    else {

                        //add id
                        opts.parameters.id = parseInt(opts.item.id);
                        new Route(self.itemType).prefix(self.prefix).whereId(opts.item.id).put(opts.parameters, function(res) {

                           // Page.reload(2000);
                            opts.callback();

                        }, function(res) {

                            generalError();
                        });
                    }
                },
                parameters: function($modal) {

                    let parameters = Modal.parameters($modal);

                    //add thumbnail
                    parameters.thumbnail = $modal.find('.filebox img').attr('src');

                    return parameters;
                },
                callback: function(res) {

                    closeVModal(function(){

                        generalSuccess();
                        Page.redirect(self.url(res.Data.id), 2000);
                    });
                }
            };

            opts = $.extend(defaults, opts);

            if (opts.item?.id) {

                opts.title = `Edit ${opts.item.name}`;   
            }

            //opts = $.extend(defaults, opts);

            if (opts.item?.id) 
                return Modal.edit({ ...opts,  title: __('Edit') +': '+ opts.item.name });
            return Modal.create(opts);

            
        },
        search() {

            return new Model(this.itemType);
        },
    },
};