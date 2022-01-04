'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
const vscode = require("vscode");
const constants_1 = require("./constants");
class Global {
    static get Configuration() {
        return vscode.workspace.getConfiguration(constants_1.Constants.ExtensionId);
    }
}
exports.Global = Global;
Global.keytar = getCoreNodeModule('keytar');
Global.context = null;
Global.ResultManager = null;
function getCoreNodeModule(moduleName) {
    try {
        return require(`${vscode.env.appRoot}/node_modules.asar/${moduleName}`);
    }
    catch (err) { }
    try {
        return require(`${vscode.env.appRoot}/node_modules/${moduleName}`);
    }
    catch (err) { }
    return null;
}
//# sourceMappingURL=global.js.map