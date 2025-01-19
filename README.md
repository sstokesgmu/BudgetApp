## Introduction

For this assignment "JavaScript Web Application", my goal was to create a budgeting app over the break. This lead me the Plaid Api to use it's authentication and other services to get sample banking information. When I realized this was a little to ambitious, I course corrected to the next best thing, create a small database and api.  

## Welcome to the BudgetMe API  

I use it to connect and retrieve information from a sample dataset with:
- multiple accounts
- transaction data

And so will you!!!

### Getting Started

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

## Working the web app

You should see the account info (name, balance, type). You can change what information you see by selecting an account inside of the drop down. That changes the information shown on the transaction table. Click "Add a Transaction" and submit the form to update the table

## Routes

### Seed Route

This seed adds transaction data to a particular account 

**GET** `/transactions/seed/:accountID`

```
http://localhost:port/transactions/seed/:accountID
```


### User Routes 

These endpoints allow the application to interact with the user collection. Right now this model only holds the name of the user and an array of accounts. However, even though it is more simplistic than the other models you can consider this the **parent** of all the other models. If there are no accounts chached then there is no reason to store transaction data.

We are using a route prefix of: `/api/users`

**GET** `/` 

 ```
 http//:localhost:port/api/users/
 ```
Base route that will fetch all documents within the user collection

**POST** `/create/:accountId 

```
http//:localhost:port/api/users/create/(new account number)
```

Will query to see if a users has an accounts array of the passed number exists. Then (add) the new account id to the array.

**Note**: this route is functional when used delicatly. Definetly would be better to use a query paramater and some sort of validation. 

**PATCH** `/del/:accountId`

```
http://localhost:8080/api/users/del/(account)
```

will query to see if a document of model user has an accounts array exists. Then we pull (remove) the an account from the array

### Account Endpoint 

Holds basic account information for each account

We are using the route prefix: `/api/accounts`

**GET**  `/`
```
http://localhost:port/api/accounts
```
Retrieve all the documents within the accounts collection


### Transaction Endpoint

Probably the collection with the most endpoints. In this collection singular transactions are grouped into a transaction bucket. Each bucket has a particular start date; (start date === the 1st transaction's date) and end date. This implies that one account can have multiple transaction buckets, which makes this collection the one with the biggest load.

There are some new errors but either way here are the routes.


We are using the prefix route: `/api/transactions`

**GET** `/:accountId`

```
http://localhost:port/api/transactions/123
```

Returns the all the documents that match that accountId

**POST** `/add/:accountId`

```
http://localhost:port/api/transactions/add/123
```

Adds a transaction to an current transaction bucket or creates a new transaction bucket 

Here is some simple json to test on postman: 

```json
{
    "date": "",
    "amount": 30232, 
    "trans_type": "withdrawl",
    "comp_name": "Costco",
    "status": "pending",
    "account": 123
}
```

**PATCH** `/del/:accountId`

> Warning this route only works in the HTML, and that is not even certain

**This route is pretty busted when there are two routes with the same account id** 

```
http://localhost:8080/api/transactions/del/123
```

Remove a transaction from the transaction bucket. In the application you can double click a row and that should delete it. 


## SBA 319 Requirements



## Reflection:

What could you have done differently during the planning stages of your project to make the execution easier? **Rely more on Postman it is awesome**


What would you add to, or change about your application if given more time? **Validation and more support for edge cases. The code needs support for handling multiple transaction buckets**

  
  

## TODO
---
- [ ] Add chart.js to the project
- [X] Organize the front end of the project
- [ ] Figure out a way to add .env, without creating a sec. risk
- [X] Add a patch route to remove a transaction from a transaction bucket
- [X] Add a delete route to delete an account from the DB (that means all the transaction buckets that reference that account)  
- [X] Update database with a transaction seed 
- [ ] Create Onboarding functionality 
- [ ] 

  
  

## Possibilities



  

## Old Goals

  

- [ ] **Deprecated Goal id: 1** Modify the data in the get request to get account, balance, transaction information

    - Plaid api is not exactly what I expected so it will be sidelined for now until I can implement it i a useful way.
