import express, { Request, Response } from "express";
import BucketModel from "../models/transactions.js";
import {ITransaction, ITransaction_Bucket } from "../../../../shared/interfaces/budget.js";

const router: any = express.Router();

/** 
 * @param {string} - route endpoint
 * @param {Request} 
 * @param {Response} 
 * @callback => Finds all transaction documents that match the given account id 
*/
router.get("/:accountId",  async (req: Request, res: Response) => {
    const result = await BucketModel.find({account_id: req.params.accountId});
    try {
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

/** 
 * @param {string} - route endpoint
 * @param {Request} 
 * @param {Response} 
 * @callback => 
*/
router.post("/add/:accountid", async (req: Request, res: Response) => {
  const transactionObj: ITransaction = {
    date: new Date(Date.now()),
    amount: req.body?.amount,
    trans_type: req.body?.type,
    account: req.body?.account,
    comp_name: req.body?.company ,
    status: "pending",
  };
  try {
  /**
   * @var exist - will indicate if the account exist in the collection
   */
    const exist:Array<Document> = await BucketModel.find({}, {limits: 1});
    if(exist.length === 0)
    {
      console.log("There are no documents inside of the collection, creating a  new transaction bucket");
      const result = CreateModel(transactionObj);
      result.save();
      res.status(200).send(result);
    } else {
      //We have a collection but lets think about this:
        /*
        1. does the account number in the data set match the account number of the transaction 
        2. does the data set have a bucket that is within the time frame
       */
      const doesDocExist = await BucketModel.findOne({"account_id": transactionObj.account,
                "start_date": {"$lte":transactionObj.date}, "end_date": {"$gte":transactionObj.date}
      });
      if(doesDocExist)
      {
        const result = await doesDocExist.updateOne({$push: {transactions: transactionObj}});
        res.status(200).send(`The response is okay: ${result}`);
        
      } else {
        //Create a new document
        const result = CreateModel(transactionObj);
        result.save();
        res.status(200).send(result);
      }
    }
  } catch (error) {
    console.error(error); 
    res.status(500).send(error);
  }
});


router.patch("/del/:accountId", async (req: Request, res:Response) => {
  try {
    const result: any = await BucketModel.findByIdAndUpdate(
      req.body.tableid, 
      {$pull: {transactions:req.body.data}},
      {new:true} 
    ).exec();
    if(!result)
      throw new Error("This is not the right bucket");     
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
})

/**
 * @param startDate 
 * @returns a new date 14 days after the start date
 */
function CreateEndDate(startDate:Date):Date {
  let date = new Date(startDate);
  date.setDate(date.getDay() + 14); 
  return date;
}

/**
 * 
 * @param transaction 
 * @param trans_bucket 
 * @returns a new compiled Bucket model where the first element of the transaction array is the transaction 
 * passed in the request. 
 */
function CreateModel(transaction?:ITransaction, trans_bucket?:ITransaction_Bucket ):any {
  try {
    let bucket:ITransaction_Bucket;
    if(trans_bucket) {
      //Create the Transaction bucket with a new bucket.
      bucket = trans_bucket;
    } else if (transaction) {
      //Create the transaction bucket with the first transaction
      let array:ITransaction[] = [transaction];
      bucket = new BucketModel({account_id: transaction.account,
        transaction_count: 1,
        start_date: transaction.date,
        end_date: CreateEndDate(transaction.date),
        transactions: array,
      });
    } else {
      throw new Error("Either transaction of trans_bucket must be provided")
    }
    return bucket
  } catch(error) {
    console.error(error);
  }
}
export default router;


// router.post("/create/bucket", async (req: Request, res:Response) => {
//     const result = CreateModel(undefined, req.body.data);
//     result.save()
//     res.send(`Created a new bucket ${result}`);
// })