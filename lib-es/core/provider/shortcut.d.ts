import TSMind from "..";
export default class shortcut_provider {
    tsm: TSMind;
    opts: ITSMShortcutProvOpts;
    mapping: ITSMShortcutProvOptsMapping;
    handles: ITSMShortcutProvOptsHandles;
    _mapping: ITSMShortcutProvOptsMapping;
    constructor(tsm: TSMind, options: ITSMShortcutProvOpts);
    enable_shortcut: () => void;
    disable_shortcut: () => void;
    handler: (e?: KeyboardEvent) => any;
    handle_addchild: (tsm: TSMind) => void;
    handle_addbrother: (tsm: TSMind) => void;
    handle_editnode: (tsm: TSMind) => void;
    handle_delnode: (tsm: TSMind) => void;
    handle_toggle: (tsm: TSMind, e?: Event) => void;
    handle_up: (tsm: TSMind, e?: Event) => void;
    handle_down: (tsm: TSMind, e?: Event) => void;
    handle_left: (tsm: TSMind, e: any) => void;
    handle_right: (tsm: TSMind, e: any) => void;
    _handle_direction: (tsm: TSMind, e: Event | undefined, d: ITSMDirectionValue) => void;
}
