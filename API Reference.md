
## Comprehensive reference for integrating with BudgetMe API Endpoints


### Seed Route

This seed adds transaction data to a particular account 

**GET** `/transactions/seed/:accountID`

```
http://localhost:port/transactions/seed/:accountID
```


## User Routes 

#### API reference for User endpoint 

Retrieve basic user information.
We are using a route prefix of: `/api/users`

## Endpoint

#### **GET** `https://budgetapp-vdsp.onrender.com/api/users` 
 
Base route that will fetch all documents within the user collection that includes name, accounts, and total.

#### **PATCH `https://budgetapp-vdsp.onrender.com/api/users/create/accounts`

This route will create an account and add it to the user's accounts array. It will also create a new account doc and add it to the accounts collection. This route takes in a dynamic body, to create an account we can send different account bodies :

```json
{
	"accounts": 123 
	Or
	"accounts": [123,456]
}
```

```json
{
	"accounts": [123,456,789]
}
```

These will return a result like:

```json
{
	"account_num": 123,
	"type": "savings",
	"date_opened": Date,
	"date_closed": null,
	"starting_amount": 0,
	"current_amount": null,
	"bucket": null
}
```



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