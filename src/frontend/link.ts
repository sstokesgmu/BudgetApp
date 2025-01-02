//Untility Class
class PlaidClient {
    //! must includes methods
    //Method to create a link token
    static async createLink():Promise<string> {
        const res = await fetch ("/init/create_link_token");
        const data = await res.json();
        console.log(data);
        //Save to local storage
        const linkToken = data.link_token;
        console.log(linkToken)
        localStorage.setItem("link_token", linkToken);
        return linkToken; //Return a promise or a string
    }
    
    //Method to create the Plaid handler (manages the connection between your app and a user's financial institution)
    static async initHandler(linkToken:string): Promise<Plaid.Handler> {
        return Plaid.create({
            token: linkToken,
            onSuccess: (token, metadata) => {
                console.log(`Public Token: ${token}`);
                console.log(`Meta Data: ${metadata}`);
            },
            onExit: (err, metadata) => {
                console.log("Exit Event: ", err, metadata);
           }, 
        });
    }
}

(async () => {
    
    try {
        const linkToken = await PlaidClient.createLink();
        console.log(linkToken);
        const handler = await PlaidClient.initHandler(linkToken);
        handler.open();
    } catch (error) {
        console.error("Error initializing Plaid handler:", error);
    }
})();
