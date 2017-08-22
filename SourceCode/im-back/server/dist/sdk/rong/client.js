"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const httpm = require("typed-rest-client/HttpClient");
const util_1 = require("../../lib/util");
const httpc = new httpm.HttpClient('');
/*
 * http 请求
 * @param url
 * @param rst
 */
function exec(url, rst) {
    return __awaiter(this, void 0, void 0, function* () {
        const APPKEY = config_1.default.rong.RONGCLOUD_APP_KEY;
        const APPSECRET = config_1.default.rong.RONGCLOUD_APP_SECRET;
        const NONCE = parseInt((Math.random() * 0xffffff).toString());
        const TIMESTAMP = Date.parse((new Date()).toString()) / 1000;
        const SIGNATURE = util_1.sha1(APPSECRET + NONCE + TIMESTAMP);
        const headers = {
            ["App-Key"]: APPKEY,
            ["Nonce"]: NONCE,
            ["Timestamp"]: TIMESTAMP,
            ["Signature"]: SIGNATURE,
            ["Content-Type"]: 'application/x-www-form-urlencoded',
        };
        let query = Object.keys(rst).map(k => k + '=' + rst[k]).join('&');
        let re = yield httpc.post(config_1.default.rong.url + url, query, headers);
        return yield re.readBody();
    });
}
exports.exec = exec;
//# sourceMappingURL=client.js.map