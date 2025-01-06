import express, { Request, Response } from "express";
import BucketModel from "../models/transactions";
import { ITransaction } from "../../../../shared/interfaces/transactions";

const router: any = express.Router();

//Get all transactions from an account: need account nnumber
router.get(
  "/api/:accountId/transactions",
  async (req: Request, res: Response) => {
    const transactions = await BucketModel.findById(req.params.accountId);
    try {
      res.send(transactions);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

//Post transaction to an account
router.post("/transaction", async (req: Request, res: Response) => {
  const transaction: ITransaction = {
    date: Date.now(),
    amount: req.params?.amount,
    trans_type: req.params?.type,
    account: req.params?.account,
    comp_name: req.params?.company,
    status: "pending",
  };

  try {
    //See if the we can match the new transaction to a object
    if (await BucketModel.find({}, { limit: 1 })) {
      //The is a document inside the collection does it match the time frame and id
    }
  } catch (error) {}
});

function DoAccountsMatch(): bool {}
function WithinTimeFram(): bool {}
