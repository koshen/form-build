var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function() {

  /*
   * @name BaseModal基本数据模型类
   * @parma{ String } id file 的唯一标识
   * @parma{ String } code file 的编号
   * @parma{ boolean } require file是否必填
   */
  var BaseModal, BaseResponseFiled, FormBuilder, TextFiled, b, response;
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
      activeFiled: ko.observable(),
      filedContent: ko.observable({
        id: ko.observable(),
        label: ko.observable(),
        require: ko.observable(),
        errors: ko.observable(),
        filed_type: ko.observable(),
        filed_options: []
      }),
      mode: ko.observable({
        value: "base",
        label: "基本属性"
      }),
      filedTypes: ko.observableArray([
        {
          label: "单行文本",
          value: "text"
        }, {
          label: "单选题",
          value: "radio"
        }, {
          label: "多选题",
          value: "checkbox"
        }, {
          label: "多行文本",
          value: "textArea"
        }
      ]),
      modeNames: ko.observableArray([
        {
          name: "base",
          icon: "icon-rulers",
          label: "基本属性"
        }, {
          name: "relation",
          icon: "icon-git-compare",
          label: "逻辑关系"
        }
      ]),
      setmode: ko.observable(),
      chooseFiled: function(id) {
        var key, ref, results, value;
        ref = this.responseFileds();
        results = [];
        for (key in ref) {
          value = ref[key];
          if (value.id() === id) {
            results.push(this.filedContent(value));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
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
  BaseResponseFiled = (function(superClass) {
    var _index;

    extend(BaseResponseFiled, superClass);

    _index = 0;

    function BaseResponseFiled(index) {
      this.setId(index);
    }

    BaseResponseFiled.prototype.getId = function() {
      return _index;
    };

    BaseResponseFiled.prototype.setId = function(id) {
      return _index = id;
    };

    return BaseResponseFiled;

  })(BaseModal);
  TextFiled = (function(superClass) {
    extend(TextFiled, superClass);

    function TextFiled(index) {
      TextFiled.__super__.constructor.call(this, index);
      this.init();
    }

    TextFiled.prototype.init = function() {};

    return TextFiled;

  })(BaseResponseFiled);
  FormBuilder = (function(superClass) {
    var _model;

    extend(FormBuilder, superClass);

    _model = {};

    function FormBuilder(options) {
      this.setMode = bind(this.setMode, this);
      var key, value;
      this.setData("el", "[data-formcontent]");
      this.setData("setmode", this.setMode);
      for (key in options) {
        value = options[key];
        this.setData(key, value);
      }
      this.init();
      console.log(this.getData().filedContent());
    }

    FormBuilder.prototype.setMode = function(value, label) {
      return this.setData("mode", {
        value: value,
        label: label
      });
    };

    FormBuilder.prototype.render = function() {
      return this.template(this.getData().el());
    };

    FormBuilder.prototype.init = function() {
      var key, ref, results, value;
      ko.applyBindings(this.getData());
      if (this.getData().responseFileds().length) {
        this.getData().chooseFiled(this.getData().responseFileds()[0].id());
      }
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
        filed_type: ko.observable("text"),
        id: ko.observable("456"),
        required: ko.observable(true),
        label: ko.observable("test"),
        filed_options: {
          size: ko.observable("one_column")
        }
      }, {
        filed_type: ko.observable("text"),
        id: ko.observable("234"),
        required: ko.observable(false),
        label: ko.observable("test"),
        filed_options: {
          size: ko.observable("one_column")
        }
      }
    ],
    isLoading: false,
    formName: "入院查体",
    formCode: "c24"
  };
  return b = new FormBuilder(response);
})();
