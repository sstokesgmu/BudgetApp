
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


```js
User {
	name: string,
	total: number,
	accounts: number[],
}
```
### Endpoints

#### **GET** `/`
**Full Route** `https://budgetapp-vdsp.onrender.com/api/users` 
 
Base route that will fetch all documents within the user collection that includes name, accounts, and total. You could also provide a query parameter of **fields** to get specific information. 

**Example:** `https://budgetapp-vdsp.onrender.com/api/users?fields=name,accounts`

**Output:**

```json
[
    {
        "_id": "679f7d1a1e60cbf987a78c11",
        "accounts": [333,222],
        "name": "John Doe"
    }
]
```


#### **PATCH : `/api/users/create/accounts`
**full route**: `https://budgetapp-vdsp.onrender.com/api/users/create/accounts`

This route will create an account and add it to the user's accounts array. It will also create a new account doc and add it to the accounts collection. We can pass in numbers, object, an array of numbers, and an array of objects to the req.body as such:

```json
{
	"account": 123 
	Or
	"accounts": [123,456]
}
```

```json
{
	"account": {
		"account_num":333,
		"type": "Checking",
		"starting_amount": 5000
	}

	OR

	"account": [
		{
			"account_num": 321,
			"type": "Savings",
			"starting_amount": 300
		},
		{
			"account_num": 555,
			"type": "Checking",
			"starting_amount": 400
		}
	]
}
```

These will return a response like this, showing the new values of added to the array:

```json
{
    "_id": "679f7d1a1e60cbf987a78c11",
    "accounts": [123, 456, 789, 444, 321, 555],
    "name": "John Doe",
    "total": 0
}
```


And will also add a new Account model to the collection 

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

#### **PATCH**: `/api/users/del/accounts?accounts=123,234,`

**full route**: `https://budgetapp-vdsp.onrender.com/api/users/del/accounts?accounts=numbers`

User the query parameter **accounts** to remove account numbers from the user array and delete the corresponding account inside of the Account's collection.

**Example:**

```json
// The user document holds an array of account numbers
{
    "_id": "679f7d1a1e60cbf987a78c11",
    "accounts": [
        123,
        456,
        789,
        444,
        321,
        555
    ],
    "name": "John Doe",
    "total": 0
}
```

**Route:** `https://budgetapp-vdsp.onrender.com/api/users/del/accounts?accounts=456,789,444,555`
The only account left will be 321 and 123.

```json
//The output
{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
// a little weired but this does show a successful response, run a get request on the user and the account to be sure
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



## Account Routes

The account collection holds account information like starting and current amount. Date opened and date closed. But most importantly it holds ObjectId references to the transaction collection inside the array.

```js
Account {
    account_num: number|null,
    type: string | null,
    date_opened: Date,
    date_closed: Date | null,
    starting_amount: number|null,
    current_amount: number | null,
    bucket: ObjectId[] | null,
 }
```

### Endpoints

We are using the route prefix: `/api/accounts`

#### **GET**  `/`
**Full Route**: `https://budgetapp-vdsp.onrender.com/api/accounts`

The base route, use it to either get all account documents within the collection, or provide a query request parameter of **id** to select one account base on its account number.

**Example**

`https://budgetapp-vdsp.onrender.com/api/account`

```json
[
    {
        "_id": "67a2ac2b8f3af807d1ba58b1",
        "account_num": 123,
        "type": "Checking",
        "date_opened": "2025-02-05T00:09:15.649Z",
        "date_closed": null,
        "starting_amount": 0,
        "current_amount": 0,
        "bucket": null,
        "__v": 0
    },
    {
        "_id": "67a2ade88f3af807d1ba58b9",
        "account_num": 321,
        "type": "Savings",
        "date_opened": "2025-02-05T00:16:40.551Z",
        "date_closed": null,
        "starting_amount": 400,
        "current_amount": 400,
        "bucket": null,
        "__v": 0
    }
]
```

`https://budgetapp-vdsp.onrender.com/api/account?id=321`

```json
[
    {
        "_id": "67a2ade88f3af807d1ba58b9",
        "account_num": 321,
        "type": "Savings",
        "date_opened": "2025-02-05T00:16:40.551Z",
        "date_closed": null,
        "starting_amount": 400,
        "current_amount": 400,
        "bucket": null,
        "__v": 0
    }
]
```


### **Patches:** `/update-type/:accountId` and `/update-balance/:accountId`

We can also update the type of account and the balance. 

**Full Route:** 
	`https//:budgetapp-vdsp.onrender.com/api/accounts/update-type/:accountId`
	`https//:budgetapp-vdsp.onrender.com/api/accounts/update-balance/:accountId`


****
**Update Type Example:**

`https//:budgetapp-vdsp.onrender.com/api/accounts/update-type/123`
```json
{"type": "Checking"}
```

**The response will be this**. However if you call the get request the type of the account will be updated
```json
{

    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
``` 
****
**Update Current Balance Example:**

`https//:budgetapp-vdsp.onrender.com/api/accounts/update-balance/123`

```json
{"balance": 4000}
```


**The response will be this**. However if you call the get to see the updated account information 
```json
{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
```


#### A Note of Post and Delete

There are routes to post new  and delete old accounts, however that is all automated on the server-side.


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