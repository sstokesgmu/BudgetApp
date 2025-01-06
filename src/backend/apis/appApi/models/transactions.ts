import mongoose, {Schema, model, Document} from "mongoose";

interface Transaction {
    date: Date,
    amount: number,
    trans_type: string,
    comp_name: string,
    status: string,
}

//Create a sub-schema 
const transactionSchema = new Schema<Transaction>({
    date: {type:Date,required:true},
    amount: {type:Number,required:true},
    trans_type: {type:String, required:true},
    comp_name: {type:String, required:true},
    status: {type:String, required:true},
})

interface ITransaction_Bucket extends Document {
    account_id : number,
    transaction_count: number,
    bucket_start_date: Date,
    bucket_end_date: Date | null,
    transactions: Transaction[];
}

const bucketSchema = new Schema<ITransaction_Bucket>({
    account_id : {type: Number, required:true},
    transaction_count: {type:Number,required:true},
    bucket_start_date: {type: Date, required:true},
    bucket_end_date: {type: Date, default:null},
    transactions: {type: [transactionSchema], required: true}
});

const BucketModel = model<ITransaction_Bucket>("TransactionBucket", bucketSchema);

export default BucketModel;