function Form(arr) {
    this.model = arr.model;
    this.bindings = [];
    this.errors = [];
    arr.controller && this.__autoBind(arr.controller);
    this.__modelPrepare();
    this.model.on("error", function(errors) {
        _.each(errors, function(err, field) {
            this.setError(field, err);
        }, this);
    }, this);
    this.model.on("clearError", function(field) {
        this.model.get("has_error_" + field) && this.clearError(field);
    }, this);
}

function strToValidation(string) {
    var valid = {};
    params = string.split(",");
    _.each(params, function() {});
    _.extend(valid, {
        required: string.indexOf("required") > -1
    });
    return {
        message: "WTF? Does not match format >:["
    };
}

function strToArgs(string) {
    var params = string.replace(/ /g, "").split(",");
    return _.map(params, function(par) {
        var lr = par.split("=");
        var left = lr[0];
        var right = lr[1] || "value@change";
        var object_field_event = right.split("@");
        var objEvents = object_field_event[1] ? object_field_event[1].split("+") : [ "change" ];
        return {
            modelField: left,
            objectField: object_field_event[0],
            objectEvent: objEvents
        };
    });
}

function grepBindings(controller) {
    var bindables = _.filter(controller.__views, function(v) {
        _.isFunction(v.bBind) && (v.bBind = v.bBind());
        return !!v.bBind;
    });
    return _.flatten(_.map(bindables, function(el) {
        return _.map(strToArgs(el.bBind), function(args) {
            args.object = el;
            return args;
        });
    }));
}

function _rec_findBindables(view) {
    function _recFind(children, arr) {
        return _.foldl(children, function(acc, el) {
            el.bBind && acc.push(el);
            return _recFind(el.children, acc);
        }, arr);
    }
    return _recFind([ view ], []);
}

var Binder = require("Binder");

var bv = require("backbone-validator");

Form.prototype.addBinding = function(binding) {
    this.bindings.push(binding);
};

Form.prototype.validate = function(arr) {
    var o = this.model.toJSON();
    _.each(o, function(v, k) {
        (k.indexOf("has_error_") > -1 || k.indexOf("error_") > -1 || k.indexOf("form_has_error") > -1 || k.indexOf("form_error") > -1) && this.model.set(k, "");
    }, this);
    _.each(this.errors, function(err, field) {
        this.clearError(field);
    }, this);
    this.errors = this.model.validate();
    _.isFunction(this.customValidator) && (this.errors = _.extend(this.errors, this.customValidator(this.model)));
    _.each(this.errors, function(err, field) {
        this.setError(field, err.join(", "));
    }, this);
    arr && _.isFunction(arr.handler) && arr.handler(_.extend({}, this.errors));
    if (this.errors) {
        this.model.set("form_has_error", true);
        this.model.set("form_error", _.flatten(_.values(this.errors)).join("\n"));
        return false;
    }
    return true;
};

Form.prototype.clearError = function(field) {
    this.model.set("has_error_" + field, false);
    this.model.set("error_" + field, "");
    this.model.trigger("fieldError", null, field);
    this.model.trigger("fieldError:" + field, null);
};

Form.prototype.setError = function(field, messages) {
    this.errors = _.extend(this.errors || {}, {
        field: messages
    });
    this.model.set("has_error_" + field, true);
    this.model.set("error_" + field, _.isArray(messages) ? messages.join(", ") : messages);
    this.model.trigger("fieldError", {
        field: messages
    });
    this.model.trigger("fieldError:" + field, messages);
};

Form.prototype.unbind = function() {
    _.each(this.bindings, function(b) {
        b.unbind();
    });
    this.bindings = [];
};

Form.prototype.isValid = function() {
    this.validate();
    return null == this.errors;
};

Form.prototype.__autoBind = function(controller, models) {
    var bindArgs = grepBindings(controller, models);
    "auto" == this.model && (this.model = new Backbone.Model());
    _.each(bindArgs, function(ar) {
        this.addBinding(Binder.bind(_.defaults(ar, {
            model: this.model
        })));
    }, this);
};

Form.prototype.fromModel = function() {
    _.each(this.bindings, function(bind) {
        bind.setOValue(bind.getMValue());
    });
};

Form.prototype.toModel = function(silent) {
    _.each(this.bindings, function(bind) {
        bind.setMValue(bind.getOValue(), {
            silent: !!silent
        });
    });
};

Form.prototype.blur = function() {
    _.each(this.bindings, function(bind) {
        bind.blur();
    });
};

Form.prototype.__modelPrepare = function() {
    var validation = {};
    _.each(this.bindings, function(b) {
        b.object.validation && (validation[b.modelField] = _.isFunction(b.object.validation) ? b.object.validation() : b.object.validation);
    });
    this.model.validation = _.extend(this.model.validation || {}, validation);
};

Form.prototype.modelToJSON = function() {
    return _.omit(this.model.toJSON(), function(v, k) {
        return k.indexOf("has_error_") > -1 || k.indexOf("error_") > -1 || k.indexOf("form_has_error") > -1 || k.indexOf("form_error") > -1;
    });
};

Form.prototype.fillModel = function(json, force) {
    Ti.API.info("fillModel:", json);
    this.model.set(force ? json : _.pick(json, _.keys(this.model.toJSON())));
    this.validate();
};

Form.prototype.addValidation = function(validation) {
    validation && !_.isEmpty(validation) && (this.model.validation = _.extend(this.model.validation || {}, validation));
};

module.exports = {
    Form: Form,
    createFromAlloy: function($) {
        var form = new Form({
            model: $.formModel
        });
        return form;
    },
    grepBinds: function(controller) {
        var bindables = _rec_findBindables(controller.getView());
        _.each(bindables, function() {});
    }
};