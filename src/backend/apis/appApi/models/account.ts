import {Model, Schema, model as createModel} from "mongoose";
import { IAccount } from "../../../shared/interfaces/budget.js";
import {ObjectId} from 'mongodb'
// Create a Schema correspondoing to the document interface
const accountSchema = new Schema<IAccount>({
    account_id: {type: Number, required:true, unique: true},
    type: { type: String, required: true},
    date_opened: {type: Date, required: true},
    date_closed: {type: Date, default:null},
    starting_amount: {type: Number, required: true},
    current_amount: {type: Number, required: true},
    bucket:{type: [ObjectId], default:null}
});

const AccountModel: Model<IAccount> = createModel<IAccount>("Account", accountSchema);
export default AccountModel;