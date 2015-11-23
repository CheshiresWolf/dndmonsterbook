function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function isInList(attr) {
        for (var i = 0; i < keysList.length; i++) if (attr == keysList[i]) return true;
        return false;
    }
    function setFavourite() {
        var starTrigger = null != FavoritesList.findByName(modelName);
        DEBUG && Ti.API.debug("card | setFavourite | starTrigger : ", starTrigger);
        $.star.backgroundImage = "/images/MainWin/star_" + (starTrigger ? "off" : "on") + ".png";
        starTrigger ? FavoritesList.remove(currentModel) : FavoritesList.add(currentModel);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "card";
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
    $.__views.cardWindow = Ti.UI.createWindow({
        backgroundImage: "/images/MainWin/parchment2.jpg",
        modal: "true",
        id: "cardWindow"
    });
    $.__views.cardWindow && $.addTopLevelView($.__views.cardWindow);
    $.__views.__alloyId0 = Ti.UI.createScrollView({
        id: "__alloyId0"
    });
    $.__views.cardWindow.add($.__views.__alloyId0);
    $.__views.statBox = Ti.UI.createView({
        top: 70,
        left: "11%",
        width: "78%",
        height: 70,
        backgroundImage: "/images/MainWin/stat.png",
        id: "statBox"
    });
    $.__views.__alloyId0.add($.__views.statBox);
    $.__views.armorclass = Ti.UI.createLabel({
        textAlign: "center",
        top: 0,
        left: 0,
        width: "50%",
        height: 20,
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "white",
        id: "armorclass"
    });
    $.__views.statBox.add($.__views.armorclass);
    $.__views.hitpoints = Ti.UI.createLabel({
        textAlign: "center",
        top: 0,
        right: 0,
        width: "50%",
        height: 20,
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "white",
        id: "hitpoints"
    });
    $.__views.statBox.add($.__views.hitpoints);
    $.__views.statLabels = Ti.UI.createView({
        top: 20,
        left: 0,
        width: "100%",
        height: 20,
        layout: "horizontal",
        color: "white",
        id: "statLabels"
    });
    $.__views.statBox.add($.__views.statLabels);
    $.__views.statLabels_str = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "Str",
        id: "statLabels_str"
    });
    $.__views.statLabels.add($.__views.statLabels_str);
    $.__views.statLabels_dex = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "Dex",
        id: "statLabels_dex"
    });
    $.__views.statLabels.add($.__views.statLabels_dex);
    $.__views.statLabels_con = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "Con",
        id: "statLabels_con"
    });
    $.__views.statLabels.add($.__views.statLabels_con);
    $.__views.statLabels_int = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "Int",
        id: "statLabels_int"
    });
    $.__views.statLabels.add($.__views.statLabels_int);
    $.__views.statLabels_wis = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "Wis",
        id: "statLabels_wis"
    });
    $.__views.statLabels.add($.__views.statLabels_wis);
    $.__views.statLabels_cha = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "Cha",
        id: "statLabels_cha"
    });
    $.__views.statLabels.add($.__views.statLabels_cha);
    $.__views.statValues = Ti.UI.createView({
        top: 45,
        left: 0,
        width: "100%",
        height: 20,
        layout: "horizontal",
        id: "statValues"
    });
    $.__views.statBox.add($.__views.statValues);
    $.__views.statValues_str = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "0",
        id: "statValues_str"
    });
    $.__views.statValues.add($.__views.statValues_str);
    $.__views.statValues_dex = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "0",
        id: "statValues_dex"
    });
    $.__views.statValues.add($.__views.statValues_dex);
    $.__views.statValues_con = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "0",
        id: "statValues_con"
    });
    $.__views.statValues.add($.__views.statValues_con);
    $.__views.statValues_int = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "0",
        id: "statValues_int"
    });
    $.__views.statValues.add($.__views.statValues_int);
    $.__views.statValues_wis = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "0",
        id: "statValues_wis"
    });
    $.__views.statValues.add($.__views.statValues_wis);
    $.__views.statValues_cha = Ti.UI.createLabel({
        width: "16.67%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold"
        },
        color: "black",
        textAlign: "center",
        text: "0",
        id: "statValues_cha"
    });
    $.__views.statValues.add($.__views.statValues_cha);
    $.__views.anotherBox = Ti.UI.createView({
        top: 150,
        left: "5%",
        width: "90%",
        layout: "vertical",
        id: "anotherBox"
    });
    $.__views.__alloyId0.add($.__views.anotherBox);
    $.__views.topBox = Ti.UI.createView({
        top: 0,
        left: 0,
        width: "100%",
        height: 50,
        backgroundImage: "/images/MainWin/parchment2_top.png",
        id: "topBox"
    });
    $.__views.cardWindow.add($.__views.topBox);
    $.__views.name = Ti.UI.createLabel({
        top: 10,
        left: 0,
        width: "100%",
        font: {
            fontSize: "20dp",
            fontFamily: "HelveticaNeue-CondensedBold",
            fontWeight: "bold"
        },
        color: "black",
        textAlign: "center",
        id: "name"
    });
    $.__views.topBox.add($.__views.name);
    $.__views.challenge = Ti.UI.createLabel({
        textAlign: "center",
        top: 40,
        right: 0,
        width: "100%",
        font: {
            fontSize: "12dp",
            fontFamily: "HelveticaNeue-CondensedBold",
            fontWeight: "bold"
        },
        color: "black",
        id: "challenge"
    });
    $.__views.topBox.add($.__views.challenge);
    $.__views.star = Ti.UI.createButton({
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        backgroundImage: "/images/MainWin/star_off.png",
        id: "star"
    });
    $.__views.topBox.add($.__views.star);
    setFavourite ? $.addListener($.__views.star, "click", setFavourite) : __defers["$.__views.star!click!setFavourite"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var DEBUG = true;
    var keysList = [ "name", "size", "armor", "hp", "str", "dex", "con", "inteligence", "wis", "cha", "Challenge", "id", "lvl", "ac" ];
    var modelName = null;
    var currentModel = null;
    var FavoritesList = null;
    $.init = function(model, list) {
        modelName = model.get("name");
        $.name.text = modelName;
        currentModel = model;
        FavoritesList = list;
        var starTrigger = null != FavoritesList.findByName(modelName);
        starTrigger && ($.star.backgroundImage = "/images/MainWin/star_on.png");
        $.challenge.text = model.get("Challenge");
        $.armorclass.text = model.get("armor").replace("Armor Class", "AC :");
        $.hitpoints.text = model.get("hp").replace("Hit Points", "Hp :");
        $.statValues_str.text = model.get("str");
        $.statValues_dex.text = model.get("dex");
        $.statValues_con.text = model.get("con");
        $.statValues_int.text = model.get("inteligence");
        $.statValues_wis.text = model.get("wis");
        $.statValues_cha.text = model.get("cha");
        model.set({
            speed: model.get("speed").replace("Speed ", "")
        });
        for (var attr in model.attributes) if (!isInList(attr)) {
            $.anotherBox.add(Ti.UI.createLabel({
                text: attr,
                font: {
                    fontSize: "8pt",
                    fontFamily: "Deutsch-Gothic"
                },
                color: "black"
            }));
            $.anotherBox.add(Ti.UI.createLabel({
                text: model.get(attr),
                font: {
                    fontSize: "8pt",
                    fontFamily: "HelveticaNeue-CondensedBold"
                },
                color: "black",
                textAlign: "left"
            }));
        }
    };
    $.cardWindow.addEventListener("open", function() {
        $.cardWindow.activity.actionBar.hide();
    });
    __defers["$.__views.star!click!setFavourite"] && $.addListener($.__views.star, "click", setFavourite);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;