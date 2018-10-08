"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function to_lower_snake_case(text) {
    if (text.length == 1)
        return text;
    return text[0].toLowerCase() + text.substr(1).replace(/[A-Z]+/g, i => '_' + i.toLowerCase());
}
exports.to_lower_snake_case = to_lower_snake_case;
function to_lower(text) {
    return text[0].toLowerCase() + text.substr(1);
}
exports.to_lower = to_lower;
//# sourceMappingURL=utility.js.map