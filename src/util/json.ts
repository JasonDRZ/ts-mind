import { $logger } from "./tools";

export function json2string(json: JSON) {
	if (!!JSON) {
		try {
			const json_str = JSON.stringify(json);
			return json_str;
		} catch (e) {
			$logger.warn(e);
			$logger.warn("can not convert to string");
			return null;
		}
	}
	return null;
}
