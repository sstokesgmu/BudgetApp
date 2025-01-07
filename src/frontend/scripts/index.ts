import {ITransaction} from "../../shared/interfaces/transactions";


const titleCard:Element = document.getElementsByTagName("h1")[0];
const accountTitle: Element = document.getElementsByTagName("h2")[0];
const accountType: HTMLElement | null = document.getElementById("account_type");
const balanceEl: HTMLElement | null = document.getElementById("balance");
const accountSelect: any = document.getElementById("accountSelect"); 

//On initalization select the first user with the Database //!for now
(async () => {
    let result = await fetch("/api/user").then(res => res.json());
    modifyHTMLText(result[0]?.name, titleCard);
    result  = await fetch("/api/accounts").then(res => res.json()); 
    SetAccountInfo(result);

    accountSelect?.addEventListener("change", async () => {
        result = await fetch("/api/accounts").then(res => res.json());
        SetAccountInfo(result);
    })
})();

function modifyHTMLText(textValue:string, element:Element|HTMLElement):void {
    element.textContent = textValue;
}

function SetAccountInfo(result:any):void {
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
    modifyHTMLText(account?.current_amount, balanceEl);
}

