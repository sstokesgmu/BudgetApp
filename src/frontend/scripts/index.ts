import { ITransaction } from "../../shared/interfaces/budget.js";


const titleCard:Element = document.getElementsByTagName("h1")[0];
const accountTitle: Element = document.getElementsByTagName("h2")[0];
const accountType: HTMLElement | null = document.getElementById("account_type");
const balanceEl: HTMLElement | null = document.getElementById("balance");
const tableBody = document.getElementById("table-body");

//const accountSelect: Element = document.getElementById("accountSelect");


(async () => {
    const users = await fetch("/api/users").then(res => res.json());
    let accounts = await fetch("/api/accounts").then(res => res.json()); 
    modifyHTMLText(users[0]?.name, titleCard);
    
    //! This needs to change
    if(tableBody)
        tableBody.dataset.objId = " ";

    DeleteTable(); 
    BuildTable(SetAccountInfo(accounts));

    accountSelect?.addEventListener("change", async () => {
        accounts = await fetch("/api/accounts").then(res => res.json());
        
        DeleteTable();
        BuildTable(SetAccountInfo(accounts));
    })
})();

function modifyHTMLText(textValue:string, element:Element|HTMLElement):void {
    console.log(element);
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
    if(!tableBody)
        return
    //!  You will have to throw a limit on this how many buckets do you want to get
    //* When fetch the bucket information, we add the obj of the called bucket for that account
    //* We are going to use the objId to find the correct bucket when deleting data
    const bucket = await fetch(`/api/transactions/${account_id}`).then(res => res.json());

    tableBody.dataset.objId = bucket[0]?._id;

    const array:any = bucket.map( (element:any) => {
        return [...element.transactions];
    }).flat();

    array.forEach(element => {
        const row = document.createElement("tr");
        row.addEventListener("click", deleteTransaction)

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
    if(!tableBody)
        return
    if(tableBody?.children)
    for(let i = tableBody?.children.length-1; i > 1; i--) {
        tableBody.lastChild?.remove();
    }
}

async function deleteTransaction (event:MouseEvent) {
    console.log("Delete transaction");
    let a = event.target as HTMLElement;
    console.log(a.parentElement);
    let b =  Array.prototype.slice.call( a.parentElement?.children); //! What does this do
    let c = b.map(element => {return element.textContent});
     
    
    const tableid = tableBody?.dataset.objId;
    
    const data:ITransaction = {
        comp_name: c[0],
        amount: c[1],
        date: c[2],
        status:c[3],
    };
    const reqBody = { tableid, data, }

    const res = await fetch(`/api/transactions/update/${accountSelect?.value}`, {
        method:"DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
    })
}
