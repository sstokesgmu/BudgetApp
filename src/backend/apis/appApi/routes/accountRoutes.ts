import express, {Request, Response, Router}from "express";
import AccountModel from "../models/account.js";

const router:Router = express.Router();

/** 
 * @param {string} - / refers to the root
 * @param {Request} 
 * @param {Response} 
 * @callback => will fetch all documents within the accounts collection
*/
router.get("/", async (_:Request, res:Response) => {
    const result = await AccountModel.find({});
    try {
        res.status(200).send(result);
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