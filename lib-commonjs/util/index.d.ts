import * as array from "./array";
export declare const util: {
    is_node(node: any): boolean;
    ajax: {
        _xhr(): any;
        _eurl(url: string): string;
        request(url: string, param?: object, method?: "GET" | "POST" | "PUT" | "DELETE", callback?: ITSMAnyCall<any[], any>, fail_callback?: ITSMAnyCall<any[], any>): void;
        get(url: string, callback: ITSMAnyCall<any[], any>): void;
        post(url: string, param: object, callback: ITSMAnyCall<any[], any>): void;
    };
    dom: {
        add_event(target: Element | Document, event: string, call: ITSMAnyCall<any[], any>): void;
        css(cstyle: CSSStyleDeclaration, property_name: string): string;
        is_visible(cstyle: CSSStyleDeclaration): boolean;
    };
    canvas: {
        bezierto(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
        lineto(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
        clear(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
        rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void;
        text_multiline(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number, lineheight: number): void;
        text_ellipsis(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number): void;
        fittingString(ctx: CanvasRenderingContext2D, text: string, max_width: number): string;
        image(ctx: CanvasRenderingContext2D, backgroundUrl: string, x: number, y: number, w: number, h: number, r: number, rotation: number, callback?: () => any): void;
    };
    file: {
        read(file_data: File, fn_callback: ITSMAnyCall<any[], any>): void;
        save(file_data: File, type: string, name: string): void;
    };
    json: {
        json2string(json: JSON): string | null;
        string2json(json_str: string): any;
        merge(b: object, a: object): {};
    };
    uuid: {
        newid(): string;
    };
    text: {
        is_empty(s: any): boolean;
    };
    array: typeof array;
};
export default util;
