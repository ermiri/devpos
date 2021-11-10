Welcome to the devpos wiki!
This is a full package which it can be integrated at any laravel(version >= 6) project.
It come with a facade `DevPos`, models, controllers, views and resources.

First we will cover the facade `DevPos` which is the heart of this package.
Facade make this package acts as a proxy between you and devpos system.
You are free to use it without controllers or views, or if you just need to run some simple operations againsts devpos system.


## AccompanyingInvoice
Methods available are:

    - list() //to get all invoices
    - create() //to create one
    - show($id) //to get only one

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all accompanying invoices
    DevPos::accompanyingInvoice()->list(); //where ::accompanyingInvoice() serve as a factory method which will produce and return an AccompanyingInvoice object

    //to show/get one
    DevPos::accompanyingInvoice()->show($id)

    //update and delete actions are not available

## Account

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all account
    DevPos::account()->list(); 

    //create
    DevPos::account()->create($parameters)

    //show/get one
    DevPos::account()->show($id)

    //update
    DevPos::account()->update($id, parameters)

    //delete
    DevPos::account()->destroy($id)


## Branch

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all branch
    DevPos::branch()->list(); 

    //create
    DevPos::branch()->create($parameters)

    //show/get one
    DevPos::branch()->show($id)

    //update
    DevPos::branch()->update($id, parameters)

    //delete
    DevPos::branch()->destroy($id)

## Carrier

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all carrier
    DevPos::carrier()->list(); 

    //create
    DevPos::carrier()->create($parameters)

    //show/get one
    DevPos::carrier()->show($id)

    //update
    DevPos::carrier()->update($id, parameters)

    //delete
    DevPos::carrier()->destroy($id)

## ClientCard

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Client Card
    DevPos::clientCard()->list(); 

    //create
    DevPos::clientCard()->create($parameters)

    //show/get one
    DevPos::clientCard()->show($id)

    //update
    DevPos::clientCard()->update($id, parameters)

    //delete
    DevPos::clientCard()->destroy($id)

## Currency

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Currency
    DevPos::currency()->list(); 

    //create
    DevPos::currency()->create($parameters)

    //show/get one
    DevPos::currency()->show($id)

    //update
    DevPos::currency()->update($id, parameters)

    //delete
    DevPos::currency()->destroy($id)

## Customer

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Customer
    DevPos::customer()->list(); 

    //create
    DevPos::customer()->create($parameters)

    //show/get one
    DevPos::customer()->show($id)

    //update
    DevPos::customer()->update($id, parameters)

    //delete
    DevPos::customer()->destroy($id)


## EInvoice

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all EInvoice
    DevPos::einvoice()->list(); 

    //create
    DevPos::einvoice()->create($parameters)

    //show/get one
    DevPos::einvoice()->show($id)

    //update
    DevPos::einvoice()->update($id, $parameters)

    //delete
    DevPos::einvoice()->destroy($id)


## Invoice
You can run different action againsts `Invoice` model/object like: 

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all invoices
    DevPos::invoice()->list(); //where ::invoice() serve as a factory method which will produce and return an Invoice object

    //show an invoice
    DevPos::invoice()->show($id)

    //to cancel invoice
    DevPos::invoice()->cancel($iic) //where $iic is the iic of invoice

    //to resendeinvoice an invoice
    DevPos::invoice()->resendeinvoice($iic) //where $iic is the iic of invoice

    //to list unfiscalized invoices
    DevPos::invoice()->unfiscalized()

    //to correct an invoice
    DevPos::invoice()->correct($parameters) //where $parameters are new parameters

    //to export an invoice
    DevPos::invoice()->export($params = []) //where $params is the filter array

    //to export unfiscalized invoices
    DevPos::invoice()->exportUnfiscalized()


## POS

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all POS
    DevPos::pos()->list(); 

    //create
    DevPos::pos()->create($parameters)

    //show/get one
    DevPos::pos()->show($id)

    //update
    DevPos::pos()->update($id, $parameters)

    //delete
    DevPos::pos()->destroy($id)

## Product

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Product
    DevPos::product()->list(); 

    //create
    DevPos::product()->create($parameters)

    //show/get one
    DevPos::product()->show($id)

    //update
    DevPos::product()->update($id, $parameters)

    //delete
    DevPos::product()->destroy($id)

## ProductCategory

Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all ProductCategory
    DevPos::productCategory()->list(); 

    //create
    DevPos::productCategory()->create($parameters)

    //show/get one
    DevPos::productCategory()->show($id)

    //update
    DevPos::productCategory()->update($id, $parameters)

    //delete
    DevPos::productCategory()->destroy($id)

## ProductGroup
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all ProductGroup
    DevPos::productGroup()->list(); 

    //create
    DevPos::productGroup()->create($parameters)

    //show/get one
    DevPos::productGroup()->show($id)

    //update
    DevPos::productGroup()->update($id, $parameters)

    //delete
    DevPos::productGroup()->destroy($id)

## Role
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Role
    DevPos::role()->list(); 

    //create
    DevPos::role()->create($parameters)

    //show/get one
    DevPos::role()->show($id)

    //update
    DevPos::role()->update($id, $parameters)

    //delete
    DevPos::role()->destroy($id)

## Supplier
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Supplier
    DevPos::supplier()->list(); 

    //create
    DevPos::supplier()->create($parameters)

    //show/get one
    DevPos::supplier()->show($id)

    //update
    DevPos::supplier()->update($id, $parameters)

    //delete
    DevPos::supplier()->destroy($id)

## SupplierList
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Supplier
    DevPos::supplierList()->list(); 

    //create
    DevPos::supplierList()->create($parameters)

    //show/get one
    DevPos::supplierList()->show($id)

    //update
    DevPos::supplierList()->update($id, $parameters)

    //delete
    DevPos::supplierList()->destroy($id)

## TaxPayer
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //update
    DevPos::taxpayer()->update($id, $parameters)

   //list, create, destroy are not allowed against this model

## TCR

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Supplier
    DevPos::tcr()->list(); 

    //create
    DevPos::tcr()->create($parameters)

    //show/get one
    DevPos::tcr()->show($id)

    //update
    DevPos::tcr()->update($id, $parameters)

    //delete
    DevPos::tcr()->destroy($id)

    //fiscalizeTCR
    DevPos::tcr()->fiscalizeTCR($id)

    //listActiveTCR
    DevPos::tcr()->listActiveTCR()

    //updateTCRBalance
    DevPos::tcr()->updateTCRBalance($parameters)

    //isBalanceDeclared
    DevPos::tcr()->isBalanceDeclared($tcrCode)

    //tcrReport
    DevPos::tcr()->tcrReport($tcrCode)

    //unfiscalizedBalances
    DevPos::tcr()->unfiscalizedBalances($tcrCode)

## TCRBalance
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Supplier
    DevPos::tcrBalance()->list(); 

    //create
    DevPos::tcrBalance()->create($parameters)

    //show/get one
    DevPos::tcrBalance()->show($id)

    //update
    DevPos::tcrBalance()->update($id, $parameters)

    //delete
    DevPos::tcrBalance()->destroy($id)

    //list all unfiscalized balances
    DevPos::tcrBalance()->unfiscalized($id)

    //fiscalize a balance
    DevPos::tcrBalance()->fiscalize($id)

## Transporter
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all transporters
    DevPos::transporter()->list(); 

    //create
    DevPos::transporter()->create($parameters)

    //show/get one
    DevPos::transporter()->show($id)

    //update
    DevPos::transporter()->update($id, $parameters)

    //delete
    DevPos::transporter()->destroy($id)

## Unit
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all units
    DevPos::unit()->list(); 

    //create
    DevPos::unit()->create($parameters)

    //show/get one
    DevPos::unit()->show($id)

    //update
    DevPos::unit()->update($id, $parameters)

    //delete
    DevPos::unit()->destroy($id)

## User
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Users
    DevPos::user()->list(); 

    //create
    DevPos::user()->create($parameters)

    //show/get one
    DevPos::user()->show($id)

    //update
    DevPos::user()->update($id, $parameters)

    //delete
    DevPos::user()->destroy($id)

    //get my user profile
    DevPos::user()->me()

## Vehicle
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Vehicles
    DevPos::vehicle()->list(); 

    //create
    DevPos::vehicle()->create($parameters)

    //show/get one
    DevPos::vehicle()->show($id)

    //update
    DevPos::vehicle()->update($id, $parameters)

    //delete
    DevPos::vehicle()->destroy($id)

## WareHouse
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all Vehicles
    DevPos::warehouse()->list(); 

    //create
    DevPos::warehouse()->create($parameters)

    //show/get one
    DevPos::warehouse()->show($id)

    //update
    DevPos::warehouse()->update($id, $parameters)

    //delete
    DevPos::warehouse()->destroy($id)


## Enum
This class/object/model is used to get system constants like `warehouse types`, `payment method types`, `cities` etc.
Using the facade you can the above commands as:

    //namespace
    use ErmirShehaj\DevPos\Facades\DevPos;

    //to list all warehouse types
    DevPos::enum()->getWareHouseType();

    //getPaymentMethodTypes
    DevPos::enum()->getPaymentMethodTypes()

    //getPaymentMethodTypesEinvoice
    DevPos::enum()->getPaymentMethodTypesEinvoice()

    //getPaymentMethodTypesEinvoice
    DevPos::enum()->getFeeTypes()

    //banks
    DevPos::enum()->getBanks()

    //center types
    DevPos::enum()->getCenterType()

    //getCurrencies
    DevPos::enum()->getCurrencies()

    //getCities
    DevPos::enum()->getCities()

    //getCountries
    DevPos::enum()->getCountries()

    //getClientCardTypes
    DevPos::enum()->getClientCardTypes()

    //getTypesOfSelfIssuing
    DevPos::enum()->getTypesOfSelfIssuing()

    //getIdTypes
    DevPos::enum()->getIdTypes()

    //getUnits
    DevPos::enum()->getUnits()
    
    //getEInvoiceStatuses
    DevPos::enum()->getEInvoiceStatuses()
    
    //getEInvoiceProcesses
    DevPos::enum()->getEInvoiceProcesses()
    
    //getEInvoiceDocumentTypes
    DevPos::enum()->getEInvoiceDocumentTypes()
    
    //getSubsequentDeliveryType
    DevPos::enum()->getSubsequentDeliveryType()
    
    //getVehicleOwnershipTypes
    DevPos::enum()->getVehicleOwnershipTypes()

    //getInvoiceTypes
    DevPos::enum()->getInvoiceTypes()

    //getTransactionTypes
    DevPos::enum()->getTransactionTypes()

    //getWtnTypes
    DevPos::enum()->getWtnTypes()

    //getStartPoints
    DevPos::enum()->getStartPoints()

    //getDestinationPoints
    DevPos::enum()->getDestinationPoints()

