import express, {Request, Response, Router} from "express";
import UserModel from "../models/user.js";
import { IAccount } from "../../../../shared/interfaces/budget.js";
import AccountModel from "../models/account.js";

//create mini app
const router:Router = express.Router();

/** 
 * @param {string} - / refers to the root
 * @param {Request} 
 * @param {Response} 
 * @callback => will fetch all documents within the accounts collection
*/
router.get("/", async ( _:Request , res:Response) => {
    const user = await UserModel.find({});
    try {
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 * @param {string} - / refers to the endpoint
 * @param {Request} 
 * @param {Response} 
 * @callback => will queries to see if a document of model user has an accounts array of @type {number} exists
 * Then we push (add) the new account id to the array   
*/
router.post("/create/:accountId", async(req:Request, res:Response) => {
    const { accountId } = req.params;
    const { accountType, amount} = req.body
    try {
        const result = await UserModel.findOneAndUpdate(
            {"accounts": {$exists: true, $type: "array"}},
            {$push: {"accounts": accountId}},
            {new: true}
        ).exec()
        await createAccount(parseInt(accountId), accountType, amount);
    res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 * @param {string} - route endpoint
 * @param {Request} 
 * @param {Response} 
 * @callback => will queries to see if a document of model user has an accounts array of @type {number} exists
 * Then we push (add) the new account id to the array   
*/
router.patch("/del/:accountId", async(req:Request, res:Response) => {
    try {
        const result = await UserModel.findOneAndUpdate(
            {"accounts": req.params.accountId},
            {$pull: {"accounts": req.params.accountId}},
            {new: true}
        ).exec();
        res.status(200).send(result);
    } catch(error) {
        res.status(500).send(error);
    }
});


/**
 * 
 * @param id  - the account id 
 * @param accountType  - the type of the account 
 * @param startNumber  - the starting amount of the account 
 * @function - This function creates a new account model and saves it to the database collection
 */
async function createAccount (id:number, accountType:string, startNumber:number) {
    const data:IAccount = {
        account_id : id,
        type: accountType,
        date_opened: new Date(Date.now()),
        date_closed: null,
        starting_amount: startNumber,
        current_amount: startNumber,
    }
    try {
        const account = new AccountModel(data);
        await account.save();
        console.log(`Account created successfully: ${account}`)
    } catch (error) {
        console.error(error);
    }
}
export default router;