"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = __importDefault(require("./app/config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const notFoundHandler_1 = __importDefault(require("./app/middlewares/notFoundHandler"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
// middlewares
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({
    limit: config_1.default.MAX_REQUEST_SIZE || '100kb',
    extended: true
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use((0, cors_1.default)({ origin: ["http://localhost:5173", "http://127.0.0.1:5500", "https://krezona.vercel.app", "https://krezona-admin.vercel.app"], credentials: true }));
app.use(express_1.default.json());
if (config_1.default.node_env === "development") {
    app.use((0, morgan_1.default)("tiny"));
}
// api route
app.get("/", (req, res) => {
    res.send("Welcome to admin API");
});
app.use("/api", routes_1.default);
app.use(notFoundHandler_1.default);
app.use(globalErrorHandler_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${config_1.default.port}`);
});
exports.default = app;
