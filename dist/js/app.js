var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function() {

  /*
   * @name BaseModal基本数据模型类
   * @parma{ String } id file 的唯一标识
   * @parma{ String } code file 的编号
   * @parma{ boolean } require file是否必填
   */
  var BaseModal, BaseResponseFiled, FormBuilder, Template, TextFiled, b, response;
  BaseModal = (function() {
    var data;

    function BaseModal() {}

    data = {
      responseFileds: ko.observableArray([
        {
          id: ko.observable(),
          label: ko.observable(null),
          require: ko.observable(false),
          errors: ko.observable(),
          filed_type: ko.observable("text"),
          filed_options: ko.observable()
        }
      ]),
      isLoading: ko.observable(true),
      mode: ko.observable("base"),
      setmode: ko.observable()
    };

    BaseModal.prototype.getData = function() {
      return data;
    };

    BaseModal.prototype.setData = function(name, value) {
      return this.set(data, name, value);
    };

    BaseModal.prototype.setMode = function() {};

    BaseModal.prototype.change = function(name, cb) {
      return data[name].subscribe(cb);
    };

    BaseModal.prototype.set = function(d, name, value) {
      var _key, k, v;
      _key = true;
      for (k in d) {
        v = d[k];
        if (k === name) {
          _key = false;
          break;
        }
      }
      if (_key) {
        return d[name] = this.is(value, "Array") ? ko.observableArray(value) : ko.observable(value);
      } else {
        return d[name](value);
      }
    };

    BaseModal.prototype.is = function(obj, type) {
      return (type === "Null" && obj === null) || (type === "Undefined" && obj === void 0) || (type === "Number" && isFinite(obj)) || Object.prototype.toString.call(obj).slice(8, -1) === type;
    };

    return BaseModal;

  })();
  Template = (function() {
    function Template() {}

    Template.prototype.textFile = function() {
      return "<div data-bind=\"style:{ width: filed_options.size === 'one_column'? '100%' : '50%' }\">\n    <input type='text' data-bind='value: value'>\n</div>";
    };

    Template.prototype.fileHead = function() {
      return "<div class=\"crf-filed-header\">\n    <span data-bind='visible: required'>*</span>\n    <span data-bind='text: id'></span>\n    <span>-</span>\n    <span data-bind='text: label'></span>\n</div>";
    };

    Template.prototype.fileError = function() {
      return "<div data-errors>\n    \n</div>";
    };

    Template.prototype.fileLoading = function() {
      return "<div class=\"crf-form-loading\" >loading</div>";
    };

    Template.prototype.formContainer = function() {
      return "<div class='crf-form-container' ></div>";
    };

    Template.prototype.formContent = function() {
      return "<div class=\"crf-form-content\" data-bind=\"foreach: responseFileds()\">\n    <div data-bind=\"attr:{ id: id }\" class=\"crf-filed-container\">\n        " + (this.fileHead()) + "\n        <div data-bind=\"if: filed_type=='text'\" >" + (this.textFile()) + "</div>\n        " + (this.fileError()) + "\n    </div>\n</div>";
    };

    Template.prototype.chooseView = function(type) {
      switch (type) {
        case "fileHead":
          return this.fileHead();
        case "error":
          return this.fileError();
        case "text":
          return this.textFile();
        case "loading":
          return this.fileLoading();
      }
    };

    return Template;

  })();
  BaseResponseFiled = (function(superClass) {
    var _index;

    extend(BaseResponseFiled, superClass);

    _index = 0;

    function BaseResponseFiled(index) {
      _index = index;
    }

    BaseResponseFiled.prototype.getValue = function() {
      return _data.value;
    };

    return BaseResponseFiled;

  })(BaseModal);
  TextFiled = (function(superClass) {
    extend(TextFiled, superClass);

    function TextFiled() {
      return TextFiled.__super__.constructor.apply(this, arguments);
    }

    return TextFiled;

  })(BaseResponseFiled);
  FormBuilder = (function(superClass) {
    var _model;

    extend(FormBuilder, superClass);

    _model = {};

    function FormBuilder(options) {
      var key, value;
      this.setData("el", "[data-formcontent]");
      this.setData("setmode", this.setMode);
      for (key in options) {
        value = options[key];
        this.setData(key, value);
      }
      this.init();
    }

    FormBuilder.prototype.setMode = function(value) {
      return console.log(value);
    };

    FormBuilder.prototype.render = function() {
      return this.template(this.getData().el());
    };

    FormBuilder.prototype.init = function() {
      var key, ref, results, value;
      ko.bindingHandlers.modeType = {
        update: function(element, valueAccessor, allBindings) {
          var value;
          return value = valueAccessor();
        }
      };
      ko.applyBindings(this.getData());
      ref = this.getData().responseFileds();
      results = [];
      for (key in ref) {
        value = ref[key];
        switch (value.filed_type) {
          case "text":
            results.push(_model[key] = new TextFiled(key));
            break;
          default:
            results.push(void 0);
        }
      }
      return results;
    };

    return FormBuilder;

  })(BaseModal);
  response = {
    responseFileds: [
      {
        filed_type: "text",
        value: '123',
        id: 456,
        required: false,
        label: 'test',
        filed_options: {
          size: "one_column"
        }
      }, {
        filed_type: "text",
        value: '',
        id: 234,
        required: false,
        label: 'test',
        filed_options: {
          size: "one_column"
        }
      }
    ],
    isLoading: false,
    formName: "入院查体",
    formCode: "c24"
  };
  return b = new FormBuilder(response);
})();
