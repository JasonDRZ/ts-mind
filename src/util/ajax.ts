import { $logger, $noop } from "./tools";

function _xhr() {
	let xhr = null;
	if ("XMLHttpRequest" in window) {
		xhr = new XMLHttpRequest();
	} else {
		try {
			xhr = new (window as any).ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
	}
	return xhr;
}
function _eurl(url: string) {
	return encodeURIComponent(url);
}

function _formatParams(param: object) {
	let p = null;
	const tmp_param: string[] = [];
	Object.keys(param).map(k => {
		tmp_param.push(_eurl(k) + "=" + _eurl(param[k]));
	});
	if (tmp_param.length > 0) {
		p = tmp_param.join("&");
	}
	return p;
}

export function _string2json(json_str: string) {
	if (!!JSON) {
		try {
			const json = JSON.parse(json_str);
			return json;
		} catch (e) {
			$logger.warn(e);
			$logger.warn("can not parse to json");
			return json_str;
		}
	}
}

export function ajax(
	url: string,
	param: object = {},
	method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
	callback: ITSMAnyCall = $noop,
	fail_callback: ITSMAnyCall = $noop
) {
	const paramStr = _formatParams(param);
	const xhr = _xhr();
	if (!xhr) {
		throw Error("This broswer dose not support [XMLHttpRequest] feature!");
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200 || xhr.status === 0) {
				const data = _string2json(xhr.responseText);
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
	xhr.open(method, url, true);
	xhr.setRequestHeader("If-Modified-Since", "0");
	if (method === "POST") {
		xhr.setRequestHeader(
			"Content-Type",
			"application/x-www-form-urlencoded;charset=utf-8"
		);
		xhr.send(paramStr);
	} else {
		xhr.send();
	}
}
ajax.get = get;
ajax.post = post;
export function get(url: string, callback: ITSMAnyCall) {
	return ajax(url, {}, "GET", callback);
}
export function post(url: string, param: object, callback: ITSMAnyCall) {
	return ajax(url, param, "POST", callback);
}
