import { IAccount } from "../shared/interfaces/budget.js";
import express, { Request, Response, Router } from "express";
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

export namespace BudgetApp {
  export const router: Router = express.Router();
  //seed routes //Todo: Add valiadation to make sure the resquest has admin privliges to seed data
  router.post("/seed/accounts", async (req: Request, res: Response) => {
    //Todo: We can use req.body to check a different user
    const data = accounts_seed_full;
    try {
      const ids = UnpackAccountIds(
        data, ValidateAccount(data)
      );
      console.log(ids);
      const result = await UserModel.findOneAndUpdate(
        { accounts: { $exists: true, $type: "array" }, name: "John Doe" },
        { $push: { 'accounts': ids } },
        { new: true }
      ).exec();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });


//   router.post(
//     "/seed/transactions/:accountId",
//     async (req: Request, res: Response) => {
//       try {
//         const result = await BucketModel.findOneAndUpdate(
//           { account_num: req.params.accountId },
//           { $push: { transactions: transaction_seed } },
//           { new: true }
//         );
//         if (!result)
//           throw new Error(
//             `There is no account with the value of ${req.params.accountId}`
//           );

//         res.status(200).send(result);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   );

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
  export function UnpackAccountIds(params: AccountParams, code: ValidationResult){
    //number|number[]
    let result:AccountParams;
    switch (code) {
      case 0:
        result = CreateAccount({account_num:params} as IAccount);
        console.log(result);
        return params as number;
      case 1:
        result = CreateAccount(params as IAccount);
        console.log(result);
        return (params as IAccount).account_num;
      case 2:
        const accounts = (params as number[]).map(id => ({account_num: id} as IAccount));
        result = accounts.map(account => CreateAccount(account))
        console.log(result);
        return params as number[];
      case 3:
        result = []; 
        const ids = (params as IAccount[]).map(
          (element) => 
          {
            element.current_amount = element.starting_amount;
            (result as IAccount[]).push(CreateAccount(element));

            return element.account_num
          }
        );
        console.log(result);
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

  //else it is object or array of objects then we can save it to the db

  //     // Promise.all([
  //        let res =  await fetch('/api/accounts/create', {
  //             method:"POST",
  //             headers:{"Content-Type": "application/json"},
  //             body: JSON.stringify(account_var)
  //         }).then(res => res.json())
  //         console.log(res);
  //     // ])

  // }

  export async function DeleteAccount(account_num: number | number[]) {
    Promise.all([
      await fetch("/api/accounts/del", {
        method: "Patch",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    ]);
  }
}
