import TSMind from "..";
import { ITSMOptions } from "../../util/constants";
import { TSM_node } from "../node";
export default class screenshot {
    tsm: TSMind;
    options: ITSMOptions;
    canvas_elem: ITSMUnionNull<HTMLCanvasElement>;
    canvas_ctx: ITSMUnionNull<CanvasRenderingContext2D>;
    _inited: boolean;
    constructor(tsm: TSMind, opts: ITSMOptions);
    init(): void;
    shoot: (callback: ITSMAnyCall<any[], any>) => void;
    shootDownload: () => void;
    shootAsDataURL: (callback: ITSMAnyCall<any[], any>) => void;
    resize: () => void;
    clean: () => void;
    _draw: (callback: ITSMAnyCall<any[], any>) => void;
    _watermark: () => void;
    _draw_lines: () => void;
    _draw_nodes: (callback: ITSMAnyCall<any[], any>) => void;
    _draw_node: (node: TSM_node) => void;
    _draw_expander: (expander: HTMLElement) => void;
    _download: () => void;
    event_handle: (type: ITSMEventTypeValue) => void;
}
