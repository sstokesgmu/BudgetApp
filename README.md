## Introduction

##  BudgetMe
---
`BudgetMe` is  a free, open-source tool that allows users to design and track their own budgeting system. Severing as an alternative to other budgeting applications.
- Track spending through a time frame 
-  Manage different account balances 


Frontend: https://github.com/sstokesgmu/Budget-Me-App.git
Deployed FrontEnd: https://budget-me-app.onrender.com
API Reference: https://github.com/sstokesgmu/BudgetApp/blob/main/API%20Reference.md

## TODO
---
- [ ] Add OAuth
- [ ] Add Admin Dashboard
- [ ] Create better error handling for routes
- [ ] Segment the BudgeAppName Space

## Getting Started 

Lets walk through the set up:

1. Clone the repo and navigate to the correct branch 

2. This code base uses a couple of standard packages like express, dotenv, mongoose. Your gonna need to install it to.

```bash
npm install
```

3. Create a .env file, then copy and paste the information below 

```.env
# Rename this file to .env and fill out each variable

SAMPLE_BANK_URI=mongodb+srv://dev-01:RevoEthicsMind@budgetmeclutster.jwhyi.mongodb.net/?retryWrites=true&w=majority&appName=BudgetMeClutster

#Define your own port if you want to
PORT=8080;
```

4. This project is written in TypeScript, so we need to compile ts files into js before we try to run the server. Don't worry about the TS type errors, I'm still trying to figure it out. Use this command:

```bash
npm run build
```

5. Start the server; it runs on port `8080` for now  

```bash
npm start
```

## Quick Start API Reference:

| **Route** | **Method** | **Description** | **Full Route Example** | **Request Body Example** | **Response Example** |
|-----------|------------|-----------------|------------------------|-------------------|----------------------|
| **Seed Route** | `GET` | Adds transaction data to a particular account | `http://localhost:port/transactions/seed/:accountID` | N/A | N/A |
| **User Routes** | `GET` | Fetches all user documents with name, accounts, and total | `https://budgetapp-vdsp.onrender.com/api/users` | N/A | `[ { "_id": "679f7d1a1e60cbf987a78c11", "accounts": [333,222], "name": "John Doe" } ]` |
| **User Create Account** | `PATCH` | Adds an account to a user | `https://budgetapp-vdsp.onrender.com/api/users/create/accounts` | `{ "account": 123 }` or `{ "accounts": [123,456] }` | `{ "_id": "679f7d1a1e60cbf987a78c11", "accounts": [123, 456, 789, 444, 321, 555], "name": "John Doe", "total": 0 }` |
| **User Delete Account** | `PATCH` | Removes accounts from the user | `https://budgetapp-vdsp.onrender.com/api/users/del/accounts?accounts=123,234` | N/A | `{ "acknowledged": true, "modifiedCount": 1, "matchedCount": 1 }` |
| **Create New Account** | `POST` | Adds a new account to a user’s account array | `http://localhost:port/api/users/create/:accountId` | N/A | N/A |
| **Delete Account** | `PATCH` | Removes an account from a user's account array | `http://localhost:8080/api/users/del/:accountId` | N/A | N/A |
| **Account Routes** | `GET` | Retrieves all or specific account documents | `https://budgetapp-vdsp.onrender.com/api/accounts` | N/A | `[ { "_id": "67a2ac2b8f3af807d1ba58b1", "account_num": 123, "type": "Checking", "date_opened": "2025-02-05T00:09:15.649Z" } ]` |
| **Account Update Type** | `PATCH` | Updates account type | `https://budgetapp-vdsp.onrender.com/api/accounts/update-type/:accountId` | `{ "type": "Checking" }` | `{ "acknowledged": true, "modifiedCount": 1, "matchedCount": 1 }` |
| **Account Update Balance** | `PATCH` | Updates account balance | `https://budgetapp-vdsp.onrender.com/api/accounts/update-balance/:accountId` | `{ "balance": 4000 }` | `{ "acknowledged": true, "modifiedCount": 1, "matchedCount": 1 }` |
| **Transaction Routes** | `GET` | Retrieves transactions for a specific account | `http://localhost:port/api/transactions/123` | N/A | `[ { "date": "", "amount": 30232, "trans_type": "withdrawl", "comp_name": "Costco", "status": "pending" } ]` |
| **Transaction Add** | `POST` | Adds a transaction to a transaction bucket | `http://localhost:port/api/transactions/add/123` | `{ "date": "", "amount": 30232, "trans_type": "withdrawl", "comp_name": "Costco", "status": "pending", "account": 123 }` | N/A |
| **Transaction Delete** | `PATCH` | Removes a transaction from a transaction bucket | `http://localhost:8080/api/transactions/del/123` | N/A | N/A |
