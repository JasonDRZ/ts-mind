import { json } from "./json";
import { $logger, $noop } from "./tools";
export const ajax = {
    _xhr() {
        let xhr = null;
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
    _eurl(url) {
        return encodeURIComponent(url);
    },
    request(url, param = {}, method = "GET", callback = $noop, fail_callback = $noop) {
        const a = ajax;
        let p = null;
        const tmp_param = [];
        Object.keys(param).map(k => {
            tmp_param.push(a._eurl(k) + "=" + a._eurl(param[k]));
        });
        if (tmp_param.length > 0) {
            p = tmp_param.join("&");
        }
        const xhr = a._xhr();
        if (!xhr) {
            return;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    const data = json.string2json(xhr.responseText);
                    if (data != null) {
                        callback(data);
                    }
                    else {
                        callback(xhr.responseText);
                    }
                }
                else {
                    fail_callback(xhr);
                    $logger.error("xhr request failed.", xhr);
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
    get(url, callback) {
        return ajax.request(url, {}, "GET", callback);
    },
    post(url, param, callback) {
        return ajax.request(url, param, "POST", callback);
    }
};
