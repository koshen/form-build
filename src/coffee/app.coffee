(() ->

    ###
    # @name BaseModal基本数据模型类
    # @parma{ String } id file 的唯一标识
    # @parma{ String } code file 的编号
    # @parma{ boolean } require file是否必填
    ###

    class BaseModal

        data =
            responseFileds: ko.observableArray([
                id: ko.observable()
                label: ko.observable(null)
                require: ko.observable(false)
                errors: ko.observable()
                filed_type: ko.observable("text")
                filed_options: ko.observable()
            ])
            isLoading: ko.observable(true)
            mode: ko.observable("base")
            setmode: ko.observable()
        getData: ->
            return data
        setData: ( name, value ) ->
            @set( data, name, value )
        setMode: ->
        change: ( name, cb ) ->
            data[ name ].subscribe cb
        set: ( d, name, value ) ->
            _key = true
            for k, v of d
                if k is name
                    _key = false
                    break
    
            if _key
                d[ name ] = if @is value, "Array" then ko.observableArray( value ) else ko.observable( value )
            else
                d[ name ]( value )

        is: ( obj, type ) ->
            return ( type is "Null" and obj is null ) or ( type is "Undefined" and obj is undefined ) or ( type is "Number" and isFinite obj ) or Object.prototype.toString.call(obj).slice(8,-1) is type
  


    class Template
        textFile: ->
            return("""
                <div data-bind="style:{ width: filed_options.size === 'one_column'? '100%' : '50%' }">
                    <input type='text' data-bind='value: value'>
                </div>
            """)
        fileHead:() ->
            return("""
                <div class="crf-filed-header">
                    <span data-bind='visible: required'>*</span>
                    <span data-bind='text: id'></span>
                    <span>-</span>
                    <span data-bind='text: label'></span>
                </div>
            """)
        fileError: ->
            return("""
                <div data-errors>
                    
                </div>
            """)
        fileLoading: ->
            return("""
                <div class="crf-form-loading" >loading</div>
            """)
        formContainer: ->
            return("""
                <div class='crf-form-container' ></div>
            """)
        formContent: ->
            return("""
                <div class="crf-form-content" data-bind="foreach: responseFileds()">
                    <div data-bind="attr:{ id: id }" class="crf-filed-container">
                        #{@fileHead()}
                        <div data-bind="if: filed_type=='text'" >#{@textFile()}</div>
                        #{@fileError()}
                    </div>
                </div>
            """)
        chooseView: ( type ) ->
            switch( type )
                when "fileHead" then return @fileHead()
                when "error" then return @fileError()
                when "text" then return @textFile()
                when "loading" then return @fileLoading()
    
     class BaseResponseFiled extends BaseModal
        _index = 0
    
        constructor: ( index )->
            _index = index
        getValue: ->
            return _data.value
    class TextFiled extends BaseResponseFiled


    class FormBuilder extends BaseModal
        _model = {}
        constructor: ( options ) ->
            @setData("el","[data-formcontent]")
            @setData("setmode", @setMode)
            for key, value of options
                @setData( key, value )
            @init()
       
        setMode: ( value ) ->
            console.log( value )
        render: ()->
            @template @getData().el()
        init: ->
            ko.bindingHandlers.modeType =
                update: ( element, valueAccessor, allBindings )->
                    value = valueAccessor()
                    #console.log value
            #@render()
            ko.applyBindings @getData()
            for key, value of @getData().responseFileds()
                switch value.filed_type
                    when "text" then _model[ key ] = new TextFiled key
    
    response =
        responseFileds:[
            {
                filed_type: "text"
                value: '123'
                id: 456
                required: false
                label: 'test'
                filed_options:{
                    size: "one_column"
                }
            }
            {
                filed_type: "text"
                value: ''
                id: 234
                required: false
                label: 'test'
                filed_options:{
                    size: "one_column"
                }
            }
        ]
        isLoading: false
        formName: "入院查体"
        formCode: "c24"

    b = new FormBuilder response

)()
