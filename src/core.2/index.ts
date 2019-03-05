import { __version__, DEFAULT_OPTIONS, ITSMOptions } from "../utils/constants";
import { $extend, $noop, $logger } from "../utils/tools";
import { TSM_mind } from "./mind";
import { TSM_node } from "./node";
import { EventManager, globalRegister } from "./event";

export type ITSMClassPlug = new (tsm: TSMind, opts: ITSMOptions) => any;
export type ITSMPlugin =
	| ITSMAnyCall<[TSMind, ITSMOptions], void>
	| ITSMClassPlug;

export type ITSMNode = string | TSM_node;

// mind direction
export const TSMindDirectionMap: { [k: string]: ITSMDirectionValue } = {
	left: -1,
	center: 0,
	right: 1
};
// mind event type
export const TSMindEventTypeMap: { [k: string]: ITSMEventTypeValue } = {
	show: 1,
	resize: 2,
	edit: 3,
	select: 4
};

// mind core class
export class TSMind {
	// public properties
	public options: ITSMOptions;
	public mind: ITSMUnionNull<TSM_mind> = null;

	// static properties
	static version = __version__;
	static directionMap = TSMindDirectionMap;
	static eventTypeMap = TSMindEventTypeMap;
	static globalEvent = globalRegister;

	public readonly isInitialized: boolean = false;

	public EventManager = new EventManager();

	public readonly $logger: $logger;

	constructor(options: ITSMOptions, onReady = $noop) {
		if (!options.container) {
			throw Error("the options.container should not be null or empty.");
		}
		this.options = $extend(true, DEFAULT_OPTIONS, options) as ITSMOptions;
		this.isInitialized = true;
		this.$logger = new $logger(!!options.debug);
		// call ready hook
		onReady(this);
	}
	// register life circle hook
	on = this.EventManager.register;
}

export default TSMind;
