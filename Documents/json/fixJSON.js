var fs = require('fs');

function guid() {

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function requireJSON(file) {
    var obj = fs.readFileSync(file);
    return JSON.parse(obj);
}

function saveJSON(path, array) {
    fs.writeFileSync(path, JSON.stringify(array, null, 4));
}

var inputJSON = requireJSON("monsterList.json");

for (var i = 0; i < inputJSON.length; i++) {
    if (inputJSON[i].id == undefined) {
        inputJSON[i].id = guid();
    }

    if (inputJSON[i]["Challenge"] != undefined) {
        inputJSON[i]["lvl"] = inputJSON[i]["Challenge"].split(" ")[0];
    }

    if (inputJSON[i]["armor"] != undefined) {
        inputJSON[i]["ac"] = inputJSON[i]["armor"].split(" ")[2];
    }
}

saveJSON("monsterList2.json", inputJSON);