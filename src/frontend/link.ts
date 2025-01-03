//Untility Class




class PlaidClient {
    //! must includes methods
    //Method to create a link token
    static async createLink():Promise<string> {
        const res = await fetch ("/init/create_link_token");
        const data = await res.json();
        //Save to local storage
        const linkToken = data.link_token;
        localStorage.setItem("link_token", linkToken);
        return linkToken; //Return a promise or a string
    }
    
    //Method to create the Plaid handler (manages the connection between your app and a user's financial institution)
    static async initHandler(linkToken:string): Promise<Plaid.Handler> {
        return Plaid.create({
            token: linkToken,
            onSuccess: async (token, metadata) => {
                console.log(`Public Token: ${token}`);
                console.log(`Meta Data: ${metadata}`);
        
                console.log(token);
                await fetch ("/init/exchange_public_token", {
                    method: "POST",
                    body: JSON.stringify({ public_token: token}),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
            onExit: (err, metadata) => {
                console.log("Exit Event: ", err, metadata);
           }, 
            onEvent: (eventName, metadata) => {
                console.log("Event:", eventName);
                console.log("Metadata:", metadata);
            },
        });
    }

    //Attach handle.open to a dom element
    static async attachEventListener(
        id:string,
        event:Event,
        handler:Plaid.Handler):Promise<void> {
        const element = document.getElementById(`"${id}"`);
        element?.addEventListener(event.type, (e) => {
            handler.open();    
        })
        console.log(`Added an event lister ${id},
            ${element?.tagName}, 
            ${event.type}`);
    }
}

(async () => {
    try {
        const linkToken = await PlaidClient.createLink();
        const handler = await PlaidClient.initHandler(linkToken);
        ;
        PlaidClient.attachEventListener(
            "link-account",
            new Event("click"),
            handler
        );
        handler.open();
    } catch (error) {
        console.error("Error initializing Plaid handler:", error);
    }
})();
