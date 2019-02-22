"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvas = {
    bezierto: function (ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + ((x2 - x1) * 2) / 3, y1, x1, y2, x2, y2);
        ctx.stroke();
    },
    lineto: function (ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },
    clear: function (ctx, x, y, w, h) {
        ctx.clearRect(x, y, w, h);
    },
    rect: function (ctx, x, y, w, h, r) {
        if (w < 2 * r)
            r = w / 2;
        if (h < 2 * r)
            r = h / 2;
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
    },
    text_multiline: function (ctx, text, x, y, w, h, lineheight) {
        var line = "";
        var text_len = text.length;
        var chars = text.split("");
        var test_line = null;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        for (var i = 0; i < text_len; i++) {
            test_line = line + chars[i];
            if (ctx.measureText(test_line).width > w && i > 0) {
                ctx.fillText(line, x, y);
                line = chars[i];
                y += lineheight;
            }
            else {
                line = test_line;
            }
        }
        ctx.fillText(line, x, y);
    },
    text_ellipsis: function (ctx, text, x, y, w, h) {
        var center_y = y + h / 2;
        text = exports.canvas.fittingString(ctx, text, w);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, center_y, w);
    },
    fittingString: function (ctx, text, max_width) {
        var width = ctx.measureText(text).width;
        var ellipsis = "…";
        var ellipsis_width = ctx.measureText(ellipsis).width;
        if (width <= max_width || width <= ellipsis_width) {
            return text;
        }
        else {
            var len = text.length;
            while (width >= max_width - ellipsis_width && len-- > 0) {
                text = text.substring(0, len);
                width = ctx.measureText(text).width;
            }
            return text + ellipsis;
        }
    },
    image: function (ctx, backgroundUrl, x, y, w, h, r, rotation, callback) {
        if (callback === void 0) { callback = function () { }; }
        var img = new Image();
        img.onload = function () {
            ctx.save();
            ctx.translate(x, y);
            ctx.save();
            ctx.beginPath();
            exports.canvas.rect(ctx, 0, 0, w, h, r);
            ctx.closePath();
            ctx.clip();
            ctx.translate(w / 2, h / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -w / 2, -h / 2);
            ctx.restore();
            ctx.restore();
            callback();
        };
        img.src = backgroundUrl;
    }
};
