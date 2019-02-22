"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = {
    newid: function () {
        return (new Date().getTime().toString(16) +
            Math.random()
                .toString(16)
                .substr(2)).substr(2, 16);
    }
};
