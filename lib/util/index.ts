import { TSM_node } from "../core/node";
import { canvas } from "./canvas";
import { file } from "./file";
import { json } from "./json";
import { ajax } from "./ajax";
import { dom } from "./dom";
import { uuid } from "./uuid";
import { text } from "./text";
import * as array from "./array";

export const util = {
  is_node(node: any) {
    return node instanceof TSM_node;
  },
  ajax,

  dom,

  canvas,

  file,

  json,

  uuid,

  text,

  array
};

export default util;
