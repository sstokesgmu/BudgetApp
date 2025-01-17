import express, {Request, Response, Router} from "express";
import UserModel from "../models/user.js";
import { IAccount } from "../../../../shared/interfaces/budget.js";
import AccountModel from "../models/account.js";

//create mini app
const router:Router = express.Router();

router.get("/", async ( _:Request , res:Response) => {
    const user = await UserModel.find({});
    try {
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// These route modify the 
router.post("/create/:accountId", async(req:Request, res:Response) => {
    console.log(req.params);
    const { accountId } = req.params;
    const { accountType, amount} = req.body

    try {
        const result = await UserModel.findOneAndUpdate(
            {"accounts": {$exists: true, $type: "array"}},
            {$push: {"accounts": accountId}},
            {new: true}
        ).exec()
        
        await createAccount(parseInt(accountId), accountType, amount);
        res.status(200).send(`The response is okay: ${result}.`);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.patch("/del/:accountId", async(req:Request, res:Response) => {
    try {
        const result = await UserModel.findOneAndUpdate(
            {"accounts": {$all: [req.params.accountId]}},
            {$pull: {"accounts": req.params.accountId}},
            {new: true}
        ).exec();
        res.status(200).send(`The response is okay: ${result}`);
    } catch(error) {
        res.status(500).send(error);
    }
});

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