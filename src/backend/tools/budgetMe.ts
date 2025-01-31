import { IAccount, ITransaction, ITransaction_Bucket } from "../shared/interfaces/budget.js";
import express, { Request, Response, Router } from "express";
import dotenv from 'dotenv'
import BucketModel from "../apis/appApi/models/transactions.js";
import {
  account_seed,
  account_seed_full,
  accounts_seed,
  accounts_seed_full,
  transaction_seed,
} from "./seed.js";
import AccountModel from "../apis/appApi/models/account.js";
import UserModel from "../apis/appApi/models/user.js";

dotenv.config();

export namespace BudgetApp {
  export const router: Router = express.Router();
  //Todo: Add valiadation to make sure the resquest has admin privliges to seed data
  router.patch("/seed/accounts", async (req: Request, res: Response) => {
  //Todo: We can use req.body to check a different user
    const data = account_seed;
    try {
      const ids = await UnpackAccountIds(data, ValidateAccount(data));
      const result = await UserModel.findOneAndUpdate(
        {accounts:{$exists: true, $type: "array"}, name: "John Doe"},
        {$push: { 'accounts': ids }},
        {new: true}
      ).exec();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  type AccountParams = number | number[] | IAccount | IAccount[];
  enum ValidationResult {
    SINGLE_NUMBER = 0,
    SINGLE_ACCOUNT = 1,
    ARRAY_NUMBERS = 2,
    ARRAY_ACCOUNTS = 3,
  }
  export function ValidateAccount(param: AccountParams): ValidationResult {
    //Type guards
    let a = "this is an";
    // If
    if (Array.isArray(param)) {
      a += " array ";
      let element = param[0];
      if (isFilledAccount(element)) {
        a += "of IAccount objects";
        console.log(a);
        return ValidationResult.ARRAY_ACCOUNTS;
      } else {
        a += "of numbers";
        console.log(a);
        return ValidationResult.ARRAY_NUMBERS;
      }
    } else {
      a += " single ";
      if (isFilledAccount(param)) {
        a += "object type IAccounts";
        console.log(a);
        return ValidationResult.SINGLE_ACCOUNT;
      } else {
        a += "number";
        console.log(a);
        return ValidationResult.SINGLE_NUMBER;
      }
    }
  }
  export async function UnpackAccountIds(params: AccountParams, code: ValidationResult){
    //number|number[]
    let account:AccountParams;
    switch (code) {
      case 0:
        account = CreateAccount({account_num:params} as IAccount);
        await InsertAccount(`http://localhost:${process.env.PORT}/api/accounts`,account);
        return params as number;
      case 1:
        account = CreateAccount(params as IAccount);
        account.current_amount = account.starting_amount;
        await InsertAccount(`http://localhost:${process.env.PORT}/api/accounts`,account);
        return (params as IAccount).account_num;
      case 2:
        const accounts = (params as number[]).map(id => ({account_num: id} as IAccount));
        account = accounts.map(account => CreateAccount(account))
        await InsertAccount(`http://localhost:${process.env.PORT}/api/accounts`,account);
        return params as number[];
      case 3:
        account = []; 
        const ids = (params as IAccount[]).map(
          (element) => 
          {
            element.current_amount = element.starting_amount;
            (account as IAccount[]).push(CreateAccount(element));
            return element.account_num
          }
        );
        await InsertAccount(`http://localhost:${process.env.PORT}/api/accounts`,account);
        return ids;
    }
  }
  function isFilledAccount(a: Number | IAccount): a is IAccount {
    return typeof a === "object" && "account_num" in a;
  }
  function CreateAccount(param:Partial<IAccount>):IAccount{
    const template:IAccount = {
        account_num: null,
        type: null,
        date_opened: new Date(Date.now()),
        date_closed: null,
        starting_amount:null,
        current_amount: null, 
        bucket:null
    }
    return Object.assign(template,param);
  }
  async function InsertAccount(route:string,data:IAccount|IAccount[]): Promise<void> {
    await fetch(route,
      {
       method:"POST",
       headers: {
         "Content-Type":"application/json",
       },
       body: JSON.stringify(data),
     });
  }

  export async function DeleteAccounts(a:string):Promise<any>{
    let b = await fetch(`http://localhost:${process.env.PORT}/api/accounts?account_nums=${a}`,
      {
        method:"DELETE",
        headers: {
          "Content-Type":"application/json",
        }
      }
    );
    console.log(`b is:${JSON.stringify(b)}`)
    return b;
  }

  export function CreateTransaction(obj:any):ITransaction{
    console.log(obj);
    const transaction:ITransaction = {
      date: new Date(Date.now()),
      amount: obj.amount,
      trans_type: obj.type,
      comp_name:obj.company,
      status: 'pending'
    }
    return transaction
  }
  export function CreateBucket(transaction:ITransaction,accountId:number):Partial<ITransaction_Bucket>{
    console.log(transaction);
    let array: ITransaction[] = [transaction];
    const bucket:Partial<ITransaction_Bucket> = {
      account_id: accountId,
      start_date: transaction.date,
      end_date: CreateEndDate(transaction.date),
      transactions: array,
    }
    return bucket;
  }
  export async function DoesBucketExist(query:object):Promise<any>{
    const doc = await BucketModel.findOne(query);
    return doc;
  }
  /**
 * @param startDate
 * @returns a new date 14 days after the start date
 */
function CreateEndDate(startDate: Date): Date {
  let date = new Date(startDate);
  date.setDate(date.getDay() + 14);
  return date;
}


  export async function UpdateBucket(transaction:ITransaction, objectid:string, operation:string):Promise<any>{
    try {
      let response:any;
      if(operation === "push"){
        //send request
       response = await fetch(`http://localhost:${process.env.PORT}/api/transactions/push/${objectid}`,
        {
          method:"PATCH",
          headers: {'Content-Type':'application/json',},
          body: JSON.stringify(transaction)
        });
      }
      else {
        response = await fetch(`http://localhost:${process.env.PORT}/api/transactions/pull/${objectid}`),
        {
          method:"PATCH",
          headers: {'Content-Type':'application/json',},
          body: JSON.stringify(transaction)
        }
      }
      return response;
    } catch(e){
      console.error(e);
    }
  }
}

