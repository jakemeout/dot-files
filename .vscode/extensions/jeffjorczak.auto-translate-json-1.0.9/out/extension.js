"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const files_1 = require("./files");
const google_1 = require("./google");
const NAME = "AutoTranslateJSON";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Extension "auto-translate-json" is active');
    vscode.commands.registerCommand("extension.autotranslate", (resource) => __awaiter(this, void 0, void 0, function* () {
        // check that we have a google api key
        var apikey = vscode.workspace
            .getConfiguration()
            .get("auto-translate-json.googleApiKey");
        if (!apikey) {
            showWarning("You must provide a Google API key first in the extension settings.");
            return;
        }
        var googleTranslate = new google_1.GoogleTranslate(apikey);
        // inform user if runnign the extension from the command bar
        if (resource == null) {
            showMessage("You must run this extension by right clicking on a .json file", "");
            return;
        }
        var filePath;
        var files;
        try {
            filePath = resource.fsPath;
            files = new files_1.Files(filePath);
            // log locale info
            showMessage("Source locale = " + files.sourceLocale);
            showMessage("Target locales = " + files.targetLocales);
        }
        catch (error) {
            showError(error, "Opening Files: ");
            return;
        }
        // enforce source locale if provided in settings
        var configLocale = vscode.workspace
            .getConfiguration()
            .get("auto-translate-json.sourceLocale");
        if (!configLocale || configLocale !== files.sourceLocale) {
            showWarning("You must use the " +
                configLocale +
                ".json file due to your Source Locale setting.");
            return;
        }
        // ask user to pick options
        var keepTranslations = yield askToPreservevTranslations();
        if (keepTranslations === null) {
            showWarning("You must select a translations option");
            return;
        }
        var keepExtras = yield askToKeepExtra();
        if (keepExtras === null) {
            showWarning("You must select a keep option");
            return;
        }
        // load source JSON
        try {
            var source = yield files.loadJsonFromLocale(files.sourceLocale);
        }
        catch (error) {
            showError(error, "Source file malfored");
            return;
        }
        // Iterate target Locales
        files.targetLocales.forEach((targetLocale) => __awaiter(this, void 0, void 0, function* () {
            try {
                var isValid = yield googleTranslate.isValidLocale(targetLocale);
                if (!isValid) {
                    throw Error(targetLocale + " is not supported. Skipping.");
                }
                var targetOriginal = yield files.loadJsonFromLocale(targetLocale);
                // Iterate source terms
                var targetNew = yield recurseNode(source, targetOriginal, keepTranslations, keepExtras, targetLocale, googleTranslate);
                // save target
                files.saveJsonToLocale(targetLocale, targetNew);
                var feedback = "Translated locale '" + targetLocale + "'";
                console.log(feedback);
                vscode.window.showInformationMessage(feedback);
            }
            catch (error) {
                showError(error.message);
                return;
            }
        }));
    }));
    function recurseNode(source, original, keepTranslations, keepExtras, locale, googleTranslate) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            var destination = {};
            // defaults
            if (keepTranslations === null) {
                keepTranslations = true;
            }
            if (keepExtras === null) {
                keepExtras = true;
            }
            for (var term in source) {
                var node = source[term];
                if (node instanceof Object && node !== null) {
                    destination[term] = yield recurseNode(node, (_a = original[term]) !== null && _a !== void 0 ? _a : {}, keepTranslations, keepExtras, locale, googleTranslate);
                }
                else {
                    // if we already have a translation, keep it
                    if (keepTranslations && original[term]) {
                        destination[term] = original[term];
                    }
                    else {
                        var translation = yield googleTranslate
                            .translateText(node, locale)
                            .catch((err) => showError(err));
                        destination[term] = translation;
                    }
                }
            }
            if (keepExtras) {
                // add back in any terms that were not in source
                for (var term in original) {
                    if (!destination[term]) {
                        destination[term] = original[term];
                    }
                }
            }
            return destination;
        });
    }
}
exports.activate = activate;
function showError(error, prefix = "") {
    var message = error.toString();
    if (error.message) {
        message = NAME + ": " + prefix + error.message;
    }
    else {
        message = NAME + ": " + prefix + message;
    }
    console.error(message);
    vscode.window.showErrorMessage(message);
}
function showWarning(message, prefix = "") {
    message = NAME + ": " + prefix + message;
    console.log(message);
    vscode.window.showWarningMessage(message);
}
function showMessage(message, prefix = "") {
    message = NAME + ": " + prefix + message;
    console.log(message);
    vscode.window.showInformationMessage(message);
}
function askToPreservevTranslations() {
    return __awaiter(this, void 0, void 0, function* () {
        var keepTranslations = null;
        var optionKeep = "Preserve previous translations (default)";
        var optionReplace = "Retranslate previous translations";
        yield vscode.window
            .showQuickPick([optionKeep, optionReplace])
            .then((selection) => {
            if (selection === optionReplace) {
                keepTranslations = false;
            }
            if (selection === optionKeep) {
                keepTranslations = true;
            }
        });
        return keepTranslations;
    });
}
function askToKeepExtra() {
    return __awaiter(this, void 0, void 0, function* () {
        var keepExtra = null;
        var optionKeep = "Keep extra translations (default)";
        var optionReplace = "Remove extra translations";
        yield vscode.window
            .showQuickPick([optionKeep, optionReplace])
            .then((selection) => {
            if (selection === optionReplace) {
                keepExtra = false;
            }
            if (selection === optionKeep) {
                keepExtra = true;
            }
        });
        return keepExtra;
    });
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map