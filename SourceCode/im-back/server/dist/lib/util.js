"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function md5(str) {
    let md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}
exports.md5 = md5;
function sha1(str) {
    let sha1 = crypto.createHash('sha1');
    sha1.update(str);
    return sha1.digest('hex');
}
exports.sha1 = sha1;
//# sourceMappingURL=util.js.map