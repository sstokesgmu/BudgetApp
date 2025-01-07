import express, { Request, Response } from "express";
import BucketModel from "../models/transactions";
import { ITransaction } from "../../../../shared/interfaces/transactions";

const router: any = express.Router();

// Get all transactions from an account: need account nnumber
router.get(
  "/:accountId",
  async (req: Request, res: Response) => {
    const transactions = await BucketModel.find({account_id: req.params.accountId});
    //ToDo: add an check to see if the collection is empty
    try {
      res.send(transactions);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

//Post transaction to an account
router.post("/", async (req: Request, res: Response) => {
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

function CreateEndDate(startDate:Date):Date {
  let date = new Date(startDate);
  date.setDate(date.getDay() + 14); 
  return date;
}

function CreateModel(transaction:ITransaction):any {

  let array_copy:ITransaction[] = [transaction];
  const bucket = new BucketModel({
    account_id: transaction.account,
    transaction_count: 1,
    start_date: transaction.date,
    end_date: CreateEndDate(transaction.date),
    transactions: array_copy
  });
  return bucket;
}


module.exports = router;
