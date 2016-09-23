var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function() {

  /*
   * @name BaseModal基本数据模型类
   * @parma{ String } id file 的唯一标识
   * @parma{ String } code file 的编号
   * @parma{ boolean } require file是否必填
   */
  var BaseModal, BaseResponseFile, FormBuilder, TextFile, b, response;
  BaseModal = (function() {
    var data;

    function BaseModal() {}

    data = {
      id: ko.observable(),
      code: ko.observable(),
      name: ko.observable(),
      require: ko.observable(false),
      errors: ko.observable()
    };

    BaseModal.prototype.getData = function() {
      return data;
    };

    BaseModal.prototype.setData = function(name, value) {
      return this.set(data, name, value);
    };

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

  /*
   * @name BaseResponseFile 基础file的问题类
   * init 类在构造函数中会调用该方法
   * render 视图重绘方法
   * getTemplateBody 抽象接口，在各个子类中定义不同的视图
   */
  BaseResponseFile = (function(superClass) {
    extend(BaseResponseFile, superClass);

    function BaseResponseFile(options) {
      var i, key, len, value;
      for (value = i = 0, len = options.length; i < len; value = ++i) {
        key = options[value];
        this.setData(key, value);
      }
      this.init();
    }

    BaseResponseFile.prototype.getTemplateHead = function() {
      return "<div>\n    <span data-bind='visible: require()'>*</span>\n    <span data-bind='text: code()'></span>\n    <span data-bind='text: name()'></span>\n</div>";
    };

    BaseResponseFile.prototype.getTemplateBody = function() {
      return "";
    };

    BaseResponseFile.prototype.getTemplateErrors = function() {
      return "<div>\n    <div  data-bind='visible: errors()' data-bind=\"text: errors()\" ></div>\n</div>";
    };

    BaseResponseFile.prototype.template = function(v) {
      $(v).append(this.getTemplateHead());
      $(v).append(this.getTemplateBody());
      if (this.data.require) {
        return $(v).append(this.getTemplateErrors());
      }
    };

    BaseResponseFile.prototype.render = function() {
      return ko.applyBindings(this.data);
    };

    BaseResponseFile.prototype.init = function() {
      this.setData("layout", "one_column");
      this.data = this.getData();
      return this.render();
    };

    return BaseResponseFile;

  })(BaseModal);
  TextFile = (function(superClass) {
    extend(TextFile, superClass);

    function TextFile() {
      return TextFile.__super__.constructor.apply(this, arguments);
    }

    TextFile.prototype.getTemplateBody = function() {
      return "<div data-bind=\"style:{ width: layout() === 'one_column'? '100%' : '50%' }\">\n    <input type='text' data-bind='value: value()'>\n</div>";
    };

    TextFile.prototype.getValue = function() {
      d[this.data.id()] = this.data.value();
      return d;
    };

    TextFile.prototype.render = function() {
      this.template('[data-text]');
      return TextFile.__super__.render.call(this);
    };

    TextFile.prototype.init = function() {
      this.setData("type", "text");
      this.setData("value", null);
      return TextFile.__super__.init.call(this);
    };

    return TextFile;

  })(BaseResponseFile);
  FormBuilder = (function(superClass) {
    var _data, templateContent, templateLoading;

    extend(FormBuilder, superClass);

    _data = {
      el: ko.observable("[data-formcontent]")
    };

    function FormBuilder(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        this.set(_data, key, value);
      }
      this.init();
    }

    templateLoading = function() {
      return "<div class=\"crf-form-loading\" >loading</div>";
    };

    templateContent = function() {
      return "<div class=\"crf-form-content\" data-bind=\"foreach: responseFileds()\">\n    <div data-bind=\"if: type === 'text'\" data-bind=\"attr: {'data-text':''}\">\n        <div data-bind=\"text: id\" ></div>\n    </div>\n    <div data-bind=\"if: type === 'checkbox'\" data-bind=\"attr: {'data-checkbox'}\">\n        <div data-bind=\"text: id\" ></div>\n    </div>\n</div>";
    };

    FormBuilder.prototype.template = function(v) {
      return $(v).html("<div class='crf-form-container' >" + (_data.isLoading() ? templateLoading() : templateContent()) + "</div>");
    };

    FormBuilder.prototype.render = function() {
      console.log(_data);
      this.template(_data.el());
      return ko.applyBindings(_data);
    };

    FormBuilder.prototype.init = function() {
      return this.render();
    };

    return FormBuilder;

  })(BaseModal);
  response = {
    responseFileds: [
      {
        type: "text",
        value: '123',
        id: '456',
        name: 'test'
      }
    ],
    isLoading: false
  };
  return b = new FormBuilder(response);
})();
