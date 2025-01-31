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
        console.log('Client retrieving account documents')
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async(req:Request,res:Response) => {
    const data = req.body;
    try {
        let result;
        if(!Array.isArray(data))
        {
            console.log("data recieved is not an array");
            result = new AccountModel(data);
            await result.save();
        }
        else
        {
            console.log("data recieved is an array");
            result = await AccountModel.insertMany(data)
        }
        console.log(`Account data inserted successfully`) 
        res.status(200).send(result);
    } catch (e) {
        console.error(e);
    }
});

router.delete('/', async(req:Request, res:Response) => {
    const accountsArray = (req.query.account_nums as string).split(',').map(account => parseInt(account))
    const result = await AccountModel.deleteMany({account_num: {$in: accountsArray}})
    res.status(200).send(result)
});













//Todo: two patches for adding a transaction bucket obj id and antoher for updating the current balance
//router.patch


// router.patch("/balance/:accountId", async (req: Request, res:Response) => {
//     const account = await AccountModel.findOne({"account_id" : req.params.accountId});
//     const appliedBucket = await BucketModel.find({"account_id" : req.params.accountId});
    
//     res.send({
//         account,
//         appliedBucket
//     });
// }); 

export default router;