function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function listClick(e) {
        var model = $.collection.at(e.itemIndex);
        DEBUG && Ti.API.debug("MainWin | listClick | model : ", JSON.stringify(model.toJSON(), null, 4));
        var card = Alloy.createController("card");
        card.init(model, FavoritesList);
        card.getView().open();
    }
    function favoriteListClick(e) {
        var model = FavoritesList.collection.at(e.itemIndex);
        DEBUG && Ti.API.debug("MainWin | favoriteListClick | model : ", JSON.stringify(model.toJSON(), null, 4));
        var card = Alloy.createController("card");
        card.init(model, FavoritesList);
        card.getView().open();
    }
    function chooseAll(e) {
        $.listView.show();
        $.filterView.hide();
        $.favoriteListView.hide();
        changeButtonsImage(e.source.id);
    }
    function chooseFilter(e) {
        $.listView.hide();
        $.filterView.show();
        $.favoriteListView.hide();
        $.collection.count({
            where: defaultFilter.where
        }, function(err, count) {
            $.searchResults.text = count + " matches";
        });
        changeButtonsImage(e.source.id);
    }
    function chooseFavorite(e) {
        $.listView.hide();
        $.filterView.hide();
        $.favoriteListView.show();
        changeButtonsImage(e.source.id);
    }
    function changeButtonsImage(id) {
        buttonNames.forEach(function(e) {
            $[e.id].backgroundImage = "/images/MainWin/" + e.image + "_" + (e.id == id ? "on" : "off") + ".png";
        });
    }
    function filterAC() {
        var opts = {
            options: [ "all" ]
        };
        for (var i = 5; 25 >= i; i++) opts.options.push(i);
        var dialog = Ti.UI.createOptionDialog(opts);
        dialog.addEventListener("click", function(e) {
            var index = e.index < 0 ? 0 : e.index;
            0 == index ? delete defaultFilter.where["ac"] : defaultFilter.where["ac"] = opts.options[index];
            $.searchAC.title = "AC : " + opts.options[index];
            $.collection.count({
                where: defaultFilter.where
            }, function(err, count) {
                $.searchResults.text = count + " matches";
            });
        });
        dialog.show();
    }
    function filterChallenge() {
        var opts = {
            options: [ "all", "1/8", "1/4", "1/2" ]
        };
        for (var i = 0; 21 >= i; i++) opts.options.push(i);
        var dialog = Ti.UI.createOptionDialog(opts);
        dialog.addEventListener("click", function(e) {
            var index = e.index < 0 ? 0 : e.index;
            0 == index ? delete defaultFilter.where["lvl"] : defaultFilter.where["lvl"] = opts.options[index];
            $.searchChallenge.title = "Challenge : " + opts.options[index];
            $.collection.count({
                where: defaultFilter.where
            }, function(err, count) {
                $.searchResults.text = count + " matches";
            });
        });
        dialog.show();
    }
    function filterAligment() {
        var opts = {
            options: [ "all", "unaligned", "lawful good", "neutral good", "chaotic good", "lawful neutral", "neutral neutral", "chaotic neutral", "lawful evil", "neutral evil", "chaotic evil" ]
        };
        var dialog = Ti.UI.createOptionDialog(opts);
        dialog.addEventListener("click", function(e) {
            var index = e.index < 0 ? 0 : e.index;
            0 == index ? delete defaultFilter.where["alignment"] : defaultFilter.where["alignment"] = opts.options[index];
            $.searchAligment.title = "Aligment : " + opts.options[index];
            $.collection.count({
                where: defaultFilter.where
            }, function(err, count) {
                $.searchResults.text = count + " matches";
            });
        });
        dialog.show();
    }
    function filterType() {
        var opts = {
            options: [ "all", "aberration", "beast", "construct", "dragon", "elemental", "giant", "humanoid", "ooze", "monstrosity", "celestial", "fey", "fiend", "plant", "undead" ]
        };
        var dialog = Ti.UI.createOptionDialog(opts);
        dialog.addEventListener("click", function(e) {
            var index = e.index < 0 ? 0 : e.index;
            0 == index ? delete defaultFilter.where["type"] : defaultFilter.where["type"] = opts.options[index];
            $.searchType.title = "Type : " + opts.options[index];
            $.collection.count({
                where: defaultFilter.where
            }, function(err, count) {
                $.searchResults.text = count + " matches";
            });
        });
        dialog.show();
    }
    function applyFilter() {
        $.collection.initialize(defaultFilter);
        $.collection.reload();
        chooseAll({
            source: {
                id: "listButton"
            }
        });
    }
    function resetFilter() {
        $.collection.count({
            where: defaultFilter.where
        }, function(err, count) {
            $.searchResults.text = count + " matches";
        });
        defaultFilter = {
            where: {},
            limit: 10
        };
        $.searchAC.title = "AC : all";
        $.searchChallenge.title = "Challenge : all";
        $.searchAligment.title = "Aligment : all";
        $.searchType.title = "Type : all";
        applyFilter();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        title: "Center Window",
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.container = Ti.UI.createView({
        backgroundColor: "#343535",
        id: "container"
    });
    $.__views.index.add($.__views.container);
    $.__views.controls = Ti.UI.createView({
        top: 0,
        left: 0,
        width: Ti.UI.FILL,
        height: 40,
        layout: "horizontal",
        id: "controls"
    });
    $.__views.container.add($.__views.controls);
    $.__views.listButton = Ti.UI.createButton({
        top: 5,
        left: "8%",
        width: "28%",
        height: 30,
        color: "black",
        backgroundImage: "/images/MainWin/lb_on.png",
        id: "listButton",
        title: "List"
    });
    $.__views.controls.add($.__views.listButton);
    chooseAll ? $.addListener($.__views.listButton, "click", chooseAll) : __defers["$.__views.listButton!click!chooseAll"] = true;
    $.__views.filterButton = Ti.UI.createButton({
        top: 5,
        left: 0,
        width: "28%",
        height: 30,
        color: "black",
        backgroundImage: "/images/MainWin/lf_off.png",
        id: "filterButton",
        title: "Filter"
    });
    $.__views.controls.add($.__views.filterButton);
    chooseFilter ? $.addListener($.__views.filterButton, "click", chooseFilter) : __defers["$.__views.filterButton!click!chooseFilter"] = true;
    $.__views.favouriteButton = Ti.UI.createButton({
        top: 5,
        left: 0,
        width: "28%",
        height: 30,
        color: "black",
        backgroundImage: "/images/MainWin/ls_off.png",
        id: "favouriteButton",
        title: "Favorite"
    });
    $.__views.controls.add($.__views.favouriteButton);
    chooseFavorite ? $.addListener($.__views.favouriteButton, "click", chooseFavorite) : __defers["$.__views.favouriteButton!click!chooseFavorite"] = true;
    var __alloyId1 = {};
    var __alloyId4 = [];
    var __alloyId5 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            font: {
                fontSize: "16pt",
                fontFamily: "Deutsch-Gothic"
            },
            color: "white",
            textAlign: "center",
            bindId: "title"
        }
    };
    __alloyId4.push(__alloyId5);
    var __alloyId6 = {
        type: "Ti.UI.Label",
        bindId: "challenge",
        properties: {
            top: 5,
            right: 5,
            font: {
                fontSize: "8pt",
                fontFamily: "Deutsch-Gothic"
            },
            color: "red",
            textAlign: "right",
            bindId: "challenge"
        }
    };
    __alloyId4.push(__alloyId6);
    var __alloyId3 = {
        properties: {
            name: "defaultTemplate",
            height: "100"
        },
        childTemplates: __alloyId4
    };
    __alloyId1["defaultTemplate"] = __alloyId3;
    $.__views.defaultListSection = Ti.UI.createListSection({
        id: "defaultListSection"
    });
    var __alloyId8 = [];
    __alloyId8.push($.__views.defaultListSection);
    $.__views.listView = Ti.UI.createListView({
        top: 40,
        left: 0,
        sections: __alloyId8,
        templates: __alloyId1,
        id: "listView",
        defaultItemTemplate: "defaultTemplate",
        allowsSelection: "true"
    });
    $.__views.container.add($.__views.listView);
    listClick ? $.addListener($.__views.listView, "itemclick", listClick) : __defers["$.__views.listView!itemclick!listClick"] = true;
    $.__views.filterView = Ti.UI.createView({
        top: 40,
        left: 0,
        right: 0,
        bottom: 0,
        visible: false,
        id: "filterView"
    });
    $.__views.container.add($.__views.filterView);
    $.__views.searchAC = Ti.UI.createButton({
        top: 10,
        width: 250,
        height: 50,
        id: "searchAC",
        title: "AC : all"
    });
    $.__views.filterView.add($.__views.searchAC);
    filterAC ? $.addListener($.__views.searchAC, "click", filterAC) : __defers["$.__views.searchAC!click!filterAC"] = true;
    $.__views.searchChallenge = Ti.UI.createButton({
        top: 70,
        width: 250,
        height: 50,
        id: "searchChallenge",
        title: "Challenge : all"
    });
    $.__views.filterView.add($.__views.searchChallenge);
    filterChallenge ? $.addListener($.__views.searchChallenge, "click", filterChallenge) : __defers["$.__views.searchChallenge!click!filterChallenge"] = true;
    $.__views.searchAligment = Ti.UI.createButton({
        top: 130,
        width: 250,
        height: 50,
        id: "searchAligment",
        title: "Aligment : all"
    });
    $.__views.filterView.add($.__views.searchAligment);
    filterAligment ? $.addListener($.__views.searchAligment, "click", filterAligment) : __defers["$.__views.searchAligment!click!filterAligment"] = true;
    $.__views.searchType = Ti.UI.createButton({
        top: 190,
        width: 250,
        height: 50,
        id: "searchType",
        title: "Type : all"
    });
    $.__views.filterView.add($.__views.searchType);
    filterType ? $.addListener($.__views.searchType, "click", filterType) : __defers["$.__views.searchType!click!filterType"] = true;
    $.__views.searchResults = Ti.UI.createLabel({
        height: 40,
        bottom: 40,
        font: {
            fontSize: "8pt",
            fontFamily: "Deutsch-Gothic"
        },
        color: "white",
        textAlign: "center",
        id: "searchResults"
    });
    $.__views.filterView.add($.__views.searchResults);
    $.__views.searchApply = Ti.UI.createButton({
        left: 5,
        bottom: 5,
        width: "49%",
        height: 50,
        id: "searchApply",
        title: "Apply"
    });
    $.__views.filterView.add($.__views.searchApply);
    applyFilter ? $.addListener($.__views.searchApply, "click", applyFilter) : __defers["$.__views.searchApply!click!applyFilter"] = true;
    $.__views.searchReset = Ti.UI.createButton({
        right: 5,
        bottom: 5,
        width: "49%",
        height: 50,
        id: "searchReset",
        title: "Reset"
    });
    $.__views.filterView.add($.__views.searchReset);
    resetFilter ? $.addListener($.__views.searchReset, "click", resetFilter) : __defers["$.__views.searchReset!click!resetFilter"] = true;
    var __alloyId9 = {};
    var __alloyId12 = [];
    var __alloyId13 = {
        type: "Ti.UI.Label",
        bindId: "title",
        properties: {
            font: {
                fontSize: "16pt",
                fontFamily: "Deutsch-Gothic"
            },
            color: "white",
            textAlign: "center",
            bindId: "title"
        }
    };
    __alloyId12.push(__alloyId13);
    var __alloyId14 = {
        type: "Ti.UI.Label",
        bindId: "challenge",
        properties: {
            top: 5,
            right: 5,
            font: {
                fontSize: "8pt",
                fontFamily: "Deutsch-Gothic"
            },
            color: "red",
            textAlign: "right",
            bindId: "challenge"
        }
    };
    __alloyId12.push(__alloyId14);
    var __alloyId11 = {
        properties: {
            name: "favoriteTemplate",
            height: "100"
        },
        childTemplates: __alloyId12
    };
    __alloyId9["favoriteTemplate"] = __alloyId11;
    $.__views.favoriteListSection = Ti.UI.createListSection({
        id: "favoriteListSection"
    });
    var __alloyId16 = [];
    __alloyId16.push($.__views.favoriteListSection);
    $.__views.favoriteListView = Ti.UI.createListView({
        top: 40,
        left: 0,
        visible: false,
        sections: __alloyId16,
        templates: __alloyId9,
        id: "favoriteListView",
        defaultItemTemplate: "favoriteTemplate",
        allowsSelection: "true"
    });
    $.__views.container.add($.__views.favoriteListView);
    favoriteListClick ? $.addListener($.__views.favoriteListView, "itemclick", favoriteListClick) : __defers["$.__views.favoriteListView!itemclick!favoriteListClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var ListViewBinder = require("ListViewBinder");
    arguments[0] || {};
    var DEBUG = true;
    var FavoritesList = require("FavoritesList");
    var defaultFilter = {
        where: {},
        limit: 10
    };
    $.collection = Alloy.createCollection("Monster");
    $.binder = new ListViewBinder({
        listview: $.listView,
        section: $.defaultListSection,
        collection: $.collection
    });
    $.binder.bind();
    $.collection.initialize(defaultFilter);
    $.collection.reload();
    DEBUG && Ti.API.debug("index | FavoritesList.collection.length : ", FavoritesList.collection.length);
    $.favoriteBinder = new ListViewBinder({
        listview: $.favoriteListView,
        section: $.favoriteListSection,
        collection: FavoritesList.collection
    });
    $.favoriteBinder.bind();
    FavoritesList.refresh();
    var buttonNames = [ {
        id: "listButton",
        image: "lb"
    }, {
        id: "filterButton",
        image: "lf"
    }, {
        id: "favouriteButton",
        image: "ls"
    } ];
    $.index.addEventListener("open", function() {
        $.index.activity.actionBar.hide();
    });
    $.index.open();
    __defers["$.__views.listButton!click!chooseAll"] && $.addListener($.__views.listButton, "click", chooseAll);
    __defers["$.__views.filterButton!click!chooseFilter"] && $.addListener($.__views.filterButton, "click", chooseFilter);
    __defers["$.__views.favouriteButton!click!chooseFavorite"] && $.addListener($.__views.favouriteButton, "click", chooseFavorite);
    __defers["$.__views.listView!itemclick!listClick"] && $.addListener($.__views.listView, "itemclick", listClick);
    __defers["$.__views.searchAC!click!filterAC"] && $.addListener($.__views.searchAC, "click", filterAC);
    __defers["$.__views.searchChallenge!click!filterChallenge"] && $.addListener($.__views.searchChallenge, "click", filterChallenge);
    __defers["$.__views.searchAligment!click!filterAligment"] && $.addListener($.__views.searchAligment, "click", filterAligment);
    __defers["$.__views.searchType!click!filterType"] && $.addListener($.__views.searchType, "click", filterType);
    __defers["$.__views.searchApply!click!applyFilter"] && $.addListener($.__views.searchApply, "click", applyFilter);
    __defers["$.__views.searchReset!click!resetFilter"] && $.addListener($.__views.searchReset, "click", resetFilter);
    __defers["$.__views.favoriteListView!itemclick!favoriteListClick"] && $.addListener($.__views.favoriteListView, "itemclick", favoriteListClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;