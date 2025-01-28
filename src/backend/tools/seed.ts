import { ITransaction } from "../shared/interfaces/budget"

export const account_seed:Number[] = [123,456,789]

export const transaction_seed:ITransaction[]= [
    {
        date: new Date(Date.now()),
        amount: 72.36,
        trans_type: "Withdrawal",
        comp_name: "Amazon",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 15.94,
        trans_type: "Withdrawal",
        comp_name: "Audible",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 7.45,
        trans_type: "Deposit",
        comp_name: "MICROSOFT",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 18.80,
        trans_type: "Deposit",
        comp_name: "APPLE.COM/BILL",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 791.12,
        trans_type: "Deposit",
        comp_name: "Costco Wholesale",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 20.44,
        trans_type: "Withdrawal",
        comp_name: "MCDONALDS",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 931.60,
        trans_type: "Deposit",
        comp_name: "Costco",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 69.36,
        trans_type: "Withdrawal",
        comp_name: "Walmart",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 300,
        trans_type: "Transfer-Deposit",
        comp_name: "INTR FROM 786",
        status: "completed"
    },
    {
        date: new Date(Date.now()),
        amount: 1000,
        trans_type: "Transfer-Withdrawal",
        comp_name: "INTR To 786",
        status: "completed"
    }
]
