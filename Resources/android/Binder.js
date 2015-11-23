function apiNameEvent() {
    return [ "change" ];
}

function apiNameField(apiName) {
    switch (apiName) {
      case "Ti.UI.Switch":
        return "value";

      case "Ti.UI.Label":
        return "text";

      default:
        return "value";
    }
    return "text";
}

function Binding(arr) {
    this.model = arr.model;
    this.modelField = arr.modelField;
    this.object = arr.object;
    this.apiName = this.object.apiName;
    this.objectEvent = (_.isArray(arr.objectEvent) ? arr.objectEvent : [ arr.objectEvent ]) || apiNameEvent(this.apiName);
    this.objectField = arr.objectField || apiNameField(this.apiName);
}

var Bacon = require("Bacon").Bacon;

Binding.prototype.getOValue = function() {
    return _.isFunction(this.object[this.objectField]) ? this.object[this.objectField]() : this.object[this.objectField];
};

Binding.prototype.setOValue = function(val) {
    this.getOValue() != val && (_.isFunction(this.object[this.objectField]) ? this.object[this.objectField](val) : this.object[this.objectField] = val);
};

Binding.prototype.getMValue = function() {
    return this.model.get(this.modelField);
};

Binding.prototype.setMValue = function(val, opts) {
    opts = opts || {};
    if (this.getMValue() != val) {
        this.model.set(this.modelField, val, opts);
        if (_.isFunction(this.model.validate) && opts && !opts.silent) {
            var errors = this.model.validate(this.modelField);
            errors ? this.model.trigger("error", errors) : this.model.trigger("clearError", this.modelField);
        }
    }
};

Binding.prototype.fireEvent = function(type, evt) {
    this.object && _.isFunction(this.object.fireEvent) && this.object.fireEvent(type, evt);
};

Binding.prototype.blur = function() {
    this.object && _.isFunction(this.object.blur) && this.object.blur();
};

Binding.prototype.bindIn = function() {
    var hand = _.bind(function() {
        this.setMValue(this.getOValue());
    }, this);
    _.isArray(this.objectEvent) || (this.objectEvent = [ this.objectEvent ]);
    _.each(this.objectEvent, function(evt) {
        this.object.addEventListener(evt, hand);
    }, this);
    this.unbind = _.bind(function() {
        _.each(this.objectEvent, function(evt) {
            this.object.removeEventListener(evt, hand);
        }, this);
    }, this);
    return this.unbind;
};

Binding.prototype.bindOut = function() {
    var hand = _.bind(function() {
        this.setOValue(this.getMValue());
    }, this);
    this.model.on("change:" + this.modelField, hand);
    this.unbind = _.bind(function() {
        this.model.off("change:" + this.modelField, hand);
    }, this);
    return this.unbind;
};

Binding.prototype.bind = function() {
    var unbindIn = this.bindIn();
    var unbindOut = this.bindOut();
    this.unbind = _.bind(function() {
        unbindIn();
        unbindOut();
    }, this);
    return this.unbind;
};

var binder = {};

binder.bindIn = function(ar) {
    var binding = new Binding(ar);
    binding.bindIn();
    return binding;
};

binder.bindOut = function(ar) {
    var binding = new Binding(ar);
    binding.bindOut();
    return binding;
};

binder.bind = function(ar) {
    var binding = new Binding(ar);
    binding.bind();
    return binding;
};

module.exports = binder;