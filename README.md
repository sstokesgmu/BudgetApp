## Introduction

##  BudgetMe
---
`BudgetMe` is  a free, open-source tool that allows users to design and track their own budgeting system. Severing as an alternative to other budgeting applications.
- Track spending through a time frame 
-  Manage different account balances 


Frontend: https://github.com/sstokesgmu/Budget-Me-App.git
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





## Reflection:

What could you have done differently during the planning stages of your project to make the execution easier? **Rely more on Postman it is awesome**


What would you add to, or change about your application if given more time? **Validation and more support for edge cases. The code needs support for handling multiple transaction buckets**
