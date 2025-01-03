import {Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products} from "plaid";
import express,{Request,Response,Application,NextFunction} from "express";
import dotenv from "dotenv";
import session from "express-session"; //!This is like cookies
import path from "path";

declare module "express-session" {
    interface SessionData {
      access_token?: string;
    }
  }
dotenv.config();
const app: Application = express();
const port = 8080;

// Let's tell TypeScript we're adding a new property to the session
// Again, don't ever do this in production



app.use(
    // For Demo purposes only
    // Use an actual secret key in production
    session({
        secret: "use-a-real-secret-key",
        saveUninitialized: true,
        resave: true,
    })
);



// Configuration for plaid client
//? What is a node process
const environment = process.env.PLAID_ENV ?? "sandbox";
const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions:{
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET, 
        },
    },
});

//Instantiat the Plaid client with the configuration
const client: PlaidApi = new PlaidApi(configuration);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

//Create Homepage 
app.get("/", async (_: Request, res: Response) => {
  const filepath = path.join(__dirname, "../frontend/index.html");
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


//!Server route to get the link token from the Plaid Service and return to the client
app.get("/init/create_link_token", 
    async (req:Request, res:Response, next:NextFunction) => {
        try {
            const linkConfigObj: LinkTokenCreateRequest = {
                user: { client_user_id: req.sessionID,},
                client_name: "Plaid's Tiny Quickstart",
                language: "en",
                country_codes: [CountryCode.Us],
                products: [Products.Auth], // Add the required products here
                // redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
            }
            const tokenRes = await client.linkTokenCreate(linkConfigObj);
            res.json(tokenRes.data);
        } catch(error:any) {
            console.log(`Something went wrong when creating the link token ${error.message}`);
            next(error);
        }
    });
// Checks whether the user's account is connected, called
// in index.html when redirected from oauth.html
app.get("/init/is_account_connected", async (req:Request, res:Response, next:NextFunction) => {
      try {
        console.dir(req.session, { depth: null });
        req.session.access_token ? res.json({ status: true }) : res.json({ status: false });
      } catch (error) {
        next(error);
      }
    }
  );

  //! Exchange the clients Link object to for an access token
app.post("/init/exchange_public_token", 
    async (req:Request, res:Response, next:NextFunction) => {
        try {
            const exchangeRes = await client.itemPublicTokenExchange({public_token:req.body.public_token});
            const accessToken = exchangeRes.data.access_token;
            console.log(accessToken);
            //TODO: Store access token in DB instead of session storage
            req.session.access_token = req.session.access_token ?? "";
            res.json(true); 
        } catch(error: any) {
            console.log(`Something went wrong when creating the link token ${error.message}`);
            next(error);
        }
});

  // Fetches balance data using the Node client library for Plaid
app.get(
    "/api/data",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const access_token = req.session.access_token ?? "";
        const balanceResponse = await client.accountsBalanceGet({
          access_token: access_token,
        });
        res.json({
          Balance: balanceResponse.data,
        });
      } catch (error) {
        next(error);
      }
    }
  );

