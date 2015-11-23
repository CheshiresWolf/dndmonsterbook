function getValue(inputValue) {
    var buf = inputValue.split(" ");
    return buf[2];
}

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {},
    extendModel: function(Model) {
        _.extend(Model.prototype, require("LocalJson").Model);
        _.extend(Model.prototype, {
            translate: function() {
                var self = this.toJSON();
                return {
                    title: {
                        text: self.name
                    },
                    challenge: {
                        text: self.Challenge
                    },
                    str: {
                        text: self.str
                    },
                    dex: {
                        text: self.dex
                    },
                    con: {
                        text: self.con
                    },
                    inteligence: {
                        text: self.inteligence
                    },
                    wis: {
                        text: self.wis
                    },
                    cha: {
                        text: self.cha
                    },
                    ac: {
                        text: getValue(self.armor)
                    },
                    hp: {
                        text: "~" + getValue(self.hp)
                    },
                    fullStat: {
                        text: "S : " + self.str + " | D : " + self.dex + " | C : " + self.con + " | I : " + self.inteligence + " | W : " + self.wis + " | C : " + self.cha + " | AC : " + getValue(self.armor) + " | Hp : ~" + getValue(self.hp)
                    },
                    raw: self
                };
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, require("LocalJson").Collection);
        return Collection;
    }
};

model = Alloy.M("Monster", exports.definition, []);

collection = Alloy.C("Monster", exports.definition, model);

exports.Model = model;

exports.Collection = collection;