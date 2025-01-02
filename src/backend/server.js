"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const plaid_1 = require("plaid");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session")); //!This is like cookies
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8080;
// Let's tell TypeScript we're adding a new property to the session
// Again, don't ever do this in production
app.use(
// For Demo purposes only
// Use an actual secret key in production
(0, express_session_1.default)({
    secret: "use-a-real-secret-key",
    saveUninitialized: true,
    resave: true,
}));
// Configuration for plaid client
//? What is a node process
const environment = (_a = process.env.PLAID_ENV) !== null && _a !== void 0 ? _a : "sandbox";
const configuration = new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});
//Instantiat the Plaid client with the configuration
const client = new plaid_1.PlaidApi(configuration);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//Create Homepage 
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = path_1.default.join(__dirname, "../frontend/index.html");
    console.log(__dirname);
    console.log(filepath);
    res.sendFile(path_1.default.join(__dirname, "../frontend/index.html"));
}));
//!Server route to get the link token from the Plaid Service and return to the client
app.get("/init/create_link_token", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const linkConfigObj = {
            user: { client_user_id: req.sessionID, },
            client_name: "Plaid's Tiny Quickstart",
            language: "en",
            country_codes: [plaid_1.CountryCode.Us],
            products: [plaid_1.Products.Auth], // Add the required products here
            // redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
        };
        const tokenRes = yield client.linkTokenCreate(linkConfigObj);
        res.json(tokenRes.data);
    }
    catch (error) {
        console.log(`Something went wrong when creating the link token ${error.message}`);
        next(error);
    }
}));
// app.get("/api/is_account_connected", 
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             return req.session.access_token ? 
//         }
//     });
// Checks whether the user's account is connected, called
// in index.html when redirected from oauth.html
app.get("/init/is_account_connected", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.dir(req.session, { depth: null });
        req.session.access_token ? res.json({ status: true }) : res.json({ status: false });
    }
    catch (error) {
        next(error);
    }
}));
//! Exchange the clients Link object to for an access token
app.post("/init/exchange_public_token", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const exchangeRes = yield client.itemPublicTokenExchange({ public_token: req.body.public_token });
        const accessToken = exchangeRes.data.access_token;
        //TODO: Store access token in DB instead of session storage
        req.session.access_token = (_a = req.session.access_token) !== null && _a !== void 0 ? _a : "";
        res.json(true);
    }
    catch (error) {
        console.log(`Something went wrong when creating the link token ${error.message}`);
        next(error);
    }
}));
// Fetches balance data using the Node client library for Plaid
app.get("/api/data", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const access_token = (_a = req.session.access_token) !== null && _a !== void 0 ? _a : "";
        const balanceResponse = yield client.accountsBalanceGet({
            access_token: access_token,
        });
        res.json({
            Balance: balanceResponse.data,
        });
    }
    catch (error) {
        next(error);
    }
}));
