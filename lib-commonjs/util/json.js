"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
exports.json = {
    json2string: function (json) {
        if (!!JSON) {
            try {
                var json_str = JSON.stringify(json);
                return json_str;
            }
            catch (e) {
                tools_1.$logger.warn(e);
                tools_1.$logger.warn("can not convert to string");
                return null;
            }
        }
        return null;
    },
    string2json: function (json_str) {
        if (!!JSON) {
            try {
                var json_1 = JSON.parse(json_str);
                return json_1;
            }
            catch (e) {
                tools_1.$logger.warn(e);
                tools_1.$logger.warn("can not parse to json");
                return null;
            }
        }
    },
    merge: function (b, a) {
        return tools_1.$extend(b, a);
    }
};
