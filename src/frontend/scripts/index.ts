//import { ITransaction } from "../../shared/interfaces/transactions.js";


const titleCard:Element = document.getElementsByTagName("h1")[0];
const accountTitle: Element = document.getElementsByTagName("h2")[0];
const accountType:any = document.getElementById("account_type");
const balanceEl: any = document.getElementById("balance");
//const accountSelect: Element = document.getElementById("accountSelect");

//On initalization select the first user with the Database //!for now
(async () => {
    const users = await fetch("/api/users").then(res => res.json());
    let accounts = await fetch("/api/accounts").then(res => res.json()); 
    modifyHTMLText(users[0]?.name, titleCard);
    DeleteTable(); 
    BuildTable(SetAccountInfo(accounts));
    

    accountSelect?.addEventListener("change", async () => {
        accounts = await fetch("/api/accounts").then(res => res.json());
        
        DeleteTable();
        BuildTable(SetAccountInfo(accounts));
    })
})();

function modifyHTMLText(textValue:string, element:Element|HTMLElement):void {
    element.textContent = textValue;
}

function SetAccountInfo(result:any):number {


    if (accountSelect?.children.length === 0) {
        for (let element of result) {
            let option: HTMLOptionElement = document.createElement("option");
            option.setAttribute("value", element.account_id); // Use correct `value`
            option.innerText = `Account: ${element.account_id}`;
            accountSelect.append(option);
        }
    }
    let account:any = result.find((element:any) => element?.account_id == accountSelect?.value);
 
    //Populate the html text and the select drop down
    modifyHTMLText(`Account: ${account?.account_id}`, accountTitle);
    modifyHTMLText(`${account?.type}`, accountType?.querySelector("p"));
    //result successfully returns the accounts //TODO: Populate into a selectable drop down
    modifyHTMLText(`$${account?.current_amount}`, balanceEl);
    return account?.account_id;
    
}

async function BuildTable(account_id:number){
    const tableBody = document.getElementById("table-body");
    if(!tableBody)
        return

    
    //!  You will have to throw a limit on this how many buckets do you want to get
    const bucket = await fetch(`/api/transactions/${account_id}`).then(res => res.json());
    const array:any = bucket.map( (element:any) => {
        return [...element.transactions];
    }).flat();

    console.log(array);
    array.forEach(element => {
       
        const row = document.createElement("tr");

        // Create individual table cells
        const compNameCell = document.createElement("td");
        compNameCell.textContent = element.comp_name;

        const amountCell = document.createElement("td");
        amountCell.textContent = element.amount;

        const dateCell = document.createElement("td");
        dateCell.textContent = element.date;

        const statusCell = document.createElement("td");
        statusCell.textContent = element.status;

        // Append cells to the row
        row.appendChild(compNameCell);
        row.appendChild(amountCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);

        // Append row to the table
        tableBody.appendChild(row);
    });
}
function DeleteTable(){
    const tableBody = document.getElementById("table-body");
    if(!tableBody)
        return
    //for each
    console.log(tableBody?.children)
    if(tableBody?.children)
    for(let i = tableBody?.children.length-1; i > 1; i--) {
        tableBody.lastChild?.remove();
    }
}


