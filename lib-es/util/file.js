import { $doc } from "./tools";
export const file = {
    read(file_data, fn_callback) {
        const reader = new FileReader();
        reader.onload = function () {
            if (typeof fn_callback === "function") {
                fn_callback(this.result, file_data.name);
            }
        };
        reader.readAsText(file_data);
    },
    save(file_data, type, name) {
        let blob;
        const _wind = window;
        if (typeof _wind.Blob === "function") {
            blob = new Blob([file_data], { type });
        }
        else {
            const BlobBuilder = _wind.BlobBuilder || _wind.MozBlobBuilder || _wind.WebKitBlobBuilder || _wind.MSBlobBuilder;
            const bb = new BlobBuilder();
            bb.append(file_data);
            blob = bb.getBlob(type);
        }
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, name);
        }
        else {
            const URL = _wind.URL || _wind.webkitURL;
            const bloburl = URL.createObjectURL(blob);
            const anchor = $doc.createElement("a");
            if ("download" in anchor) {
                anchor.style.visibility = "hidden";
                anchor.href = bloburl;
                anchor.download = name;
                $doc.body.appendChild(anchor);
                const evt = $doc.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                anchor.dispatchEvent(evt);
                $doc.body.removeChild(anchor);
            }
            else {
                location.href = bloburl;
            }
        }
    }
};
