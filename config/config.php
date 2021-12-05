<?php

return [

  'endPointBase' => 'https://demo.devpos.al',
  'endPoint' => 'https://demo.devpos.al/api/v3',
  'tokenEndPoint' => 'https://demo.devpos.al/connect/token',
  

  //devpos login credentials
  'tenant' => 'A00000000B',
  'authorization' => 'Basic Zmlza2FsaXppbWlfc3BhOg==',
  'username' => 'admin',
  'password' => 'Demo@1devpos',
  'grant_type' => 'password',


  //some defaults options
  'cache_everything' => 'false',

  /**
   * Cache settings
   * By default we will cache all get methods if we have not specified on concret class or method(noCache()) on runtime.
   * So we will store them under: cache_prefix + '.' + cache_key
   * Cache key by default will be the path we use to get the data, but hashed as md5: md5($path); 
   * 
   * If you want to store a model cache under specific key, you can define it by three ways:
   * 1- here as default behaviour
   * 2- on model class, under the constructor
   * 3- on runtime: customer()->setCacheKey('customers')->list()
   * 
   * If you use a custom key during runtime => you have to remember that key to fetch them from cache store.So please avoid this usage. 
   * So please stick to method 1 or 2 if you want a custom key.
   * 
   * Anyway we strongly suggest you to live the system do the work by itself.
   * 
   */
  
  'cache' => true,
  'cache_prefix' => 'devpos', //use prefix to prevent collision with other keys in the cache
  'cache_timeout' => '1800', //general cache timeout. Timeout specified on model will override this.
  'cache_models' => [

    'client-card' => [

      'key' => 'client-cards', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'customer' => [

      'key' => 'customers', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'pos' => [

      'key' => 'pos', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'product' => [

      'key' => 'products', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'product-category' => [

      'key' => 'product-categories', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'product-group' => [

      'key' => 'product-groups', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'role' => [

      'key' => 'roles', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'supplier' => [

      'key' => 'suppliers', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'supplier-list' => [

      'key' => 'supplier-lists', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'taxpayer' => [

      'key' => 'taxpayer', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'tcr' => [

      'key' => 'tcrs', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'tcr-balance' => [

      'key' => 'tcr-balances', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'transporter' => [

      'key' => 'transporters', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'unit' => [

      'key' => 'units', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'user' => [

      'key' => 'users', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    'warehouse' => [

      'key' => 'warehouses', //cache tcr list under 'tcrs' index(as plural form of tcr)
      'timeout' => '1800' //30 minutes
    ],
    
  ],




  /**
   * Routes prefix and middleware
   */

  'route_prefix' => 'devpos',
  'middleware' => ['web', 'auth'],
   
];