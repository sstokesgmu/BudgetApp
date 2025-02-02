import express, { Request, Response, Router } from "express";
import UserModel from "../models/user.js";
import { IAccount } from "../../../tools/budget.js";
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
router.patch("/create/accounts", async (req: Request, res: Response) => {
  const account = req.body.account;
  console.log(account);
  try {
    const ids = await BudgetApp.UnpackAccountIds(
      account,
      BudgetApp.ValidateAccount(account)
    );
    console.log(ids);
    const result = await UserModel.findOneAndUpdate(
      { accounts: { $exists: true, $type: "array" }, name: "John Doe" },
      { $push: { accounts: ids } },
      { new: true }
    ).exec();
    res.status(200).send(result);
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
33;
//? localhost:8080/api/uses/del?accounts=123,456,789
router.patch("/del/accounts", async (req: Request, res: Response) => {
  try {
    const accountsArray = (req.query.accounts as string)
      .split(",")
      .map((account) => parseInt(account));
    const result = await UserModel.updateMany(
      { accounts: { $in: accountsArray } },
      { $pull: { accounts: { $in: accountsArray } } }
    ).exec();
    const res_data = BudgetApp.DeleteAccounts(req.query.accounts as string);
    console.log(`Accounts: ${req.query.accounts} were deleted successfully`);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
export default router;
