import mongoose, {Model, Schema} from "mongoose";

// Create an interface representing a document in MongoDB
interface IAccount {
    account_id: number,
    type: string,
    date_opened: Date,
    date_closed: Date | null,
    starting_amount: number,
    current_amount: number,
}

// Create a Schema correspondoing to the document interface
const accountSchema = new Schema<IAccount>({
    account_id: {type: Number, required:true, unique: true},
    type: { type: String, required: true},
    date_opened: {type: Date, required: true},
    date_closed: {type: Date, default:null},
    starting_amount: {type: Number, required: true},
    current_amount: {type: Number, required: true},
});

const AccountModel: Model<IAccount> = mongoose.model("Account", accountSchema);

export default AccountModel;