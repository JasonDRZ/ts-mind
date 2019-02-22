export declare const ajax: {
    _xhr(): any;
    _eurl(url: string): string;
    request(url: string, param?: object, method?: "GET" | "POST" | "PUT" | "DELETE", callback?: ITSMAnyCall<any[], any>, fail_callback?: ITSMAnyCall<any[], any>): void;
    get(url: string, callback: ITSMAnyCall<any[], any>): void;
    post(url: string, param: object, callback: ITSMAnyCall<any[], any>): void;
};
