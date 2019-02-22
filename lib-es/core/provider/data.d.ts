import TSMind from "..";
export declare class data_provider {
    private tsm;
    constructor(tsm: TSMind);
    reset: () => void;
    load: (mind_data: ITSMSourceData<any>) => import("../mind").TSM_mind | null;
    get_data: (data_format: "" | "node_array" | "node_tree" | "freemind" | null | undefined) => {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: any;
    } | null;
}
