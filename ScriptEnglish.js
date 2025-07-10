/*
 * ScriptEnglish
 * Copyright © 2025 Cryptic Tek
 */
const Senglish = (() => {
    'use strict';
    const config = { debug: true, warnings: true };
    const state = {};
    const commands = {};
    const log = (message) => { if (config.debug) console.log(`Senglish: ${message}`); };
    const warn = (message) => { if (config.warnings) console.warn(`Senglish Warning: ${message}`); };
    const $_ = (id) => document.getElementById(id);
    const createElem = (tag, id) => { const elem = document.createElement(tag); if (id) elem.id = id.trim().toLowerCase(); return elem; };
    const appendToTarget = (element, targetId) => {
        if (!element) return;
        const parentId = targetId?.trim().toLowerCase();
        let parent;
        if (!parentId || parentId === 'body') {
            parent = document.body;
        } else {
            parent = $_(parentId);
        }
        if (parent) {
            parent.appendChild(element);
        } else {
            warn(`Target container "${parentId}" not found.`);
        }
    };
    const registerCommand = (commandConfig) => { const { name, aliases = [], handler } = commandConfig; if (!name || !handler) { warn(`Invalid command registration: ${name || 'unnamed'}`); return; } [name, ...aliases].forEach(alias => { commands[alias.toLowerCase()] = handler; }); };
    
    // --- Command Handlers (All ID lookups are now case-insensitive) ---
    registerCommand({ name: 'create', handler: (cmd) => { const parts = cmd.match(/create\s+(\w+)\s+named\s+([\w-]+)(?:\s+in\s+([\w-]+))?(?:\s+with\s+text\s+"([^"]+)")?/); if (!parts) return warn('Syntax error. Use: create <tag> named <id> [in <container>] [with text "..."]'); const [, tag, id, container, text] = parts; const elem = createElem(tag, id); if (text) elem.textContent = text; appendToTarget(elem, container); } });
    registerCommand({ name: 'style', handler: (cmd) => { const parts = cmd.match(/style\s+([\w-]+)\s+with\s+(.+)/); if (!parts) return warn('Syntax error. Use: style <id> with <css-rules>'); const [, id, rulesStr] = parts; const elem = $_(id.toLowerCase()); if (!elem) return warn(`Element "${id}" not found for styling.`); rulesStr.split(/\s+and\s+/).forEach(rule => { const [prop, value] = rule.trim().split(/:(.+)/); if (prop && value) elem.style[prop.trim()] = value.trim(); }); } });
    registerCommand({ name: 'addClass', handler: (cmd) => { const parts = cmd.match(/addClass\s+([\w-]+)\s+to\s+([\w-]+)/); if (!parts) return warn('Syntax error. Use: addClass <className> to <id>'); const [, className, id] = parts; $_(id.toLowerCase())?.classList.add(className); } });
    registerCommand({ name: 'removeClass', handler: (cmd) => { const parts = cmd.match(/removeClass\s+([\w-]+)\s+from\s+([\w-]+)/); if (!parts) return warn('Syntax error. Use: removeClass <className> from <id>'); const [, className, id] = parts; $_(id.toLowerCase())?.classList.remove(className); } });
    registerCommand({ name: 'toggleClass', handler: (cmd) => { const parts = cmd.match(/toggleClass\s+([\w-]+)\s+on\s+([\w-]+)/); if (!parts) return warn('Syntax error. Use: toggleClass <className> on <id>'); const [, className, id] = parts; $_(id.toLowerCase())?.classList.toggle(className); } });
    registerCommand({ name: 'insert', handler: (cmd) => { const parts = cmd.match(/insert\s+(text|html|value)\s+"([^"]*)"\s+(into|on)\s+([\w-]+)/); if (!parts) return warn('Syntax error. Use: insert <text|html|value> "content" <into|on> <id>'); const [, type, content, , id] = parts; const elem = $_(id.toLowerCase()); if (!elem) return warn(`Element "${id}" not found for insert.`); if (type === 'text') { elem.textContent = content; } else if (type === 'value') { elem.value = content; } else { warn('Using "insert html" can be a security risk.'); elem.innerHTML = content; } } });
    registerCommand({ name: 'setAttr', handler: (cmd) => { const parts = cmd.match(/setAttr\s+([\w-]+)\s+to\s+"([^"]+)"\s+on\s+([\w-]+)/); if (!parts) return warn('Syntax error. Use: setAttr <attribute> to "value" on <id>'); const [, attr, value, id] = parts; $_(id.toLowerCase())?.setAttribute(attr, value); } });
    registerCommand({ name: 'when', handler: (cmd) => { const parts = cmd.match(/^when\s+([\w-]+)\s+is\s+(\w+)\s+do\s+([\s\S]+)\s+end$/); if (!parts) return warn('Syntax error. Use: when <id> is <event> do ... end'); const [, id, event, action] = parts; const elem = $_(id.toLowerCase()); if (!elem) return warn(`Element "${id}" not found for event binding.`); elem.addEventListener(event, (e) => { if (event === 'submit') { e.preventDefault(); } const taskInput = document.getElementById('taskinput'); const inputValue = taskInput ? taskInput.value : ''; if (event === 'submit' && !inputValue.trim()) return; let finalAction = action.replace(/INPUT_VALUE/g, `"${inputValue}"`); finalAction = finalAction.replace(/UNIQUE_ID/g, Date.now()); process(finalAction); }); } });
    registerCommand({ name: 'animate', handler: (cmd) => { const parts = cmd.match(/animate\s+([\w-]+)\s+with\s+([\w-]+)(?:\s+for\s+([\d.]+)s)?/); if (!parts) return warn('Syntax error. Use: animate <id> with <className> [for <duration>s]'); const [, id, className, durationStr] = parts; const elem = $_(id.toLowerCase()); if (!elem) return warn(`Element "${id}" not found for animation.`); const duration = durationStr ? parseFloat(durationStr) * 1000 : 500; return new Promise(resolve => { elem.classList.add(className); setTimeout(() => { if (!cmd.includes('and keep')) elem.classList.remove(className); resolve(); }, duration); }); } });
    registerCommand({ name: 'wait', handler: (cmd) => { const parts = cmd.match(/wait\s+([\d.]+)\s*s/); if (!parts) return warn('Syntax error. Use: wait <duration>s'); const duration = parseFloat(parts[1]) * 1000; return new Promise(resolve => setTimeout(resolve, duration)); } });
    registerCommand({ name: 'fetch', handler: async (cmd) => { const parts = cmd.match(/fetch\s+json\s+from\s+([^\s]+)(?:\s+and\s+store\s+as\s+(\w+))?/); if (!parts) return warn('Syntax error. Use: fetch json from <url> [and store as <key>]'); const [, url, stateKey] = parts; try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const data = await response.json(); if (stateKey) { state[stateKey] = data; log(`Data from ${url} stored in state.${stateKey}`); } return data; } catch (e) { warn(`Fetch failed: ${e.message}`); } } });
    registerCommand({ name: 'remove', handler: (cmd) => { const parts = cmd.match(/remove\s+element\s+([\w-]+)/); if (!parts) return warn('Syntax error: Use: remove element <id>'); $_(parts[1].toLowerCase())?.remove(); }});
    
    const executeCommand = async (commandText) => { const commandName = commandText.split(' ')[0].toLowerCase(); const handler = commands[commandName]; if (handler) { try { await handler(commandText); } catch (e) { warn(`Error executing "${commandName}": ${e.message}`); } } else { warn(`Unknown command "${commandName}".`); } };
    
    // Robust process function to handle nested blocks and quoted strings
    const process = async (fullCommandString) => {
        const commandChain = [];
        let buffer = '';
        let depth = 0;
        let inQuote = false;
        let i = 0;

        const normalizedString = fullCommandString.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');

        while (i < normalizedString.length) {
            const char = normalizedString[i];
            
            if (char === '"') {
                inQuote = !inQuote;
            }

            const lookaheadWhen = normalizedString.substring(i).match(/^when\s/);
            const lookaheadEnd = normalizedString.substring(i).match(/^end\b/);
            const lookaheadChain = normalizedString.substring(i).match(/^\s*\.\./);

            if (lookaheadWhen && !inQuote) {
                depth++;
            }
            if (lookaheadEnd && !inQuote && depth > 0) {
                depth--;
            }

            if (lookaheadChain && depth === 0 && !inQuote) {
                if (buffer.trim()) {
                    commandChain.push(buffer.trim());
                }
                buffer = '';
                i += lookaheadChain[0].length;
                continue;
            }

            buffer += char;
            i++;
        }
        if (buffer.trim()) {
            commandChain.push(buffer.trim());
        }
        
        for (const command of commandChain) {
            await executeCommand(command.trim());
        }
    };

    return { cmd: process, registerCommand: registerCommand, config: config, state: state };
})();