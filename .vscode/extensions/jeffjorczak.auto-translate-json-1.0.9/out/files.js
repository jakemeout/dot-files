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
exports.Files = void 0;
const path = require("path");
const fs = require("fs");
class Files {
    constructor(filePath) {
        this.folderPath = path.dirname(filePath);
        var fileName = path.basename(filePath);
        this.sourceLocale = this.getLocaleFromFilename(fileName);
        this.targetLocales = this.getTargetLocales();
    }
    getLocaleFromFilename(fileName) {
        return fileName.replace(".json", "");
    }
    getTargetLocales() {
        var locales = new Array();
        var files = fs.readdirSync(this.folderPath);
        files.forEach((file) => {
            var locale = this.getLocaleFromFilename(file);
            if (locale !== this.sourceLocale) {
                locales.push(locale);
            }
        });
        return locales;
    }
    loadJsonFromLocale(locale) {
        return __awaiter(this, void 0, void 0, function* () {
            var filename = this.folderPath + "/" + locale + ".json";
            var data = yield this.readFileAsync(filename);
            // handle empty files
            if (!data) {
                data = "{}";
            }
            var json = JSON.parse(data);
            return json;
        });
    }
    readFileAsync(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs.readFile(filename, (error, data) => {
                    error ? reject(error) : resolve(data.toString());
                });
            });
        });
    }
    saveJsonToLocale(locale, file) {
        var filename = this.folderPath + "/" + locale + ".json";
        var data = JSON.stringify(file, null, "  ");
        fs.writeFileSync(filename, data, "utf8");
    }
}
exports.Files = Files;
//# sourceMappingURL=files.js.map