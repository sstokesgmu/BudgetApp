// shared/interfaces.ts
export interface ITransaction {
    date: Date;
    amount: number;
    account: number;
    trans_type: string;
    comp_name: string;
    status: string;
}

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