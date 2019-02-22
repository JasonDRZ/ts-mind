"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_1 = require("./json");
var tools_1 = require("./tools");
exports.ajax = {
    _xhr: function () {
        var xhr = null;
        if ("XMLHttpRequest" in window) {
            xhr = new XMLHttpRequest();
        }
        else {
            try {
                xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) { }
        }
        return xhr;
    },
    _eurl: function (url) {
        return encodeURIComponent(url);
    },
    request: function (url, param, method, callback, fail_callback) {
        if (param === void 0) { param = {}; }
        if (method === void 0) { method = "GET"; }
        if (callback === void 0) { callback = tools_1.$noop; }
        if (fail_callback === void 0) { fail_callback = tools_1.$noop; }
        var a = exports.ajax;
        var p = null;
        var tmp_param = [];
        Object.keys(param).map(function (k) {
            tmp_param.push(a._eurl(k) + "=" + a._eurl(param[k]));
        });
        if (tmp_param.length > 0) {
            p = tmp_param.join("&");
        }
        var xhr = a._xhr();
        if (!xhr) {
            return;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    var data = json_1.json.string2json(xhr.responseText);
                    if (data != null) {
                        callback(data);
                    }
                    else {
                        callback(xhr.responseText);
                    }
                }
                else {
                    fail_callback(xhr);
                    tools_1.$logger.error("xhr request failed.", xhr);
                }
            }
        };
        method = method || "GET";
        xhr.open(method, url, true);
        xhr.setRequestHeader("If-Modified-Since", "0");
        if (method === "POST") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            xhr.send(p);
        }
        else {
            xhr.send();
        }
    },
    get: function (url, callback) {
        return exports.ajax.request(url, {}, "GET", callback);
    },
    post: function (url, param, callback) {
        return exports.ajax.request(url, param, "POST", callback);
    }
};
