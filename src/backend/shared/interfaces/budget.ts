import {Document} from "mongoose"
import {ObjectId} from "mongodb"

// shared/interfaces.ts
export interface IUser {
    name: string,
    total: number,
    accounts: number[],
}
export interface IAccount {
    account_num: number|null,
    type: string | null, 
    date_opened: Date,
    date_closed: Date | null, 
    starting_amount: number|null, 
    current_amount: number | null,
    bucket: ObjectId[] | null,
}

export interface ITransaction_Bucket extends Document {
    account_id : number,
    transaction_count: number,
    start_date: Date,
    end_date: Date | null,
    transactions: ITransaction[] | null;
}
export interface ITransaction {
    date: Date;
    amount: number;
    // account?: number;
    trans_type: string;
    comp_name: string;
    status: string;
}