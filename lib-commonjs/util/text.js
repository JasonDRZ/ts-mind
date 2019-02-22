"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.text = {
    is_empty: function (s) {
        if (!s) {
            return true;
        }
        return s.replace(/\s*/, "").length === 0;
    }
};
