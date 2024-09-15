'use strict';

var obsidian = require('obsidian');

const modifiers = /^(CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|AltGr|Option|Alt|Shift|Super)/i;
const keyCodes = /^(Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z)!@#$%^&*(:+<_>?~{|}";=,\-./`[\\\]'])/i;
const UNSUPPORTED = {};

function _command(accelerator, event, modifier) {
	if (process.platform !== 'darwin') {
		return UNSUPPORTED;
	}

	if (event.metaKey) {
		throw new Error('Double `Command` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {metaKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _super(accelerator, event, modifier) {
	if (event.metaKey) {
		throw new Error('Double `Super` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {metaKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _commandorcontrol(accelerator, event, modifier) {
	if (process.platform === 'darwin') {
		if (event.metaKey) {
			throw new Error('Double `Command` modifier specified.');
		}

		return {
			event: Object.assign({}, event, {metaKey: true}),
			accelerator: accelerator.slice(modifier.length)
		};
	}

	if (event.ctrlKey) {
		throw new Error('Double `Control` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {ctrlKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _alt(accelerator, event, modifier) {
	if (modifier === 'option' && process.platform !== 'darwin') {
		return UNSUPPORTED;
	}

	if (event.altKey) {
		throw new Error('Double `Alt` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {altKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _shift(accelerator, event, modifier) {
	if (event.shiftKey) {
		throw new Error('Double `Shift` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {shiftKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _control(accelerator, event, modifier) {
	if (event.ctrlKey) {
		throw new Error('Double `Control` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {ctrlKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function reduceModifier({accelerator, event}, modifier) {
	switch (modifier) {
		case 'command':
		case 'cmd': {
			return _command(accelerator, event, modifier);
		}

		case 'super': {
			return _super(accelerator, event, modifier);
		}

		case 'control':
		case 'ctrl': {
			return _control(accelerator, event, modifier);
		}

		case 'commandorcontrol':
		case 'cmdorctrl': {
			return _commandorcontrol(accelerator, event, modifier);
		}

		case 'option':
		case 'altgr':
		case 'alt': {
			return _alt(accelerator, event, modifier);
		}

		case 'shift': {
			return _shift(accelerator, event, modifier);
		}

		default:
			console.error(modifier);
	}
}

function reducePlus({accelerator, event}) {
	return {
		event,
		accelerator: accelerator.trim().slice(1)
	};
}

const virtualKeyCodes = {
	0: 'Digit0',
	1: 'Digit1',
	2: 'Digit2',
	3: 'Digit3',
	4: 'Digit4',
	5: 'Digit5',
	6: 'Digit6',
	7: 'Digit7',
	8: 'Digit8',
	9: 'Digit9',
	'-': 'Minus',
	'=': 'Equal',
	Q: 'KeyQ',
	W: 'KeyW',
	E: 'KeyE',
	R: 'KeyR',
	T: 'KeyT',
	Y: 'KeyY',
	U: 'KeyU',
	I: 'KeyI',
	O: 'KeyO',
	P: 'KeyP',
	'[': 'BracketLeft',
	']': 'BracketRight',
	A: 'KeyA',
	S: 'KeyS',
	D: 'KeyD',
	F: 'KeyF',
	G: 'KeyG',
	H: 'KeyH',
	J: 'KeyJ',
	K: 'KeyK',
	L: 'KeyL',
	';': 'Semicolon',
	'\'': 'Quote',
	'`': 'Backquote',
	'/': 'Backslash',
	Z: 'KeyZ',
	X: 'KeyX',
	C: 'KeyC',
	V: 'KeyV',
	B: 'KeyB',
	N: 'KeyN',
	M: 'KeyM',
	',': 'Comma',
	'.': 'Period',
	'\\': 'Slash',
	' ': 'Space'
};

function reduceKey({accelerator, event}, key) {
	if (key.length > 1 || event.key) {
		throw new Error(`Unvalid keycode \`${key}\`.`);
	}

	const code =
		key.toUpperCase() in virtualKeyCodes ?
			virtualKeyCodes[key.toUpperCase()] :
			null;

	return {
		event: Object.assign({}, event, {key}, code ? {code} : null),
		accelerator: accelerator.trim().slice(key.length)
	};
}

const domKeys = Object.assign(Object.create(null), {
	plus: 'Add',
	space: 'Space',
	tab: 'Tab',
	backspace: 'Backspace',
	delete: 'Delete',
	insert: 'Insert',
	return: 'Return',
	enter: 'Return',
	up: 'ArrowUp',
	down: 'ArrowDown',
	left: 'ArrowLeft',
	right: 'ArrowRight',
	home: 'Home',
	end: 'End',
	pageup: 'PageUp',
	pagedown: 'PageDown',
	escape: 'Escape',
	esc: 'Escape',
	volumeup: 'AudioVolumeUp',
	volumedown: 'AudioVolumeDown',
	volumemute: 'AudioVolumeMute',
	medianexttrack: 'MediaTrackNext',
	mediaprevioustrack: 'MediaTrackPrevious',
	mediastop: 'MediaStop',
	mediaplaypause: 'MediaPlayPause',
	printscreen: 'PrintScreen'
});

// Add function keys
for (let i = 1; i <= 24; i++) {
	domKeys[`f${i}`] = `F${i}`;
}

function reduceCode({accelerator, event}, {code, key}) {
	if (event.code) {
		throw new Error(`Duplicated keycode \`${key}\`.`);
	}

	return {
		event: Object.assign({}, event, {key}, code ? {code} : null),
		accelerator: accelerator.trim().slice((key && key.length) || 0)
	};
}

/**
 * This function transform an Electron Accelerator string into
 * a DOM KeyboardEvent object.
 *
 * @param  {string} accelerator an Electron Accelerator string, e.g. `Ctrl+C` or `Shift+Space`.
 * @return {object} a DOM KeyboardEvent object derivate from the `accelerator` argument.
 */
function toKeyEvent(accelerator) {
	let state = {accelerator, event: {}};
	while (state.accelerator !== '') {
		const modifierMatch = state.accelerator.match(modifiers);
		if (modifierMatch) {
			const modifier = modifierMatch[0].toLowerCase();
			state = reduceModifier(state, modifier);
			if (state === UNSUPPORTED) {
				return {unsupportedKeyForPlatform: true};
			}
		} else if (state.accelerator.trim()[0] === '+') {
			state = reducePlus(state);
		} else {
			const codeMatch = state.accelerator.match(keyCodes);
			if (codeMatch) {
				const code = codeMatch[0].toLowerCase();
				if (code in domKeys) {
					state = reduceCode(state, {
						code: domKeys[code],
						key: code
					});
				} else {
					state = reduceKey(state, code);
				}
			} else {
				throw new Error(`Unvalid accelerator: "${state.accelerator}"`);
			}
		}
	}

	return state.event;
}

var keyboardeventFromElectronAccelerator = {
	UNSUPPORTED,
	reduceModifier,
	reducePlus,
	reduceKey,
	reduceCode,
	toKeyEvent
};

/**
 * Follows the link under the cursor, temporarily moving the cursor if necessary for follow-link to
 * work (i.e. if the cursor is on a starting square bracket).
 */
const followLinkUnderCursor = (vimrcPlugin) => {
    const obsidianEditor = vimrcPlugin.getActiveObsidianEditor();
    const { line, ch } = obsidianEditor.getCursor();
    const firstTwoChars = obsidianEditor.getRange({ line, ch }, { line, ch: ch + 2 });
    let numCharsMoved = 0;
    for (const char of firstTwoChars) {
        if (char === "[") {
            obsidianEditor.exec("goRight");
            numCharsMoved++;
        }
    }
    vimrcPlugin.executeObsidianCommand("editor:follow-link");
    // Move the cursor back to where it was
    for (let i = 0; i < numCharsMoved; i++) {
        obsidianEditor.exec("goLeft");
    }
};

/**
 * Moves the cursor down `repeat` lines, skipping over folded sections.
 */
const moveDownSkippingFolds = (vimrcPlugin, cm, { repeat }) => {
    moveSkippingFolds(vimrcPlugin, repeat, "down");
};
/**
 * Moves the cursor up `repeat` lines, skipping over folded sections.
 */
const moveUpSkippingFolds = (vimrcPlugin, cm, { repeat }) => {
    moveSkippingFolds(vimrcPlugin, repeat, "up");
};
function moveSkippingFolds(vimrcPlugin, repeat, direction) {
    const obsidianEditor = vimrcPlugin.getActiveObsidianEditor();
    let { line: oldLine, ch: oldCh } = obsidianEditor.getCursor();
    const commandName = direction === "up" ? "goUp" : "goDown";
    for (let i = 0; i < repeat; i++) {
        obsidianEditor.exec(commandName);
        const { line: newLine, ch: newCh } = obsidianEditor.getCursor();
        if (newLine === oldLine && newCh === oldCh) {
            // Going in the specified direction doesn't do anything anymore, stop now
            return;
        }
        [oldLine, oldCh] = [newLine, newCh];
    }
}

/**
 * Returns the position of the repeat-th instance of a pattern from a given cursor position, in the
 * given direction; looping to the other end of the document when reaching one end. Returns the
 * original cursor position if no match is found.
 *
 * Under the hood, to avoid repeated loops of the document: we get all matches at once, order them
 * according to `direction` and `cursorPosition`, and use modulo arithmetic to return the
 * appropriate match.
 */
function jumpToPattern({ cm, cursorPosition, repeat, regex, direction, }) {
    const content = cm.getValue();
    const cursorIdx = cm.indexFromPos(cursorPosition);
    const orderedMatches = getOrderedMatches({
        content,
        regex,
        cursorIdx,
        direction,
    });
    const effectiveRepeat = (repeat % orderedMatches.length) || orderedMatches.length;
    const matchIdx = orderedMatches[effectiveRepeat - 1]?.index;
    if (matchIdx === undefined) {
        return cursorPosition;
    }
    const newCursorPosition = cm.posFromIndex(matchIdx);
    return newCursorPosition;
}
/**
 * Returns an ordered array of all matches of a regex in a string in the given direction from the
 * cursor index (looping around to the other end of the document when reaching one end).
 */
function getOrderedMatches({ content, regex, cursorIdx, direction, }) {
    const { previousMatches, currentMatches, nextMatches } = getAndGroupMatches(content, regex, cursorIdx);
    if (direction === "next") {
        return [...nextMatches, ...previousMatches, ...currentMatches];
    }
    return [
        ...previousMatches.reverse(),
        ...nextMatches.reverse(),
        ...currentMatches.reverse(),
    ];
}
/**
 * Finds all matches of a regex in a string and groups them by their positions relative to the
 * cursor.
 */
function getAndGroupMatches(content, regex, cursorIdx) {
    const globalRegex = makeGlobalRegex(regex);
    const allMatches = [...content.matchAll(globalRegex)];
    const previousMatches = allMatches.filter((match) => match.index < cursorIdx && !isCursorOnMatch(match, cursorIdx));
    const currentMatches = allMatches.filter((match) => isCursorOnMatch(match, cursorIdx));
    const nextMatches = allMatches.filter((match) => match.index > cursorIdx);
    return { previousMatches, currentMatches, nextMatches };
}
function makeGlobalRegex(regex) {
    const globalFlags = getGlobalFlags(regex);
    return new RegExp(regex.source, globalFlags);
}
function getGlobalFlags(regex) {
    const { flags } = regex;
    return flags.includes("g") ? flags : `${flags}g`;
}
function isCursorOnMatch(match, cursorIdx) {
    return match.index <= cursorIdx && cursorIdx < match.index + match[0].length;
}

const HEADING_REGEX = /^#+ /gm;
/**
 * Jumps to the repeat-th next heading.
 */
const jumpToNextHeading = (cm, cursorPosition, { repeat }) => {
    return jumpToPattern({
        cm,
        cursorPosition,
        repeat,
        regex: HEADING_REGEX,
        direction: "next",
    });
};
/**
 * Jumps to the repeat-th previous heading.
 */
const jumpToPreviousHeading = (cm, cursorPosition, { repeat }) => {
    return jumpToPattern({
        cm,
        cursorPosition,
        repeat,
        regex: HEADING_REGEX,
        direction: "previous",
    });
};

const WIKILINK_REGEX_STRING = "\\[\\[[^\\]\\]]+?\\]\\]";
const MARKDOWN_LINK_REGEX_STRING = "\\[[^\\]]+?\\]\\([^)]+?\\)";
const LINK_REGEX_STRING = `${WIKILINK_REGEX_STRING}|${MARKDOWN_LINK_REGEX_STRING}`;
const LINK_REGEX = new RegExp(LINK_REGEX_STRING, "g");
/**
 * Jumps to the repeat-th next link.
*/
const jumpToNextLink = (cm, cursorPosition, { repeat }) => {
    return jumpToPattern({
        cm,
        cursorPosition,
        repeat,
        regex: LINK_REGEX,
        direction: "next",
    });
};
/**
 * Jumps to the repeat-th previous link.
 */
const jumpToPreviousLink = (cm, cursorPosition, { repeat }) => {
    return jumpToPattern({
        cm,
        cursorPosition,
        repeat,
        regex: LINK_REGEX,
        direction: "previous",
    });
};

/**
 * Utility types and functions for defining Obsidian-specific Vim commands.
 */
function defineAndMapObsidianVimMotion(vimObject, motionFn, mapping) {
    vimObject.defineMotion(motionFn.name, motionFn);
    vimObject.mapCommand(mapping, "motion", motionFn.name, undefined, {});
}
function defineAndMapObsidianVimAction(vimObject, vimrcPlugin, obsidianActionFn, mapping) {
    vimObject.defineAction(obsidianActionFn.name, (cm, actionArgs) => {
        obsidianActionFn(vimrcPlugin, cm, actionArgs);
    });
    vimObject.mapCommand(mapping, "action", obsidianActionFn.name, undefined, {});
}

const DEFAULT_SETTINGS = {
    vimrcFileName: ".obsidian.vimrc",
    displayChord: false,
    displayVimMode: false,
    fixedNormalModeLayout: false,
    capturedKeyboardMap: {},
    supportJsCommands: false,
    vimStatusPromptMap: {
        normal: '🟢',
        insert: '🟠',
        visual: '🟡',
        replace: '🔴',
    },
};
const vimStatusPromptClass = "vimrc-support-vim-mode";
// NOTE: to future maintainers, please make sure all mapping commands are included in this array.
const mappingCommands = [
    "map",
    "nmap",
    "noremap",
    "iunmap",
    "nunmap",
    "vunmap",
];
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class VimrcPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.codeMirrorVimObject = null;
        this.initialized = false;
        this.lastYankBuffer = [""];
        this.lastSystemClipboard = "";
        this.yankToSystemClipboard = false;
        this.currentKeyChord = [];
        this.vimChordStatusBar = null;
        this.vimStatusBar = null;
        this.currentVimStatus = "normal" /* vimStatus.normal */;
        this.customVimKeybinds = {};
        this.currentSelection = null;
        this.isInsertMode = false;
        this.logVimModeChange = async (cm) => {
            if (!cm)
                return;
            this.isInsertMode = cm.mode === 'insert';
            switch (cm.mode) {
                case "insert":
                    this.currentVimStatus = "insert" /* vimStatus.insert */;
                    break;
                case "normal":
                    this.currentVimStatus = "normal" /* vimStatus.normal */;
                    break;
                case "visual":
                    this.currentVimStatus = "visual" /* vimStatus.visual */;
                    break;
                case "replace":
                    this.currentVimStatus = "replace" /* vimStatus.replace */;
                    break;
            }
            if (this.settings.displayVimMode)
                this.updateVimStatusBar();
        };
        this.onVimKeypress = async (vimKey) => {
            if (vimKey != "<Esc>") { // TODO figure out what to actually look for to exit commands.
                this.currentKeyChord.push(vimKey);
                if (this.customVimKeybinds[this.currentKeyChord.join("")] != undefined) { // Custom key chord exists.
                    this.currentKeyChord = [];
                }
            }
            else {
                this.currentKeyChord = [];
            }
            // Build keychord text
            let tempS = "";
            for (const s of this.currentKeyChord) {
                tempS += " " + s;
            }
            if (tempS != "") {
                tempS += "-";
            }
            this.vimChordStatusBar?.setText(tempS);
        };
        this.onVimCommandDone = async (reason) => {
            this.vimChordStatusBar?.setText("");
            this.currentKeyChord = [];
        };
        this.onKeydown = (ev) => {
            if (this.settings.fixedNormalModeLayout) {
                const keyMap = this.settings.capturedKeyboardMap;
                if (!this.isInsertMode && !ev.shiftKey &&
                    ev.code in keyMap && ev.key != keyMap[ev.code]) {
                    let view = this.getActiveView();
                    if (view) {
                        const cmEditor = this.getCodeMirror(view);
                        if (cmEditor) {
                            this.codeMirrorVimObject.handleKey(cmEditor, keyMap[ev.code], 'mapping');
                        }
                    }
                    ev.preventDefault();
                    return false;
                }
            }
        };
    }
    updateVimStatusBar() {
        this.vimStatusBar.setText(this.settings.vimStatusPromptMap[this.currentVimStatus]);
        this.vimStatusBar.dataset.vimMode = this.currentVimStatus;
    }
    async captureKeyboardLayout() {
        // This is experimental API and it might break at some point:
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardLayoutMap
        let keyMap = {};
        let layout = await navigator.keyboard.getLayoutMap();
        let doneIterating = new Promise((resolve, reject) => {
            let counted = 0;
            layout.forEach((value, index) => {
                keyMap[index] = value;
                counted += 1;
                if (counted === layout.size)
                    resolve();
            });
        });
        await doneIterating;
        new obsidian.Notice('Keyboard layout captured');
        return keyMap;
    }
    async initialize() {
        if (this.initialized)
            return;
        this.codeMirrorVimObject = window.CodeMirrorAdapter?.Vim;
        this.registerYankEvents(activeWindow);
        this.app.workspace.on("window-open", (workspaceWindow, w) => {
            this.registerYankEvents(w);
        });
        // Two events cos
        // this don't trigger on loading/reloading obsidian with note opened
        this.app.workspace.on("active-leaf-change", async () => {
            this.updateSelectionEvent();
            this.updateVimEvents();
        });
        // and this don't trigger on opening same file in new pane
        this.app.workspace.on("file-open", async () => {
            this.updateSelectionEvent();
            this.updateVimEvents();
        });
        this.initialized = true;
    }
    registerYankEvents(win) {
        this.registerDomEvent(win.document, 'click', () => {
            this.captureYankBuffer(win);
        });
        this.registerDomEvent(win.document, 'keyup', () => {
            this.captureYankBuffer(win);
        });
        this.registerDomEvent(win.document, 'focusin', () => {
            this.captureYankBuffer(win);
        });
    }
    async updateSelectionEvent() {
        const view = this.getActiveView();
        if (!view)
            return;
        let cm = this.getCodeMirror(view);
        if (this.getCursorActivityHandlers(cm).some((e) => e.name === "updateSelection"))
            return;
        cm.on("cursorActivity", async (cm) => this.updateSelection(cm));
    }
    async updateSelection(cm) {
        this.currentSelection = cm.listSelections();
    }
    getCursorActivityHandlers(cm) {
        return cm._handlers.cursorActivity;
    }
    async updateVimEvents() {
        if (!this.app.isVimEnabled())
            return;
        let view = this.getActiveView();
        if (view) {
            const cmEditor = this.getCodeMirror(view);
            // See https://codemirror.net/doc/manual.html#vimapi_events for events.
            this.isInsertMode = false;
            this.currentVimStatus = "normal" /* vimStatus.normal */;
            if (this.settings.displayVimMode)
                this.updateVimStatusBar();
            cmEditor.off('vim-mode-change', this.logVimModeChange);
            cmEditor.on('vim-mode-change', this.logVimModeChange);
            this.currentKeyChord = [];
            cmEditor.off('vim-keypress', this.onVimKeypress);
            cmEditor.on('vim-keypress', this.onVimKeypress);
            cmEditor.off('vim-command-done', this.onVimCommandDone);
            cmEditor.on('vim-command-done', this.onVimCommandDone);
            CodeMirror.off(cmEditor.getInputField(), 'keydown', this.onKeydown);
            CodeMirror.on(cmEditor.getInputField(), 'keydown', this.onKeydown);
        }
    }
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new SettingsTab(this.app, this));
        console.log('loading Vimrc plugin');
        this.app.workspace.on('active-leaf-change', async () => {
            if (!this.initialized)
                await this.initialize();
            if (this.codeMirrorVimObject.loadedVimrc)
                return;
            let fileName = this.settings.vimrcFileName;
            if (!fileName || fileName.trim().length === 0) {
                fileName = DEFAULT_SETTINGS.vimrcFileName;
                console.log('Configured Vimrc file name is illegal, falling-back to default');
            }
            let vimrcContent = '';
            try {
                vimrcContent = await this.app.vault.adapter.read(fileName);
            }
            catch (e) {
                console.log('Error loading vimrc file', fileName, 'from the vault root', e.message);
            }
            this.readVimInit(vimrcContent);
        });
    }
    async loadSettings() {
        const data = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
    onunload() {
        console.log('unloading Vimrc plugin (but Vim commands that were already loaded will still work)');
    }
    getActiveView() {
        return this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    }
    getActiveObsidianEditor() {
        return this.getActiveView().editor;
    }
    getCodeMirror(view) {
        return view.editMode?.editor?.cm?.cm;
    }
    readVimInit(vimCommands) {
        let view = this.getActiveView();
        if (view) {
            var cmEditor = this.getCodeMirror(view);
            if (cmEditor && !this.codeMirrorVimObject.loadedVimrc) {
                this.defineBasicCommands(this.codeMirrorVimObject);
                this.defineAndMapObsidianVimCommands(this.codeMirrorVimObject);
                this.defineSendKeys(this.codeMirrorVimObject);
                this.defineObCommand(this.codeMirrorVimObject);
                this.defineSurround(this.codeMirrorVimObject);
                this.defineJsCommand(this.codeMirrorVimObject);
                this.defineJsFile(this.codeMirrorVimObject);
                this.defineSource(this.codeMirrorVimObject);
                this.loadVimCommands(vimCommands);
                this.prepareChordDisplay();
                this.prepareVimModeDisplay();
                // Make sure that we load it just once per CodeMirror instance.
                // This is supposed to work because the Vim state is kept at the keymap level, hopefully
                // there will not be bugs caused by operations that are kept at the object level instead
                this.codeMirrorVimObject.loadedVimrc = true;
            }
            if (cmEditor) {
                cmEditor.off('vim-mode-change', this.logVimModeChange);
                cmEditor.on('vim-mode-change', this.logVimModeChange);
                CodeMirror.off(cmEditor.getInputField(), 'keydown', this.onKeydown);
                CodeMirror.on(cmEditor.getInputField(), 'keydown', this.onKeydown);
            }
        }
    }
    loadVimCommands(vimCommands) {
        let view = this.getActiveView();
        if (view) {
            var cmEditor = this.getCodeMirror(view);
            vimCommands.split("\n").forEach(function (line, index, arr) {
                if (line.trim().length > 0 && line.trim()[0] != '"') {
                    let split = line.split(" ");
                    if (mappingCommands.includes(split[0])) {
                        // Have to do this because "vim-command-done" event doesn't actually work properly, or something.
                        this.customVimKeybinds[split[1]] = true;
                    }
                    this.codeMirrorVimObject.handleEx(cmEditor, line);
                }
            }.bind(this) // Faster than an arrow function. https://stackoverflow.com/questions/50375440/binding-vs-arrow-function-for-react-onclick-event
            );
        }
    }
    defineBasicCommands(vimObject) {
        vimObject.defineOption('clipboard', '', 'string', ['clip'], (value, cm) => {
            if (value) {
                if (value.trim() == 'unnamed' || value.trim() == 'unnamedplus') {
                    if (!this.yankToSystemClipboard) {
                        this.yankToSystemClipboard = true;
                        console.log("Vim is now set to yank to system clipboard.");
                    }
                }
                else {
                    throw new Error("Unrecognized clipboard option, supported are 'unnamed' and 'unnamedplus' (and they do the same)");
                }
            }
        });
        vimObject.defineOption('tabstop', 4, 'number', [], (value, cm) => {
            if (value && cm) {
                cm.setOption('tabSize', value);
            }
        });
        vimObject.defineEx('iunmap', '', (cm, params) => {
            if (params.argString.trim()) {
                this.codeMirrorVimObject.unmap(params.argString.trim(), 'insert');
            }
        });
        vimObject.defineEx('nunmap', '', (cm, params) => {
            if (params.argString.trim()) {
                this.codeMirrorVimObject.unmap(params.argString.trim(), 'normal');
            }
        });
        vimObject.defineEx('vunmap', '', (cm, params) => {
            if (params.argString.trim()) {
                this.codeMirrorVimObject.unmap(params.argString.trim(), 'visual');
            }
        });
        vimObject.defineEx('noremap', '', (cm, params) => {
            if (!params?.args?.length) {
                throw new Error('Invalid mapping: noremap');
            }
            if (params.argString.trim()) {
                this.codeMirrorVimObject.noremap.apply(this.codeMirrorVimObject, params.args);
            }
        });
        // Allow the user to register an Ex command
        vimObject.defineEx('exmap', '', (cm, params) => {
            if (params?.args?.length && params.args.length < 2) {
                throw new Error(`exmap requires at least 2 parameters: [name] [actions...]`);
            }
            let commandName = params.args[0];
            params.args.shift();
            let commandContent = params.args.join(' ');
            // The content of the user's Ex command is just the remaining parameters of the exmap command
            this.codeMirrorVimObject.defineEx(commandName, '', (cm, params) => {
                this.codeMirrorVimObject.handleEx(cm, commandContent);
            });
        });
    }
    defineAndMapObsidianVimCommands(vimObject) {
        defineAndMapObsidianVimMotion(vimObject, jumpToNextHeading, ']]');
        defineAndMapObsidianVimMotion(vimObject, jumpToPreviousHeading, '[[');
        defineAndMapObsidianVimMotion(vimObject, jumpToNextLink, 'gl');
        defineAndMapObsidianVimMotion(vimObject, jumpToPreviousLink, 'gL');
        defineAndMapObsidianVimAction(vimObject, this, moveDownSkippingFolds, 'zj');
        defineAndMapObsidianVimAction(vimObject, this, moveUpSkippingFolds, 'zk');
        defineAndMapObsidianVimAction(vimObject, this, followLinkUnderCursor, 'gf');
    }
    defineSendKeys(vimObject) {
        vimObject.defineEx('sendkeys', '', async (cm, params) => {
            if (!params?.args?.length) {
                console.log(params);
                throw new Error(`The sendkeys command requires a list of keys, e.g. sendKeys Ctrl+p a b Enter`);
            }
            let allGood = true;
            let events = [];
            for (const key of params.args) {
                if (key.startsWith('wait')) {
                    const delay = key.slice(4);
                    await sleep(delay * 1000);
                }
                else {
                    let keyEvent = null;
                    try {
                        keyEvent = new KeyboardEvent('keydown', keyboardeventFromElectronAccelerator.toKeyEvent(key));
                        events.push(keyEvent);
                    }
                    catch (e) {
                        allGood = false;
                        throw new Error(`Key '${key}' couldn't be read as an Electron Accelerator`);
                    }
                    if (allGood) {
                        for (keyEvent of events)
                            window.postMessage(JSON.parse(JSON.stringify(keyEvent)), '*');
                        // view.containerEl.dispatchEvent(keyEvent);
                    }
                }
            }
        });
    }
    executeObsidianCommand(commandName) {
        const availableCommands = this.app.commands.commands;
        if (!(commandName in availableCommands)) {
            throw new Error(`Command ${commandName} was not found, try 'obcommand' with no params to see in the developer console what's available`);
        }
        const view = this.getActiveView();
        const editor = view.editor;
        const command = availableCommands[commandName];
        const { callback, checkCallback, editorCallback, editorCheckCallback } = command;
        if (editorCheckCallback)
            editorCheckCallback(false, editor, view);
        else if (editorCallback)
            editorCallback(editor, view);
        else if (checkCallback)
            checkCallback(false);
        else if (callback)
            callback();
        else
            throw new Error(`Command ${commandName} doesn't have an Obsidian callback`);
    }
    defineObCommand(vimObject) {
        vimObject.defineEx('obcommand', '', async (cm, params) => {
            if (!params?.args?.length || params.args.length != 1) {
                const availableCommands = this.app.commands.commands;
                console.log(`Available commands: ${Object.keys(availableCommands).join('\n')}`);
                throw new Error(`obcommand requires exactly 1 parameter`);
            }
            const commandName = params.args[0];
            this.executeObsidianCommand(commandName);
        });
    }
    defineSurround(vimObject) {
        // Function to surround selected text or highlighted word.
        var surroundFunc = (params) => {
            var editor = this.getActiveView().editor;
            if (!params.length) {
                throw new Error("surround requires exactly 2 parameters: prefix and postfix text.");
            }
            let newArgs = params.join(" ").match(/(\\.|[^\s\\\\]+)+/g);
            if (newArgs.length != 2) {
                throw new Error("surround requires exactly 2 parameters: prefix and postfix text.");
            }
            let beginning = newArgs[0].replace("\\\\", "\\").replace("\\ ", " "); // Get the beginning surround text
            let ending = newArgs[1].replace("\\\\", "\\").replace("\\ ", " "); // Get the ending surround text
            let currentSelections = this.currentSelection;
            var chosenSelection = currentSelections?.[0] ? currentSelections[0] : { anchor: editor.getCursor(), head: editor.getCursor() };
            if (currentSelections?.length > 1) {
                console.log("WARNING: Multiple selections in surround. Attempt to select matching cursor. (obsidian-vimrc-support)");
                const cursorPos = editor.getCursor();
                for (const selection of currentSelections) {
                    if (selection.head.line == cursorPos.line && selection.head.ch == cursorPos.ch) {
                        console.log("RESOLVED: Selection matching cursor found. (obsidian-vimrc-support)");
                        chosenSelection = selection;
                        break;
                    }
                }
            }
            if (editor.posToOffset(chosenSelection.anchor) === editor.posToOffset(chosenSelection.head)) {
                // No range of selected text, so select word.
                let wordAt = editor.wordAt(chosenSelection.head);
                if (wordAt) {
                    chosenSelection = { anchor: wordAt.from, head: wordAt.to };
                }
            }
            let currText;
            if (editor.posToOffset(chosenSelection.anchor) > editor.posToOffset(chosenSelection.head)) {
                currText = editor.getRange(chosenSelection.head, chosenSelection.anchor);
            }
            else {
                currText = editor.getRange(chosenSelection.anchor, chosenSelection.head);
            }
            editor.replaceRange(beginning + currText + ending, chosenSelection.anchor, chosenSelection.head);
            // If no selection, place cursor between beginning and ending
            if (editor.posToOffset(chosenSelection.anchor) === editor.posToOffset(chosenSelection.head)) {
                chosenSelection.head.ch += beginning.length;
                editor.setCursor(chosenSelection.head);
            }
        };
        vimObject.defineEx("surround", "", (cm, params) => { surroundFunc(params.args); });
        vimObject.defineEx("pasteinto", "", (cm, params) => {
            // Using the register for when this.yankToSystemClipboard == false
            surroundFunc(['[',
                '](' + vimObject.getRegisterController().getRegister('yank').keyBuffer + ")"]);
        });
        this.getActiveView().editor;
        // Handle the surround dialog input
        var surroundDialogCallback = (value) => {
            if ((/^\[+$/).test(value)) { // check for 1-inf [ and match them with ]
                surroundFunc([value, "]".repeat(value.length)]);
            }
            else if ((/^\(+$/).test(value)) { // check for 1-inf ( and match them with )
                surroundFunc([value, ")".repeat(value.length)]);
            }
            else if ((/^\{+$/).test(value)) { // check for 1-inf { and match them with }
                surroundFunc([value, "}".repeat(value.length)]);
            }
            else { // Else, just put it before and after.
                surroundFunc([value, value]);
            }
        };
        vimObject.defineOperator("surroundOperator", () => {
            let p = "<span>Surround with: <input type='text'></span>";
            CodeMirror.openDialog(p, surroundDialogCallback, { bottom: true, selectValueOnOpen: false });
        });
        vimObject.mapCommand("<A-y>s", "operator", "surroundOperator");
    }
    async captureYankBuffer(win) {
        if (!this.yankToSystemClipboard) {
            return;
        }
        const yankRegister = this.codeMirrorVimObject.getRegisterController().getRegister('yank');
        const currentYankBuffer = yankRegister.keyBuffer;
        // yank -> clipboard
        const buf = currentYankBuffer[0];
        if (buf !== this.lastYankBuffer[0]) {
            await win.navigator.clipboard.writeText(buf);
            this.lastYankBuffer = currentYankBuffer;
            this.lastSystemClipboard = await win.navigator.clipboard.readText();
            return;
        }
        // clipboard -> yank
        try {
            const currentClipboardText = await win.navigator.clipboard.readText();
            if (currentClipboardText !== this.lastSystemClipboard) {
                yankRegister.setText(currentClipboardText);
                this.lastYankBuffer = yankRegister.keyBuffer;
                this.lastSystemClipboard = currentClipboardText;
            }
        }
        catch (e) {
            // XXX: Avoid "Uncaught (in promise) DOMException: Document is not focused."
            // XXX: It is not good but easy workaround
        }
    }
    prepareChordDisplay() {
        if (this.settings.displayChord) {
            // Add status bar item
            this.vimChordStatusBar = this.addStatusBarItem();
            // Move vimChordStatusBar to the leftmost position and center it.
            let parent = this.vimChordStatusBar.parentElement;
            this.vimChordStatusBar.parentElement.insertBefore(this.vimChordStatusBar, parent.firstChild);
            this.vimChordStatusBar.style.marginRight = "auto";
            let cmEditor = this.getCodeMirror(this.getActiveView());
            // See https://codemirror.net/doc/manual.html#vimapi_events for events.
            cmEditor.off('vim-keypress', this.onVimKeypress);
            cmEditor.on('vim-keypress', this.onVimKeypress);
            cmEditor.off('vim-command-done', this.onVimCommandDone);
            cmEditor.on('vim-command-done', this.onVimCommandDone);
        }
    }
    prepareVimModeDisplay() {
        if (this.settings.displayVimMode) {
            this.vimStatusBar = this.addStatusBarItem(); // Add status bar item
            this.vimStatusBar.setText(this.settings.vimStatusPromptMap["normal" /* vimStatus.normal */]); // Init the vimStatusBar with normal mode
            this.vimStatusBar.addClass(vimStatusPromptClass);
            this.vimStatusBar.dataset.vimMode = this.currentVimStatus;
        }
    }
    defineJsCommand(vimObject) {
        vimObject.defineEx('jscommand', '', (cm, params) => {
            if (!this.settings.supportJsCommands)
                throw new Error("JS commands are turned off; enable them via the Vimrc plugin configuration if you're sure you know what you're doing");
            const jsCode = params.argString.trim();
            if (jsCode[0] != '{' || jsCode[jsCode.length - 1] != '}')
                throw new Error("Expected an argument which is JS code surrounded by curly brackets: {...}");
            let currentSelections = this.currentSelection;
            var chosenSelection = currentSelections && currentSelections.length > 0 ? currentSelections[0] : null;
            const command = Function('editor', 'view', 'selection', jsCode);
            const view = this.getActiveView();
            command(view.editor, view, chosenSelection);
        });
    }
    defineJsFile(vimObject) {
        vimObject.defineEx('jsfile', '', async (cm, params) => {
            if (!this.settings.supportJsCommands)
                throw new Error("JS commands are turned off; enable them via the Vimrc plugin configuration if you're sure you know what you're doing");
            if (params?.args?.length < 1)
                throw new Error("Expected format: fileName {extraCode}");
            let extraCode = '';
            const fileName = params.args[0];
            if (params.args.length > 1) {
                params.args.shift();
                extraCode = params.args.join(' ').trim();
                if (extraCode[0] != '{' || extraCode[extraCode.length - 1] != '}')
                    throw new Error("Expected an extra code argument which is JS code surrounded by curly brackets: {...}");
            }
            let currentSelections = this.currentSelection;
            var chosenSelection = currentSelections && currentSelections.length > 0 ? currentSelections[0] : null;
            let content = '';
            try {
                content = await this.app.vault.adapter.read(fileName);
            }
            catch (e) {
                throw new Error(`Cannot read file ${params.args[0]} from vault root: ${e.message}`);
            }
            const command = Function('editor', 'view', 'selection', content + extraCode);
            const view = this.getActiveView();
            command(view.editor, view, chosenSelection);
        });
    }
    defineSource(vimObject) {
        vimObject.defineEx('source', '', async (cm, params) => {
            if (params?.args?.length > 1)
                throw new Error("Expected format: source [fileName]");
            const fileName = params.argString.trim();
            try {
                this.app.vault.adapter.read(fileName).then(vimrcContent => {
                    this.loadVimCommands(vimrcContent);
                });
            }
            catch (e) {
                console.log('Error loading vimrc file', fileName, 'from the vault root', e.message);
            }
        });
    }
}
class SettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Vimrc Settings' });
        new obsidian.Setting(containerEl)
            .setName('Vimrc file name')
            .setDesc('Relative to vault directory (requires restart)')
            .addText((text) => {
            text.setPlaceholder(DEFAULT_SETTINGS.vimrcFileName);
            text.setValue(this.plugin.settings.vimrcFileName || DEFAULT_SETTINGS.vimrcFileName);
            text.onChange(value => {
                this.plugin.settings.vimrcFileName = value;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Vim chord display')
            .setDesc('Displays the current chord until completion. Ex: "<Space> f-" (requires restart)')
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.displayChord || DEFAULT_SETTINGS.displayChord);
            toggle.onChange(value => {
                this.plugin.settings.displayChord = value;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Vim mode display')
            .setDesc('Displays the current vim mode (requires restart)')
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.displayVimMode || DEFAULT_SETTINGS.displayVimMode);
            toggle.onChange(value => {
                this.plugin.settings.displayVimMode = value;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Use a fixed keyboard layout for Normal mode')
            .setDesc('Define a keyboard layout to always use when in Normal mode, regardless of the input language (experimental).')
            .addButton(async (button) => {
            button.setButtonText('Capture current layout');
            button.onClick(async () => {
                this.plugin.settings.capturedKeyboardMap = await this.plugin.captureKeyboardLayout();
                this.plugin.saveSettings();
            });
        })
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.fixedNormalModeLayout || DEFAULT_SETTINGS.fixedNormalModeLayout);
            toggle.onChange(async (value) => {
                this.plugin.settings.fixedNormalModeLayout = value;
                if (value && Object.keys(this.plugin.settings.capturedKeyboardMap).length === 0)
                    this.plugin.settings.capturedKeyboardMap = await this.plugin.captureKeyboardLayout();
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Support JS commands (beware!)')
            .setDesc("Support the 'jscommand' and 'jsfile' commands, which allow defining Ex commands using Javascript. WARNING! Review the README to understand why this may be dangerous before enabling.")
            .addToggle(toggle => {
            toggle.setValue(this.plugin.settings.supportJsCommands ?? DEFAULT_SETTINGS.supportJsCommands);
            toggle.onChange(value => {
                this.plugin.settings.supportJsCommands = value;
                this.plugin.saveSettings();
            });
        });
        containerEl.createEl('h2', { text: 'Vim Mode Display Prompt' });
        new obsidian.Setting(containerEl)
            .setName('Normal mode prompt')
            .setDesc('Set the status prompt text for normal mode.')
            .addText((text) => {
            text.setPlaceholder('Default: 🟢');
            text.setValue(this.plugin.settings.vimStatusPromptMap.normal ||
                DEFAULT_SETTINGS.vimStatusPromptMap.normal);
            text.onChange((value) => {
                this.plugin.settings.vimStatusPromptMap.normal = value ||
                    DEFAULT_SETTINGS.vimStatusPromptMap.normal;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Insert mode prompt')
            .setDesc('Set the status prompt text for insert mode.')
            .addText((text) => {
            text.setPlaceholder('Default: 🟠');
            text.setValue(this.plugin.settings.vimStatusPromptMap.insert ||
                DEFAULT_SETTINGS.vimStatusPromptMap.insert);
            text.onChange((value) => {
                this.plugin.settings.vimStatusPromptMap.insert = value ||
                    DEFAULT_SETTINGS.vimStatusPromptMap.insert;
                console.log(this.plugin.settings.vimStatusPromptMap);
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Visual mode prompt')
            .setDesc('Set the status prompt text for visual mode.')
            .addText((text) => {
            text.setPlaceholder('Default: 🟡');
            text.setValue(this.plugin.settings.vimStatusPromptMap.visual ||
                DEFAULT_SETTINGS.vimStatusPromptMap.visual);
            text.onChange((value) => {
                this.plugin.settings.vimStatusPromptMap.visual = value ||
                    DEFAULT_SETTINGS.vimStatusPromptMap.visual;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Replace mode prompt')
            .setDesc('Set the status prompt text for replace mode.')
            .addText((text) => {
            text.setPlaceholder('Default: 🔴');
            text.setValue(this.plugin.settings.vimStatusPromptMap.replace ||
                DEFAULT_SETTINGS.vimStatusPromptMap.replace);
            text.onChange((value) => {
                this.plugin.settings.vimStatusPromptMap.replace = value ||
                    DEFAULT_SETTINGS.vimStatusPromptMap.replace;
                this.plugin.saveSettings();
            });
        });
    }
}

module.exports = VimrcPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL2tleWJvYXJkZXZlbnQtZnJvbS1lbGVjdHJvbi1hY2NlbGVyYXRvci9pbmRleC5qcyIsImFjdGlvbnMvZm9sbG93TGlua1VuZGVyQ3Vyc29yLnRzIiwiYWN0aW9ucy9tb3ZlU2tpcHBpbmdGb2xkcy50cyIsInV0aWxzL2p1bXBUb1BhdHRlcm4udHMiLCJtb3Rpb25zL2p1bXBUb0hlYWRpbmcudHMiLCJtb3Rpb25zL2p1bXBUb0xpbmsudHMiLCJ1dGlscy9vYnNpZGlhblZpbUNvbW1hbmQudHMiLCJtYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1vZGlmaWVycyA9IC9eKENvbW1hbmRPckNvbnRyb2x8Q21kT3JDdHJsfENvbW1hbmR8Q21kfENvbnRyb2x8Q3RybHxBbHRHcnxPcHRpb258QWx0fFNoaWZ0fFN1cGVyKS9pO1xuY29uc3Qga2V5Q29kZXMgPSAvXihQbHVzfFNwYWNlfFRhYnxCYWNrc3BhY2V8RGVsZXRlfEluc2VydHxSZXR1cm58RW50ZXJ8VXB8RG93bnxMZWZ0fFJpZ2h0fEhvbWV8RW5kfFBhZ2VVcHxQYWdlRG93bnxFc2NhcGV8RXNjfFZvbHVtZVVwfFZvbHVtZURvd258Vm9sdW1lTXV0ZXxNZWRpYU5leHRUcmFja3xNZWRpYVByZXZpb3VzVHJhY2t8TWVkaWFTdG9wfE1lZGlhUGxheVBhdXNlfFByaW50U2NyZWVufEYyNHxGMjN8RjIyfEYyMXxGMjB8RjE5fEYxOHxGMTd8RjE2fEYxNXxGMTR8RjEzfEYxMnxGMTF8RjEwfEY5fEY4fEY3fEY2fEY1fEY0fEYzfEYyfEYxfFswLTlBLVopIUAjJCVeJiooOis8Xz4/fnt8fVwiOz0sXFwtLi9gW1xcXFxcXF0nXSkvaTtcbmNvbnN0IFVOU1VQUE9SVEVEID0ge307XG5cbmZ1bmN0aW9uIF9jb21tYW5kKGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpIHtcblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG5cdFx0cmV0dXJuIFVOU1VQUE9SVEVEO1xuXHR9XG5cblx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0RvdWJsZSBgQ29tbWFuZGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHttZXRhS2V5OiB0cnVlfSksXG5cdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0fTtcbn1cblxuZnVuY3Rpb24gX3N1cGVyKGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpIHtcblx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0RvdWJsZSBgU3VwZXJgIG1vZGlmaWVyIHNwZWNpZmllZC4nKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7bWV0YUtleTogdHJ1ZX0pLFxuXHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci5zbGljZShtb2RpZmllci5sZW5ndGgpXG5cdH07XG59XG5cbmZ1bmN0aW9uIF9jb21tYW5kb3Jjb250cm9sKGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpIHtcblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG5cdFx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBDb21tYW5kYCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge21ldGFLZXk6IHRydWV9KSxcblx0XHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci5zbGljZShtb2RpZmllci5sZW5ndGgpXG5cdFx0fTtcblx0fVxuXG5cdGlmIChldmVudC5jdHJsS2V5KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYENvbnRyb2xgIG1vZGlmaWVyIHNwZWNpZmllZC4nKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7Y3RybEtleTogdHJ1ZX0pLFxuXHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci5zbGljZShtb2RpZmllci5sZW5ndGgpXG5cdH07XG59XG5cbmZ1bmN0aW9uIF9hbHQoYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcikge1xuXHRpZiAobW9kaWZpZXIgPT09ICdvcHRpb24nICYmIHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG5cdFx0cmV0dXJuIFVOU1VQUE9SVEVEO1xuXHR9XG5cblx0aWYgKGV2ZW50LmFsdEtleSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBBbHRgIG1vZGlmaWVyIHNwZWNpZmllZC4nKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7YWx0S2V5OiB0cnVlfSksXG5cdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0fTtcbn1cblxuZnVuY3Rpb24gX3NoaWZ0KGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpIHtcblx0aWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYFNoaWZ0YCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge3NoaWZ0S2V5OiB0cnVlfSksXG5cdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0fTtcbn1cblxuZnVuY3Rpb24gX2NvbnRyb2woYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcikge1xuXHRpZiAoZXZlbnQuY3RybEtleSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBDb250cm9sYCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge2N0cmxLZXk6IHRydWV9KSxcblx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3Iuc2xpY2UobW9kaWZpZXIubGVuZ3RoKVxuXHR9O1xufVxuXG5mdW5jdGlvbiByZWR1Y2VNb2RpZmllcih7YWNjZWxlcmF0b3IsIGV2ZW50fSwgbW9kaWZpZXIpIHtcblx0c3dpdGNoIChtb2RpZmllcikge1xuXHRcdGNhc2UgJ2NvbW1hbmQnOlxuXHRcdGNhc2UgJ2NtZCc6IHtcblx0XHRcdHJldHVybiBfY29tbWFuZChhY2NlbGVyYXRvciwgZXZlbnQsIG1vZGlmaWVyKTtcblx0XHR9XG5cblx0XHRjYXNlICdzdXBlcic6IHtcblx0XHRcdHJldHVybiBfc3VwZXIoYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcik7XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29udHJvbCc6XG5cdFx0Y2FzZSAnY3RybCc6IHtcblx0XHRcdHJldHVybiBfY29udHJvbChhY2NlbGVyYXRvciwgZXZlbnQsIG1vZGlmaWVyKTtcblx0XHR9XG5cblx0XHRjYXNlICdjb21tYW5kb3Jjb250cm9sJzpcblx0XHRjYXNlICdjbWRvcmN0cmwnOiB7XG5cdFx0XHRyZXR1cm4gX2NvbW1hbmRvcmNvbnRyb2woYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcik7XG5cdFx0fVxuXG5cdFx0Y2FzZSAnb3B0aW9uJzpcblx0XHRjYXNlICdhbHRncic6XG5cdFx0Y2FzZSAnYWx0Jzoge1xuXHRcdFx0cmV0dXJuIF9hbHQoYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcik7XG5cdFx0fVxuXG5cdFx0Y2FzZSAnc2hpZnQnOiB7XG5cdFx0XHRyZXR1cm4gX3NoaWZ0KGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpO1xuXHRcdH1cblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRjb25zb2xlLmVycm9yKG1vZGlmaWVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZWR1Y2VQbHVzKHthY2NlbGVyYXRvciwgZXZlbnR9KSB7XG5cdHJldHVybiB7XG5cdFx0ZXZlbnQsXG5cdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnRyaW0oKS5zbGljZSgxKVxuXHR9O1xufVxuXG5jb25zdCB2aXJ0dWFsS2V5Q29kZXMgPSB7XG5cdDA6ICdEaWdpdDAnLFxuXHQxOiAnRGlnaXQxJyxcblx0MjogJ0RpZ2l0MicsXG5cdDM6ICdEaWdpdDMnLFxuXHQ0OiAnRGlnaXQ0Jyxcblx0NTogJ0RpZ2l0NScsXG5cdDY6ICdEaWdpdDYnLFxuXHQ3OiAnRGlnaXQ3Jyxcblx0ODogJ0RpZ2l0OCcsXG5cdDk6ICdEaWdpdDknLFxuXHQnLSc6ICdNaW51cycsXG5cdCc9JzogJ0VxdWFsJyxcblx0UTogJ0tleVEnLFxuXHRXOiAnS2V5VycsXG5cdEU6ICdLZXlFJyxcblx0UjogJ0tleVInLFxuXHRUOiAnS2V5VCcsXG5cdFk6ICdLZXlZJyxcblx0VTogJ0tleVUnLFxuXHRJOiAnS2V5SScsXG5cdE86ICdLZXlPJyxcblx0UDogJ0tleVAnLFxuXHQnWyc6ICdCcmFja2V0TGVmdCcsXG5cdCddJzogJ0JyYWNrZXRSaWdodCcsXG5cdEE6ICdLZXlBJyxcblx0UzogJ0tleVMnLFxuXHREOiAnS2V5RCcsXG5cdEY6ICdLZXlGJyxcblx0RzogJ0tleUcnLFxuXHRIOiAnS2V5SCcsXG5cdEo6ICdLZXlKJyxcblx0SzogJ0tleUsnLFxuXHRMOiAnS2V5TCcsXG5cdCc7JzogJ1NlbWljb2xvbicsXG5cdCdcXCcnOiAnUXVvdGUnLFxuXHQnYCc6ICdCYWNrcXVvdGUnLFxuXHQnLyc6ICdCYWNrc2xhc2gnLFxuXHRaOiAnS2V5WicsXG5cdFg6ICdLZXlYJyxcblx0QzogJ0tleUMnLFxuXHRWOiAnS2V5VicsXG5cdEI6ICdLZXlCJyxcblx0TjogJ0tleU4nLFxuXHRNOiAnS2V5TScsXG5cdCcsJzogJ0NvbW1hJyxcblx0Jy4nOiAnUGVyaW9kJyxcblx0J1xcXFwnOiAnU2xhc2gnLFxuXHQnICc6ICdTcGFjZSdcbn07XG5cbmZ1bmN0aW9uIHJlZHVjZUtleSh7YWNjZWxlcmF0b3IsIGV2ZW50fSwga2V5KSB7XG5cdGlmIChrZXkubGVuZ3RoID4gMSB8fCBldmVudC5rZXkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFVudmFsaWQga2V5Y29kZSBcXGAke2tleX1cXGAuYCk7XG5cdH1cblxuXHRjb25zdCBjb2RlID1cblx0XHRrZXkudG9VcHBlckNhc2UoKSBpbiB2aXJ0dWFsS2V5Q29kZXMgP1xuXHRcdFx0dmlydHVhbEtleUNvZGVzW2tleS50b1VwcGVyQ2FzZSgpXSA6XG5cdFx0XHRudWxsO1xuXG5cdHJldHVybiB7XG5cdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7a2V5fSwgY29kZSA/IHtjb2RlfSA6IG51bGwpLFxuXHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci50cmltKCkuc2xpY2Uoa2V5Lmxlbmd0aClcblx0fTtcbn1cblxuY29uc3QgZG9tS2V5cyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwge1xuXHRwbHVzOiAnQWRkJyxcblx0c3BhY2U6ICdTcGFjZScsXG5cdHRhYjogJ1RhYicsXG5cdGJhY2tzcGFjZTogJ0JhY2tzcGFjZScsXG5cdGRlbGV0ZTogJ0RlbGV0ZScsXG5cdGluc2VydDogJ0luc2VydCcsXG5cdHJldHVybjogJ1JldHVybicsXG5cdGVudGVyOiAnUmV0dXJuJyxcblx0dXA6ICdBcnJvd1VwJyxcblx0ZG93bjogJ0Fycm93RG93bicsXG5cdGxlZnQ6ICdBcnJvd0xlZnQnLFxuXHRyaWdodDogJ0Fycm93UmlnaHQnLFxuXHRob21lOiAnSG9tZScsXG5cdGVuZDogJ0VuZCcsXG5cdHBhZ2V1cDogJ1BhZ2VVcCcsXG5cdHBhZ2Vkb3duOiAnUGFnZURvd24nLFxuXHRlc2NhcGU6ICdFc2NhcGUnLFxuXHRlc2M6ICdFc2NhcGUnLFxuXHR2b2x1bWV1cDogJ0F1ZGlvVm9sdW1lVXAnLFxuXHR2b2x1bWVkb3duOiAnQXVkaW9Wb2x1bWVEb3duJyxcblx0dm9sdW1lbXV0ZTogJ0F1ZGlvVm9sdW1lTXV0ZScsXG5cdG1lZGlhbmV4dHRyYWNrOiAnTWVkaWFUcmFja05leHQnLFxuXHRtZWRpYXByZXZpb3VzdHJhY2s6ICdNZWRpYVRyYWNrUHJldmlvdXMnLFxuXHRtZWRpYXN0b3A6ICdNZWRpYVN0b3AnLFxuXHRtZWRpYXBsYXlwYXVzZTogJ01lZGlhUGxheVBhdXNlJyxcblx0cHJpbnRzY3JlZW46ICdQcmludFNjcmVlbidcbn0pO1xuXG4vLyBBZGQgZnVuY3Rpb24ga2V5c1xuZm9yIChsZXQgaSA9IDE7IGkgPD0gMjQ7IGkrKykge1xuXHRkb21LZXlzW2BmJHtpfWBdID0gYEYke2l9YDtcbn1cblxuZnVuY3Rpb24gcmVkdWNlQ29kZSh7YWNjZWxlcmF0b3IsIGV2ZW50fSwge2NvZGUsIGtleX0pIHtcblx0aWYgKGV2ZW50LmNvZGUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQga2V5Y29kZSBcXGAke2tleX1cXGAuYCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge2tleX0sIGNvZGUgPyB7Y29kZX0gOiBudWxsKSxcblx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3IudHJpbSgpLnNsaWNlKChrZXkgJiYga2V5Lmxlbmd0aCkgfHwgMClcblx0fTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHRyYW5zZm9ybSBhbiBFbGVjdHJvbiBBY2NlbGVyYXRvciBzdHJpbmcgaW50b1xuICogYSBET00gS2V5Ym9hcmRFdmVudCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBhY2NlbGVyYXRvciBhbiBFbGVjdHJvbiBBY2NlbGVyYXRvciBzdHJpbmcsIGUuZy4gYEN0cmwrQ2Agb3IgYFNoaWZ0K1NwYWNlYC5cbiAqIEByZXR1cm4ge29iamVjdH0gYSBET00gS2V5Ym9hcmRFdmVudCBvYmplY3QgZGVyaXZhdGUgZnJvbSB0aGUgYGFjY2VsZXJhdG9yYCBhcmd1bWVudC5cbiAqL1xuZnVuY3Rpb24gdG9LZXlFdmVudChhY2NlbGVyYXRvcikge1xuXHRsZXQgc3RhdGUgPSB7YWNjZWxlcmF0b3IsIGV2ZW50OiB7fX07XG5cdHdoaWxlIChzdGF0ZS5hY2NlbGVyYXRvciAhPT0gJycpIHtcblx0XHRjb25zdCBtb2RpZmllck1hdGNoID0gc3RhdGUuYWNjZWxlcmF0b3IubWF0Y2gobW9kaWZpZXJzKTtcblx0XHRpZiAobW9kaWZpZXJNYXRjaCkge1xuXHRcdFx0Y29uc3QgbW9kaWZpZXIgPSBtb2RpZmllck1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRzdGF0ZSA9IHJlZHVjZU1vZGlmaWVyKHN0YXRlLCBtb2RpZmllcik7XG5cdFx0XHRpZiAoc3RhdGUgPT09IFVOU1VQUE9SVEVEKSB7XG5cdFx0XHRcdHJldHVybiB7dW5zdXBwb3J0ZWRLZXlGb3JQbGF0Zm9ybTogdHJ1ZX07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzdGF0ZS5hY2NlbGVyYXRvci50cmltKClbMF0gPT09ICcrJykge1xuXHRcdFx0c3RhdGUgPSByZWR1Y2VQbHVzKHN0YXRlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgY29kZU1hdGNoID0gc3RhdGUuYWNjZWxlcmF0b3IubWF0Y2goa2V5Q29kZXMpO1xuXHRcdFx0aWYgKGNvZGVNYXRjaCkge1xuXHRcdFx0XHRjb25zdCBjb2RlID0gY29kZU1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmIChjb2RlIGluIGRvbUtleXMpIHtcblx0XHRcdFx0XHRzdGF0ZSA9IHJlZHVjZUNvZGUoc3RhdGUsIHtcblx0XHRcdFx0XHRcdGNvZGU6IGRvbUtleXNbY29kZV0sXG5cdFx0XHRcdFx0XHRrZXk6IGNvZGVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0ZSA9IHJlZHVjZUtleShzdGF0ZSwgY29kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW52YWxpZCBhY2NlbGVyYXRvcjogXCIke3N0YXRlLmFjY2VsZXJhdG9yfVwiYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHN0YXRlLmV2ZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0VU5TVVBQT1JURUQsXG5cdHJlZHVjZU1vZGlmaWVyLFxuXHRyZWR1Y2VQbHVzLFxuXHRyZWR1Y2VLZXksXG5cdHJlZHVjZUNvZGUsXG5cdHRvS2V5RXZlbnRcbn07XG4iLCJpbXBvcnQgeyBPYnNpZGlhbkFjdGlvbkZuIH0gZnJvbSBcIi4uL3V0aWxzL29ic2lkaWFuVmltQ29tbWFuZFwiO1xuXG4vKipcbiAqIEZvbGxvd3MgdGhlIGxpbmsgdW5kZXIgdGhlIGN1cnNvciwgdGVtcG9yYXJpbHkgbW92aW5nIHRoZSBjdXJzb3IgaWYgbmVjZXNzYXJ5IGZvciBmb2xsb3ctbGluayB0b1xuICogd29yayAoaS5lLiBpZiB0aGUgY3Vyc29yIGlzIG9uIGEgc3RhcnRpbmcgc3F1YXJlIGJyYWNrZXQpLlxuICovXG5leHBvcnQgY29uc3QgZm9sbG93TGlua1VuZGVyQ3Vyc29yOiBPYnNpZGlhbkFjdGlvbkZuID0gKHZpbXJjUGx1Z2luKSA9PiB7XG4gIGNvbnN0IG9ic2lkaWFuRWRpdG9yID0gdmltcmNQbHVnaW4uZ2V0QWN0aXZlT2JzaWRpYW5FZGl0b3IoKTtcbiAgY29uc3QgeyBsaW5lLCBjaCB9ID0gb2JzaWRpYW5FZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gIGNvbnN0IGZpcnN0VHdvQ2hhcnMgPSBvYnNpZGlhbkVkaXRvci5nZXRSYW5nZShcbiAgICB7IGxpbmUsIGNoIH0sXG4gICAgeyBsaW5lLCBjaDogY2ggKyAyIH1cbiAgKTtcbiAgbGV0IG51bUNoYXJzTW92ZWQgPSAwO1xuICBmb3IgKGNvbnN0IGNoYXIgb2YgZmlyc3RUd29DaGFycykge1xuICAgIGlmIChjaGFyID09PSBcIltcIikge1xuICAgICAgb2JzaWRpYW5FZGl0b3IuZXhlYyhcImdvUmlnaHRcIik7XG4gICAgICBudW1DaGFyc01vdmVkKys7XG4gICAgfVxuICB9XG4gIHZpbXJjUGx1Z2luLmV4ZWN1dGVPYnNpZGlhbkNvbW1hbmQoXCJlZGl0b3I6Zm9sbG93LWxpbmtcIik7XG4gIC8vIE1vdmUgdGhlIGN1cnNvciBiYWNrIHRvIHdoZXJlIGl0IHdhc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUNoYXJzTW92ZWQ7IGkrKykge1xuICAgIG9ic2lkaWFuRWRpdG9yLmV4ZWMoXCJnb0xlZnRcIik7XG4gIH1cbn07XG4iLCJpbXBvcnQgVmltcmNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IE9ic2lkaWFuQWN0aW9uRm4gfSBmcm9tIFwiLi4vdXRpbHMvb2JzaWRpYW5WaW1Db21tYW5kXCI7XG5cbi8qKlxuICogTW92ZXMgdGhlIGN1cnNvciBkb3duIGByZXBlYXRgIGxpbmVzLCBza2lwcGluZyBvdmVyIGZvbGRlZCBzZWN0aW9ucy5cbiAqL1xuZXhwb3J0IGNvbnN0IG1vdmVEb3duU2tpcHBpbmdGb2xkczogT2JzaWRpYW5BY3Rpb25GbiA9IChcbiAgdmltcmNQbHVnaW4sXG4gIGNtLFxuICB7IHJlcGVhdCB9XG4pID0+IHtcbiAgbW92ZVNraXBwaW5nRm9sZHModmltcmNQbHVnaW4sIHJlcGVhdCwgXCJkb3duXCIpO1xufTtcblxuLyoqXG4gKiBNb3ZlcyB0aGUgY3Vyc29yIHVwIGByZXBlYXRgIGxpbmVzLCBza2lwcGluZyBvdmVyIGZvbGRlZCBzZWN0aW9ucy5cbiAqL1xuZXhwb3J0IGNvbnN0IG1vdmVVcFNraXBwaW5nRm9sZHM6IE9ic2lkaWFuQWN0aW9uRm4gPSAoXG4gIHZpbXJjUGx1Z2luLFxuICBjbSxcbiAgeyByZXBlYXQgfVxuKSA9PiB7XG4gIG1vdmVTa2lwcGluZ0ZvbGRzKHZpbXJjUGx1Z2luLCByZXBlYXQsIFwidXBcIik7XG59O1xuXG5mdW5jdGlvbiBtb3ZlU2tpcHBpbmdGb2xkcyhcbiAgdmltcmNQbHVnaW46IFZpbXJjUGx1Z2luLFxuICByZXBlYXQ6IG51bWJlcixcbiAgZGlyZWN0aW9uOiBcInVwXCIgfCBcImRvd25cIlxuKSB7XG4gIGNvbnN0IG9ic2lkaWFuRWRpdG9yID0gdmltcmNQbHVnaW4uZ2V0QWN0aXZlT2JzaWRpYW5FZGl0b3IoKTtcbiAgbGV0IHsgbGluZTogb2xkTGluZSwgY2g6IG9sZENoIH0gPSBvYnNpZGlhbkVkaXRvci5nZXRDdXJzb3IoKTtcbiAgY29uc3QgY29tbWFuZE5hbWUgPSBkaXJlY3Rpb24gPT09IFwidXBcIiA/IFwiZ29VcFwiIDogXCJnb0Rvd25cIjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXBlYXQ7IGkrKykge1xuICAgIG9ic2lkaWFuRWRpdG9yLmV4ZWMoY29tbWFuZE5hbWUpO1xuICAgIGNvbnN0IHsgbGluZTogbmV3TGluZSwgY2g6IG5ld0NoIH0gPSBvYnNpZGlhbkVkaXRvci5nZXRDdXJzb3IoKTtcbiAgICBpZiAobmV3TGluZSA9PT0gb2xkTGluZSAmJiBuZXdDaCA9PT0gb2xkQ2gpIHtcbiAgICAgIC8vIEdvaW5nIGluIHRoZSBzcGVjaWZpZWQgZGlyZWN0aW9uIGRvZXNuJ3QgZG8gYW55dGhpbmcgYW55bW9yZSwgc3RvcCBub3dcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgW29sZExpbmUsIG9sZENoXSA9IFtuZXdMaW5lLCBuZXdDaF07XG4gIH1cbn1cbiIsImltcG9ydCB7IEVkaXRvciBhcyBDb2RlTWlycm9yRWRpdG9yIH0gZnJvbSBcImNvZGVtaXJyb3JcIjtcbmltcG9ydCB7IEVkaXRvclBvc2l0aW9uIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcG9zaXRpb24gb2YgdGhlIHJlcGVhdC10aCBpbnN0YW5jZSBvZiBhIHBhdHRlcm4gZnJvbSBhIGdpdmVuIGN1cnNvciBwb3NpdGlvbiwgaW4gdGhlXG4gKiBnaXZlbiBkaXJlY3Rpb247IGxvb3BpbmcgdG8gdGhlIG90aGVyIGVuZCBvZiB0aGUgZG9jdW1lbnQgd2hlbiByZWFjaGluZyBvbmUgZW5kLiBSZXR1cm5zIHRoZVxuICogb3JpZ2luYWwgY3Vyc29yIHBvc2l0aW9uIGlmIG5vIG1hdGNoIGlzIGZvdW5kLlxuICpcbiAqIFVuZGVyIHRoZSBob29kLCB0byBhdm9pZCByZXBlYXRlZCBsb29wcyBvZiB0aGUgZG9jdW1lbnQ6IHdlIGdldCBhbGwgbWF0Y2hlcyBhdCBvbmNlLCBvcmRlciB0aGVtXG4gKiBhY2NvcmRpbmcgdG8gYGRpcmVjdGlvbmAgYW5kIGBjdXJzb3JQb3NpdGlvbmAsIGFuZCB1c2UgbW9kdWxvIGFyaXRobWV0aWMgdG8gcmV0dXJuIHRoZVxuICogYXBwcm9wcmlhdGUgbWF0Y2guXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqdW1wVG9QYXR0ZXJuKHtcbiAgY20sXG4gIGN1cnNvclBvc2l0aW9uLFxuICByZXBlYXQsXG4gIHJlZ2V4LFxuICBkaXJlY3Rpb24sXG59OiB7XG4gIGNtOiBDb2RlTWlycm9yRWRpdG9yO1xuICBjdXJzb3JQb3NpdGlvbjogRWRpdG9yUG9zaXRpb247XG4gIHJlcGVhdDogbnVtYmVyO1xuICByZWdleDogUmVnRXhwO1xuICBkaXJlY3Rpb246IFwibmV4dFwiIHwgXCJwcmV2aW91c1wiO1xufSk6IEVkaXRvclBvc2l0aW9uIHtcbiAgY29uc3QgY29udGVudCA9IGNtLmdldFZhbHVlKCk7XG4gIGNvbnN0IGN1cnNvcklkeCA9IGNtLmluZGV4RnJvbVBvcyhjdXJzb3JQb3NpdGlvbik7XG4gIGNvbnN0IG9yZGVyZWRNYXRjaGVzID0gZ2V0T3JkZXJlZE1hdGNoZXMoe1xuICAgIGNvbnRlbnQsXG4gICAgcmVnZXgsXG4gICAgY3Vyc29ySWR4LFxuICAgIGRpcmVjdGlvbixcbiAgfSk7XG4gIGNvbnN0IGVmZmVjdGl2ZVJlcGVhdCA9IChyZXBlYXQgJSBvcmRlcmVkTWF0Y2hlcy5sZW5ndGgpIHx8IG9yZGVyZWRNYXRjaGVzLmxlbmd0aDtcbiAgY29uc3QgbWF0Y2hJZHggPSBvcmRlcmVkTWF0Y2hlc1tlZmZlY3RpdmVSZXBlYXQgLSAxXT8uaW5kZXg7XG4gIGlmIChtYXRjaElkeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGN1cnNvclBvc2l0aW9uO1xuICB9XG4gIGNvbnN0IG5ld0N1cnNvclBvc2l0aW9uID0gY20ucG9zRnJvbUluZGV4KG1hdGNoSWR4KTtcbiAgcmV0dXJuIG5ld0N1cnNvclBvc2l0aW9uO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gb3JkZXJlZCBhcnJheSBvZiBhbGwgbWF0Y2hlcyBvZiBhIHJlZ2V4IGluIGEgc3RyaW5nIGluIHRoZSBnaXZlbiBkaXJlY3Rpb24gZnJvbSB0aGVcbiAqIGN1cnNvciBpbmRleCAobG9vcGluZyBhcm91bmQgdG8gdGhlIG90aGVyIGVuZCBvZiB0aGUgZG9jdW1lbnQgd2hlbiByZWFjaGluZyBvbmUgZW5kKS5cbiAqL1xuZnVuY3Rpb24gZ2V0T3JkZXJlZE1hdGNoZXMoe1xuICBjb250ZW50LFxuICByZWdleCxcbiAgY3Vyc29ySWR4LFxuICBkaXJlY3Rpb24sXG59OiB7XG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgcmVnZXg6IFJlZ0V4cDtcbiAgY3Vyc29ySWR4OiBudW1iZXI7XG4gIGRpcmVjdGlvbjogXCJuZXh0XCIgfCBcInByZXZpb3VzXCI7XG59KTogUmVnRXhwRXhlY0FycmF5W10ge1xuICBjb25zdCB7IHByZXZpb3VzTWF0Y2hlcywgY3VycmVudE1hdGNoZXMsIG5leHRNYXRjaGVzIH0gPSBnZXRBbmRHcm91cE1hdGNoZXMoXG4gICAgY29udGVudCxcbiAgICByZWdleCxcbiAgICBjdXJzb3JJZHhcbiAgKTtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gXCJuZXh0XCIpIHtcbiAgICByZXR1cm4gWy4uLm5leHRNYXRjaGVzLCAuLi5wcmV2aW91c01hdGNoZXMsIC4uLmN1cnJlbnRNYXRjaGVzXTtcbiAgfVxuICByZXR1cm4gW1xuICAgIC4uLnByZXZpb3VzTWF0Y2hlcy5yZXZlcnNlKCksXG4gICAgLi4ubmV4dE1hdGNoZXMucmV2ZXJzZSgpLFxuICAgIC4uLmN1cnJlbnRNYXRjaGVzLnJldmVyc2UoKSxcbiAgXTtcbn1cblxuLyoqXG4gKiBGaW5kcyBhbGwgbWF0Y2hlcyBvZiBhIHJlZ2V4IGluIGEgc3RyaW5nIGFuZCBncm91cHMgdGhlbSBieSB0aGVpciBwb3NpdGlvbnMgcmVsYXRpdmUgdG8gdGhlXG4gKiBjdXJzb3IuXG4gKi9cbmZ1bmN0aW9uIGdldEFuZEdyb3VwTWF0Y2hlcyhcbiAgY29udGVudDogc3RyaW5nLFxuICByZWdleDogUmVnRXhwLFxuICBjdXJzb3JJZHg6IG51bWJlclxuKToge1xuICBwcmV2aW91c01hdGNoZXM6IFJlZ0V4cEV4ZWNBcnJheVtdO1xuICBjdXJyZW50TWF0Y2hlczogUmVnRXhwRXhlY0FycmF5W107XG4gIG5leHRNYXRjaGVzOiBSZWdFeHBFeGVjQXJyYXlbXTtcbn0ge1xuICBjb25zdCBnbG9iYWxSZWdleCA9IG1ha2VHbG9iYWxSZWdleChyZWdleCk7XG4gIGNvbnN0IGFsbE1hdGNoZXMgPSBbLi4uY29udGVudC5tYXRjaEFsbChnbG9iYWxSZWdleCldO1xuICBjb25zdCBwcmV2aW91c01hdGNoZXMgPSBhbGxNYXRjaGVzLmZpbHRlcihcbiAgICAobWF0Y2gpID0+IG1hdGNoLmluZGV4IDwgY3Vyc29ySWR4ICYmICFpc0N1cnNvck9uTWF0Y2gobWF0Y2gsIGN1cnNvcklkeClcbiAgKTtcbiAgY29uc3QgY3VycmVudE1hdGNoZXMgPSBhbGxNYXRjaGVzLmZpbHRlcigobWF0Y2gpID0+XG4gICAgaXNDdXJzb3JPbk1hdGNoKG1hdGNoLCBjdXJzb3JJZHgpXG4gICk7XG4gIGNvbnN0IG5leHRNYXRjaGVzID0gYWxsTWF0Y2hlcy5maWx0ZXIoKG1hdGNoKSA9PiBtYXRjaC5pbmRleCA+IGN1cnNvcklkeCk7XG4gIHJldHVybiB7IHByZXZpb3VzTWF0Y2hlcywgY3VycmVudE1hdGNoZXMsIG5leHRNYXRjaGVzIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VHbG9iYWxSZWdleChyZWdleDogUmVnRXhwKTogUmVnRXhwIHtcbiAgY29uc3QgZ2xvYmFsRmxhZ3MgPSBnZXRHbG9iYWxGbGFncyhyZWdleCk7XG4gIHJldHVybiBuZXcgUmVnRXhwKHJlZ2V4LnNvdXJjZSwgZ2xvYmFsRmxhZ3MpO1xufVxuXG5mdW5jdGlvbiBnZXRHbG9iYWxGbGFncyhyZWdleDogUmVnRXhwKTogc3RyaW5nIHtcbiAgY29uc3QgeyBmbGFncyB9ID0gcmVnZXg7XG4gIHJldHVybiBmbGFncy5pbmNsdWRlcyhcImdcIikgPyBmbGFncyA6IGAke2ZsYWdzfWdgO1xufVxuXG5mdW5jdGlvbiBpc0N1cnNvck9uTWF0Y2gobWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSwgY3Vyc29ySWR4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIG1hdGNoLmluZGV4IDw9IGN1cnNvcklkeCAmJiBjdXJzb3JJZHggPCBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbn1cbiIsImltcG9ydCB7IGp1bXBUb1BhdHRlcm4gfSBmcm9tIFwiLi4vdXRpbHMvanVtcFRvUGF0dGVyblwiO1xuaW1wb3J0IHsgTW90aW9uRm4gfSBmcm9tIFwiLi4vdXRpbHMvdmltQXBpXCI7XG5cbmNvbnN0IEhFQURJTkdfUkVHRVggPSAvXiMrIC9nbTtcblxuLyoqXG4gKiBKdW1wcyB0byB0aGUgcmVwZWF0LXRoIG5leHQgaGVhZGluZy5cbiAqL1xuZXhwb3J0IGNvbnN0IGp1bXBUb05leHRIZWFkaW5nOiBNb3Rpb25GbiA9IChjbSwgY3Vyc29yUG9zaXRpb24sIHsgcmVwZWF0IH0pID0+IHtcbiAgcmV0dXJuIGp1bXBUb1BhdHRlcm4oe1xuICAgIGNtLFxuICAgIGN1cnNvclBvc2l0aW9uLFxuICAgIHJlcGVhdCxcbiAgICByZWdleDogSEVBRElOR19SRUdFWCxcbiAgICBkaXJlY3Rpb246IFwibmV4dFwiLFxuICB9KTtcbn07XG5cbi8qKlxuICogSnVtcHMgdG8gdGhlIHJlcGVhdC10aCBwcmV2aW91cyBoZWFkaW5nLlxuICovXG5leHBvcnQgY29uc3QganVtcFRvUHJldmlvdXNIZWFkaW5nOiBNb3Rpb25GbiA9IChcbiAgY20sXG4gIGN1cnNvclBvc2l0aW9uLFxuICB7IHJlcGVhdCB9XG4pID0+IHtcbiAgcmV0dXJuIGp1bXBUb1BhdHRlcm4oe1xuICAgIGNtLFxuICAgIGN1cnNvclBvc2l0aW9uLFxuICAgIHJlcGVhdCxcbiAgICByZWdleDogSEVBRElOR19SRUdFWCxcbiAgICBkaXJlY3Rpb246IFwicHJldmlvdXNcIixcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsganVtcFRvUGF0dGVybiB9IGZyb20gXCIuLi91dGlscy9qdW1wVG9QYXR0ZXJuXCI7XG5pbXBvcnQgeyBNb3Rpb25GbiB9IGZyb20gXCIuLi91dGlscy92aW1BcGlcIjtcblxuY29uc3QgV0lLSUxJTktfUkVHRVhfU1RSSU5HID0gXCJcXFxcW1xcXFxbW15cXFxcXVxcXFxdXSs/XFxcXF1cXFxcXVwiO1xuY29uc3QgTUFSS0RPV05fTElOS19SRUdFWF9TVFJJTkcgPSBcIlxcXFxbW15cXFxcXV0rP1xcXFxdXFxcXChbXildKz9cXFxcKVwiO1xuY29uc3QgTElOS19SRUdFWF9TVFJJTkcgPSBgJHtXSUtJTElOS19SRUdFWF9TVFJJTkd9fCR7TUFSS0RPV05fTElOS19SRUdFWF9TVFJJTkd9YDtcbmNvbnN0IExJTktfUkVHRVggPSBuZXcgUmVnRXhwKExJTktfUkVHRVhfU1RSSU5HLCBcImdcIik7XG5cbi8qKlxuICogSnVtcHMgdG8gdGhlIHJlcGVhdC10aCBuZXh0IGxpbmsuXG4qL1xuZXhwb3J0IGNvbnN0IGp1bXBUb05leHRMaW5rOiBNb3Rpb25GbiA9IChjbSwgY3Vyc29yUG9zaXRpb24sIHsgcmVwZWF0IH0pID0+IHtcbiAgcmV0dXJuIGp1bXBUb1BhdHRlcm4oe1xuICAgIGNtLFxuICAgIGN1cnNvclBvc2l0aW9uLFxuICAgIHJlcGVhdCxcbiAgICByZWdleDogTElOS19SRUdFWCxcbiAgICBkaXJlY3Rpb246IFwibmV4dFwiLFxuICB9KTtcbn07XG5cbi8qKlxuICogSnVtcHMgdG8gdGhlIHJlcGVhdC10aCBwcmV2aW91cyBsaW5rLlxuICovXG5leHBvcnQgY29uc3QganVtcFRvUHJldmlvdXNMaW5rOiBNb3Rpb25GbiA9IChjbSwgY3Vyc29yUG9zaXRpb24sIHsgcmVwZWF0IH0pID0+IHtcbiAgcmV0dXJuIGp1bXBUb1BhdHRlcm4oe1xuICAgIGNtLFxuICAgIGN1cnNvclBvc2l0aW9uLFxuICAgIHJlcGVhdCxcbiAgICByZWdleDogTElOS19SRUdFWCxcbiAgICBkaXJlY3Rpb246IFwicHJldmlvdXNcIixcbiAgfSk7XG59O1xuIiwiLyoqXG4gKiBVdGlsaXR5IHR5cGVzIGFuZCBmdW5jdGlvbnMgZm9yIGRlZmluaW5nIE9ic2lkaWFuLXNwZWNpZmljIFZpbSBjb21tYW5kcy5cbiAqL1xuXG5pbXBvcnQgeyBFZGl0b3IgYXMgQ29kZU1pcnJvckVkaXRvciB9IGZyb20gXCJjb2RlbWlycm9yXCI7XG5cbmltcG9ydCBWaW1yY1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgTW90aW9uRm4sIFZpbUFwaSB9IGZyb20gXCIuL3ZpbUFwaVwiO1xuXG5leHBvcnQgdHlwZSBPYnNpZGlhbkFjdGlvbkZuID0gKFxuICB2aW1yY1BsdWdpbjogVmltcmNQbHVnaW4sICAvLyBJbmNsdWRlZCBzbyB3ZSBjYW4gcnVuIE9ic2lkaWFuIGNvbW1hbmRzIGFzIHBhcnQgb2YgdGhlIGFjdGlvblxuICBjbTogQ29kZU1pcnJvckVkaXRvcixcbiAgYWN0aW9uQXJnczogeyByZXBlYXQ6IG51bWJlciB9LFxuKSA9PiB2b2lkO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lQW5kTWFwT2JzaWRpYW5WaW1Nb3Rpb24oXG4gIHZpbU9iamVjdDogVmltQXBpLFxuICBtb3Rpb25GbjogTW90aW9uRm4sXG4gIG1hcHBpbmc6IHN0cmluZ1xuKSB7XG4gIHZpbU9iamVjdC5kZWZpbmVNb3Rpb24obW90aW9uRm4ubmFtZSwgbW90aW9uRm4pO1xuICB2aW1PYmplY3QubWFwQ29tbWFuZChtYXBwaW5nLCBcIm1vdGlvblwiLCBtb3Rpb25Gbi5uYW1lLCB1bmRlZmluZWQsIHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUFuZE1hcE9ic2lkaWFuVmltQWN0aW9uKFxuICB2aW1PYmplY3Q6IFZpbUFwaSxcbiAgdmltcmNQbHVnaW46IFZpbXJjUGx1Z2luLFxuICBvYnNpZGlhbkFjdGlvbkZuOiBPYnNpZGlhbkFjdGlvbkZuLFxuICBtYXBwaW5nOiBzdHJpbmdcbikge1xuICB2aW1PYmplY3QuZGVmaW5lQWN0aW9uKG9ic2lkaWFuQWN0aW9uRm4ubmFtZSwgKGNtLCBhY3Rpb25BcmdzKSA9PiB7XG4gICAgb2JzaWRpYW5BY3Rpb25Gbih2aW1yY1BsdWdpbiwgY20sIGFjdGlvbkFyZ3MpO1xuICB9KTtcbiAgdmltT2JqZWN0Lm1hcENvbW1hbmQobWFwcGluZywgXCJhY3Rpb25cIiwgb2JzaWRpYW5BY3Rpb25Gbi5uYW1lLCB1bmRlZmluZWQsIHt9KTtcbn1cbiIsImltcG9ydCAqIGFzIGtleUZyb21BY2NlbGVyYXRvciBmcm9tICdrZXlib2FyZGV2ZW50LWZyb20tZWxlY3Ryb24tYWNjZWxlcmF0b3InO1xyXG5pbXBvcnQgeyBBcHAsIEVkaXRvclNlbGVjdGlvbiwgTWFya2Rvd25WaWV3LCBOb3RpY2UsIEVkaXRvciBhcyBPYnNpZGlhbkVkaXRvciwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuaW1wb3J0IHsgZm9sbG93TGlua1VuZGVyQ3Vyc29yIH0gZnJvbSAnLi9hY3Rpb25zL2ZvbGxvd0xpbmtVbmRlckN1cnNvcic7XHJcbmltcG9ydCB7IG1vdmVEb3duU2tpcHBpbmdGb2xkcywgbW92ZVVwU2tpcHBpbmdGb2xkcyB9IGZyb20gJy4vYWN0aW9ucy9tb3ZlU2tpcHBpbmdGb2xkcyc7XHJcbmltcG9ydCB7IGp1bXBUb05leHRIZWFkaW5nLCBqdW1wVG9QcmV2aW91c0hlYWRpbmcgfSBmcm9tICcuL21vdGlvbnMvanVtcFRvSGVhZGluZyc7XHJcbmltcG9ydCB7IGp1bXBUb05leHRMaW5rLCBqdW1wVG9QcmV2aW91c0xpbmsgfSBmcm9tICcuL21vdGlvbnMvanVtcFRvTGluayc7XHJcbmltcG9ydCB7IGRlZmluZUFuZE1hcE9ic2lkaWFuVmltQWN0aW9uLCBkZWZpbmVBbmRNYXBPYnNpZGlhblZpbU1vdGlvbiB9IGZyb20gJy4vdXRpbHMvb2JzaWRpYW5WaW1Db21tYW5kJztcclxuaW1wb3J0IHsgVmltQXBpIH0gZnJvbSAnLi91dGlscy92aW1BcGknO1xyXG5cclxuZGVjbGFyZSBjb25zdCBDb2RlTWlycm9yOiBhbnk7XHJcblxyXG5jb25zdCBlbnVtIHZpbVN0YXR1cyB7XHJcblx0bm9ybWFsID0gJ25vcm1hbCcsXHJcblx0aW5zZXJ0ID0gJ2luc2VydCcsXHJcblx0dmlzdWFsID0gJ3Zpc3VhbCcsXHJcblx0cmVwbGFjZSA9ICdyZXBsYWNlJyxcclxufVxyXG50eXBlIFZpbVN0YXR1c1Byb21wdCA9IHN0cmluZztcclxudHlwZSBWaW1TdGF0dXNQcm9tcHRNYXAgPSB7XHJcblx0W3N0YXR1cyBpbiB2aW1TdGF0dXNdOiBWaW1TdGF0dXNQcm9tcHQ7XHJcbn07XHJcblxyXG5pbnRlcmZhY2UgU2V0dGluZ3Mge1xyXG5cdHZpbXJjRmlsZU5hbWU6IHN0cmluZyxcclxuXHRkaXNwbGF5Q2hvcmQ6IGJvb2xlYW4sXHJcblx0ZGlzcGxheVZpbU1vZGU6IGJvb2xlYW4sXHJcblx0Zml4ZWROb3JtYWxNb2RlTGF5b3V0OiBib29sZWFuLFxyXG5cdGNhcHR1cmVkS2V5Ym9hcmRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXHJcblx0c3VwcG9ydEpzQ29tbWFuZHM/OiBib29sZWFuXHJcblx0dmltU3RhdHVzUHJvbXB0TWFwOiBWaW1TdGF0dXNQcm9tcHRNYXA7XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNldHRpbmdzID0ge1xyXG5cdHZpbXJjRmlsZU5hbWU6IFwiLm9ic2lkaWFuLnZpbXJjXCIsXHJcblx0ZGlzcGxheUNob3JkOiBmYWxzZSxcclxuXHRkaXNwbGF5VmltTW9kZTogZmFsc2UsXHJcblx0Zml4ZWROb3JtYWxNb2RlTGF5b3V0OiBmYWxzZSxcclxuXHRjYXB0dXJlZEtleWJvYXJkTWFwOiB7fSxcclxuXHRzdXBwb3J0SnNDb21tYW5kczogZmFsc2UsXHJcblx0dmltU3RhdHVzUHJvbXB0TWFwOiB7XHJcblx0XHRub3JtYWw6ICfwn5+iJyxcclxuXHRcdGluc2VydDogJ/Cfn6AnLFxyXG5cdFx0dmlzdWFsOiAn8J+foScsXHJcblx0XHRyZXBsYWNlOiAn8J+UtCcsXHJcblx0fSxcclxufVxyXG5cclxuY29uc3QgdmltU3RhdHVzUHJvbXB0Q2xhc3MgPSBcInZpbXJjLXN1cHBvcnQtdmltLW1vZGVcIjtcclxuXHJcbi8vIE5PVEU6IHRvIGZ1dHVyZSBtYWludGFpbmVycywgcGxlYXNlIG1ha2Ugc3VyZSBhbGwgbWFwcGluZyBjb21tYW5kcyBhcmUgaW5jbHVkZWQgaW4gdGhpcyBhcnJheS5cclxuY29uc3QgbWFwcGluZ0NvbW1hbmRzOiBTdHJpbmdbXSA9IFtcclxuXHRcIm1hcFwiLFxyXG5cdFwibm1hcFwiLFxyXG5cdFwibm9yZW1hcFwiLFxyXG5cdFwiaXVubWFwXCIsXHJcblx0XCJudW5tYXBcIixcclxuXHRcInZ1bm1hcFwiLFxyXG5dXHJcblxyXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKSB7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaW1yY1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcblx0c2V0dGluZ3M6IFNldHRpbmdzO1xyXG5cclxuXHRwcml2YXRlIGNvZGVNaXJyb3JWaW1PYmplY3Q6IGFueSA9IG51bGw7XHJcblx0cHJpdmF0ZSBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuXHRwcml2YXRlIGxhc3RZYW5rQnVmZmVyOiBzdHJpbmdbXSA9IFtcIlwiXTtcclxuXHRwcml2YXRlIGxhc3RTeXN0ZW1DbGlwYm9hcmQgPSBcIlwiO1xyXG5cdHByaXZhdGUgeWFua1RvU3lzdGVtQ2xpcGJvYXJkOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBjdXJyZW50S2V5Q2hvcmQ6IGFueSA9IFtdO1xyXG5cdHByaXZhdGUgdmltQ2hvcmRTdGF0dXNCYXI6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuXHRwcml2YXRlIHZpbVN0YXR1c0JhcjogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG5cdHByaXZhdGUgY3VycmVudFZpbVN0YXR1czogdmltU3RhdHVzID0gdmltU3RhdHVzLm5vcm1hbDtcclxuXHRwcml2YXRlIGN1c3RvbVZpbUtleWJpbmRzOiB7IFtuYW1lOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcclxuXHRwcml2YXRlIGN1cnJlbnRTZWxlY3Rpb246IFtFZGl0b3JTZWxlY3Rpb25dID0gbnVsbDtcclxuXHRwcml2YXRlIGlzSW5zZXJ0TW9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHR1cGRhdGVWaW1TdGF0dXNCYXIoKSB7XHJcblx0XHR0aGlzLnZpbVN0YXR1c0Jhci5zZXRUZXh0KFxyXG5cdFx0XHR0aGlzLnNldHRpbmdzLnZpbVN0YXR1c1Byb21wdE1hcFt0aGlzLmN1cnJlbnRWaW1TdGF0dXNdXHJcblx0XHQpO1xyXG5cdFx0dGhpcy52aW1TdGF0dXNCYXIuZGF0YXNldC52aW1Nb2RlID0gdGhpcy5jdXJyZW50VmltU3RhdHVzO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgY2FwdHVyZUtleWJvYXJkTGF5b3V0KCkge1xyXG5cdFx0Ly8gVGhpcyBpcyBleHBlcmltZW50YWwgQVBJIGFuZCBpdCBtaWdodCBicmVhayBhdCBzb21lIHBvaW50OlxyXG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0tleWJvYXJkTGF5b3V0TWFwXHJcblx0XHRsZXQga2V5TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XHJcblx0XHRsZXQgbGF5b3V0ID0gYXdhaXQgKG5hdmlnYXRvciBhcyBhbnkpLmtleWJvYXJkLmdldExheW91dE1hcCgpO1xyXG5cdFx0bGV0IGRvbmVJdGVyYXRpbmcgPSBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBjb3VudGVkID0gMDtcclxuXHRcdFx0bGF5b3V0LmZvckVhY2goKHZhbHVlOiBhbnksIGluZGV4OiBhbnkpID0+IHtcclxuXHRcdFx0XHRrZXlNYXBbaW5kZXhdID0gdmFsdWU7XHJcblx0XHRcdFx0Y291bnRlZCArPSAxO1xyXG5cdFx0XHRcdGlmIChjb3VudGVkID09PSBsYXlvdXQuc2l6ZSlcclxuXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHRcdGF3YWl0IGRvbmVJdGVyYXRpbmc7XHJcblx0XHRuZXcgTm90aWNlKCdLZXlib2FyZCBsYXlvdXQgY2FwdHVyZWQnKTtcclxuXHRcdHJldHVybiBrZXlNYXA7XHJcblx0fVxyXG5cclxuXHRhc3luYyBpbml0aWFsaXplKCkge1xyXG5cdFx0aWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLmNvZGVNaXJyb3JWaW1PYmplY3QgPSAod2luZG93IGFzIGFueSkuQ29kZU1pcnJvckFkYXB0ZXI/LlZpbTtcclxuXHJcblx0XHR0aGlzLnJlZ2lzdGVyWWFua0V2ZW50cyhhY3RpdmVXaW5kb3cpO1xyXG5cdFx0dGhpcy5hcHAud29ya3NwYWNlLm9uKFwid2luZG93LW9wZW5cIiwgKHdvcmtzcGFjZVdpbmRvdywgdykgPT4ge1xyXG5cdFx0XHR0aGlzLnJlZ2lzdGVyWWFua0V2ZW50cyh3KTtcclxuXHRcdH0pXHJcblxyXG5cdFx0Ly8gVHdvIGV2ZW50cyBjb3NcclxuXHRcdC8vIHRoaXMgZG9uJ3QgdHJpZ2dlciBvbiBsb2FkaW5nL3JlbG9hZGluZyBvYnNpZGlhbiB3aXRoIG5vdGUgb3BlbmVkXHJcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVNlbGVjdGlvbkV2ZW50KCk7XHJcblxyXG5cdFx0XHR0aGlzLnVwZGF0ZVZpbUV2ZW50cygpO1xyXG5cdFx0fSk7XHJcblx0XHQvLyBhbmQgdGhpcyBkb24ndCB0cmlnZ2VyIG9uIG9wZW5pbmcgc2FtZSBmaWxlIGluIG5ldyBwYW5lXHJcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJmaWxlLW9wZW5cIiwgYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVNlbGVjdGlvbkV2ZW50KCk7XHJcblxyXG5cdFx0XHR0aGlzLnVwZGF0ZVZpbUV2ZW50cygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRyZWdpc3RlcllhbmtFdmVudHMod2luOiBXaW5kb3cpIHtcclxuXHRcdHRoaXMucmVnaXN0ZXJEb21FdmVudCh3aW4uZG9jdW1lbnQsICdjbGljaycsICgpID0+IHtcclxuXHRcdFx0dGhpcy5jYXB0dXJlWWFua0J1ZmZlcih3aW4pO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnJlZ2lzdGVyRG9tRXZlbnQod2luLmRvY3VtZW50LCAna2V5dXAnLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuY2FwdHVyZVlhbmtCdWZmZXIod2luKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5yZWdpc3RlckRvbUV2ZW50KHdpbi5kb2N1bWVudCwgJ2ZvY3VzaW4nLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuY2FwdHVyZVlhbmtCdWZmZXIod2luKTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRhc3luYyB1cGRhdGVTZWxlY3Rpb25FdmVudCgpIHtcclxuXHRcdGNvbnN0IHZpZXcgPSB0aGlzLmdldEFjdGl2ZVZpZXcoKTtcclxuXHRcdGlmICghdmlldykgcmV0dXJuO1xyXG5cclxuXHRcdGxldCBjbSA9IHRoaXMuZ2V0Q29kZU1pcnJvcih2aWV3KTtcclxuXHRcdGlmIChcclxuXHRcdFx0dGhpcy5nZXRDdXJzb3JBY3Rpdml0eUhhbmRsZXJzKGNtKS5zb21lKFxyXG5cdFx0XHRcdChlOiB7IG5hbWU6IHN0cmluZyB9KSA9PiBlLm5hbWUgPT09IFwidXBkYXRlU2VsZWN0aW9uXCIpXHJcblx0XHQpIHJldHVybjtcclxuXHRcdGNtLm9uKFwiY3Vyc29yQWN0aXZpdHlcIiwgYXN5bmMgKGNtOiBDb2RlTWlycm9yLkVkaXRvcikgPT4gdGhpcy51cGRhdGVTZWxlY3Rpb24oY20pKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHVwZGF0ZVNlbGVjdGlvbihjbTogYW55KSB7XHJcblx0XHR0aGlzLmN1cnJlbnRTZWxlY3Rpb24gPSBjbS5saXN0U2VsZWN0aW9ucygpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRDdXJzb3JBY3Rpdml0eUhhbmRsZXJzKGNtOiBDb2RlTWlycm9yLkVkaXRvcikge1xyXG5cdFx0cmV0dXJuIChjbSBhcyBhbnkpLl9oYW5kbGVycy5jdXJzb3JBY3Rpdml0eTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHVwZGF0ZVZpbUV2ZW50cygpIHtcclxuXHRcdGlmICghKHRoaXMuYXBwIGFzIEFueSkuaXNWaW1FbmFibGVkKCkpXHJcblx0XHRcdHJldHVybjtcclxuXHRcdGxldCB2aWV3ID0gdGhpcy5nZXRBY3RpdmVWaWV3KCk7XHJcblx0XHRpZiAodmlldykge1xyXG5cdFx0XHRjb25zdCBjbUVkaXRvciA9IHRoaXMuZ2V0Q29kZU1pcnJvcih2aWV3KTtcclxuXHJcblx0XHRcdC8vIFNlZSBodHRwczovL2NvZGVtaXJyb3IubmV0L2RvYy9tYW51YWwuaHRtbCN2aW1hcGlfZXZlbnRzIGZvciBldmVudHMuXHJcblx0XHRcdHRoaXMuaXNJbnNlcnRNb2RlID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuY3VycmVudFZpbVN0YXR1cyA9IHZpbVN0YXR1cy5ub3JtYWw7XHJcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmRpc3BsYXlWaW1Nb2RlKVxyXG5cdFx0XHRcdHRoaXMudXBkYXRlVmltU3RhdHVzQmFyKCk7XHJcblx0XHRcdGNtRWRpdG9yLm9mZigndmltLW1vZGUtY2hhbmdlJywgdGhpcy5sb2dWaW1Nb2RlQ2hhbmdlKTtcclxuXHRcdFx0Y21FZGl0b3Iub24oJ3ZpbS1tb2RlLWNoYW5nZScsIHRoaXMubG9nVmltTW9kZUNoYW5nZSk7XHJcblxyXG5cdFx0XHR0aGlzLmN1cnJlbnRLZXlDaG9yZCA9IFtdO1xyXG5cdFx0XHRjbUVkaXRvci5vZmYoJ3ZpbS1rZXlwcmVzcycsIHRoaXMub25WaW1LZXlwcmVzcyk7XHJcblx0XHRcdGNtRWRpdG9yLm9uKCd2aW0ta2V5cHJlc3MnLCB0aGlzLm9uVmltS2V5cHJlc3MpO1xyXG5cdFx0XHRjbUVkaXRvci5vZmYoJ3ZpbS1jb21tYW5kLWRvbmUnLCB0aGlzLm9uVmltQ29tbWFuZERvbmUpO1xyXG5cdFx0XHRjbUVkaXRvci5vbigndmltLWNvbW1hbmQtZG9uZScsIHRoaXMub25WaW1Db21tYW5kRG9uZSk7XHJcblx0XHRcdENvZGVNaXJyb3Iub2ZmKGNtRWRpdG9yLmdldElucHV0RmllbGQoKSwgJ2tleWRvd24nLCB0aGlzLm9uS2V5ZG93bik7XHJcblx0XHRcdENvZGVNaXJyb3Iub24oY21FZGl0b3IuZ2V0SW5wdXRGaWVsZCgpLCAna2V5ZG93bicsIHRoaXMub25LZXlkb3duKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIG9ubG9hZCgpIHtcclxuXHRcdGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSlcclxuXHJcblx0XHRjb25zb2xlLmxvZygnbG9hZGluZyBWaW1yYyBwbHVnaW4nKTtcclxuXHJcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2FjdGl2ZS1sZWFmLWNoYW5nZScsIGFzeW5jICgpID0+IHtcclxuXHRcdFx0aWYgKCF0aGlzLmluaXRpYWxpemVkKVxyXG5cdFx0XHRcdGF3YWl0IHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cdFx0XHRpZiAodGhpcy5jb2RlTWlycm9yVmltT2JqZWN0LmxvYWRlZFZpbXJjKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0bGV0IGZpbGVOYW1lID0gdGhpcy5zZXR0aW5ncy52aW1yY0ZpbGVOYW1lO1xyXG5cdFx0XHRpZiAoIWZpbGVOYW1lIHx8IGZpbGVOYW1lLnRyaW0oKS5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRmaWxlTmFtZSA9IERFRkFVTFRfU0VUVElOR1MudmltcmNGaWxlTmFtZTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnQ29uZmlndXJlZCBWaW1yYyBmaWxlIG5hbWUgaXMgaWxsZWdhbCwgZmFsbGluZy1iYWNrIHRvIGRlZmF1bHQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdmltcmNDb250ZW50ID0gJyc7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmltcmNDb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci5yZWFkKGZpbGVOYW1lKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdFcnJvciBsb2FkaW5nIHZpbXJjIGZpbGUnLCBmaWxlTmFtZSwgJ2Zyb20gdGhlIHZhdWx0IHJvb3QnLCBlLm1lc3NhZ2UpXHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5yZWFkVmltSW5pdCh2aW1yY0NvbnRlbnQpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcblx0XHRjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5sb2FkRGF0YSgpO1xyXG5cdFx0dGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGRhdGEpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG5cdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cdGxvZ1ZpbU1vZGVDaGFuZ2UgPSBhc3luYyAoY206IGFueSkgPT4ge1xyXG5cdFx0aWYgKCFjbSkgcmV0dXJuO1xyXG5cdFx0dGhpcy5pc0luc2VydE1vZGUgPSBjbS5tb2RlID09PSAnaW5zZXJ0JztcclxuXHRcdHN3aXRjaCAoY20ubW9kZSkge1xyXG5cdFx0XHRjYXNlIFwiaW5zZXJ0XCI6XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50VmltU3RhdHVzID0gdmltU3RhdHVzLmluc2VydDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcIm5vcm1hbFwiOlxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFZpbVN0YXR1cyA9IHZpbVN0YXR1cy5ub3JtYWw7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgXCJ2aXN1YWxcIjpcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRWaW1TdGF0dXMgPSB2aW1TdGF0dXMudmlzdWFsO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFwicmVwbGFjZVwiOlxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFZpbVN0YXR1cyA9IHZpbVN0YXR1cy5yZXBsYWNlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MuZGlzcGxheVZpbU1vZGUpXHJcblx0XHRcdHRoaXMudXBkYXRlVmltU3RhdHVzQmFyKCk7XHJcblx0fVxyXG5cclxuXHRvbnVubG9hZCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCd1bmxvYWRpbmcgVmltcmMgcGx1Z2luIChidXQgVmltIGNvbW1hbmRzIHRoYXQgd2VyZSBhbHJlYWR5IGxvYWRlZCB3aWxsIHN0aWxsIHdvcmspJyk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldEFjdGl2ZVZpZXcoKTogTWFya2Rvd25WaWV3IHtcclxuXHRcdHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xyXG5cdH1cclxuXHJcblx0Z2V0QWN0aXZlT2JzaWRpYW5FZGl0b3IoKTogT2JzaWRpYW5FZGl0b3Ige1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0QWN0aXZlVmlldygpLmVkaXRvcjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0Q29kZU1pcnJvcih2aWV3OiBNYXJrZG93blZpZXcpOiBDb2RlTWlycm9yLkVkaXRvciB7XHJcblx0XHRyZXR1cm4gKHZpZXcgYXMgYW55KS5lZGl0TW9kZT8uZWRpdG9yPy5jbT8uY207XHJcblx0fVxyXG5cclxuXHRyZWFkVmltSW5pdCh2aW1Db21tYW5kczogc3RyaW5nKSB7XHJcblx0XHRsZXQgdmlldyA9IHRoaXMuZ2V0QWN0aXZlVmlldygpO1xyXG5cdFx0aWYgKHZpZXcpIHtcclxuXHRcdFx0dmFyIGNtRWRpdG9yID0gdGhpcy5nZXRDb2RlTWlycm9yKHZpZXcpO1xyXG5cdFx0XHRpZiAoY21FZGl0b3IgJiYgIXRoaXMuY29kZU1pcnJvclZpbU9iamVjdC5sb2FkZWRWaW1yYykge1xyXG5cdFx0XHRcdHRoaXMuZGVmaW5lQmFzaWNDb21tYW5kcyh0aGlzLmNvZGVNaXJyb3JWaW1PYmplY3QpO1xyXG5cdFx0XHRcdHRoaXMuZGVmaW5lQW5kTWFwT2JzaWRpYW5WaW1Db21tYW5kcyh0aGlzLmNvZGVNaXJyb3JWaW1PYmplY3QpO1xyXG5cdFx0XHRcdHRoaXMuZGVmaW5lU2VuZEtleXModGhpcy5jb2RlTWlycm9yVmltT2JqZWN0KTtcclxuXHRcdFx0XHR0aGlzLmRlZmluZU9iQ29tbWFuZCh0aGlzLmNvZGVNaXJyb3JWaW1PYmplY3QpO1xyXG5cdFx0XHRcdHRoaXMuZGVmaW5lU3Vycm91bmQodGhpcy5jb2RlTWlycm9yVmltT2JqZWN0KTtcclxuXHRcdFx0XHR0aGlzLmRlZmluZUpzQ29tbWFuZCh0aGlzLmNvZGVNaXJyb3JWaW1PYmplY3QpO1xyXG5cdFx0XHRcdHRoaXMuZGVmaW5lSnNGaWxlKHRoaXMuY29kZU1pcnJvclZpbU9iamVjdCk7XHJcblx0XHRcdFx0dGhpcy5kZWZpbmVTb3VyY2UodGhpcy5jb2RlTWlycm9yVmltT2JqZWN0KTtcclxuXHJcblx0XHRcdFx0dGhpcy5sb2FkVmltQ29tbWFuZHModmltQ29tbWFuZHMpO1xyXG5cclxuXHRcdFx0XHR0aGlzLnByZXBhcmVDaG9yZERpc3BsYXkoKTtcclxuXHRcdFx0XHR0aGlzLnByZXBhcmVWaW1Nb2RlRGlzcGxheSgpO1xyXG5cclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSBsb2FkIGl0IGp1c3Qgb25jZSBwZXIgQ29kZU1pcnJvciBpbnN0YW5jZS5cclxuXHRcdFx0XHQvLyBUaGlzIGlzIHN1cHBvc2VkIHRvIHdvcmsgYmVjYXVzZSB0aGUgVmltIHN0YXRlIGlzIGtlcHQgYXQgdGhlIGtleW1hcCBsZXZlbCwgaG9wZWZ1bGx5XHJcblx0XHRcdFx0Ly8gdGhlcmUgd2lsbCBub3QgYmUgYnVncyBjYXVzZWQgYnkgb3BlcmF0aW9ucyB0aGF0IGFyZSBrZXB0IGF0IHRoZSBvYmplY3QgbGV2ZWwgaW5zdGVhZFxyXG5cdFx0XHRcdHRoaXMuY29kZU1pcnJvclZpbU9iamVjdC5sb2FkZWRWaW1yYyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjbUVkaXRvcikge1xyXG5cdFx0XHRcdGNtRWRpdG9yLm9mZigndmltLW1vZGUtY2hhbmdlJywgdGhpcy5sb2dWaW1Nb2RlQ2hhbmdlKTtcclxuXHRcdFx0XHRjbUVkaXRvci5vbigndmltLW1vZGUtY2hhbmdlJywgdGhpcy5sb2dWaW1Nb2RlQ2hhbmdlKTtcclxuXHRcdFx0XHRDb2RlTWlycm9yLm9mZihjbUVkaXRvci5nZXRJbnB1dEZpZWxkKCksICdrZXlkb3duJywgdGhpcy5vbktleWRvd24pO1xyXG5cdFx0XHRcdENvZGVNaXJyb3Iub24oY21FZGl0b3IuZ2V0SW5wdXRGaWVsZCgpLCAna2V5ZG93bicsIHRoaXMub25LZXlkb3duKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZFZpbUNvbW1hbmRzKHZpbUNvbW1hbmRzOiBzdHJpbmcpIHtcclxuXHRcdGxldCB2aWV3ID0gdGhpcy5nZXRBY3RpdmVWaWV3KCk7XHJcblx0XHRpZiAodmlldykge1xyXG5cdFx0XHR2YXIgY21FZGl0b3IgPSB0aGlzLmdldENvZGVNaXJyb3Iodmlldyk7XHJcblxyXG5cdFx0XHR2aW1Db21tYW5kcy5zcGxpdChcIlxcblwiKS5mb3JFYWNoKFxyXG5cdFx0XHRcdGZ1bmN0aW9uIChsaW5lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIGFycjogW3N0cmluZ10pIHtcclxuXHRcdFx0XHRcdGlmIChsaW5lLnRyaW0oKS5sZW5ndGggPiAwICYmIGxpbmUudHJpbSgpWzBdICE9ICdcIicpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHNwbGl0ID0gbGluZS5zcGxpdChcIiBcIilcclxuXHRcdFx0XHRcdFx0aWYgKG1hcHBpbmdDb21tYW5kcy5pbmNsdWRlcyhzcGxpdFswXSkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBIYXZlIHRvIGRvIHRoaXMgYmVjYXVzZSBcInZpbS1jb21tYW5kLWRvbmVcIiBldmVudCBkb2Vzbid0IGFjdHVhbGx5IHdvcmsgcHJvcGVybHksIG9yIHNvbWV0aGluZy5cclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN1c3RvbVZpbUtleWJpbmRzW3NwbGl0WzFdXSA9IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0aGlzLmNvZGVNaXJyb3JWaW1PYmplY3QuaGFuZGxlRXgoY21FZGl0b3IsIGxpbmUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0uYmluZCh0aGlzKSAvLyBGYXN0ZXIgdGhhbiBhbiBhcnJvdyBmdW5jdGlvbi4gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTAzNzU0NDAvYmluZGluZy12cy1hcnJvdy1mdW5jdGlvbi1mb3ItcmVhY3Qtb25jbGljay1ldmVudFxyXG5cdFx0XHQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkZWZpbmVCYXNpY0NvbW1hbmRzKHZpbU9iamVjdDogYW55KSB7XHJcblx0XHR2aW1PYmplY3QuZGVmaW5lT3B0aW9uKCdjbGlwYm9hcmQnLCAnJywgJ3N0cmluZycsIFsnY2xpcCddLCAodmFsdWU6IHN0cmluZywgY206IGFueSkgPT4ge1xyXG5cdFx0XHRpZiAodmFsdWUpIHtcclxuXHRcdFx0XHRpZiAodmFsdWUudHJpbSgpID09ICd1bm5hbWVkJyB8fCB2YWx1ZS50cmltKCkgPT0gJ3VubmFtZWRwbHVzJykge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLnlhbmtUb1N5c3RlbUNsaXBib2FyZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnlhbmtUb1N5c3RlbUNsaXBib2FyZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiVmltIGlzIG5vdyBzZXQgdG8geWFuayB0byBzeXN0ZW0gY2xpcGJvYXJkLlwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5yZWNvZ25pemVkIGNsaXBib2FyZCBvcHRpb24sIHN1cHBvcnRlZCBhcmUgJ3VubmFtZWQnIGFuZCAndW5uYW1lZHBsdXMnIChhbmQgdGhleSBkbyB0aGUgc2FtZSlcIilcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZpbU9iamVjdC5kZWZpbmVPcHRpb24oJ3RhYnN0b3AnLCA0LCAnbnVtYmVyJywgW10sICh2YWx1ZTogbnVtYmVyLCBjbTogYW55KSA9PiB7XHJcblx0XHRcdGlmICh2YWx1ZSAmJiBjbSkge1xyXG5cdFx0XHRcdGNtLnNldE9wdGlvbigndGFiU2l6ZScsIHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmltT2JqZWN0LmRlZmluZUV4KCdpdW5tYXAnLCAnJywgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7XHJcblx0XHRcdGlmIChwYXJhbXMuYXJnU3RyaW5nLnRyaW0oKSkge1xyXG5cdFx0XHRcdHRoaXMuY29kZU1pcnJvclZpbU9iamVjdC51bm1hcChwYXJhbXMuYXJnU3RyaW5nLnRyaW0oKSwgJ2luc2VydCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR2aW1PYmplY3QuZGVmaW5lRXgoJ251bm1hcCcsICcnLCAoY206IGFueSwgcGFyYW1zOiBhbnkpID0+IHtcclxuXHRcdFx0aWYgKHBhcmFtcy5hcmdTdHJpbmcudHJpbSgpKSB7XHJcblx0XHRcdFx0dGhpcy5jb2RlTWlycm9yVmltT2JqZWN0LnVubWFwKHBhcmFtcy5hcmdTdHJpbmcudHJpbSgpLCAnbm9ybWFsJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZpbU9iamVjdC5kZWZpbmVFeCgndnVubWFwJywgJycsIChjbTogYW55LCBwYXJhbXM6IGFueSkgPT4ge1xyXG5cdFx0XHRpZiAocGFyYW1zLmFyZ1N0cmluZy50cmltKCkpIHtcclxuXHRcdFx0XHR0aGlzLmNvZGVNaXJyb3JWaW1PYmplY3QudW5tYXAocGFyYW1zLmFyZ1N0cmluZy50cmltKCksICd2aXN1YWwnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmltT2JqZWN0LmRlZmluZUV4KCdub3JlbWFwJywgJycsIChjbTogYW55LCBwYXJhbXM6IGFueSkgPT4ge1xyXG5cdFx0XHRpZiAoIXBhcmFtcz8uYXJncz8ubGVuZ3RoKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1hcHBpbmc6IG5vcmVtYXAnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcmFtcy5hcmdTdHJpbmcudHJpbSgpKSB7XHJcblx0XHRcdFx0dGhpcy5jb2RlTWlycm9yVmltT2JqZWN0Lm5vcmVtYXAuYXBwbHkodGhpcy5jb2RlTWlycm9yVmltT2JqZWN0LCBwYXJhbXMuYXJncyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIHJlZ2lzdGVyIGFuIEV4IGNvbW1hbmRcclxuXHRcdHZpbU9iamVjdC5kZWZpbmVFeCgnZXhtYXAnLCAnJywgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7XHJcblx0XHRcdGlmIChwYXJhbXM/LmFyZ3M/Lmxlbmd0aCAmJiBwYXJhbXMuYXJncy5sZW5ndGggPCAyKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBleG1hcCByZXF1aXJlcyBhdCBsZWFzdCAyIHBhcmFtZXRlcnM6IFtuYW1lXSBbYWN0aW9ucy4uLl1gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgY29tbWFuZE5hbWUgPSBwYXJhbXMuYXJnc1swXTtcclxuXHRcdFx0cGFyYW1zLmFyZ3Muc2hpZnQoKTtcclxuXHRcdFx0bGV0IGNvbW1hbmRDb250ZW50ID0gcGFyYW1zLmFyZ3Muam9pbignICcpO1xyXG5cdFx0XHQvLyBUaGUgY29udGVudCBvZiB0aGUgdXNlcidzIEV4IGNvbW1hbmQgaXMganVzdCB0aGUgcmVtYWluaW5nIHBhcmFtZXRlcnMgb2YgdGhlIGV4bWFwIGNvbW1hbmRcclxuXHRcdFx0dGhpcy5jb2RlTWlycm9yVmltT2JqZWN0LmRlZmluZUV4KGNvbW1hbmROYW1lLCAnJywgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5jb2RlTWlycm9yVmltT2JqZWN0LmhhbmRsZUV4KGNtLCBjb21tYW5kQ29udGVudCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuICBkZWZpbmVBbmRNYXBPYnNpZGlhblZpbUNvbW1hbmRzKHZpbU9iamVjdDogVmltQXBpKSB7XHJcblx0XHRkZWZpbmVBbmRNYXBPYnNpZGlhblZpbU1vdGlvbih2aW1PYmplY3QsIGp1bXBUb05leHRIZWFkaW5nLCAnXV0nKTtcclxuXHRcdGRlZmluZUFuZE1hcE9ic2lkaWFuVmltTW90aW9uKHZpbU9iamVjdCwganVtcFRvUHJldmlvdXNIZWFkaW5nLCAnW1snKTtcclxuXHRcdGRlZmluZUFuZE1hcE9ic2lkaWFuVmltTW90aW9uKHZpbU9iamVjdCwganVtcFRvTmV4dExpbmssICdnbCcpO1xyXG5cdFx0ZGVmaW5lQW5kTWFwT2JzaWRpYW5WaW1Nb3Rpb24odmltT2JqZWN0LCBqdW1wVG9QcmV2aW91c0xpbmssICdnTCcpO1xyXG5cclxuXHRcdGRlZmluZUFuZE1hcE9ic2lkaWFuVmltQWN0aW9uKHZpbU9iamVjdCwgdGhpcywgbW92ZURvd25Ta2lwcGluZ0ZvbGRzLCAnemonKTtcclxuXHRcdGRlZmluZUFuZE1hcE9ic2lkaWFuVmltQWN0aW9uKHZpbU9iamVjdCwgdGhpcywgbW92ZVVwU2tpcHBpbmdGb2xkcywgJ3prJyk7XHJcblx0XHRkZWZpbmVBbmRNYXBPYnNpZGlhblZpbUFjdGlvbih2aW1PYmplY3QsIHRoaXMsIGZvbGxvd0xpbmtVbmRlckN1cnNvciwgJ2dmJyk7XHJcbiAgfVxyXG5cclxuXHRkZWZpbmVTZW5kS2V5cyh2aW1PYmplY3Q6IGFueSkge1xyXG5cdFx0dmltT2JqZWN0LmRlZmluZUV4KCdzZW5ka2V5cycsICcnLCBhc3luYyAoY206IGFueSwgcGFyYW1zOiBhbnkpID0+IHtcclxuXHRcdFx0aWYgKCFwYXJhbXM/LmFyZ3M/Lmxlbmd0aCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHBhcmFtcyk7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUaGUgc2VuZGtleXMgY29tbWFuZCByZXF1aXJlcyBhIGxpc3Qgb2Yga2V5cywgZS5nLiBzZW5kS2V5cyBDdHJsK3AgYSBiIEVudGVyYCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBhbGxHb29kID0gdHJ1ZTtcclxuXHRcdFx0bGV0IGV2ZW50czogS2V5Ym9hcmRFdmVudFtdID0gW107XHJcblx0XHRcdGZvciAoY29uc3Qga2V5IG9mIHBhcmFtcy5hcmdzKSB7XHJcblx0XHRcdFx0aWYgKGtleS5zdGFydHNXaXRoKCd3YWl0JykpIHtcclxuXHRcdFx0XHRcdGNvbnN0IGRlbGF5ID0ga2V5LnNsaWNlKDQpO1xyXG5cdFx0XHRcdFx0YXdhaXQgc2xlZXAoZGVsYXkgKiAxMDAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRsZXQga2V5RXZlbnQ6IEtleWJvYXJkRXZlbnQgPSBudWxsO1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0a2V5RXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIGtleUZyb21BY2NlbGVyYXRvci50b0tleUV2ZW50KGtleSkpO1xyXG5cdFx0XHRcdFx0XHRldmVudHMucHVzaChrZXlFdmVudCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0XHRhbGxHb29kID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgS2V5ICcke2tleX0nIGNvdWxkbid0IGJlIHJlYWQgYXMgYW4gRWxlY3Ryb24gQWNjZWxlcmF0b3JgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChhbGxHb29kKSB7XHJcblx0XHRcdFx0XHRcdGZvciAoa2V5RXZlbnQgb2YgZXZlbnRzKVxyXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5wb3N0TWVzc2FnZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGtleUV2ZW50KSksICcqJyk7XHJcblx0XHRcdFx0XHRcdC8vIHZpZXcuY29udGFpbmVyRWwuZGlzcGF0Y2hFdmVudChrZXlFdmVudCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGV4ZWN1dGVPYnNpZGlhbkNvbW1hbmQoY29tbWFuZE5hbWU6IHN0cmluZykge1xyXG5cdFx0Y29uc3QgYXZhaWxhYmxlQ29tbWFuZHMgPSAodGhpcy5hcHAgYXMgYW55KS5jb21tYW5kcy5jb21tYW5kcztcclxuXHRcdGlmICghKGNvbW1hbmROYW1lIGluIGF2YWlsYWJsZUNvbW1hbmRzKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvbW1hbmQgJHtjb21tYW5kTmFtZX0gd2FzIG5vdCBmb3VuZCwgdHJ5ICdvYmNvbW1hbmQnIHdpdGggbm8gcGFyYW1zIHRvIHNlZSBpbiB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgd2hhdCdzIGF2YWlsYWJsZWApO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgdmlldyA9IHRoaXMuZ2V0QWN0aXZlVmlldygpO1xyXG5cdFx0Y29uc3QgZWRpdG9yID0gdmlldy5lZGl0b3I7XHJcblx0XHRjb25zdCBjb21tYW5kID0gYXZhaWxhYmxlQ29tbWFuZHNbY29tbWFuZE5hbWVdO1xyXG5cdFx0Y29uc3Qge2NhbGxiYWNrLCBjaGVja0NhbGxiYWNrLCBlZGl0b3JDYWxsYmFjaywgZWRpdG9yQ2hlY2tDYWxsYmFja30gPSBjb21tYW5kO1xyXG5cdFx0aWYgKGVkaXRvckNoZWNrQ2FsbGJhY2spXHJcblx0XHRcdGVkaXRvckNoZWNrQ2FsbGJhY2soZmFsc2UsIGVkaXRvciwgdmlldyk7XHJcblx0XHRlbHNlIGlmIChlZGl0b3JDYWxsYmFjaylcclxuXHRcdFx0ZWRpdG9yQ2FsbGJhY2soZWRpdG9yLCB2aWV3KTtcclxuXHRcdGVsc2UgaWYgKGNoZWNrQ2FsbGJhY2spXHJcblx0XHRcdGNoZWNrQ2FsbGJhY2soZmFsc2UpO1xyXG5cdFx0ZWxzZSBpZiAoY2FsbGJhY2spXHJcblx0XHRcdGNhbGxiYWNrKCk7XHJcblx0XHRlbHNlXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ29tbWFuZCAke2NvbW1hbmROYW1lfSBkb2Vzbid0IGhhdmUgYW4gT2JzaWRpYW4gY2FsbGJhY2tgKTtcclxuXHR9XHJcblxyXG5cdGRlZmluZU9iQ29tbWFuZCh2aW1PYmplY3Q6IGFueSkge1xyXG5cdFx0dmltT2JqZWN0LmRlZmluZUV4KCdvYmNvbW1hbmQnLCAnJywgYXN5bmMgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7XHJcblx0XHRcdGlmICghcGFyYW1zPy5hcmdzPy5sZW5ndGggfHwgcGFyYW1zLmFyZ3MubGVuZ3RoICE9IDEpIHtcclxuXHRcdFx0XHRjb25zdCBhdmFpbGFibGVDb21tYW5kcyA9ICh0aGlzLmFwcCBhcyBhbnkpLmNvbW1hbmRzLmNvbW1hbmRzO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBBdmFpbGFibGUgY29tbWFuZHM6ICR7T2JqZWN0LmtleXMoYXZhaWxhYmxlQ29tbWFuZHMpLmpvaW4oJ1xcbicpfWApXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBvYmNvbW1hbmQgcmVxdWlyZXMgZXhhY3RseSAxIHBhcmFtZXRlcmApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IGNvbW1hbmROYW1lID0gcGFyYW1zLmFyZ3NbMF07XHJcblx0XHRcdHRoaXMuZXhlY3V0ZU9ic2lkaWFuQ29tbWFuZChjb21tYW5kTmFtZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRlZmluZVN1cnJvdW5kKHZpbU9iamVjdDogYW55KSB7XHJcblx0XHQvLyBGdW5jdGlvbiB0byBzdXJyb3VuZCBzZWxlY3RlZCB0ZXh0IG9yIGhpZ2hsaWdodGVkIHdvcmQuXHJcblx0XHR2YXIgc3Vycm91bmRGdW5jID0gKHBhcmFtczogc3RyaW5nW10pID0+IHtcclxuXHRcdFx0dmFyIGVkaXRvciA9IHRoaXMuZ2V0QWN0aXZlVmlldygpLmVkaXRvcjtcclxuXHRcdFx0aWYgKCFwYXJhbXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwic3Vycm91bmQgcmVxdWlyZXMgZXhhY3RseSAyIHBhcmFtZXRlcnM6IHByZWZpeCBhbmQgcG9zdGZpeCB0ZXh0LlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgbmV3QXJncyA9IHBhcmFtcy5qb2luKFwiIFwiKS5tYXRjaCgvKFxcXFwufFteXFxzXFxcXFxcXFxdKykrL2cpO1xyXG5cdFx0XHRpZiAobmV3QXJncy5sZW5ndGggIT0gMikge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInN1cnJvdW5kIHJlcXVpcmVzIGV4YWN0bHkgMiBwYXJhbWV0ZXJzOiBwcmVmaXggYW5kIHBvc3RmaXggdGV4dC5cIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBiZWdpbm5pbmcgPSBuZXdBcmdzWzBdLnJlcGxhY2UoXCJcXFxcXFxcXFwiLCBcIlxcXFxcIikucmVwbGFjZShcIlxcXFwgXCIsIFwiIFwiKTsgLy8gR2V0IHRoZSBiZWdpbm5pbmcgc3Vycm91bmQgdGV4dFxyXG5cdFx0XHRsZXQgZW5kaW5nID0gbmV3QXJnc1sxXS5yZXBsYWNlKFwiXFxcXFxcXFxcIiwgXCJcXFxcXCIpLnJlcGxhY2UoXCJcXFxcIFwiLCBcIiBcIik7IC8vIEdldCB0aGUgZW5kaW5nIHN1cnJvdW5kIHRleHRcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50U2VsZWN0aW9ucyA9IHRoaXMuY3VycmVudFNlbGVjdGlvbjtcclxuXHRcdFx0dmFyIGNob3NlblNlbGVjdGlvbiA9IGN1cnJlbnRTZWxlY3Rpb25zPy5bMF0gPyBjdXJyZW50U2VsZWN0aW9uc1swXSA6IHthbmNob3I6IGVkaXRvci5nZXRDdXJzb3IoKSwgaGVhZDogZWRpdG9yLmdldEN1cnNvcigpfTtcclxuXHRcdFx0aWYgKGN1cnJlbnRTZWxlY3Rpb25zPy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJXQVJOSU5HOiBNdWx0aXBsZSBzZWxlY3Rpb25zIGluIHN1cnJvdW5kLiBBdHRlbXB0IHRvIHNlbGVjdCBtYXRjaGluZyBjdXJzb3IuIChvYnNpZGlhbi12aW1yYy1zdXBwb3J0KVwiKVxyXG5cdFx0XHRcdGNvbnN0IGN1cnNvclBvcyA9IGVkaXRvci5nZXRDdXJzb3IoKTtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IHNlbGVjdGlvbiBvZiBjdXJyZW50U2VsZWN0aW9ucykge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGVjdGlvbi5oZWFkLmxpbmUgPT0gY3Vyc29yUG9zLmxpbmUgJiYgc2VsZWN0aW9uLmhlYWQuY2ggPT0gY3Vyc29yUG9zLmNoKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUkVTT0xWRUQ6IFNlbGVjdGlvbiBtYXRjaGluZyBjdXJzb3IgZm91bmQuIChvYnNpZGlhbi12aW1yYy1zdXBwb3J0KVwiKVxyXG5cdFx0XHRcdFx0XHRjaG9zZW5TZWxlY3Rpb24gPSBzZWxlY3Rpb247XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZWRpdG9yLnBvc1RvT2Zmc2V0KGNob3NlblNlbGVjdGlvbi5hbmNob3IpID09PSBlZGl0b3IucG9zVG9PZmZzZXQoY2hvc2VuU2VsZWN0aW9uLmhlYWQpKSB7XHJcblx0XHRcdFx0Ly8gTm8gcmFuZ2Ugb2Ygc2VsZWN0ZWQgdGV4dCwgc28gc2VsZWN0IHdvcmQuXHJcblx0XHRcdFx0bGV0IHdvcmRBdCA9IGVkaXRvci53b3JkQXQoY2hvc2VuU2VsZWN0aW9uLmhlYWQpO1xyXG5cdFx0XHRcdGlmICh3b3JkQXQpIHtcclxuXHRcdFx0XHRcdGNob3NlblNlbGVjdGlvbiA9IHthbmNob3I6IHdvcmRBdC5mcm9tLCBoZWFkOiB3b3JkQXQudG99O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgICAgICBsZXQgY3VyclRleHQ7XHJcbiAgICAgICAgICAgIGlmIChlZGl0b3IucG9zVG9PZmZzZXQoY2hvc2VuU2VsZWN0aW9uLmFuY2hvcikgPiBlZGl0b3IucG9zVG9PZmZzZXQoY2hvc2VuU2VsZWN0aW9uLmhlYWQpKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyVGV4dCA9IGVkaXRvci5nZXRSYW5nZShjaG9zZW5TZWxlY3Rpb24uaGVhZCwgY2hvc2VuU2VsZWN0aW9uLmFuY2hvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyVGV4dCA9IGVkaXRvci5nZXRSYW5nZShjaG9zZW5TZWxlY3Rpb24uYW5jaG9yLCBjaG9zZW5TZWxlY3Rpb24uaGVhZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdFx0ZWRpdG9yLnJlcGxhY2VSYW5nZShiZWdpbm5pbmcgKyBjdXJyVGV4dCArIGVuZGluZywgY2hvc2VuU2VsZWN0aW9uLmFuY2hvciwgY2hvc2VuU2VsZWN0aW9uLmhlYWQpO1xyXG5cdFx0XHQvLyBJZiBubyBzZWxlY3Rpb24sIHBsYWNlIGN1cnNvciBiZXR3ZWVuIGJlZ2lubmluZyBhbmQgZW5kaW5nXHJcblx0XHRcdGlmIChlZGl0b3IucG9zVG9PZmZzZXQoY2hvc2VuU2VsZWN0aW9uLmFuY2hvcikgPT09IGVkaXRvci5wb3NUb09mZnNldChjaG9zZW5TZWxlY3Rpb24uaGVhZCkpIHtcclxuXHRcdFx0XHRjaG9zZW5TZWxlY3Rpb24uaGVhZC5jaCArPSBiZWdpbm5pbmcubGVuZ3RoO1xyXG5cdFx0XHRcdGVkaXRvci5zZXRDdXJzb3IoY2hvc2VuU2VsZWN0aW9uLmhlYWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmltT2JqZWN0LmRlZmluZUV4KFwic3Vycm91bmRcIiwgXCJcIiwgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7IHN1cnJvdW5kRnVuYyhwYXJhbXMuYXJncyk7IH0pO1xyXG5cclxuXHRcdHZpbU9iamVjdC5kZWZpbmVFeChcInBhc3RlaW50b1wiLCBcIlwiLCAoY206IGFueSwgcGFyYW1zOiBhbnkpID0+IHtcclxuXHRcdFx0Ly8gVXNpbmcgdGhlIHJlZ2lzdGVyIGZvciB3aGVuIHRoaXMueWFua1RvU3lzdGVtQ2xpcGJvYXJkID09IGZhbHNlXHJcblx0XHRcdHN1cnJvdW5kRnVuYyhcclxuXHRcdFx0XHRbJ1snLFxyXG5cdFx0XHRcdCAnXSgnICsgdmltT2JqZWN0LmdldFJlZ2lzdGVyQ29udHJvbGxlcigpLmdldFJlZ2lzdGVyKCd5YW5rJykua2V5QnVmZmVyICsgXCIpXCJdKTtcclxuXHRcdH0pXHJcblxyXG5cdFx0dmFyIGVkaXRvciA9IHRoaXMuZ2V0QWN0aXZlVmlldygpLmVkaXRvcjtcclxuXHRcdC8vIEhhbmRsZSB0aGUgc3Vycm91bmQgZGlhbG9nIGlucHV0XHJcblx0XHR2YXIgc3Vycm91bmREaWFsb2dDYWxsYmFjayA9ICh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcblx0XHRcdGlmICgoL15cXFsrJC8pLnRlc3QodmFsdWUpKSB7IC8vIGNoZWNrIGZvciAxLWluZiBbIGFuZCBtYXRjaCB0aGVtIHdpdGggXVxyXG5cdFx0XHRcdHN1cnJvdW5kRnVuYyhbdmFsdWUsIFwiXVwiLnJlcGVhdCh2YWx1ZS5sZW5ndGgpXSlcclxuXHRcdFx0fSBlbHNlIGlmICgoL15cXCgrJC8pLnRlc3QodmFsdWUpKSB7IC8vIGNoZWNrIGZvciAxLWluZiAoIGFuZCBtYXRjaCB0aGVtIHdpdGggKVxyXG5cdFx0XHRcdHN1cnJvdW5kRnVuYyhbdmFsdWUsIFwiKVwiLnJlcGVhdCh2YWx1ZS5sZW5ndGgpXSlcclxuXHRcdFx0fSBlbHNlIGlmICgoL15cXHsrJC8pLnRlc3QodmFsdWUpKSB7IC8vIGNoZWNrIGZvciAxLWluZiB7IGFuZCBtYXRjaCB0aGVtIHdpdGggfVxyXG5cdFx0XHRcdHN1cnJvdW5kRnVuYyhbdmFsdWUsIFwifVwiLnJlcGVhdCh2YWx1ZS5sZW5ndGgpXSlcclxuXHRcdFx0fSBlbHNlIHsgLy8gRWxzZSwganVzdCBwdXQgaXQgYmVmb3JlIGFuZCBhZnRlci5cclxuXHRcdFx0XHRzdXJyb3VuZEZ1bmMoW3ZhbHVlLCB2YWx1ZV0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2aW1PYmplY3QuZGVmaW5lT3BlcmF0b3IoXCJzdXJyb3VuZE9wZXJhdG9yXCIsICgpID0+IHtcclxuXHRcdFx0bGV0IHAgPSBcIjxzcGFuPlN1cnJvdW5kIHdpdGg6IDxpbnB1dCB0eXBlPSd0ZXh0Jz48L3NwYW4+XCJcclxuXHRcdFx0Q29kZU1pcnJvci5vcGVuRGlhbG9nKHAsIHN1cnJvdW5kRGlhbG9nQ2FsbGJhY2ssIHsgYm90dG9tOiB0cnVlLCBzZWxlY3RWYWx1ZU9uT3BlbjogZmFsc2UgfSlcclxuXHRcdH0pXHJcblxyXG5cclxuXHRcdHZpbU9iamVjdC5tYXBDb21tYW5kKFwiPEEteT5zXCIsIFwib3BlcmF0b3JcIiwgXCJzdXJyb3VuZE9wZXJhdG9yXCIpXHJcblxyXG5cdH1cclxuXHJcblx0YXN5bmMgY2FwdHVyZVlhbmtCdWZmZXIod2luOiBXaW5kb3cpIHtcclxuXHRcdGlmICghdGhpcy55YW5rVG9TeXN0ZW1DbGlwYm9hcmQpIHtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgeWFua1JlZ2lzdGVyID0gdGhpcy5jb2RlTWlycm9yVmltT2JqZWN0LmdldFJlZ2lzdGVyQ29udHJvbGxlcigpLmdldFJlZ2lzdGVyKCd5YW5rJyk7XHJcblx0XHRjb25zdCBjdXJyZW50WWFua0J1ZmZlciA9IHlhbmtSZWdpc3Rlci5rZXlCdWZmZXI7XHJcblxyXG5cdFx0Ly8geWFuayAtPiBjbGlwYm9hcmRcclxuXHRcdGNvbnN0IGJ1ZiA9IGN1cnJlbnRZYW5rQnVmZmVyWzBdXHJcblx0XHRpZiAoYnVmICE9PSB0aGlzLmxhc3RZYW5rQnVmZmVyWzBdKSB7XHJcblx0XHRcdGF3YWl0IHdpbi5uYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChidWYpO1xyXG5cdFx0XHR0aGlzLmxhc3RZYW5rQnVmZmVyID0gY3VycmVudFlhbmtCdWZmZXI7XHJcblx0XHRcdHRoaXMubGFzdFN5c3RlbUNsaXBib2FyZCA9IGF3YWl0IHdpbi5uYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNsaXBib2FyZCAtPiB5YW5rXHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBjdXJyZW50Q2xpcGJvYXJkVGV4dCA9IGF3YWl0IHdpbi5uYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XHJcblx0XHRcdGlmIChjdXJyZW50Q2xpcGJvYXJkVGV4dCAhPT0gdGhpcy5sYXN0U3lzdGVtQ2xpcGJvYXJkKSB7XHJcblx0XHRcdFx0eWFua1JlZ2lzdGVyLnNldFRleHQoY3VycmVudENsaXBib2FyZFRleHQpO1xyXG5cdFx0XHRcdHRoaXMubGFzdFlhbmtCdWZmZXIgPSB5YW5rUmVnaXN0ZXIua2V5QnVmZmVyO1xyXG5cdFx0XHRcdHRoaXMubGFzdFN5c3RlbUNsaXBib2FyZCA9IGN1cnJlbnRDbGlwYm9hcmRUZXh0O1xyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vIFhYWDogQXZvaWQgXCJVbmNhdWdodCAoaW4gcHJvbWlzZSkgRE9NRXhjZXB0aW9uOiBEb2N1bWVudCBpcyBub3QgZm9jdXNlZC5cIlxyXG5cdFx0XHQvLyBYWFg6IEl0IGlzIG5vdCBnb29kIGJ1dCBlYXN5IHdvcmthcm91bmRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByZXBhcmVDaG9yZERpc3BsYXkoKSB7XHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5kaXNwbGF5Q2hvcmQpIHtcclxuXHRcdFx0Ly8gQWRkIHN0YXR1cyBiYXIgaXRlbVxyXG5cdFx0XHR0aGlzLnZpbUNob3JkU3RhdHVzQmFyID0gdGhpcy5hZGRTdGF0dXNCYXJJdGVtKCk7XHJcblxyXG5cdFx0XHQvLyBNb3ZlIHZpbUNob3JkU3RhdHVzQmFyIHRvIHRoZSBsZWZ0bW9zdCBwb3NpdGlvbiBhbmQgY2VudGVyIGl0LlxyXG5cdFx0XHRsZXQgcGFyZW50ID0gdGhpcy52aW1DaG9yZFN0YXR1c0Jhci5wYXJlbnRFbGVtZW50O1xyXG5cdFx0XHR0aGlzLnZpbUNob3JkU3RhdHVzQmFyLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoaXMudmltQ2hvcmRTdGF0dXNCYXIsIHBhcmVudC5maXJzdENoaWxkKTtcclxuXHRcdFx0dGhpcy52aW1DaG9yZFN0YXR1c0Jhci5zdHlsZS5tYXJnaW5SaWdodCA9IFwiYXV0b1wiO1xyXG5cclxuXHRcdFx0bGV0IGNtRWRpdG9yID0gdGhpcy5nZXRDb2RlTWlycm9yKHRoaXMuZ2V0QWN0aXZlVmlldygpKTtcclxuXHRcdFx0Ly8gU2VlIGh0dHBzOi8vY29kZW1pcnJvci5uZXQvZG9jL21hbnVhbC5odG1sI3ZpbWFwaV9ldmVudHMgZm9yIGV2ZW50cy5cclxuXHRcdFx0Y21FZGl0b3Iub2ZmKCd2aW0ta2V5cHJlc3MnLCB0aGlzLm9uVmltS2V5cHJlc3MpO1xyXG5cdFx0XHRjbUVkaXRvci5vbigndmltLWtleXByZXNzJywgdGhpcy5vblZpbUtleXByZXNzKTtcclxuXHRcdFx0Y21FZGl0b3Iub2ZmKCd2aW0tY29tbWFuZC1kb25lJywgdGhpcy5vblZpbUNvbW1hbmREb25lKTtcclxuXHRcdFx0Y21FZGl0b3Iub24oJ3ZpbS1jb21tYW5kLWRvbmUnLCB0aGlzLm9uVmltQ29tbWFuZERvbmUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25WaW1LZXlwcmVzcyA9IGFzeW5jICh2aW1LZXk6IGFueSkgPT4ge1xyXG5cdFx0aWYgKHZpbUtleSAhPSBcIjxFc2M+XCIpIHsgLy8gVE9ETyBmaWd1cmUgb3V0IHdoYXQgdG8gYWN0dWFsbHkgbG9vayBmb3IgdG8gZXhpdCBjb21tYW5kcy5cclxuXHRcdFx0dGhpcy5jdXJyZW50S2V5Q2hvcmQucHVzaCh2aW1LZXkpO1xyXG5cdFx0XHRpZiAodGhpcy5jdXN0b21WaW1LZXliaW5kc1t0aGlzLmN1cnJlbnRLZXlDaG9yZC5qb2luKFwiXCIpXSAhPSB1bmRlZmluZWQpIHsgLy8gQ3VzdG9tIGtleSBjaG9yZCBleGlzdHMuXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50S2V5Q2hvcmQgPSBbXTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50S2V5Q2hvcmQgPSBbXTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBCdWlsZCBrZXljaG9yZCB0ZXh0XHJcblx0XHRsZXQgdGVtcFMgPSBcIlwiO1xyXG5cdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuY3VycmVudEtleUNob3JkKSB7XHJcblx0XHRcdHRlbXBTICs9IFwiIFwiICsgcztcclxuXHRcdH1cclxuXHRcdGlmICh0ZW1wUyAhPSBcIlwiKSB7XHJcblx0XHRcdHRlbXBTICs9IFwiLVwiO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy52aW1DaG9yZFN0YXR1c0Jhcj8uc2V0VGV4dCh0ZW1wUyk7XHJcblx0fVxyXG5cclxuXHRvblZpbUNvbW1hbmREb25lID0gYXN5bmMgKHJlYXNvbjogYW55KSA9PiB7XHJcblx0XHR0aGlzLnZpbUNob3JkU3RhdHVzQmFyPy5zZXRUZXh0KFwiXCIpO1xyXG5cdFx0dGhpcy5jdXJyZW50S2V5Q2hvcmQgPSBbXTtcclxuXHR9XHJcblxyXG5cdHByZXBhcmVWaW1Nb2RlRGlzcGxheSgpIHtcclxuXHRcdGlmICh0aGlzLnNldHRpbmdzLmRpc3BsYXlWaW1Nb2RlKSB7XHJcblx0XHRcdHRoaXMudmltU3RhdHVzQmFyID0gdGhpcy5hZGRTdGF0dXNCYXJJdGVtKCkgLy8gQWRkIHN0YXR1cyBiYXIgaXRlbVxyXG5cdFx0XHR0aGlzLnZpbVN0YXR1c0Jhci5zZXRUZXh0KFxyXG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MudmltU3RhdHVzUHJvbXB0TWFwW3ZpbVN0YXR1cy5ub3JtYWxdXHJcblx0XHRcdCk7IC8vIEluaXQgdGhlIHZpbVN0YXR1c0JhciB3aXRoIG5vcm1hbCBtb2RlXHJcblx0XHRcdHRoaXMudmltU3RhdHVzQmFyLmFkZENsYXNzKHZpbVN0YXR1c1Byb21wdENsYXNzKTtcclxuXHRcdFx0dGhpcy52aW1TdGF0dXNCYXIuZGF0YXNldC52aW1Nb2RlID0gdGhpcy5jdXJyZW50VmltU3RhdHVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25LZXlkb3duID0gKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5maXhlZE5vcm1hbE1vZGVMYXlvdXQpIHtcclxuXHRcdFx0Y29uc3Qga2V5TWFwID0gdGhpcy5zZXR0aW5ncy5jYXB0dXJlZEtleWJvYXJkTWFwO1xyXG5cdFx0XHRpZiAoIXRoaXMuaXNJbnNlcnRNb2RlICYmICFldi5zaGlmdEtleSAmJlxyXG5cdFx0XHRcdGV2LmNvZGUgaW4ga2V5TWFwICYmIGV2LmtleSAhPSBrZXlNYXBbZXYuY29kZV0pIHtcclxuXHRcdFx0XHRsZXQgdmlldyA9IHRoaXMuZ2V0QWN0aXZlVmlldygpO1xyXG5cdFx0XHRcdGlmICh2aWV3KSB7XHJcblx0XHRcdFx0XHRjb25zdCBjbUVkaXRvciA9IHRoaXMuZ2V0Q29kZU1pcnJvcih2aWV3KTtcclxuXHRcdFx0XHRcdGlmIChjbUVkaXRvcikge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNvZGVNaXJyb3JWaW1PYmplY3QuaGFuZGxlS2V5KGNtRWRpdG9yLCBrZXlNYXBbZXYuY29kZV0sICdtYXBwaW5nJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRlZmluZUpzQ29tbWFuZCh2aW1PYmplY3Q6IGFueSkge1xyXG5cdFx0dmltT2JqZWN0LmRlZmluZUV4KCdqc2NvbW1hbmQnLCAnJywgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7XHJcblx0XHRcdGlmICghdGhpcy5zZXR0aW5ncy5zdXBwb3J0SnNDb21tYW5kcylcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJKUyBjb21tYW5kcyBhcmUgdHVybmVkIG9mZjsgZW5hYmxlIHRoZW0gdmlhIHRoZSBWaW1yYyBwbHVnaW4gY29uZmlndXJhdGlvbiBpZiB5b3UncmUgc3VyZSB5b3Uga25vdyB3aGF0IHlvdSdyZSBkb2luZ1wiKTtcclxuXHRcdFx0Y29uc3QganNDb2RlID0gcGFyYW1zLmFyZ1N0cmluZy50cmltKCkgYXMgc3RyaW5nO1xyXG5cdFx0XHRpZiAoanNDb2RlWzBdICE9ICd7JyB8fCBqc0NvZGVbanNDb2RlLmxlbmd0aCAtIDFdICE9ICd9JylcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBhbiBhcmd1bWVudCB3aGljaCBpcyBKUyBjb2RlIHN1cnJvdW5kZWQgYnkgY3VybHkgYnJhY2tldHM6IHsuLi59XCIpO1xyXG5cdFx0XHRsZXQgY3VycmVudFNlbGVjdGlvbnMgPSB0aGlzLmN1cnJlbnRTZWxlY3Rpb247XHJcblx0XHRcdHZhciBjaG9zZW5TZWxlY3Rpb24gPSBjdXJyZW50U2VsZWN0aW9ucyAmJiBjdXJyZW50U2VsZWN0aW9ucy5sZW5ndGggPiAwID8gY3VycmVudFNlbGVjdGlvbnNbMF0gOiBudWxsO1xyXG5cdFx0XHRjb25zdCBjb21tYW5kID0gRnVuY3Rpb24oJ2VkaXRvcicsICd2aWV3JywgJ3NlbGVjdGlvbicsIGpzQ29kZSk7XHJcblx0XHRcdGNvbnN0IHZpZXcgPSB0aGlzLmdldEFjdGl2ZVZpZXcoKTtcclxuXHRcdFx0Y29tbWFuZCh2aWV3LmVkaXRvciwgdmlldywgY2hvc2VuU2VsZWN0aW9uKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZGVmaW5lSnNGaWxlKHZpbU9iamVjdDogYW55KSB7XHJcblx0XHR2aW1PYmplY3QuZGVmaW5lRXgoJ2pzZmlsZScsICcnLCBhc3luYyAoY206IGFueSwgcGFyYW1zOiBhbnkpID0+IHtcclxuXHRcdFx0aWYgKCF0aGlzLnNldHRpbmdzLnN1cHBvcnRKc0NvbW1hbmRzKVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkpTIGNvbW1hbmRzIGFyZSB0dXJuZWQgb2ZmOyBlbmFibGUgdGhlbSB2aWEgdGhlIFZpbXJjIHBsdWdpbiBjb25maWd1cmF0aW9uIGlmIHlvdSdyZSBzdXJlIHlvdSBrbm93IHdoYXQgeW91J3JlIGRvaW5nXCIpO1xyXG5cdFx0XHRpZiAocGFyYW1zPy5hcmdzPy5sZW5ndGggPCAxKVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIGZvcm1hdDogZmlsZU5hbWUge2V4dHJhQ29kZX1cIik7XHJcblx0XHRcdGxldCBleHRyYUNvZGUgPSAnJztcclxuXHRcdFx0Y29uc3QgZmlsZU5hbWUgPSBwYXJhbXMuYXJnc1swXTtcclxuXHRcdFx0aWYgKHBhcmFtcy5hcmdzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRwYXJhbXMuYXJncy5zaGlmdCgpO1xyXG5cdFx0XHRcdGV4dHJhQ29kZSA9IHBhcmFtcy5hcmdzLmpvaW4oJyAnKS50cmltKCkgYXMgc3RyaW5nO1xyXG5cdFx0XHRcdGlmIChleHRyYUNvZGVbMF0gIT0gJ3snIHx8IGV4dHJhQ29kZVtleHRyYUNvZGUubGVuZ3RoIC0gMV0gIT0gJ30nKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgYW4gZXh0cmEgY29kZSBhcmd1bWVudCB3aGljaCBpcyBKUyBjb2RlIHN1cnJvdW5kZWQgYnkgY3VybHkgYnJhY2tldHM6IHsuLi59XCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBjdXJyZW50U2VsZWN0aW9ucyA9IHRoaXMuY3VycmVudFNlbGVjdGlvbjtcclxuXHRcdFx0dmFyIGNob3NlblNlbGVjdGlvbiA9IGN1cnJlbnRTZWxlY3Rpb25zICYmIGN1cnJlbnRTZWxlY3Rpb25zLmxlbmd0aCA+IDAgPyBjdXJyZW50U2VsZWN0aW9uc1swXSA6IG51bGw7XHJcblx0XHRcdGxldCBjb250ZW50ID0gJyc7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Y29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIucmVhZChmaWxlTmFtZSk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZWFkIGZpbGUgJHtwYXJhbXMuYXJnc1swXX0gZnJvbSB2YXVsdCByb290OiAke2UubWVzc2FnZX1gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCBjb21tYW5kID0gRnVuY3Rpb24oJ2VkaXRvcicsICd2aWV3JywgJ3NlbGVjdGlvbicsIGNvbnRlbnQgKyBleHRyYUNvZGUpO1xyXG5cdFx0XHRjb25zdCB2aWV3ID0gdGhpcy5nZXRBY3RpdmVWaWV3KCk7XHJcblx0XHRcdGNvbW1hbmQodmlldy5lZGl0b3IsIHZpZXcsIGNob3NlblNlbGVjdGlvbik7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRlZmluZVNvdXJjZSh2aW1PYmplY3Q6IGFueSkge1xyXG5cdFx0dmltT2JqZWN0LmRlZmluZUV4KCdzb3VyY2UnLCAnJywgYXN5bmMgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7XHJcblx0XHRcdGlmIChwYXJhbXM/LmFyZ3M/Lmxlbmd0aCA+IDEpXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgZm9ybWF0OiBzb3VyY2UgW2ZpbGVOYW1lXVwiKTtcclxuXHRcdFx0Y29uc3QgZmlsZU5hbWUgPSBwYXJhbXMuYXJnU3RyaW5nLnRyaW0oKTtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR0aGlzLmFwcC52YXVsdC5hZGFwdGVyLnJlYWQoZmlsZU5hbWUpLnRoZW4odmltcmNDb250ZW50ID0+IHtcclxuXHRcdFx0XHRcdHRoaXMubG9hZFZpbUNvbW1hbmRzKHZpbXJjQ29udGVudCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnRXJyb3IgbG9hZGluZyB2aW1yYyBmaWxlJywgZmlsZU5hbWUsICdmcm9tIHRoZSB2YXVsdCByb290JywgZS5tZXNzYWdlKVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5jbGFzcyBTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdHBsdWdpbjogVmltcmNQbHVnaW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFZpbXJjUGx1Z2luKSB7XHJcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XHJcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuXHR9XHJcblxyXG5cdGRpc3BsYXkoKTogdm9pZCB7XHJcblx0XHRsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuXHJcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ1ZpbXJjIFNldHRpbmdzJyB9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1ZpbXJjIGZpbGUgbmFtZScpXHJcblx0XHRcdC5zZXREZXNjKCdSZWxhdGl2ZSB0byB2YXVsdCBkaXJlY3RvcnkgKHJlcXVpcmVzIHJlc3RhcnQpJylcclxuXHRcdFx0LmFkZFRleHQoKHRleHQpID0+IHtcclxuXHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKERFRkFVTFRfU0VUVElOR1MudmltcmNGaWxlTmFtZSk7XHJcblx0XHRcdFx0dGV4dC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1yY0ZpbGVOYW1lIHx8IERFRkFVTFRfU0VUVElOR1MudmltcmNGaWxlTmFtZSk7XHJcblx0XHRcdFx0dGV4dC5vbkNoYW5nZSh2YWx1ZSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1yY0ZpbGVOYW1lID0gdmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1ZpbSBjaG9yZCBkaXNwbGF5JylcclxuXHRcdFx0LnNldERlc2MoJ0Rpc3BsYXlzIHRoZSBjdXJyZW50IGNob3JkIHVudGlsIGNvbXBsZXRpb24uIEV4OiBcIjxTcGFjZT4gZi1cIiAocmVxdWlyZXMgcmVzdGFydCknKVxyXG5cdFx0XHQuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcclxuXHRcdFx0XHR0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzcGxheUNob3JkIHx8IERFRkFVTFRfU0VUVElOR1MuZGlzcGxheUNob3JkKTtcclxuXHRcdFx0XHR0b2dnbGUub25DaGFuZ2UodmFsdWUgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzcGxheUNob3JkID0gdmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1ZpbSBtb2RlIGRpc3BsYXknKVxyXG5cdFx0XHQuc2V0RGVzYygnRGlzcGxheXMgdGhlIGN1cnJlbnQgdmltIG1vZGUgKHJlcXVpcmVzIHJlc3RhcnQpJylcclxuXHRcdFx0LmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XHJcblx0XHRcdFx0dG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc3BsYXlWaW1Nb2RlIHx8IERFRkFVTFRfU0VUVElOR1MuZGlzcGxheVZpbU1vZGUpO1xyXG5cdFx0XHRcdHRvZ2dsZS5vbkNoYW5nZSh2YWx1ZSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5kaXNwbGF5VmltTW9kZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdVc2UgYSBmaXhlZCBrZXlib2FyZCBsYXlvdXQgZm9yIE5vcm1hbCBtb2RlJylcclxuXHRcdFx0LnNldERlc2MoJ0RlZmluZSBhIGtleWJvYXJkIGxheW91dCB0byBhbHdheXMgdXNlIHdoZW4gaW4gTm9ybWFsIG1vZGUsIHJlZ2FyZGxlc3Mgb2YgdGhlIGlucHV0IGxhbmd1YWdlIChleHBlcmltZW50YWwpLicpXHJcblx0XHRcdC5hZGRCdXR0b24oYXN5bmMgKGJ1dHRvbikgPT4ge1xyXG5cdFx0XHRcdGJ1dHRvbi5zZXRCdXR0b25UZXh0KCdDYXB0dXJlIGN1cnJlbnQgbGF5b3V0Jyk7XHJcblx0XHRcdFx0YnV0dG9uLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FwdHVyZWRLZXlib2FyZE1hcCA9IGF3YWl0IHRoaXMucGx1Z2luLmNhcHR1cmVLZXlib2FyZExheW91dCgpO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xyXG5cdFx0XHRcdHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5maXhlZE5vcm1hbE1vZGVMYXlvdXQgfHwgREVGQVVMVF9TRVRUSU5HUy5maXhlZE5vcm1hbE1vZGVMYXlvdXQpO1xyXG5cdFx0XHRcdHRvZ2dsZS5vbkNoYW5nZShhc3luYyB2YWx1ZSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5maXhlZE5vcm1hbE1vZGVMYXlvdXQgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdGlmICh2YWx1ZSAmJiBPYmplY3Qua2V5cyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYXB0dXJlZEtleWJvYXJkTWFwKS5sZW5ndGggPT09IDApXHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmNhcHR1cmVkS2V5Ym9hcmRNYXAgPSBhd2FpdCB0aGlzLnBsdWdpbi5jYXB0dXJlS2V5Ym9hcmRMYXlvdXQoKTtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnU3VwcG9ydCBKUyBjb21tYW5kcyAoYmV3YXJlISknKVxyXG5cdFx0XHQuc2V0RGVzYyhcIlN1cHBvcnQgdGhlICdqc2NvbW1hbmQnIGFuZCAnanNmaWxlJyBjb21tYW5kcywgd2hpY2ggYWxsb3cgZGVmaW5pbmcgRXggY29tbWFuZHMgdXNpbmcgSmF2YXNjcmlwdC4gV0FSTklORyEgUmV2aWV3IHRoZSBSRUFETUUgdG8gdW5kZXJzdGFuZCB3aHkgdGhpcyBtYXkgYmUgZGFuZ2Vyb3VzIGJlZm9yZSBlbmFibGluZy5cIilcclxuXHRcdFx0LmFkZFRvZ2dsZSh0b2dnbGUgPT4ge1xyXG5cdFx0XHRcdHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdXBwb3J0SnNDb21tYW5kcyA/PyBERUZBVUxUX1NFVFRJTkdTLnN1cHBvcnRKc0NvbW1hbmRzKTtcclxuXHRcdFx0XHR0b2dnbGUub25DaGFuZ2UodmFsdWUgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3Muc3VwcG9ydEpzQ29tbWFuZHMgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiAnVmltIE1vZGUgRGlzcGxheSBQcm9tcHQnfSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdOb3JtYWwgbW9kZSBwcm9tcHQnKVxyXG5cdFx0XHQuc2V0RGVzYygnU2V0IHRoZSBzdGF0dXMgcHJvbXB0IHRleHQgZm9yIG5vcm1hbCBtb2RlLicpXHJcblx0XHRcdC5hZGRUZXh0KCh0ZXh0KSA9PiB7XHJcblx0XHRcdFx0dGV4dC5zZXRQbGFjZWhvbGRlcignRGVmYXVsdDog8J+foicpO1xyXG5cdFx0XHRcdHRleHQuc2V0VmFsdWUoXHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1TdGF0dXNQcm9tcHRNYXAubm9ybWFsIHx8XHJcblx0XHRcdFx0XHRcdERFRkFVTFRfU0VUVElOR1MudmltU3RhdHVzUHJvbXB0TWFwLm5vcm1hbFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0dGV4dC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnZpbVN0YXR1c1Byb21wdE1hcC5ub3JtYWwgPSB2YWx1ZSB8fFxyXG5cdFx0XHRcdFx0XHRERUZBVUxUX1NFVFRJTkdTLnZpbVN0YXR1c1Byb21wdE1hcC5ub3JtYWw7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdJbnNlcnQgbW9kZSBwcm9tcHQnKVxyXG5cdFx0XHQuc2V0RGVzYygnU2V0IHRoZSBzdGF0dXMgcHJvbXB0IHRleHQgZm9yIGluc2VydCBtb2RlLicpXHJcblx0XHRcdC5hZGRUZXh0KCh0ZXh0KSA9PiB7XHJcblx0XHRcdFx0dGV4dC5zZXRQbGFjZWhvbGRlcignRGVmYXVsdDog8J+foCcpO1xyXG5cdFx0XHRcdHRleHQuc2V0VmFsdWUoXHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1TdGF0dXNQcm9tcHRNYXAuaW5zZXJ0IHx8XHJcblx0XHRcdFx0XHRcdERFRkFVTFRfU0VUVElOR1MudmltU3RhdHVzUHJvbXB0TWFwLmluc2VydFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0dGV4dC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnZpbVN0YXR1c1Byb21wdE1hcC5pbnNlcnQgPSB2YWx1ZSB8fFxyXG5cdFx0XHRcdFx0XHRERUZBVUxUX1NFVFRJTkdTLnZpbVN0YXR1c1Byb21wdE1hcC5pbnNlcnQ7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1TdGF0dXNQcm9tcHRNYXApO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnVmlzdWFsIG1vZGUgcHJvbXB0JylcclxuXHRcdFx0LnNldERlc2MoJ1NldCB0aGUgc3RhdHVzIHByb21wdCB0ZXh0IGZvciB2aXN1YWwgbW9kZS4nKVxyXG5cdFx0XHQuYWRkVGV4dCgodGV4dCkgPT4ge1xyXG5cdFx0XHRcdHRleHQuc2V0UGxhY2Vob2xkZXIoJ0RlZmF1bHQ6IPCfn6EnKTtcclxuXHRcdFx0XHR0ZXh0LnNldFZhbHVlKFxyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudmltU3RhdHVzUHJvbXB0TWFwLnZpc3VhbCB8fFxyXG5cdFx0XHRcdFx0XHRERUZBVUxUX1NFVFRJTkdTLnZpbVN0YXR1c1Byb21wdE1hcC52aXN1YWxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRcdHRleHQub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1TdGF0dXNQcm9tcHRNYXAudmlzdWFsID0gdmFsdWUgfHxcclxuXHRcdFx0XHRcdFx0REVGQVVMVF9TRVRUSU5HUy52aW1TdGF0dXNQcm9tcHRNYXAudmlzdWFsO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnUmVwbGFjZSBtb2RlIHByb21wdCcpXHJcblx0XHRcdC5zZXREZXNjKCdTZXQgdGhlIHN0YXR1cyBwcm9tcHQgdGV4dCBmb3IgcmVwbGFjZSBtb2RlLicpXHJcblx0XHRcdC5hZGRUZXh0KCh0ZXh0KSA9PiB7XHJcblx0XHRcdFx0dGV4dC5zZXRQbGFjZWhvbGRlcignRGVmYXVsdDog8J+UtCcpO1xyXG5cdFx0XHRcdHRleHQuc2V0VmFsdWUoXHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1TdGF0dXNQcm9tcHRNYXAucmVwbGFjZSB8fFxyXG5cdFx0XHRcdFx0XHRERUZBVUxUX1NFVFRJTkdTLnZpbVN0YXR1c1Byb21wdE1hcC5yZXBsYWNlXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0XHR0ZXh0Lm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudmltU3RhdHVzUHJvbXB0TWFwLnJlcGxhY2UgPSB2YWx1ZSB8fFxyXG5cdFx0XHRcdFx0XHRERUZBVUxUX1NFVFRJTkdTLnZpbVN0YXR1c1Byb21wdE1hcC5yZXBsYWNlO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdH1cclxufVxyXG4iXSwibmFtZXMiOlsiUGx1Z2luIiwiTm90aWNlIiwiTWFya2Rvd25WaWV3Iiwia2V5RnJvbUFjY2VsZXJhdG9yLnRvS2V5RXZlbnQiLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE1BQU0sU0FBUyxHQUFHLHNGQUFzRixDQUFDO0FBQ3pHLE1BQU0sUUFBUSxHQUFHLHlWQUF5VixDQUFDO0FBQzNXLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN2QjtBQUNBLFNBQVMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQ2hELENBQUMsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUNwQyxFQUFFLE9BQU8sV0FBVyxDQUFDO0FBQ3JCLEVBQUU7QUFDRjtBQUNBLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3BCLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBQzFELEVBQUU7QUFDRjtBQUNBLENBQUMsT0FBTztBQUNSLEVBQUUs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
