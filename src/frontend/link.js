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
(($) => __awaiter(void 0, void 0, void 0, function* () {
    const createLinkToken = () => __awaiter(void 0, void 0, void 0, function* () {
        const respone = yield fetch("/api/init/create_link_token");
        const data = yield respone.json();
    });
    //Initialize Link
    const handler = Plaid.create({
        token: yield createLinkToken(),
        onSuccess: (publicToken, metadata) => __awaiter(void 0, void 0, void 0, function* () {
            yield fetch("/api/exchange_public_token", {
                method: "POST",
                body: JSON.stringify({ public_token: publicToken }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            yield getBalance();
        }),
        onEvent: (eventName, metadata) => {
            console.log("Event:", eventName);
            console.log("Metadata:", metadata);
        },
        onExit: (error, metadata) => {
            console.log(error, metadata);
        },
    });
    //Start Link when button is clicked 
    const linkAccountButton = document.getElementById("link-acount");
    linkAccountButton === null || linkAccountButton === void 0 ? void 0 : linkAccountButton.addEventListener("click", (event) => {
        handler.open();
    });
}))();
// Retrieves balance information
const getBalance = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/data", {
            method: "GET",
        });
        const data = yield res.json();
        //Render response data 
        const pre = document.getElementById("response");
        pre.textContent = JSON.stringify(data, null, 2);
        pre.style.background = "#F6F6F6";
    });
};
