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

class POSController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {

        //authorize first
        //$this->authorize('menu', Pos::class);

        //get pos from devpos
        $items = DevPos::pos()->get();
        
        return view('devpos::pos', [

            'title' => __('Pos'),
            'breadcrumb' => [

                __('Pos') => route('pos.index')
            ],
            'menu' => 'devpos.pos',
            'items' => $items
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
        $this->authorize('create', Pos::class);

        //first we validate the request
        $validation = Validator::make($request->all(), Pos::rulesWith(

            array_extend([

                'code' => 'required',
                'city' => 'required',
                'address' => 'required',
                

            ], Pos::dbRules())
        ));

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }

        //first we store it to devpos
        // echo Cache::get('devpos.access_token');
        // return [];
        
        $parameters = array_filter($request->all());

        //add registrationDate
        $parameters['registrationDate'] = str_replace(' ', 'T', (new \DateTime())->format('Y-m-d H:i:s')); //date('d-m-Y'); //date('d-m-Y') //new DateTime();
        $item = DevPos::createPOS($parameters);

        //$item: {"id":42,"code":"POS 104","latitude":0,"longitude":0,"registrationDate":"0001-01-01T00:00:00","address":"Loni Ligori","city":"Tirane","businessUnitCode":"tr758ei942"}

        //now we store it
        $item2 = \App\Models\Pos::create($item);

        return response()->json([

            'Status' => 'OK',
            'Data' => $item,
            'Data2' => $item2
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
        
        //first lets get all categories 
        $categories = Category::with('productsSalable.thumbnail')->get(['id','name']);

        //first lets get all collections 
        //$categories = Collection::with('salable.thumbnail')->get(['id','name']);

        //first lets get all categories 
        $products = Product::salable()->with('thumbnail')->select(['id','name', 'rate', 'sale_rate', 'manage_stock' , 'stock_status', 'stock_quantity', 'sell_without_stock', 'thumbnail_id'])->limit(12)->orderBy('id', 'desc')->get();
       
        //get pos settings
        $settings = Setting::where('category', 'pos')->get()->pluck('value', 'name')->toArray();

        $view = 'admin.pos';
        if ($settings['pos_template'] == 'Show products')
            $view = 'admin.pos-products';

        print_r($categories);

        return view($view, [

            'title' => __('POS'),
            'breadcrumb' => [

                __('POS') => route('pos.index')
            ],
            'menu' => 'pos',
            'categories' => $categories,
            'products' => $products,
            'settings' => $settings,
        ]);
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
        
        //authorize
        $this->authorize('update', Pos::class);

        //validate
        $validation = Validator::make($request->all(), Pos::rulesWith(

            array_extend([

                'code' => 'required',
                'city' => 'required',
                'address' => 'required',

            ], Pos::dbRules())
        ));

        if ($validation->fails()) {

            return [

                'Status' => 'error',
                'Errors' => $validation->errors()
            ];
        }


        //update pos on devpos
        $item = DevPos::updatePOS($id, $request->all());

        //validate the request before we 
        $updated = Pos::findOrFail($id)->update($request->all());

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
        $this->authorize('delete', Pos::class);

        try {

            //delete pos on devpos
            $item = DevPos::deletePOS($id);
        }
        catch(\Illuminate\Http\Client\RequestException $error) {

            return [
                
                'Status' => 'error',
                'Msg' => $error->getMessage()
            ];
        }

        $deleted = Pos::destroy($id);

        return response()->json([

            'Status' => 'OK',
            'DevPos' => $item,
            'Data' => $deleted,
            'Msg' => $deleted == 0 ? 'Pos deleted successfully':'Pos didn\'t deleted successfully!'
        ]);
    }

    /**
     * Activate action
     */
    public function activate($id) {

        //authorize action
        $item = Pos::findOrFail($id);
        $this->authorize('activate', $item);

        //now activate it
        $res = $item->update(['disabled' => 0]);

        return response()->json([

            'Status' => 'OK',
            'Data' => $res
        ]);

    }

    public function deactivate($id) {

        //authorize action
        $item = Pos::findOrFail($id);
        $this->authorize('deactivate', $item);

        //now activate it
        $res = $item->update(['disabled' => 1]);

        return response()->json([

            'Status' => 'OK',
            'Data' => $res
        ]);
        
    }



    /**
     * Doctor attach and detach methods
     */

    public function attachDoctor(Request $request, $id) {

        $validation = Validator::make($request->all(), [

            'doctor_id' => 'required|exists:users,id',
            'rate' => 'required|numeric'
        ]);

        if($validation->fails()) {

            return response()->json([

                'Status' => 'error',
                'Errors' => $validation->errors()
            ]);
        }

        //after validation we save it
        Pos::find($id)->doctors()->attach($request->input('doctor_id'), $request->except('doctor_id'));
        
        return response()->json([

            'Status' => 'OK'
        ]);
    }

    public function detachDoctor($id, $doctor_id) {

        // $validated = request()->validate([
            
        // ]);

        Pos::find($id)->doctors()->detach($doctor_id);
        
        return response()->json([

            'Status' => 'OK'
        ]);
    }

    /**
     * Tax attach and detach methods
     */

    public function attachTax(Request $request, $id) {

        //authorize first
        $this->authorize('attachTaxTemplate', Pos::class);

        $validation = Validator::make($request->all(), [

            'tax_template_id' => 'required|exists:tax_templates,id',
            'valid_from' => 'nullable|date'
        ]);

        if ($validation->fails()) {

            return response()->json([

                'Status' => 'error',
                'Errors' => $validation->errors()
            ]);
        }

        //after validation we save it
        Pos::find($id)->taxes()->attach($request->input('tax_template_id'), array_merge($request->only('valid_from'), [

            'application_id' => Auth::user()->application_id,
            'created_by' => Auth::id(),
            'created_at' => date('Y-m-d H:i:s'),
            
        ]));
        
        return response()->json([

            'Status' => 'OK'
        ]);
    }

    public function detachTax($id, $tax_id) {

        //authorize first
        $this->authorize('detachTaxTemplate', Pos::class);

        Pos::find($id)->taxes()->detach($tax_id);
        
        return response()->json([

            'Status' => 'OK'
        ]);
    }


    /**
     * 
     * Note actions
     */

    public function createNote(Request $request, $id) {

        //athorize
        $this->authorize('createNote', Pos::class);

        $item = Pos::findOrFail($id)->notes()->create($request->input());

        return response()->json([

            'Status' => 'OK',
            'Data' => $item
        ]);
    }

    public function deleteNote(Request $request, $employee_id, $note_id) {

        //athorize
        $this->authorize('deleteNote', Pos::class);

        $item = Pos::findOrFail($employee_id)->notes()->whereId($note_id)->delete();

        return response()->json([

            'Status' => 'OK',
            'Data' => $item
        ]);
    }
}
