"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var Authenticate = function (request, response, next) {
    var token = request.headers['x-auth-token'];
    (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return response
                .status(401)
                .json({ message: 'Signup or Login to continue' });
        }
        request.token = decoded;
        next();
    });
};
exports.Authenticate = Authenticate;
