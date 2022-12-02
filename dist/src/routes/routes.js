"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = __importDefault(require("../controllers/authController"));
var api = (0, express_1.Router)().use(authController_1.default);
exports.default = (0, express_1.Router)().use('/api', api);
