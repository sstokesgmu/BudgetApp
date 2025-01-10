import express, {Request, Response, Router}from "express";
import AccountModel from "../models/account.js";


//create the mini app 
const router:Router = express.Router();

router.get("/", async (_:Request, res:Response) => {
    const accounts = await AccountModel.find({});
    try {
        res.send(accounts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// router.patch("/balance/:accountId", async (req: Request, res:Response) => {
//     const account = await AccountModel.findOne({"account_id" : req.params.accountId});
//     const appliedBucket = await BucketModel.find({"account_id" : req.params.accountId});
    
//     res.send({
//         account,
//         appliedBucket
//     });
// }); 

export default router;