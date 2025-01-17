import express, { Request, Response } from "express";
import BucketModel from "../models/transactions.js";
import { IAccount, ITransaction, ITransaction_Bucket } from "../../../../shared/interfaces/budget.js";

const router: any = express.Router();

// Get all transactions from an account: need account nnumber
router.get(
  "/:accountId",
  async (req: Request, res: Response) => {
    const transactions = await BucketModel.find({account_id: req.params.accountId});
    try {
      res.send(transactions);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);


router.post("/create/bucket", async (req: Request, res:Response) => {
    console.log(req.body);
    const result = CreateModel(undefined, req.body.data);
    result.save()
    res.send(`Created a new bucket ${result}`);
})



//Post transaction to an account
router.post("/add/:accountid", async (req: Request, res: Response) => {
  const transaction: ITransaction = {
    date: new Date(Date.now()),
    amount: req.body?.amount,
    trans_type: req.body?.type,
    account: req.body?.account,
    comp_name: req.body?.company ,
    status: "pending",
  };
  try {
    const exist:Array<Document>  = await BucketModel.find({}, { limit: 1});
    if(exist.length === 0)
    {
      console.log("There are no documents inside of the collection, create a transaction bucket");
      const bucket = CreateModel(transaction);
      bucket.save();
      res.send("Created a new bucket");
    } else {
      //We have a collection but lets think about this:
        /*
        1. does the account number match in the data set match the account number of the transaction 
        2. does the data set have a bucket that is within the time frame
       */
      const bucket = await BucketModel.findOne({"account_id": transaction.account,
                "start_date": {"$lte":transaction.date}, "end_date": {"$gte":transaction.date}
      });
      if(!bucket)
      {
        //Create a new bucket
        const new_bucket = CreateModel(transaction);
        new_bucket.save();
        res.send("Create a new bucket");
      } else {
        let result:any = null;
        result = await bucket.updateOne({$push: {transactions: transaction}});
        res.send("Added transaction to correct bucket");
      }
    }
  } catch (error) {
    console.error(error); 
    res.status(500).send(error);
  }
});

router.patch("/update/:accountId", async (req: Request, res:Response) => {
  try {
    const bucket: any = await BucketModel.findByIdAndUpdate(
      req.body.tableid, 
      {$pull: {transactions: {date: new Date(req.body.data.date)}}},
      {new:true} 
    ).exec();

    if(!bucket)
      throw new Error("This is not the right bucket");     
  
    //ToDo:Delete the transaction
    res.status(200).send("Delete request was successful");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
})

function CreateEndDate(startDate:Date):Date {
  let date = new Date(startDate);
  date.setDate(date.getDay() + 14); 
  return date;
}

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
