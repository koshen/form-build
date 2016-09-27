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
            activeFiled: ko.observable()
            filedContent: ko.observable({
                id:ko.observable()
                label:ko.observable()
                require:ko.observable()
                errors: ko.observable()
                filed_type: ko.observable()
                filed_options:[]
            })
            mode: ko.observable({value: "base",label: "基本属性"})
            filedTypes: ko.observableArray([
                { label: "单行文本", value: "text" }
                { label: "单选题", value: "radio" }
                { label: "多选题", value: "checkbox" }
                { label: "多行文本", value: "textArea" }
            ])
            modeNames:ko.observableArray([{name: "base", icon: "icon-rulers", label: "基本属性"},{name: "relation",icon: "icon-git-compare", label: "逻辑关系"}])
            setmode: ko.observable()
            chooseFiled: ( id )->
                for key, value of @responseFileds()
                    if value.id() is id
                        @filedContent( value )
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
    
     class BaseResponseFiled extends BaseModal
        _index = 0
    
        constructor: ( index )->
            @setId( index )
        getId: ->
            return _index
        setId: ( id )->
            _index = id

    class TextFiled extends BaseResponseFiled
        constructor: ( index )->
            super( index )
            @init()
        init:->
           

    class FormBuilder extends BaseModal
        _model = {}
        constructor: ( options ) ->
            @setData("el","[data-formcontent]")
            @setData("setmode", @setMode)
            for key, value of options
                @setData( key, value )
            @init()
            console.log @getData().filedContent()
       
        setMode: ( value, label ) =>
            @setData("mode",{value:value,label:label})
        render: ()->
            @template @getData().el()
        init: ->
            ko.applyBindings @getData()
            if @getData().responseFileds().length
                @getData().chooseFiled(@getData().responseFileds()[0].id())
            for key, value of @getData().responseFileds()
                switch value.filed_type
                    when "text" then _model[ key ] = new TextFiled key
    response =
        responseFileds:[
            {
                filed_type: ko.observable("text")
                id: ko.observable("456")
                required: ko.observable(true)
                label: ko.observable("test")
                filed_options:{
                    size: ko.observable("one_column")
                }
            }
            {
                filed_type: ko.observable("text")
                id: ko.observable("234")
                required: ko.observable(false)
                label: ko.observable("test")
                filed_options:{
                    size: ko.observable("one_column")
                }
            }
        ]
        isLoading: false
        formName: "入院查体"
        formCode: "c24"

    b = new FormBuilder response

)()
