var BaseModal, BaseResponseFile, b,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModal = (function() {
  var data;

  function BaseModal() {}

  data = {
    id: ko.observable(),
    code: ko.observable(),
    name: ko.observable()
  };

  BaseModal.prototype.getData = function() {
    return data;
  };

  BaseModal.prototype.setData = function(name, value) {
    var k, key, v;
    key = true;
    for (k in data) {
      v = data[k];
      if (k === name) {
        key = false;
        break;
      }
    }
    if (key) {
      return data[name] = ko.observable(value);
    } else {
      return data[name](value);
    }
  };

  BaseModal.prototype.change = function(name, cb) {
    return data[name].subscribe(cb);
  };

  return BaseModal;

})();

BaseResponseFile = (function(superClass) {
  extend(BaseResponseFile, superClass);

  function BaseResponseFile() {
    this.data = this.getData();
  }

  BaseResponseFile.prototype.getTemplateHead = function() {
    return "<div data-bind='text: id()'></div>";
  };

  BaseResponseFile.prototype.getTemplateBody = function() {
    return "";
  };

  BaseResponseFile.prototype.template = function(v) {
    return $(v).append(this.getTemplateHead());
  };

  BaseResponseFile.prototype.render = function() {
    this.template('[data-files]');
    return ko.applyBindings(this.data);
  };

  return BaseResponseFile;

})(BaseModal);

b = new BaseResponseFile;

b.setData("id", "123");

b.render();
