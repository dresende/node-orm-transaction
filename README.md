## ORM Transaction Plugin [![](https://badge.fury.io/js/orm-paging.png)](https://npmjs.org/package/orm-transaction)

This plugin adds a transaction function for [ORM](http://dresende.github.io/node-orm2).

## Dependencies

Of course you need `orm` to use it. Other than that, no more dependencies.

## Install

```sh
npm install orm-transaction
```

## DBMS Support

Any driver supported by ORM is supported by this plugin.

## Usage

```js
db.transaction(function (err, transaction) {
	// do your stuff
	transaction.commit(function (err) {
		if (!err) {
			console.log("success!");
		}
	});
});
```

## Example

```js
var orm = require("orm");
var transaction = require("orm-transaction");

orm.connect("mysql://username:password@host/database", function (err, db) {
	if (err) throw err;

	db.use(transaction);

	var Person = db.define("person", {
		name      : String,
		surname   : String,
		age       : Number
	});

	db.transaction(function (err, t) {
		Person.find({ surname: "Doe" }).each(function (person) {
			person.remove();
		});

		t.commit(function (err) {
        		if (!err) {
            			console.log("success!");
        		}
    		});
	});
});
```

#### ES6: await/async
```js
await db.transactionAsync(async () => {
	let persons = await Person.findAsync({ surname: "Doe" })

	for (let person of persons) {
		await person.removeAsync();
	}
});
```
**make sure use await in `db.transactionAsync` to catch error when function scope throw error**
**and make sure function scope use async and await to ensure commit, or catch error throw then to rollback**
