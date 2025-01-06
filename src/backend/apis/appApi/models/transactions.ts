import mongoose, {Schema, model, Document} from "mongoose";
import {ITransaction} from "../../../../shared/interfaces/transactions";

//Create a sub-schema 
const transactionSchema = new Schema<ITransaction>({
    date: {type:Date,required:true},
    amount: {type:Number,required:true},
    trans_type: {type:String, required:true},
    comp_name: {type:String, required:true},
    status: {type:String, required:true},
    account: {type:Number, required:true},
})

interface ITransaction_Bucket extends Document {
    account_id : number,
    transaction_count: number,
    bucket_start_date: Date,
    bucket_end_date: Date | null,
    transactions: ITransaction[];
}

const bucketSchema = new Schema<ITransaction_Bucket>({
    account_id : {type: Number, required:true},
    transaction_count: {type:Number,required:true},
    bucket_start_date: {type: Date, required:true},
    bucket_end_date: {type: Date, default:null},
    transactions: {type: [transactionSchema], required: true}
});

const BucketModel = model<ITransaction_Bucket>("TransactionBucket", bucketSchema, "transaction_bucket");

export default BucketModel;