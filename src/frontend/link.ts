
(async ($) => {
    const createLinkToken = async () => {
        const respone = await fetch ("/api/init/create_link_token");
        const data = await respone.json();
    };
    
    //Initialize Link
    const handler = Plaid.create({
        token : await createLinkToken(),
        onSuccess: async (publicToken, metadata) => {
            await fetch("/api/exchange_public_token", {
                method: "POST",
                body: JSON.stringify({public_token: publicToken}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            await getBalance();
        },
        onEvent: (eventName, metadata) => {
            console.log("Event:", eventName);
            console.log("Metadata:", metadata);
        },
        onExit: (error, metadata) => {
            console.log(error,metadata);
        },
    });

    //Start Link when button is clicked 
    const linkAccountButton = document.getElementById("link-acount");
    linkAccountButton?.addEventListener("click", (event) => {
        handler.open();
    });

 
})()
   // Retrieves balance information
   const getBalance = async function() {
        const res = await fetch("/api/data", {
            method: "GET",
        });

        const data = await res.json();
        
        //Render response data 
        const pre = document.getElementById("response");
        pre.textContent = JSON.stringify(data, null, 2);
        pre.style.background = "#F6F6F6"
   }