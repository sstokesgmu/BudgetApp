import express, { Request, Response, Router } from "express";
import UserModel from "../models/user.js";
import { IAccount } from "../../../shared/interfaces/budget.js";
import AccountModel from "../models/account.js";
import { BudgetApp } from "../../../tools/budgetMe.js";

//create mini app
const router: Router = express.Router();

/**
 * @param {string} - / refers to the root
 * @param {Request}
 * @param {Response}
 * @callback => will fetch all documents within the user collection
 */
router.get("/", async (_: Request, res: Response) => {
  const user = await UserModel.find({});
  try {
    console.log("Get user request from client");
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @param {string} - / refers to the endpoint
 * @param {Request}
 * @param {Response}
 * @callback => will queries to see if a document of model user has an accounts array of @type {number} exists
 * Then we push (add) the new account id to the array
 */
router.post("/create", async (req: Request, res: Response) => {
  // const { accountType, amount} = req.body
  const { account } = req.body.account;
  try {
    const ids = BudgetApp.UnpackAccountIds(
      account,
      BudgetApp.ValidateAccount(account),
    );
    const result = await UserModel.findOneAndUpdate(
      { accounts: { $exists: true, $type: "array" } },
      { $push: { ids } },
      { new: true },
    ).exec();
    //Todo: call CreateAccount(req.body.?account)
    // const result = await UserModel.findOneAndUpdate(
    //     {"accounts": {$exists: true, $type: "array"}},
    //     {$push: {"accounts": account.id}},
    //     {new: true}
    // ).exec()
    // await createAccount(parseInt(accountId), accountType, amount);
    res.status(200).send("okay");
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @param {string} - route endpoint
 * @param {Request}
 * @param {Response}
 * @callback => will queries to see if a document of model user has an accounts array of @type {number} exists
 * Then we pull (remove) the an account from the array
 */
router.patch("/del", async (req: Request, res: Response) => {
  try {
    const accountsArray = (req.query.accounts as string)
      .split(",")
      .map((account) => parseInt(account));
    const result = await UserModel.updateMany(
      { accounts: { $in: accountsArray } },
      { $pull: { accounts: { $in: accountsArray } } },
    ).exec();
    const res_data = BudgetApp.DeleteAccounts(req.query.accounts as string);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// /**
//  *
//  * @param id  - the account id
//  * @param accountType  - the type of the account
//  * @param startNumber  - the starting amount of the account
//         date_opened: new Date(Date.now()),
//         date_closed: null,
//         starting_amount: startNumber,
//         current_amount: startNumber,
//         bucket :null,
//     }
//     try {
//         const account = new AccountModel(data);
//         await account.save();
//         console.log(`Account created successfully: ${account}`)
//     } catch (error) {
//         console.error(error);
//     }
// }
export default router;
