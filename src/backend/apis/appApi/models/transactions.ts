import {Schema,Document, model as createModel} from "mongoose";
import {ITransaction} from "../../../../shared/interfaces/budget.js";

//Create a sub-schema 
const transactionSchema = new Schema<ITransaction>({
    date: {type:Date,required:true},
    amount: {type:Number,required:true},
    trans_type: {type:String, required:true},
    comp_name: {type:String, required:true},
    status: {type:String, required:true},
    account: {type:Number, required:true},
})

//Why do I have to extend here does it have to do with nested schemas because it needs 
//__id and __v
interface ITransaction_Bucket extends Document {
    account_id : number,
    transaction_count: number,
    start_date: Date,
    end_date: Date | null,
    transactions: ITransaction[];
}

const bucketSchema = new Schema<ITransaction_Bucket>({
    account_id : {type: Number, required:true},
    transaction_count: {type:Number,required:true},
    start_date: {type: Date, required:true},
    end_date: {type: Date, default:null},
    transactions: {type: [transactionSchema], required: true}
});

const BucketModel = createModel<ITransaction_Bucket>("TransactionBucket", bucketSchema, "transaction_bucket");
export default BucketModel;