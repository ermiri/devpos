# DevPos
This is a package to help you connect with Devpos services such as invoicing,stock management, reports and the main goal to fiscalize invoices against state taxes rules.

Later we will put here all neccessary documentation for using this package. 

This package contain a facade named `DevPos` which you can use to perform different actions on any model the system has.
Anyway we have included a full project containing routes, views, controllers and anything needed to run the package on your custom laravel project.
It will not work 100% bc the views are builded on my custom laravel project, therefore you have to do some editions on blade files.

Please check the documentation for additional informations [https://github.com/ermiri/devpos/wiki]()

## Installation

    composer require ermirshehaj/devpos

It will install the package and you are ready to use it:

    use ErmirShehaj\DevPos\Facades\DevPos;

    //list all tcr
    DevPos::tcr()->list();

## Configuration
It come with a configuration file named `devpos.php`.
There you can edit authentication parameters, cache settings and much more:

    'endPointBase' => 'https://devpos.al',
    'tokenEndPoint' => 'https://devpos.al/token',

    //devpos login credentials
    'tenant' => '0000000001',
    'authorization' => 'Basic Zml5j3jsljfs893BhOg==',
    'username' => 'admini',
    'password' => 'demo@devpos',
    'grant_type' => 'password',

## Authentication
First you have to authenticate yourself into the devpos system which in return will give you an access token needed to run each request againsts their api.

    use ErmirShehaj\DevPos\Facades\DevPos;

    //to authorize using information on `devpos.php` just run:
    DevPos::authorize();

    //if you need to set manually some parameters:
    DevPos::setTenant($tenant) //if you want another tenant than one set on devpos.php config file
            ->setAuthorization($authorization) //if you want a custom
            ->setAuthorization($authorization)//if you want a custom
            ->setUsername($username)//if you want a custom
            ->setPassword($password)//if you want a custom
            ->setGrantType($grant)//if you want a custom
                ->authorize();


The method `authorize()` just run a request and if everything is ok it will save the access_token on session under the key `devpos.access_token`
            

## Models
All models are inside `devpos/src/Classes` folder. They act as model but are not the same as laravel model.They have standart methods like:

    - list //get models
    - create //create model
    - update //update model
    - destroy //delete model

Check the wiki page for more details

## Routes
You can see/edit routes located at `devpos/route/web.php`.

## Controllers
For each model, we have created a controller.

## Cache
We tend to cache every get request(list action on models), except invoices.
By default, specified on `devpos.php` config file, it will expire after 1800 seconds.

    use ErmirShehaj\DevPos\Facades\DevPos;

    //to cache a request
    DevPos::tcr()->cache()->list() //same as DevPos::tcr()->setCache(true)->list()

    //to prevent caching
    DevPos::tcr()->setCache(false)->list()

    //to bypass caching data bc as default it will read cache first if it exists.
    DevPos::tcr()->byPassCache()->list()

    //set prefix. To avoid global pollution of cache, we use prefix, default: devpos.
    DevPos::tcr()->setCachePrefix('devpos')->list();

    //set cache key. It will be saved on cache as: prefix + '.' + key
    DevPos::tcr()->setCacheKey('tcrs')->list();

    //to get the full cache key: prefix + '.'+ key
    $obj->getCacheKeyWithPrefix();

    //set timeout
    DevPos::tcr()->setCacheTimeout(500)->list();
