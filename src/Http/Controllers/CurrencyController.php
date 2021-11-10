<?php

namespace ErmirShehaj\DevPos\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use ErmirShehaj\DevPos\Facades\DevPos;

use App\Http\Requests\PosRequest;
use \App\Models\Pos;
use DateTime;

class CurrencyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {

        //authorize first
        //$this->authorize('menu', Pos::class);

        //get warehouse from devpos
        $items = DevPos::currency()->cache()->get();

        // //get supplierList from devpos
        // $warehouseTypes = DevPos::enum()->getCurrencyType();

        //get supplierList from devpos
        $currencies = DevPos::currency()->get();

        
        return view('devpos::currencies', [

            'title' => __('Currencies'),
            'breadcrumb' => [

                __('Currencies') => route('devpos.currencies.index')
            ],
            'menu' => 'devpos.currencies',
            'items' => $items,
            'currencies' => $currencies,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {

        //authorize first
        //$this->authorize('create', Pos::class);

        try {
            
            $item = DevPos::currency()->create($request->all());
        }
        catch(\Illuminate\Validation\ValidationException $error) {

            return [

                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $request->all(),
            ];
        }
        catch(\Illuminate\Http\Client\RequestException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $parameters
            ];
        }
        catch(\Symfony\Component\HttpKernel\Exception\HttpException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $parameters
            ];
        }
        catch(\Illuminate\Auth\AuthenticationException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Authentication' => 'Unauthorized 401',
                'Data' => $parameters
            ];
        }
        catch(\Exception $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage(),
                'Data' => $parameters
            ];
        }

        return response()->json([

            'Status' => 'OK',
            'Data' => $item,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {

        try {

            //update supplier on devpos
            $item = DevPos::currency()->update($id, $request->all());
        }
        catch(\Illuminate\Http\Client\RequestException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage()
            ];
        }
        

        return response()->json([

            'Status' => 'OK',
            'DevPos' => ['updated' => $item],
            'Data' => ['updated' => $updated]
        ]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //authorize action
        //$this->authorize('delete', Pos::class);

        try {

            //delete supplier on devpos
            $item = DevPos::currency()->destroy($id);
        }
        catch(\Illuminate\Http\Client\RequestException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage()
            ];
        }


        return response()->json([

            'Status' => 'OK',
            'DevPos' => $item,
            'Data' => $deleted,
            'Msg' => $deleted == 0 ? 'Currency deleted successfully':'Currency didn\'t deleted successfully!'
        ]);
    }



}
