import { json } from "./json";
import { $logger, $noop } from "./tools";

export const ajax = {
  _xhr() {
    let xhr = null;
    if ("XMLHttpRequest" in window) {
      xhr = new XMLHttpRequest();
    } else {
      try {
        xhr = new (window as any).ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
    }
    return xhr;
  },
  _eurl(url: string) {
    return encodeURIComponent(url);
  },
  request(
    url: string,
    param: object = {},
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    callback: ITSMAnyCall = $noop,
    fail_callback: ITSMAnyCall = $noop
  ) {
    const a = ajax;
    let p = null;
    const tmp_param: string[] = [];
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
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          const data = json.string2json(xhr.responseText);
          if (data != null) {
            callback(data);
          } else {
            callback(xhr.responseText);
          }
        } else {
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
    } else {
      xhr.send();
    }
  },
  get(url: string, callback: ITSMAnyCall) {
    return ajax.request(url, {}, "GET", callback);
  },
  post(url: string, param: object, callback: ITSMAnyCall) {
    return ajax.request(url, param, "POST", callback);
  }
};
