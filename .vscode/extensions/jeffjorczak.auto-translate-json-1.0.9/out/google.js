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
exports.GoogleTranslate = void 0;
const { Translate } = require("@google-cloud/translate").v2;
class GoogleTranslate {
    constructor(apikey) {
        this.apikey = apikey;
        this.googleTranslate = new Translate({ key: this.apikey });
    }
    isValidLocale(targetLocale) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.googleTranslate.translate("test", targetLocale);
            }
            catch (error) {
                if (error.message === "Invalid Value") {
                    return false;
                }
                throw error;
            }
            return true;
        });
    }
    translateText(text, targetLocale) {
        return __awaiter(this, void 0, void 0, function* () {
            var pattern = /{(.*?)}/g;
            var args = text.match(pattern);
            // replace arguments with numbers
            if (args) {
                var i = 0;
                for (let arg of args) {
                    text = text.replace(arg, "{" + i + "}");
                    i++;
                }
            }
            var result = "";
            try {
                var translations = yield this.googleTranslate.translate(text, targetLocale);
                result = translations[0];
            }
            catch (error) {
                var message = error.message;
                if (error.message === "Invalid Value") {
                    message = "Invalid Locale " + targetLocale;
                }
                console.log(message);
                return "";
            }
            // replace arguments with numbers
            if (args) {
                var i = 0;
                for (let arg of args) {
                    result = result.replace("{" + i + "}", arg);
                    i++;
                }
            }
            return result;
        });
    }
}
exports.GoogleTranslate = GoogleTranslate;
//# sourceMappingURL=google.js.map