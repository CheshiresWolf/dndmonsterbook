!function() {
    "use strict";
    var Validator = Alloy.Backbone.Validator = {
        version: "0.3.0",
        validate: function(attrs, validations, context) {
            var errors = {};
            _.each(attrs, function(attrValue, attrName) {
                var validation = validations[attrName];
                if (validation) {
                    var error = this._validateAll(validation, attrName, attrValue, context, attrs);
                    error.length && (errors[attrName] = _.uniq(error));
                }
            }, this);
            return _.size(errors) ? errors : null;
        },
        _validateAll: function(validations, attrName, attrValue, context, allAttrs) {
            context = context || this;
            return _.inject(_.flatten([ validations || [] ]), function(errors, validation) {
                _.chain(validation).omit("message").each(function(attrExpectation, validatorName) {
                    var validator = this._validators[validatorName];
                    if (!validator) throw new Error("Missed validator: " + validatorName);
                    var result = validator.fn.apply(context, [ attrValue, attrExpectation, allAttrs ]);
                    if (true !== result) {
                        var error = validation.message || result || createErrorMessage(attrName, attrValue, attrExpectation, validatorName, context) || validator.message || "Invalid";
                        _.isFunction(error) && (error = error.apply(context, [ attrName, attrValue, attrExpectation, validatorName ]));
                        errors.push(error);
                    }
                }, this);
                return errors;
            }, [], this);
        },
        add: function(validatorName, validatorFn, errorMessage) {
            this._validators[validatorName] = {
                fn: validatorFn,
                message: errorMessage
            };
        },
        _validators: {}
    };
    Validator.Extensions = {
        View: {
            bindValidation: function(model, options) {
                model = model || this.model;
                if (!model) throw "Model is not provided";
                this.listenTo(model, "validated", function(model, attributes, errors) {
                    var callbacks = _.extend({}, Validator.ViewCallbacks, _.pick(this, "onInvalidField", "onValidField"), options);
                    errors = errors || {};
                    _.each(attributes, function(value, name) {
                        var attrErrors = errors[name];
                        attrErrors && attrErrors.length ? callbacks.onInvalidField.call(this, name, value, attrErrors, model) : callbacks.onValidField.call(this, name, value, model);
                    }, this);
                });
            }
        },
        Model: {
            validate: function(attributes, options) {
                var validation = _.result(this, "validation") || {}, attrs = getAttrsToValidate(this, attributes), errors = Validator.validate(attrs, validation, this);
                options = options || {};
                errors = options.processErrors ? options.processErrors(errors) : Validator.ModelCallbacks.processErrors(errors);
                options.silent || _.defer(_.bind(this.triggerValidated, this), attrs, errors);
                return options && options.suppress ? null : errors;
            },
            _validate: function(attributes, options) {
                if (!options.validate || !this.validate) return true;
                var attrs = getAttrsToValidate(this, attributes), errors = this.validationError = this.validate(attrs, options) || null;
                errors && this.trigger("invalid", this, errors, _.extend(options || {}, {
                    validationError: errors
                }));
                return !errors;
            },
            triggerValidated: function(attributes, errors) {
                var attrs = getAttrsToValidate(this, attributes), errs = getCleanErrors(errors);
                this.validationError = errs;
                this.trigger("validated", this, attrs, errs);
                this.trigger("validated:" + (errs ? "invalid" : "valid"), this, attrs, errs);
            },
            isValid: function(attributes, options) {
                var attrs = getAttrsToValidate(this, attributes);
                return !this.validate || !this.validate(attrs, options);
            }
        }
    };
    var pick = function(object, keys) {
        return _.inject(_.flatten([ keys ]), function(memo, key) {
            memo[key] = object[key];
            return memo;
        }, {});
    };
    var getAttrsToValidate = function(model, passedAttrs) {
        var attrs, all, modelAttrs = model.attributes, validationAttrs = _.result(model, "validation");
        if (_.isArray(passedAttrs) || _.isString(passedAttrs)) attrs = pick(modelAttrs, passedAttrs); else if (passedAttrs) attrs = passedAttrs; else {
            all = _.extend({}, modelAttrs, validationAttrs || {});
            attrs = pick(modelAttrs, _.keys(all));
        }
        return attrs;
    };
    var getCleanErrors = function(allErrors) {
        var cleanErrors = _.inject(allErrors, function(memo, fieldErrors, attr) {
            fieldErrors.length && (memo[attr] = _.isString(fieldErrors) ? [ fieldErrors ] : fieldErrors);
            return memo;
        }, {});
        return _.size(cleanErrors) ? cleanErrors : null;
    };
    var createErrorMessage = function() {
        return Validator.createMessage ? Validator.createMessage.apply(null, arguments) : false;
    };
    Validator.ViewCallbacks = {
        onValidField: function(name) {
            var input = this.$('input[name="' + name + '"]');
            input.removeClass("error");
            input.next(".error-text").remove();
        },
        onInvalidField: function(name, value, errors) {
            var input = this.$('input[name="' + name + '"]');
            input.next(".error-text").remove();
            input.addClass("error").after('<div class="error-text">' + errors.join(", ") + "</div>");
        }
    };
    Validator.ModelCallbacks = {
        processErrors: function(errors) {
            return errors;
        }
    };
    var validators = [ {
        name: "required",
        message: "Is required",
        fn: function(value, expectation) {
            return false === expectation || !!value;
        }
    }, {
        name: "blank",
        message: "Could not be blank",
        fn: function(value, expectation) {
            if (true === expectation) return true;
            if (_.isString(value)) return !value.match(/^[\s\t\r\n]*$/);
            return _.isArray(value) ? !!value.length : _.isObject(value) ? !_.isEmpty(value) : !!value;
        }
    }, {
        name: "collection",
        fn: function(collection, expectation) {
            if (false === expectation || !collection) return true;
            "function" == typeof expectation && (collection = expectation.call(this, collection));
            var errors = _.inject(collection.models || collection, function(memo, model, index) {
                var error = model.validate();
                error && memo.push([ index, error ]);
                return memo;
            }, []);
            return errors.length ? errors : true;
        }
    }, {
        name: "model",
        fn: function(model, expectation) {
            if (false === expectation || !model) return true;
            "function" == typeof expectation && (model = expectation.call(this, model));
            return model.validate() || true;
        }
    }, {
        name: "minLength",
        message: "Is too short",
        fn: function(value, expectation) {
            return !value || value.length >= expectation;
        }
    }, {
        name: "maxLength",
        message: "Is too long",
        fn: function(value, expectation) {
            return !value || value.length <= expectation;
        }
    }, {
        name: "format",
        message: "Does not match format",
        fn: function(value, expectation) {
            return !value || !!value.toString().match(Validator.formats[expectation] || expectation);
        }
    }, {
        name: "fn",
        fn: function(value, expectation, allAttrs) {
            return expectation.call(this, value, allAttrs);
        }
    } ];
    Validator.formats = {
        digits: /^\d+$/,
        number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
        url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    };
    _.each(validators, function(validator) {
        Validator.add(validator.name, validator.fn, validator.message);
    });
    _.extend(Alloy.Backbone.Model.prototype, Validator.Extensions.Model);
    _.extend(Alloy.Backbone.View.prototype, Validator.Extensions.View);
    return Validator;
}();