export declare const $noop: (...arg: any[]) => any;
export declare const $logger: Console;
export declare const $doc: Document;
export declare function $elByID(id: string): HTMLElement | null;
export declare function $pushText(parent: HTMLElement, txt: string): void;
export declare function $pushChild(parent: HTMLElement, child: any): void;
export declare function $isEl<T extends object>(el: T): boolean;
export declare function $startWith(str: string, beg: string): boolean;
export declare function $isFunc(tar: any): boolean;
export declare const $hasOwnProperty: (v: string | number | symbol) => boolean;
export declare function $isPlainObject(obj: any): any;
export declare function $extend<T extends object = {}>(deep: boolean, ...arg: object[]): T;
export declare function $extend<T extends object = {}>(this: any, ...arg: object[]): T;
export declare function $debounce<T extends any[] = any[]>(handler: ITSMAnyCall<T, void>, tick?: number): {
    (this: any, ...args: T): void;
    clear(): void;
};
