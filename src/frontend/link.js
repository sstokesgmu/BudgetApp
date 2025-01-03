"use strict";
//Untility Class
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PlaidClient {
    //! must includes methods
    //Method to create a link token
    static createLink() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch("/init/create_link_token");
            const data = yield res.json();
            //Save to local storage
            const linkToken = data.link_token;
            localStorage.setItem("link_token", linkToken);
            return linkToken; //Return a promise or a string
        });
    }
    //Method to create the Plaid handler (manages the connection between your app and a user's financial institution)
    static initHandler(linkToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return Plaid.create({
                token: linkToken,
                onSuccess: (token, metadata) => __awaiter(this, void 0, void 0, function* () {
                    console.log(`Public Token: ${token}`);
                    console.log(`Meta Data: ${metadata}`);
                    console.log(token);
                    yield fetch("/init/exchange_public_token", {
                        method: "POST",
                        body: JSON.stringify({ public_token: token }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                }),
                onExit: (err, metadata) => {
                    console.log("Exit Event: ", err, metadata);
                },
                onEvent: (eventName, metadata) => {
                    console.log("Event:", eventName);
                    console.log("Metadata:", metadata);
                },
            });
        });
    }
    //Attach handle.open to a dom element
    static attachEventListener(id, event, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const element = document.getElementById(`"${id}"`);
            element === null || element === void 0 ? void 0 : element.addEventListener(event.type, (e) => {
                handler.open();
            });
            console.log(`Added an event lister ${id},
            ${element === null || element === void 0 ? void 0 : element.tagName}, 
            ${event.type}`);
        });
    }
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const linkToken = yield PlaidClient.createLink();
        const handler = yield PlaidClient.initHandler(linkToken);
        ;
        PlaidClient.attachEventListener("link-account", new Event("click"), handler);
        handler.open();
    }
    catch (error) {
        console.error("Error initializing Plaid handler:", error);
    }
}))();
