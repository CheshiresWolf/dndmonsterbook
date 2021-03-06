function ListViewBinder(options) {
    this.options = options;
    this.data = [];
    this.listview = options.listview;
    this.collection = options.collection;
    this.modelClass = this.collection.model;
    this.template = options.item_template || null;
    this.section = options.section || null;
    this.disableLoadMore = !!options.disableLoadMore;
    this.ptr = options.pull || null;
    this.onlyafter = 0;
    this.deferAdd = 0;
    this.deferRemove = 0;
    this.deferReplace = 0;
    this.waitForAdd = [];
    this.waitForRemove = [];
    this.waitForReplace = [];
    this.modelTranslateMethod = options.modelTranslateMethod || "translate";
    this.modelTranslator = options.translator || null;
}

_.extend(ListViewBinder.prototype, {
    bind: function() {
        "use strict";
        var self = this;
        this.collection.on("add", this.add, this);
        this.collection.on("reset fetch", this.reload, this);
        this.collection.on("change", this.change, this);
        this.collection.on("remove", this.remove, this);
        if (!this.disableLoadMore) {
            this.collection.on("loadmore reset fetch", this.setMarker, this);
            this.collection.on("all_loaded", this.removeLoadMore, this);
            this.listview.addEventListener("marker", function() {
                self.collection.loadMore();
            });
        }
        true && this.ptr && this.ptr.addEventListener("refreshstart", function() {
            self.collection.reload();
        });
    },
    removeLoadMore: function() {
        "use strict";
        this.listview && this.listview.footerView && (this.listview.footerView.height = 0);
    },
    startLoading: function() {
        "use strict";
        true && null != this.ptr && this.ptr.beginRefreshing();
    },
    endLoading: function() {
        "use strict";
        true && null != this.ptr && this.ptr.endRefreshing();
    },
    setMarker: function() {
        "use strict";
        if (this.disableLoadMore) return;
        var self = this;
        self.collection.length > 0 && _.defer(function() {
            self.listview.setMarker({
                sectionIndex: 0,
                itemIndex: Math.max(7, self.collection.length - 10)
            });
        });
    },
    reload: function() {
        "use strict";
        var self = this;
        var data = _.map(this.collection.models, function(m) {
            return self.modelTranslator ? self.modelTranslator(m) : m[self.modelTranslateMethod]();
        });
        if (this.options.useSetItems) this.section.setItems(data); else {
            this.section = Ti.UI.createListSection({
                items: data
            });
            this.listview.sections = [ this.section ];
        }
        this.endLoading();
    },
    add_defer: function() {
        "use strict";
        var self = this;
        if (this.waitForAdd.length > 0) {
            var data = _.map(this.waitForAdd, function(m) {
                return self.modelTranslator ? self.modelTranslator(m) : m[self.modelTranslateMethod]();
            });
            this.section.insertItemsAt(_.first(this.waitForAdd).__insertAt, data);
            this.waitForAdd = [];
        }
    },
    add: function(model, col, options) {
        "use strict";
        var self = this;
        _.size(this.waitForAdd) > 0 && _.last(this.waitForAdd).__insertAt != options.index - 1 && self.add_defer();
        model.__insertAt = options.index;
        this.waitForAdd.push(model);
        clearTimeout(this.deferAdd);
        this.deferAdd = setTimeout(function() {
            self.add_defer();
        }, 0);
    },
    replace_defer: function() {
        "use strict";
        var self = this;
        if (this.waitForReplace.length > 0) {
            var data = _.map(this.waitForReplace, function(m) {
                return self.modelTranslator ? self.modelTranslator(m) : m[self.modelTranslateMethod]();
            });
            1 == data.length ? this.section.updateItemAt(_.first(this.waitForReplace).__insertAt, data[0]) : this.section.replaceItemsAt(_.first(this.waitForReplace).__insertAt, data.length, data);
            this.waitForReplace = [];
        }
    },
    change: function(model) {
        "use strict";
        var options = {
            index: this.collection.indexOf(model)
        };
        var self = this;
        _.size(this.waitForReplace) > 0 && _.last(this.waitForReplace).__insertAt != options.index - 1 && self.replace_defer();
        model.__insertAt = options.index;
        this.waitForReplace.push(model);
        clearTimeout(this.deferReplace);
        this.deferReplace = setTimeout(function() {
            self.replace_defer();
        }, 0);
        return;
    },
    remove_defer: function() {
        "use strict";
        if (_.size(this.waitForRemove) > 0) {
            this.section.deleteItemsAt(_.last(this.waitForRemove).__deleteAt, this.waitForRemove.length, {
                animationStyle: Titanium.UI.iPhone.RowAnimationStyle.LEFT
            });
            this.waitForRemove = [];
        }
    },
    remove: function(model, col, options) {
        "use strict";
        var self = this;
        _.size(this.waitForRemove) > 0 && _.last(this.waitForRemove).__deleteAt != options.index && self.remove_defer();
        model.__deleteAt = options.index;
        this.waitForRemove.push(model);
        clearTimeout(this.deferRemove);
        this.deferRemove = setTimeout(function() {
            self.remove_defer();
        }, 0);
    }
});

module.exports = ListViewBinder;