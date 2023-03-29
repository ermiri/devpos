<?php

    if (!class_exists('Html')) {

        class Html {

            protected function defaults() {
    
                return [
    
                    'html' => '',
                    'id' => Math.floor((Math.random() * 100000) + 1),
                    'attributes' => [],
                    'data' => [], 
                    'shown' => function($elm) { //when this element is shown/added on browser, not being visible or not
    
    
                    }
                ];
            }
    
            public static function formElement($opts = []) {
    
                if(!empty($opts['checkbox']))
                    return static::formCheckbox($opts);
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => 'col-md-6',
                    'label' => 'Title',
                    'toolbar' => [],
                    //'input' => [],
                    'hint' => 'Please '. (!empty($opts['input']) ? 'enter':'choose') .' '. strtolower( !empty($opts['label']) ? $opts['label']:'Title'),
                    'shown' => '',
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
    
                //add toolbar
                $toolbar = '';
                if (!empty($opts['toolbar'])) 
                    $toolbar = '<div class="pull-right">'. static::toolbar($opts['toolbar']) .'</div>';
                
    
                //build html
                return 
                '<div class="'. $opts['class'] .'" id="'. $opts['id'] .'">
                    '. ($opts['label'] == false ? '':'<label>'. __($opts['label']) .'</label>') .'
                    '. $toolbar .'
                    '. static::getElement($opts) .'
                    <span class="form-text text-muted">'. $opts['hint'] .'</span>
                </div>'. static::shown($opts['id'], $opts['shown']);
                
            }
    
            public static function formCheckbox($opts = []) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => 'col-md-6',
                    'label' => 'Title',
                    'hint' => 'You can check '. strtolower( !empty($opts['label']) ? $opts['label']:'Title'),
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
    
                //add toolbar
                $toolbar = '';
                if (!empty($opts['toolbar'])) 
                    $toolbar = '<div class="pull-right">'. static::toolbar($opts['toolbar']) .'</div>';
                
    
                //build html
                return 
                '<div class="'. $opts['class'] .'" id="'. $opts['id'] .'">
                    <label class="k-checkbox k-checkbox--solid">'
                        
                        . static::checkbox($opts['checkbox'])
                        . $opts['label'] 
                        . '<span></span>'
    
                    .'</label>
                    <span class="form-text text-muted">'. $opts['hint'] .'</span>
                </div>'. static::shown($opts['id'], $opts['shown']);
                
            }
    
            public static function getElement($opts = []) {
                
                if(!empty($opts['input']))
                    return static::input($opts['input']);
                if(!empty($opts['select']))
                    return static::select($opts['select']);
                if(!empty($opts['textarea']))
                    return static::textarea($opts['textarea']);
                if(!empty($opts['summernote']))
                    return static::summernote($opts['summernote']);
                if(!empty($opts['element']))
                    return static::element($opts['element']);
                if(!empty($opts['combobox']))
                    return static::combobox($opts['combobox']);
                if(!empty($opts['color-picker']))
                    return static::color_picker($opts['color-picker']);
                if(!empty($opts['file']))
                    return static::file($opts['file']);
                if(!empty($opts['section']))
                    return static::section($opts['section']);
                if(!empty($opts['image']))
                    return static::image($opts['image']);
                if(!empty($opts['gallery']))
                    return static::gallery($opts['gallery']);
                if(!empty($opts['date']))
                    return static::date($opts['date']);
                
            }
    
            public static function a($opts) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'icon' => '',
                    'class' => 'form-control',
                    'title' => 'Title', // name of the link
                    'value' => '', // name of the link
                    'attributes' => [],
                    'onClick' => '',
                    'shown' => '',
                ];
        
                $opts = array_extend($defaults, $opts);
    
                //print_r($opts);
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //build html
                $html = 
                '<a 
                    id="'. $opts['id'] .'" 
                    class="'. $opts['class'] .'" 
                    '. $attributes .'
                    onClick="'. $opts['onclick'] .'"
                />'. 
                    ($opts['icon'] ? '<i class="'. $opts['icon'] .'"></i>':'') 
                    . $opts['title'] 
                .'</a>';
                
                return $html;
            }
    
            public static function input($opts) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => 'form-control',
                    'type' => 'text', 
                    'name' => 'Title', // name of the textarea or input
                    'value' => '', 
                    'disabled' => false,
                    'autocomplete' => 'on',
                    'attributes' => [],
                    'placeholder' => 'Enter '. strtolower( !empty($opts['name']) ? str_replace('_', ' ', $opts['name']):'Title'),
                    'onClick' => '',
                    'onInput' => '',
                    'onChange' => '',
                    'shown' => '',
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
                //print_r($opts);
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //build html
                $html = 
                '<input 
                    type="'. $opts['type'] .'" 
                    id="'. $opts['id'] .'" 
                    class="'. $opts['class'] .'" 
                    name="'. $opts['name'] .'"
                    value="'. htmlspecialchars($opts['value']) .'"
                    '. $attributes .'
                    placeholder="'. $opts['placeholder'] .'"
                    onClick="'. $opts['onClick'] .'" 
                    onInput="'. $opts['onInput'] .'"
                    onChange="'. $opts['onChange'] .'"
                />'. static::shown($opts['id'], $opts['shown']);
                
                return $html;
            }

            public static function date($opts) {
    
                
                $opts['shown'] = "function(elm){
    
                    $(elm).datepicker({format: 'yyyy-mm-dd'});
                }";
    
                return static::input($opts);
            }
    
            public static function combobox($opts = []) {
    
                $html = '
                <div class="input-group">
                    '. static::input($opts) .'
                    <div class="input-group-append">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> </button>
                        <div class="dropdown-menu dropdown-menu-right" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(647px, 38px, 0px);">
                            
                            '. implode('', array_map(function ($option) {
    
                                return '<a class="dropdown-item" href="javascript:void(0)" onclick="$(this).closest(\'.input-group\').find(\'input\').val(\''. ($option['name'] ?: $option) .'\').change()">'. ($option['name'] ?: $option) .'</a>';
                            }, $opts['options'])) .'
    
                        </div>
                    </div>
                </div>';
                
                return $html;
            }
    
            public static function textarea($opts) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => 'form-control',
                    'name' => 'Title', // name of the textarea or input
                    'value' => '', // name of the textarea or input
                    'disabled' => false,
                    'autocomplete' => 'on',
                    'attributes' => [],
                    'placeholder' => 'Enter '. strtolower( !empty($opts['name']) ? $opts['name']:'Title'),
                    'onClick' => '',
                    'onInput' => '',
                    'shown' => '',
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
                //print_r($opts);
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //build html
                $html = 
                '<textarea 
                    type="text" 
                    id="'. $opts['id'] .'" 
                    class="'. $opts['class'] .'" 
                    name="'. $opts['name'] .'"
                    '. $attributes .'
                    placeholder="'. __($opts['placeholder']) .'"
                    onClick="'. $opts['onClick'] .'"
                    onInput="'. $opts['onInput'] .'"
                />'. $opts['value'] .'</textarea>'. static::shown($opts['id'], $opts['shown']);
                
                return $html;
            }
    
            public static function summernote($opts) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => 'form-control',
                    'name' => 'Title', // name of the textarea or input
                    'value' => '', // name of the textarea or input
                    'disabled' => false,
                    'autocomplete' => 'on',
                    'attributes' => [],
                    'placeholder' => 'Enter '. strtolower( !empty($opts['name']) ? $opts['name']:'Title'),
                    'onClick' => '',
                    'onInput' => '',
                    'shown' => 'function(elm){ $(elm).summernote({height: 300}); }',
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
                //print_r($opts);
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //build html
                $html = 
                '<textarea 
                    type="text" 
                    id="'. $opts['id'] .'" 
                    class="'. $opts['class'] .'" 
                    name="'. $opts['name'] .'"
                    '. $attributes .'
                    placeholder="'. __($opts['placeholder']) .'"
                    onClick="'. $opts['onClick'] .'"
                    onInput="'. $opts['onInput'] .'"
                />'. $opts['value'] .'</textarea>'. static::shown($opts['id'], $opts['shown']);
                
                return $html;
            }
    
            public static function select($opts) {
    
                //print_r($opts);
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => 'form-control',
                    'name' => 'Title', // name of the textarea or input
                    'value' => '', // name of the textarea or input
                    'options' => [],
                    'disabled' => false,
                    'attributes' => [],
                    'onClick' => '',
                    'onChange' => ''
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
    
                //print_r($opts);
    
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //convert options to string
                //convert options to string
                if (is_string($opts['options'])) {

                    $options = $opts['options'];
                }
                else {

                    foreach($opts['options'] as $key => $val) {

                        if (is_string($val)) {

                            if(is_assoc($opts['options'])) { // when options: ['anije' => 4, makina => 32, 'motorr' => 242]

                                $options .= '<option value="'. $key .'" '. get_selected_option($key, $opts['value']) .'>'.  $val .'</option>';
                            }
                            else { //when options: ['anije', 'makine', 'motorr']

                                $options .= '<option value="'. $val .'" '. get_selected_option($val, $opts['value']) .'>'.  $val .'</option>';
                            }
                        }
                        elseif (is_object($val)) { //when options: [['ID' => '5', 'Name' => 'ermir'], ['ID' => '6', 'Name' => 'endri'], ] or when nested arrays are objects

                            
                            $options .= '<option value="'. $val->id .'" '. get_selected_option($val->id, $opts['value']) .'>'.  $val->name .'</option>';
                        }
                        else { //when options: [['ID' => '5', 'Name' => 'ermir'], ['ID' => '6', 'Name' => 'endri'], ] or when nested arrays are objects

                            // if (is_object($val)) 
                            // 	$val = (array)$val;

                            $options .= '<option value="'. $val['id'] .'" '. get_selected_option($val['id'], $opts['value']) .'>'.  $val['name'] .'</option>';
                        }
                        
                    }
                }
    
                //build html
                return 
                '<select 
                    id="'. $opts['id'] .'" 
                    class="'. $opts['class'] .'" 
                    name="'. $opts['name'] .'"
                    '. $attributes .'
                    onClick="'. $opts['onClick'] .'"
                    onChange="'. $opts['onChange'] .'"
                />'. $options .'</select>'. static::shown($opts['id'], $opts['shown']);
                
            }
    
            public static function tree($opts) {
    
                //print_r($opts);
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => 'form-control',
                    'name' => 'Title', // name of the textarea or input
                    'value' => '', // name of the textarea or input
                    'options' => [],
                    'disabled' => false,
                    'attributes' => [],
                    'onClick' => '',
                    'onChange' => ''
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
    
                //print_r($opts);
    
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //convert array to tree
                $tree = buildTree($opts['options'], 'parent_id', 'id');
    
    
                //convert options to string
    
                foreach($opts['options'] as $key => $val) {
    
                    if (is_string($val)) {
    
                        if(is_assoc($opts['options'])) { // when options: ['anije' => 4, makina => 32, 'motorr' => 242]
    
                            $options .= '<option value="'. $key .'" '. get_selected_option($key, $opts['value']) .'>'.  $val .'</option>';
                        }
                        else { //when options: ['anije', 'makine', 'motorr']
    
                            $options .= '<option value="'. $val .'" '. get_selected_option($val, $opts['value']) .'>'.  $val .'</option>';
                        }
                    }
                    elseif (is_object($val)) { //when options: [['ID' => '5', 'Name' => 'ermir'], ['ID' => '6', 'Name' => 'endri'], ] or when nested arrays are objects
    
                        
                        $options .= '<option value="'. $val->id .'" '. get_selected_option($val->id, $opts['value']) .'>'.  $val->name .'</option>';
                    }
                    else { //when options: [['ID' => '5', 'Name' => 'ermir'], ['ID' => '6', 'Name' => 'endri'], ] or when nested arrays are objects
    
                        // if (is_object($val)) 
                        // 	$val = (array)$val;
    
                        $options .= '<option value="'. $val['id'] .'" '. get_selected_option($val['id'], $opts['value']) .'>'.  $val['name'] .'</option>';
                    }
                    
                }
    
                //build html
                return 
                '<select 
                    id="'. $opts['id'] .'" 
                    class="'. $opts['class'] .'" 
                    name="'. $opts['name'] .'"
                    '. $attributes .'
                    onClick="'. $opts['onClick'] .'"
                    onChange="'. $opts['onChange'] .'"
                />'. $options .'</select>'. static::shown($opts['id'], $opts['shown']);
                
            }
            
            public static function checkbox($opts = []) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => '',
                    'name' => 'Title', // name of the textarea or input
                    'value' => $opts['value'] > 0 ? $opts['value']:'1', // name of the textarea or input
                    'checked' => $opts['value'] == '0' || empty($opts['value']) ? false:true,
                    'disabled' => false,
                    'attributes' => [],
                    'onClick' => '',
                    'onChange' => ''
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
                //print_r($opts);
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //build html
                $html = 
                '<input 
                    type="checkbox" 
                    id="'. $opts['id'] .'" 
                    class="'. $opts['class'] .'" 
                    name="'. $opts['name'] .'"
                    value="'. $opts['value'] .'"
                    '. ($opts['checked'] == true ? ' checked':'') .'
                    '. $attributes .'
                    onClick="'. $opts['onClick'] .'"
                    onChange="'. $opts['onChange'] .'"
                />';
                
                return $html;
            }
    
            public static function color_picker($opts = []) {
    
                $opts['type'] = 'color';
    
                return static::input($opts);
            }
    
            public static function gallery($opts = []) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => '',
                    'name' => 'gallery', // name of the textarea or input
                    'value' => $opts['value'] > 0 ? $opts['value']:'1', // name of the textarea or input
                    'attributes' => [],
                    'limit' => '',
                    'onClick' => '',
                    'onChange' => ''
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
                //print_r($opts);
    
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //build html
                $html = '
                <div class="col-12" data-gallery="true" data-name="'. $opts['name'] .'">
                    <div class="images_list row">';
                if ($opts['limit'] > 0) {
    
                    for($i = 0; $i < $opts['limit']; $i++) {
    
                        $html .= '<div class="filebox d-table m-2" id="filebox_'. rand(1, 100000) .'"  name="'. $opts['name'] .'[]" data-url="'. $opts['value'][$i] .'"></div>';
                    }
                }
                else {
    
                    $html .= '<button type="button" class="btn btn-primary btn-sm w-100" onClick="Website.Medium.manager.load()"><i class="fa fa-upload"></i></button>';
                }
    
                $html .= "
                    </div>
                </div>";
    
                //add plus button if limit >
                
                return $html;
    
            }
    
            public static function image($opts = []) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'class' => '',
                    'name' => 'gallery', // name of the textarea or input
                    'value' => $opts['value'] > 0 ? $opts['value']:'1', // name of the textarea or input
                    'attributes' => [],
                    'limit' => '1',
                    'onClick' => '',
                    'onChange' => ''
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
                //print_r($opts);
    
                //convert attributes to string
                foreach($opts['attributes'] as $key => $val) {
    
                    $attributes .= $key .'="'.  $val .'"';
                }
    
                //build html
                $html = '
                <div class="col-12">
        
                    <div class="filebox d-table" id="filebox_'. rand(1, 100000) .'" name="'. $opts['name'] .'" data-url="'. $opts['value'] .'"></div>
                    
                </div>';
    
                //add plus button if limit >
                
                return $html;
    
            }
    
            public static function element($opts = []) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'html' => '',
                    'onClick' => '',
                    'shown' => '',
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
    
                //build html
                
                return $html . static::shown($opts['id'], $opts['shown']);
            }
    
            public static function section($opts = []) {
    
                $defaults = [
                    
                    'id' => rand(1, 100000),
                    'label' => '',
                    'class' => '',
                ];
        
                $opts = array_replace_recursive($defaults, $opts);
    
                return '
                <div class="'. $opts['class'] .'">
                    <div class="k-heading k-heading--space-sm">
                        '. $opts['label'] .'
                    </div>
                </div>
                <div class="k-separator k-separator--space-sm k-separator--border-solid w-100"></div>';
    
                //build html
                return $opts['html'] = '<h4 class="'. $opts['class'] .'">'. $opts['label'] .'</h4>';
                
                return static::element($opts);
            }
    
            protected static function toolbar($opts = []) {
    
                /**
                 * toolbar is a function that will create toolbar on this form element
                 * $param @opts will be a multi array: [['title' => 'Add', 'class': '', 'icon' => 'fa fa-plus' 'onClick' => 'function(){}'], ['title' => 'Delete', 'icon' => 'fa fa-trash' 'onClick' => 'function(){}']]
                 */
    
                $html = '';
                foreach($opts as $row) {
    
                    $html .= '<a href="javascript:void(0);" class="'. $row['class'] .'" onClick="('. str_replace('"', '&quot;', $row['onClick']) .')()">'. (!empty($row['icon']) ? '<i class="'. $row['icon'] .'"></i>':'') .''. $row['title'] .'</a>';
                }
    
                return $html;
            }
            
            protected static function shown($id, $shown) {
    
                if(empty($shown))
                    return '';
    
                return 
                '<script>
                    var function'. $id .' =  '. $shown .'
                    docReady(function(){
                        
                        return function'. $id .'(document.getElementById('. $id .'));
                    });
                </script>';
            }
    
            //complex components
            public static function portlet($opts = []) {
    
                $defaults = [
    
                    'id' => rand(0, 10000),
                    'attributes' => [],
                    'title' => 'Portlet',
                    'toolbar' => [
    
                        //['title' => 'demo', 'icon' => 'fa fa-edit', 'class' => '', 'onclick' => ""]
                    ],
                    'fit' => false,
                    'body' => ''
                ];
    
                $opts = array_extend($defaults, $opts);
    
                $html = 
                '<!--begin::Portlet-->
                <div class="k-portlet k-portlet--collapse" id="'. $opts['id'] .'" >
                    <div class="k-portlet__head">
                        <div class="k-portlet__head-label">
                            <h3 class="k-portlet__head-title">
                                '. $opts['title'] .'
                            </h3>
                        </div>
                        <div class="k-portlet__head-toolbar">
                            <div class="k-portlet__head-group"> 
                                '. implode('', array_map(function($val, $key) {
    
                                    return 	Html::a($val);
                                    
                                }, $opts['toolbar'])) .'
    
                            </div>
                        </div>
                    </div>
                    <div class="k-portlet__body" style="display: none;">
    
                        <div class="k-portlet__content">'. $opts['body'] .'</div>
    
                    </div>
                </div>
                <!--end::Portlet--> ';
            }
    
            //this method is use from Theme to create element. E.g.: on theme-options page
            public static function generateElementFromJson($element, $value = null, $tab = null, $group = null) {
    
                
                if($element->type == 'section')
                    return static::section((array)$element);
    
                $config = [
                    
                    'class' => $element->class ?: 'form-group',
                    'label' => $element->label ?: ucfirst($element->name),
                    'hint' => __($element->hint ?: 'Enter '. $element->name)
                ];
    
                unset($element->class);
                unset($element->label);
    
                //set element
                $config[$element->type] = (array)$element;
    
                if ($element->type == 'input')
                    $config[$element->type]['type'] = 'text';
    
                //set value
                $config[$element->type]['value'] = $value;
    
                //fix name
                $config[$element->type]['name'] = !empty($tab) ? $tab ."[". $element->name ."]":$element->name;
                $config[$element->type]['name'] = !empty($group) ? $group ."[". $tab ."][". $element->name ."]":$config[$element->type]['name'];
                $config[$element->type]['placeholder'] = "Enter ". $element->name;
                $config['hint'] = "";
                
                return Html::formElement($config);
            }
        }
    }

    if (!function_exists('get_selected_option')) {

        function get_selected_option($a, $b, $default = 'All'){
		
            if(is_array($b) && !empty(array_filter($b))){
                
                if(in_array($a, array_values($b))){
                
                    return 'selected';
                }
                
            }
            elseif($a == $b){
                
                return 'selected';
            }
        }
    }

    if (!function_exists('get_checked_checkbox')) {
    
        function get_checked_checkbox($a, $b ,$default = 'All'){
            
            if(is_array($b) && !empty(array_filter($b))){
    
                if(in_array($a, $b)){
                
                    return 'checked="checked"';
                }
                else{
                
                    return;
                }
            }
            elseif($a == $b){
                
                return "checked='checked'";
            }
            elseif($a == $default){
                
                return "checked='checked'";
            }
            else{
            
                return;
            }
        }
    }

    if (!function_exists('get_checked_radio')) {
        
        function get_checked_radio($a, $b, $default = 'All') {
            
            if (is_array($b)) { 
            
                if (in_array($a, $b)) {
                
                    return "checked='checked'";
                }
                else {
                
                    return;
                }
            }
            elseif ($a == $b) {
                
                return "checked='checked'";
            }
            elseif($a == $default) {
                
                return "checked='checked'";
            }
            else {
            
                return;
            }
        }
    }
    

    if (!function_exists('array_extend')) {
        
        function array_extend() {

            $arrays = func_get_args();
            $base = array_shift($arrays);
            foreach ($arrays as $array) {
        
                reset($base);
                while (list($key, $value) = @each($array))
                    if (is_array($value) && @is_array($base[$key]))
                        $base[$key] = array_extend($base[$key], $value);
                    else $base[$key] = $value;
            }
        
            return $base;
        }
    }

    if (!function_exists('priceNum')) {
        
        function priceNum($number) {

            if (is_numeric($number))
                return number_format($number, 2, '.', ' ');
        } 
    }

    if (!function_exists('is_assoc')) {

        function is_assoc($arr) {
            
            //return count(array_filter(array_keys($arr), 'is_string')) > 0;
            return array_keys($arr) !== range(0, count($arr) - 1);
        }
    }
