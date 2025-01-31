import express, {Request, Response, Router} from "express";
import UserModel from "../models/user.js";
import { IAccount } from "../../../shared/interfaces/budget.js";
import AccountModel from "../models/account.js";
import {BudgetApp} from '../../../tools/budgetMe.js'

//create mini app
const router:Router = express.Router();

/** 
 * @param {string} - / refers to the root
 * @param {Request} 
 * @param {Response} 
 * @callback => will fetch all documents within the user collection
*/
router.get("/", async ( _:Request , res:Response) => {
    const user = await UserModel.find({});
    try {
        console.log("Get user request from client");
        res.status(200).send(user);
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
router.post("/create/accounts", async(req:Request, res:Response) => {
    const {account} = req.body.account;
    try {
        const ids = BudgetApp.UnpackAccountIds(account, BudgetApp.ValidateAccount(account));
        const result = await UserModel.findOneAndUpdate(
            {'accounts': {$exists: true, $type: 'array'}},
            {$push: {ids}},
            {new:true}
        ).exec()
        res.status(200).send("okay");
    } catch (error) {
        res.status(500).send(error);
    }
});

/** 
 * @param {string} - route endpoint
 * @param {Request} 
 * @param {Response} 
 * @callback => will queries to see if a document of model user has an accounts array of @type {number} exists
 * Then we pull (remove) the an account from the array   
*/

//? localhost:8080/api/uses/del?accounts=123,456,789
router.patch("/del/accounts", async(req:Request, res:Response) => {
    try {      
        const accountsArray = (req.query.accounts as string).split(',').map(account => parseInt(account))
        const result = await UserModel.updateMany(
            {"accounts": {$in:accountsArray}},
            {$pull:{"accounts": {$in:accountsArray}}}
        ).exec()            
        const res_data = BudgetApp.DeleteAccounts(req.query.accounts as string);
        console.log(`Accounts: ${req.query.accounts} were deleted successfully`);
        res.status(200).send(result);
    } catch(error) {
        res.status(500).send(error);
    }
});


// /**
//  * 
//  * @param id  - the account id 
//  * @param accountType  - the type of the account 
//  * @param startNumber  - the starting amount of the account 
//  * @function - This function creates a new account model and saves it to the database collection
//  */
// async function createAccount (id:number, accountType:string, startNumber:number) {
//     const data:IAccount = {
//         account_num : id,
//         type: accountType,
//         date_opened: new Date(Date.now()),
//         date_closed: null,
//         starting_amount: startNumber,
//         current_amount: startNumber,
//         bucket :null,
//     }
//     try {
//         const account = new AccountModel(data);
//         await account.save();
//         console.log(`Account created successfully: ${account}`)
//     } catch (error) {
//         console.error(error);
//     }
// }
export default router;