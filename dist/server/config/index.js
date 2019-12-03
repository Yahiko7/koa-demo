"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const path = require('path');

var _default = {
  staticDir: path.resolve(__dirname, "../../web/public"),
  viewDir: path.resolve(__dirname, '../../web/pages')
};
exports.default = _default;