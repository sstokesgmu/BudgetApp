import express, { Request, Response } from "express";
import BucketModel from "../models/transactions";
import { ITransaction } from "../../../../shared/interfaces/transactions";

const router: any = express.Router();


router.get("/message", async (req: Request,res: Response) => {
  console.log("Hello from transaction");
});

//Get all transactions from an account: need account nnumber
// router.get(
//   "/api/:accountId/transactions",
//   async (req: Request, res: Response) => {
//     const transactions = await BucketModel.findById(req.params.accountId);
//     try {
//       res.send(transactions);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   },
// );

//Post transaction to an account
router.post("/", async (req: Request, res: Response) => {

  const transaction: ITransaction = {
    date: new Date(Date.now()),
    amount: req.body?.amount || 100,
    trans_type: req.body?.type || "withdrawl",
    account: req.body?.account || 123,
    comp_name: req.body?.company || "Steam",
    status: "pending",
  };
  try {
    const exist:Array<Document>  = await BucketModel.find({}, { limit: 1});
    console.log(exist);
    if(exist.length === 0)
    {
      console.log("There are no documents inside of the collection, create a transaction bucket");
      let array_copy:ITransaction[] = [transaction];
      const bucket = new BucketModel({
        account_id: transaction.account,
        transaction_count: 1,
        start_date: transaction.date,
        end_date: CreateEndDate(transaction.date),
        transactions: array_copy
      });
      bucket.save();
      res.send("Created a new bucket");
    } else {
      console.log("We have a collection");
      //TODO: Add the transaction to the correct bucket => would we use a put;
      const bucket = await BucketModel.findOne({"account_id": transaction.account,
                "start_date": {"$lte":transaction.date}, "end_date": {"$gte":transaction.date}
    });
    let result:any = null;
    if(bucket)
      result = await bucket.updateOne({$push: {transactions: transaction}});
    res.json(result);
    }
    //See if the we can match the new transaction to a object
    // res.send(transaction);
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


module.exports = router;
