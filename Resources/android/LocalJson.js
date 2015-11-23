var opath = require("object-path");

var DEBUG = true;

module.exports.Model = {
    save: function(cb) {
        DEBUG && Ti.API.debug("LocalJson | model.save");
        cb && cb(null, {});
    },
    remove: function(cb) {
        DEBUG && Ti.API.debug("LocalJson | model.remove");
        cb && cb(null, {});
    },
    relationRemove: function(relation, relId, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.relationRemove");
        cb && cb(null, {});
    },
    relationCount: function(relation, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.relationCount");
        cb && cb(null, 0);
    },
    relationCreate: function(relation, data, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.relationCreate");
        cb && cb(null, {});
    },
    relationFind: function(relation, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.relationFind");
        cb && cb(null, {});
    },
    relationLink: function(relation, relId, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.relationLink");
        cb && cb(null, {});
    },
    relationUnlink: function(relation, relId, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.relationUnlink");
        cb && cb(null, {});
    },
    updateAttribute: function(name, value, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.updateAttribute");
        this.set(name, value);
        this.save(cb);
    },
    updateAttributes: function(data, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.updateAttributes");
        this.set(data);
        this.save(cb);
    },
    reload: function(cb) {
        DEBUG && Ti.API.debug("LocalJson | model.reload");
        cb && cb(null, this);
    },
    getIdName: function() {
        DEBUG && Ti.API.debug("LocalJson | model.getIdName");
        return this.idAttribute;
    },
    querie: function(method, params, cb) {
        DEBUG && Ti.API.debug("LocalJson | model.querie");
        cb && cb(null, {});
    }
};

module.exports.Collection = {
    create: function(data, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.create");
        Alloy.Globals.jsonArray.push(data);
        var newModel = Alloy.createModel("Monster", data);
        this.add(newModel);
        cb && cb(null, newModel);
    },
    upsert: function(data, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.upsert");
        var item = Alloy.Globals.getByName(data.name);
        null != item ? Alloy.Globals.setByName(data.name, data) : this.create(data, cb);
    },
    updateOrCreate: function(data, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.updateOrCreate");
        this.upsert(data, cb);
    },
    findOrCreate: function(query, data, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.findOrCreate");
        var self = this;
        this.findOne(query, function(error, obj) {
            error ? cb && cb(error, obj) : obj ? cb && cb(null, obj) : self.create(data, cb);
        });
    },
    exists: function(id, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.exists");
        var item = Alloy.Globals.getById(id);
        cb && cb(null, null != item, item);
    },
    findById: function(id, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.findById");
        cb && cb(null, Alloy.Globals.getById(id));
    },
    find: function(params, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.find");
        this.customFind({}, params, cb);
    },
    findIdMethod: function(id, method, params, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.findIdMethod");
        this.customFind({}, params, cb);
    },
    findOne: function(params, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.findOne");
        var item = null;
        void 0 != params.id ? item = Alloy.Globals.getByName(id) : void 0 != params.name && (item = Alloy.Globals.getByName(name));
        if (null != item) {
            var newCollection = new this.constructor();
            newCollection.add(data);
            cb && cb(null, newCollection.at(0));
        } else cb && cb(null, item);
    },
    count: function(where, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.count");
        cb && cb(null, Alloy.Globals.filter(where).length);
    },
    customFind: function(prefix, params, cb) {
        DEBUG && Ti.API.debug("LocalJson | collection.customFind");
        var data = Alloy.Globals.filter(params);
        var newCollection = new this.constructor();
        newCollection.reset(data);
        cb && cb(null, newCollection);
    },
    initialize: function(info) {
        DEBUG && Ti.API.debug("LocalJson | collection.initialize");
        info = info || {};
        this.limit = info.limit || "all";
        this.offset = 0;
        this._filter = info;
    },
    loadMore: function() {
        DEBUG && Ti.API.debug("LocalJson | collection.loadMore");
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
        DEBUG && Ti.API.debug("LocalJson | collection.reload");
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