import {IAccount} from '../shared/interfaces/budget.js'

export namespace BudgetApp {

    
    export async function CreateAccount(account_var:IAccount| Array<IAccount>){
            

        console.log(account_var)

        // Promise.all([
           let res =  await fetch('/api/accounts/create', {
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(account_var)
            }).then(res => res.json())
            console.log(res);
        // ])

    }

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