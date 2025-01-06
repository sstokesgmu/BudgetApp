// shared/interfaces.ts
export interface ITransaction {
    date: Date;
    amount: number;
    account: number;
    trans_type: string;
    comp_name: string;
    status: string;
}
