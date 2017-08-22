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
const client = require("./client");
const urlConfig_1 = require("./urlConfig");
/**
 * 请求参数
 */
class SmsRst {
}
exports.SmsRst = SmsRst;
/**
 * 返回数据
 */
class SmsRpn {
}
exports.SmsRpn = SmsRpn;
/**
 * 获取数据
 * @param rst 参数
 */
function exec(rst) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield client.exec(urlConfig_1.default.sms, rst);
        return JSON.parse(data);
    });
}
exports.exec = exec;
//# sourceMappingURL=sms.js.map