import {IAccount} from '../shared/interfaces/budget.js'
import  express, {Request, Response, Router} from 'express';
import BucketModel from '../apis/appApi/models/transactions.js';
import {account_seed, transaction_seed} from './seed.js';
import { createVerify } from 'crypto';
import AccountModel from '../apis/appApi/models/account.js';
import UserModel from '../apis/appApi/models/user.js';

export namespace BudgetApp {  
    const router:Router = express.Router(); 
    //seed routes //Todo: Add valiadation to make sure the resquest has admin privliges to seed data
    router.post('/seed/accounts', async(req:Request, res:Response) => {
        try {
            //Todo: We can use req.body to check a different user
            const result = await UserModel.findOneAndUpdate(
                {'name' : 'John Doe'},
                {$push: {'accounts': account_seed}},
                {new:true}
            )
            if (!result) 
                throw new Error ("There is no user named John Doe");

            
            res.status(200).send(result);
        } catch (e) {
            console.error(e);
        }
    });
    router.post("/seed/transactions/:accountId", async(req:Request, res:Response) => {
        try {
            const result = await BucketModel.findOneAndUpdate(
                {'account_num': req.params.accountId},
                {$push: {'transactions': transaction_seed}},
                {new:true}
            )
            if (!result)
                throw new Error(`There is no account with the value of ${req.params.accountId}`); 

            res.status(200).send(result);
        } catch(e) {
            console.error(e);
        }
    });
    
    

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

    export async function DeleteAccount(account_num:number| number[]){
        Promise.all([
            await fetch('/api/accounts/del',
                {
                    method:"Patch",
                    headers:{"Content-Type": "application/json"}
                }
            ).then(res=>res.json())
        ])     
    }



}

