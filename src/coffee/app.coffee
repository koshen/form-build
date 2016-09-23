(() ->

    ###
    # @name BaseModal基本数据模型类
    # @parma{ String } id file 的唯一标识
    # @parma{ String } code file 的编号
    # @parma{ boolean } require file是否必填
    ###

    class BaseModal

        data =
            id: ko.observable()
            code: ko.observable()
            name: ko.observable()
            require: ko.observable(false)
            errors: ko.observable()

        getData: ->
            return data

        setData: ( name, value ) ->
            @set( data, name, value )

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

    ###
    # @name BaseResponseFile 基础file的问题类
    # init 类在构造函数中会调用该方法
    # render 视图重绘方法
    # getTemplateBody 抽象接口，在各个子类中定义不同的视图
    ###

    class BaseResponseFile extends BaseModal

        constructor: ( options )->
            for key, value in options
                @setData(key, value)
            @init()

        getTemplateHead: ->
            return("""
                <div>
                    <span data-bind='visible: require()'>*</span>
                    <span data-bind='text: code()'></span>
                    <span data-bind='text: name()'></span>
                </div>
            """)

        getTemplateBody: ->
            return ""

        getTemplateErrors: ->
            return("""
                <div>
                    <div  data-bind='visible: errors()' data-bind="text: errors()" ></div>
                </div>
            """)
        
        template: ( v ) ->
            $( v ).append @getTemplateHead()
            $( v ).append @getTemplateBody()
            if @data.require
                $( v ).append @getTemplateErrors()

        render: ->
            ko.applyBindings( @data )
        init: ->
            @setData("layout","one_column")
            @data = @getData()
            @render()

    class TextFile extends BaseResponseFile
        getTemplateBody: ->
            return("""
                <div data-bind="style:{ width: layout() === 'one_column'? '100%' : '50%' }">
                    <input type='text' data-bind='value: value()'>
                </div>
            """)
        getValue: ->
            d[ @data.id() ] = @data.value()
            return d
        render: ->
            @template( '[data-text]' )
            super()
        init: ->
            @setData("type","text")
            @setData( "value", null )
            super()

    class FormBuilder extends BaseModal

        _data =
            el: ko.observable("[data-formcontent]")
        
        constructor: ( options ) ->
            for key, value of options
                @set( _data, key, value )
            @init()
        
        templateLoading = ->
            return("""
                <div class="crf-form-loading" >loading</div>
            """)
        templateContent = ->
            return("""
                <div class="crf-form-content" data-bind="foreach: responseFileds()">
                    <div data-bind="if: type === 'text'" data-bind="attr: {'data-text':''}">
                        <div data-bind="text: id" ></div>
                    </div>
                    <div data-bind="if: type === 'checkbox'" data-bind="attr: {'data-checkbox'}">
                        <div data-bind="text: id" ></div>
                    </div>
                </div>
            """)
        template: ( v ) ->
            $( v ).html "<div class='crf-form-container' >#{if _data.isLoading() then templateLoading() else templateContent()}</div>"
        render: ->
            console.log _data
            @template _data.el()
            ko.applyBindings _data
        init: ->
            @render()
   
    
    response =
        responseFileds:[
            type: "text"
            value: '123'
            id: '456'
            name: 'test'
        ]
        isLoading: false

    b = new FormBuilder response

)()
