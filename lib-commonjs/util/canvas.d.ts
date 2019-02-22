export declare const canvas: {
    bezierto(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
    lineto(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void;
    clear(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
    rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void;
    text_multiline(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number, lineheight: number): void;
    text_ellipsis(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number): void;
    fittingString(ctx: CanvasRenderingContext2D, text: string, max_width: number): string;
    image(ctx: CanvasRenderingContext2D, backgroundUrl: string, x: number, y: number, w: number, h: number, r: number, rotation: number, callback?: () => any): void;
};
