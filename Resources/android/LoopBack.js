function _send(info) {
    var xhr = Ti.Network.createHTTPClient({
        onload: function() {
            Ti.API.info(">>>", this.status, this.responseText);
            if (204 == this.status) return info.callback();
            var data = null;
            try {
                data = JSON.parse(this.responseText);
            } catch (e) {
                return info.callback(null, {
                    status: this.status,
                    text: this.responseText,
                    message: "Ошибка обработки данных"
                });
            }
            info.callback(data);
        },
        onerror: function() {
            function getErrorMessageFromBody(body) {
                try {
                    var parsed = JSON.parse(body);
                } catch (e) {
                    Ti.API.error("Failed to parse JSON.");
                    parsed = {};
                } finally {
                    return opath.get(parsed, "error.message", null);
                }
            }
            function getErrorMessageFromStatus(status) {
                return L("error_" + status, 0 == status ? "Ошибка подключения сети." : "Ответ от сервера недействительный.");
            }
            Ti.API.error(">>>", this.status, this.responseText);
            var message = getErrorMessageFromBody(this.responseText) || getErrorMessageFromStatus(this.status);
            var error = {
                status: this.status,
                text: this.responseText,
                message: message
            };
            info.callback(null, error);
        }
    });
    if (info.data) {
        Ti.API.debug(" >>> data:", info.data);
        Ti.API.info(" >>> data.stringified:", JSON.stringify(info.data));
    }
    var at = Alloy.Globals && Alloy.Globals.User ? Alloy.Globals.User.get("accessToken") : null;
    var url = info.url;
    xhr.open(info.type, url);
    at && xhr.setRequestHeader("Authorization", at);
    Ti.API.info(">>> url:", Ti.Network.decodeURIComponent(url));
    xhr.send(info.data);
}

var opath = require("object-path");

module.exports.Model = {
    save: function(cb) {
        var self = this;
        var url = this.config.api_url + this.config.method_name;
        if (this.get("id")) {
            url += "/" + self.get("id");
            _send({
                type: "PUT",
                data: JSON.stringify(self.toJSON()),
                headers: [ {
                    name: "Content-Type",
                    value: "application/json"
                } ],
                url: url,
                callback: function(data, error) {
                    error ? cb && cb(error, data) : cb && cb(null, data);
                }
            });
        } else _send({
            type: "POST",
            data: self.toJSON(),
            url: url,
            callback: function(data, error) {
                if (error) cb && cb(error, data); else {
                    self.set(data);
                    cb && cb(null, data);
                }
            }
        });
    },
    remove: function(cb, id) {
        var self = this;
        var url = this.config.api_url + this.config.method_name + "/" + (id || this.get("id"));
        _send({
            type: "DELETE",
            data: self.toJSON(),
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        });
    },
    relationRemove: function(relation, relId, cb) {
        var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + (relId ? "/" + relId : "");
        _send({
            type: "DELETE",
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        });
    },
    relationCount: function(relation, cb) {
        var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + "/count";
        _send({
            type: "GET",
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data.count);
            }
        });
    },
    relationCreate: function(relation, data, cb) {
        var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation;
        _send({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        });
    },
    relationFind: function(relation, cb, filter) {
        var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + (filter ? "?filter=" + Ti.Network.encodeURIComponent(JSON.stringify(filter)) : "");
        _send({
            type: "GET",
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        });
    },
    relationLink: function(relation, relId, cb, data) {
        var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + "/rel/" + relId;
        var sendParams = {
            type: "PUT",
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        };
        _.isObject(data) && (sendParams.data = JSON.stringify(data));
        _send(sendParams);
    },
    relationUnlink: function(relation, relId, cb) {
        var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + "/rel/" + relId;
        _send({
            type: "DELETE",
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        });
    },
    updateAttribute: function(name, value, cb) {
        this.set(name, value);
        this.save(cb);
    },
    updateAttributes: function(data, cb) {
        this.set(data);
        this.save(cb);
    },
    reload: function(cb, id, include) {
        var self = this;
        var filter = {
            where: {
                id: id || this.get("id")
            },
            limit: 1
        };
        include && (filter.include = include);
        var url = this.config.api_url + (this.config.modelReplacements && this.config.modelReplacements.find ? this.config.modelReplacements.find : this.config.method_name) + "?filter=" + JSON.stringify(filter);
        _send({
            type: "GET",
            url: url,
            callback: function(data, error) {
                if (error) cb && cb(error, data); else if (data) {
                    self.set(_.first(data));
                    cb && cb(null, _.first(data));
                } else cb && cb(null, data);
            }
        });
    },
    getIdName: function() {
        return this.idAttribute;
    },
    querie: function(method, params, cb) {
        var url = this.config.api_url + this.config.method_name + "/" + this.id + "/" + method;
        url += "?filter=" + JSON.stringify(params);
        _send({
            type: "GET",
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        });
    }
};

module.exports.Collection = {
    create: function(data, cb) {
        var url = this.config.api_url + this.config.method_name;
        _send({
            type: "POST",
            data: data,
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        });
    },
    upsert: function(data, cb) {
        var url = this.config.api_url + this.config.method_name;
        _send({
            type: "PUT",
            data: data,
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data);
            }
        });
    },
    updateOrCreate: function(data) {
        this.upsert(data, callback);
    },
    findOrCreate: function(query, data, cb) {
        var self = this;
        this.findOne(query, function(error, obj) {
            error ? cb && cb(error, obj) : obj ? cb && cb(null, obj) : self.create(data, cb);
        });
    },
    exists: function(id, cb) {
        var url = this.config.api_url + this.config.method_name + "/" + id + "/exists";
        _send({
            type: "GET",
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, false, data) : cb && cb(null, data && data.exists, data);
            }
        });
    },
    findById: function(id, cb) {
        var url = this.config.api_url + this.config.method_name + "/" + id;
        _send({
            type: "GET",
            url: url,
            callback: cb
        });
    },
    find: function(params, cb) {
        this.customFind(this.config.modelReplacements && this.config.modelReplacements.find ? this.config.modelReplacements.find : this.config.method_name, params, cb);
    },
    findIdMethod: function(id, method, params, cb) {
        var prefix = id + "/" + method;
        this.customFind(prefix, params, cb);
    },
    findOne: function(params, cb) {
        var self = this;
        var url = this.config.api_url + this.config.method_name + "/findOne";
        cb ? url += "?filter=" + Ti.Network.encodeURIComponent(JSON.stringify(params)) : cb = arguments[0];
        _send({
            type: "GET",
            url: url,
            callback: function(data, error) {
                if (error) cb && cb(error, data); else if (data) {
                    var newCollection = new self.constructor();
                    newCollection.add(data);
                    cb && cb(null, newCollection.at(0));
                } else cb && cb(null, data);
            }
        });
    },
    count: function(where, cb) {
        var url = this.config.api_url + this.config.method_name + "/count";
        cb ? url = url + "?where=" + Ti.Network.encodeURIComponent(JSON.stringify(where)) : cb = arguments[0];
        _send({
            type: "GET",
            url: url,
            callback: function(data, error) {
                error ? cb && cb(error, data) : cb && cb(null, data.count);
            }
        });
    },
    customFind: function(prefix, params, cb) {
        var self = this;
        var url = this.config.api_url + prefix;
        cb ? url += "?filter=" + Ti.Network.encodeURIComponent(JSON.stringify(params)) : cb = arguments[0];
        _send({
            type: "GET",
            url: url,
            callback: function(data, error) {
                if (error) cb && cb(error, data); else if (data) {
                    var newCollection = new self.constructor();
                    newCollection.reset(data);
                    cb && cb(null, newCollection);
                } else cb(null, data);
            }
        });
    },
    initialize: function(info) {
        info = info || {};
        this.limit = info.limit || "all";
        this.offset = 0;
        this._filter = info;
    },
    loadMore: function() {
        var self = this;
        this.offset = this.length;
        this._filter.offset = this.offset;
        this.find(this._filter, function(error, collection) {
            if (!collection || error) {
                self.trigger("error_loading", {
                    error: error
                });
                return;
            }
            _.isFunction(self.beforeReset) && self.beforeReset(collection);
            self.add(collection.toJSON());
            self.trigger(collection.length == self.limit ? "loadmore" : "all_loaded");
        });
    },
    reload: function() {
        var self = this;
        this.offset = 0;
        this._filter.offset = this.offset;
        this.find(this._filter, function(error, collection) {
            if (!collection || error) {
                self.trigger("error_loading", {
                    error: error
                });
                return;
            }
            _.isFunction(self.beforeReset) && self.beforeReset(collection);
            self.reset(collection.toJSON());
            "all" != self.limit && collection.models.length == self.limit ? self.trigger("loadmore") : collection.models.length && ("all" == self.limit || collection.models.length < self.limit) ? self.trigger("all_loaded") : collection.models.length || self.trigger("collection_empty");
        });
    }
};

module.exports.send = _send;