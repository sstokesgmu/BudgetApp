import { Schema, Document, model as createModel } from "mongoose";
import { ITransaction, ITransaction_Bucket } from "../../../tools/budget.js";

//Create a sub-schema
const transactionSchema = new Schema<ITransaction>({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  trans_type: { type: String, required: true },
  comp_name: { type: String, defualt: "unknown" },
  status: { type: String, required: true },
});

const bucketSchema = new Schema<ITransaction_Bucket>({
  account_id: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, default: null },
  transactions: { type: [transactionSchema], default: [] },
});

const BucketModel = createModel<ITransaction_Bucket>(
  "TransactionBucket",
  bucketSchema,
  "transaction_bucket"
);
export default BucketModel;
