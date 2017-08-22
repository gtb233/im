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
const httpc = new httpm.HttpClient('');
/**
 * 通用响应类，无分页
 */
class RSM {
}
exports.RSM = RSM;
/// 通用响应类
class RSMP {
}
exports.RSMP = RSMP;
class DataPageInfo {
}
exports.DataPageInfo = DataPageInfo;
class pageInfo {
}
exports.pageInfo = pageInfo;
/*
 * http 请求
 * @param url
 * @param rst
 */
function exec(url, rst) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {
            ["Content-Type"]: "application/json",
            ["clientType"]: 7
        };
        let re = yield httpc.post(config_1.default.openApi.url + url, JSON.stringify(rst), headers);
        return yield re.readBody();
    });
}
exports.exec = exec;
//# sourceMappingURL=client.js.map