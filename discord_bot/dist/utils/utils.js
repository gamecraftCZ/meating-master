"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
/**
 * Return promise, that resolves after {ms} milliseconds.
 * @param ms - Sleep time in milliseconds
 */
exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
//# sourceMappingURL=utils.js.map