import {Document} from "mongoose"

// shared/interfaces.ts
export interface IUser {
    name: string,
    accounts: number[],
}
export interface IAccount {
    account_id: number,
    type: string, 
    date_opened: Date,
    date_closed: Date | null, 
    starting_amount: number, 
    current_amount: number,
}

export interface ITransaction_Bucket extends Document {
    account_id : number,
    transaction_count: number,
    start_date: Date,
    end_date: Date | null,
    transactions: ITransaction[];
}
export interface ITransaction {
    date: Date;
    amount: number;
    account?: number;
    trans_type?: string;
    comp_name: string;
    status: string;
}