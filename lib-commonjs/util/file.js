"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
exports.file = {
    read: function (file_data, fn_callback) {
        var reader = new FileReader();
        reader.onload = function () {
            if (typeof fn_callback === "function") {
                fn_callback(this.result, file_data.name);
            }
        };
        reader.readAsText(file_data);
    },
    save: function (file_data, type, name) {
        var blob;
        var _wind = window;
        if (typeof _wind.Blob === "function") {
            blob = new Blob([file_data], { type: type });
        }
        else {
            var BlobBuilder = _wind.BlobBuilder || _wind.MozBlobBuilder || _wind.WebKitBlobBuilder || _wind.MSBlobBuilder;
            var bb = new BlobBuilder();
            bb.append(file_data);
            blob = bb.getBlob(type);
        }
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, name);
        }
        else {
            var URL_1 = _wind.URL || _wind.webkitURL;
            var bloburl = URL_1.createObjectURL(blob);
            var anchor = tools_1.$doc.createElement("a");
            if ("download" in anchor) {
                anchor.style.visibility = "hidden";
                anchor.href = bloburl;
                anchor.download = name;
                tools_1.$doc.body.appendChild(anchor);
                var evt = tools_1.$doc.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                anchor.dispatchEvent(evt);
                tools_1.$doc.body.removeChild(anchor);
            }
            else {
                location.href = bloburl;
            }
        }
    }
};
