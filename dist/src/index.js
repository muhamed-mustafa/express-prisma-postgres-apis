"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_json_1 = __importDefault(require("../docs/swagger.json"));
var routes_1 = __importDefault(require("./routes/routes"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static('public'));
app.use(routes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use(function (err, req, res, next) {
    // @ts-ignore
    if (err && err.errorCode) {
        // @ts-ignore
        res.status(err.errorCode).json(err.message);
    }
    else {
        res.status(500).json(err.message);
    }
});
var PORT = 3000 || process.env.PORT;
app.listen(PORT, function () { return console.log("App listening on port ".concat(PORT)); });
