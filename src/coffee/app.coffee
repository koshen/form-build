class BaseModal

    data =
        id: ko.observable()
        code: ko.observable()
        name: ko.observable()

    getData: ->
        return data

    setData: ( name, value ) ->
        key = true
        for k, v of data
            if k is name
                key = false
                break
        if key then data[ name ] = ko.observable( value ) else data[ name ]( value )

    change: ( name, cb ) ->
        data[ name ].subscribe cb

class BaseResponseFile extends BaseModal

    constructor: ->
        @data = @getData()

    getTemplateHead: ->
        return("""
            <div data-bind='text: id()'></div>
        """)

    getTemplateBody: ->
        return ""

    template: ( v ) ->
        $( v ).append @getTemplateHead()

    render: ->
        @template( '[data-files]' )
        ko.applyBindings( @data )

b = new BaseResponseFile

b.setData( "id", "123" )

b.render()

