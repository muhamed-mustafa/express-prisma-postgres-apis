"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateToken = function (user) {
    return jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET || 'superSecret', { expiresIn: '60d' });
};
exports.default = generateToken;
