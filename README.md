## Introduction

For this assignment "JavaScript Web Application", my goal was to create a budgeting app over the break. This lead me the Plaid Api to use it's authentication and other services to get sample banking information. When I realized this was a little to ambitious, I course corrected to the next best thing, create a small database and api.  

## Welcome to the BudgetMe API  

I use it to connect and retrieve information from a sample dataset with:
- multiple accounts
- transaction data

And so will you!!!

### Getting Started

  

Lets walk through the set up:

1. Clone the repo
  

2. This code base uses a couple of standard packages like express, dotenv, mongoose. Your gonna need to install it to.

```bash

npm install

```

3. I create a user called "dev-01" that has database access and universal network access (IP: 0.0.0.0). Along with a Mongo URI that is ready to go, inside the `.enviro` file at the root directory. **Create a `.env` file and paste the Mongo URI inside.

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

## SBA 308 Requirements

- This code base uses the fetch API religiously for starting routes

- The drop down uses a `GET` route when you select a different account

- When submitting the form it uses a `PUT` route to add the new transaction to the bucket

- While the frontend doesn't use much importing the backend uses it largely for creating schemas and using models

## Reflection:


What could you have done differently during the planning stages of your project to make the execution easier? **I should work on planning scope, having solid deliverables in mind, and managing git branches**


What would you add to, or change about your application if given more time? **Definitely more functionality and refactoring for better readablility**

  
  

## TODO

---

- [X] Deprecate the index.html file and make a ts to handle server interaction

- [X] **New Goal id: 1** Create a Database with basic (John Doe) account information

- [X] Completed refactoring from updateProStruct branch

- [X] Connect server to database with mongooose

- [ ] Create routes and handlers for get, post, and put for dataset

- [X] On the frontend create a html page to show

     - [X] name of account holder

     - [X] current balance

     - [X] account #

     - [X] pop up form to add transaction data

     - [X] Add data from trans action route to get data

- [X] Add a data to the transaction collection in the database

- [X] Config server, db, and project to work for testers

  
  

## Possibilities

- [ ] Add chart.js to the project

  

## Old Goals

  

- [ ] **Deprecated Goal id: 1** Modify the data in the get request to get account, balance, transaction information

    - Plaid api is not exactly what I expected so it will be sidelined for now until I can implement it i a useful way.