'use strict';

// const { Database } = require('sqlite3').verbose();
const Table = require('cli-table');

// const db = new Database('db/Chinook_Sqlite.sqlite');

// const knex = require('knex')({
// 	client: 'sqlite3',
// 	connection: {
// 		filename: 'db/Chinook_Sqlite.sqlite'
// 	},
// 	useNullAsDefault: true
// })

const knex = require('knex')({
	client: 'pg',
	connection: 'postgres://localhost:5432/chinook'
})


// db.serialize(() => {

	// #1
	// db.all(`
	// 	SELECT FirstName || " " || LastName AS "Customer",
	// 				 CustomerId,
	// 				 Country
	//	FROM Customer
	// 	WHERE Country != "USA"
	// `, (err, customers) => {
	// 	console.log("customers: ", customers);
	// })// gets an array of objects

	// #2
	// db.each(`
	// 	SELECT FirstName || " " || LastName AS "Customer",
	// 				 CustomerId,
	// 				 Country
	// 	FROM Customer
	// 	WHERE Country = "Brazil"
	// `, (err, customer) => {
	// 	console.log(`${customer.CustomerId}: ${customer.Customer} (${customer.Country})`);
	// 	//using destructuring
	// 	// `, (err, { CustomerId, Customer, Country }) => {
	// 	// 	console.log(`${CustomerId}: ${Customer} (${Country})`);

	// })

	// #3
	// let table = new Table({
	//     head: ['InvID', 'Customer', 'Date', 'Country']
	//   // , colWidths: [7, 25, 25, 20]
	//   , style: { compact: true }
	// });
	// db.each(`
	// 	SELECT FirstName || " " || LastName AS "Name",
	// 					InvoiceId,
	// 					InvoiceDate,
	// 					BillingCountry
	// 	FROM Customer
	// 	JOIN Invoice ON Customer.CustomerId = Invoice.CustomerId
	// 	WHERE Country = "Brazil"
	// 	`, ( err, { InvoiceId, Name, InvoiceDate, BillingCountry } ) => {
	// 	// console.log(row)
	// 		table.push([`${InvoiceId}`, `${Name}`, `${InvoiceDate}`, `${BillingCountry}`])
	// 	}, () => { console.log(table.toString()) }
	// )


	// // #4
	// db.all(`
	// 	SELECT Employee.FirstName || " " || Employee.LastName AS "Name"
	// 	FROM Employee
	// 	JOIN Customer ON Customer.SupportRepId = Employee.EmployeeId
	// 	GROUP BY Name;
	// 	`, (err, salesReps) => {
	// 		// console.log("name", Name);
	// 		const salesRepTable = new Table({
 //    		head: ['Sales Rep'],
 //  			style: { compact: true }
	// 		});

	// 		salesRepTable.push(...salesReps.map(i => [i.Name]));
	// 		console.log("#4 Provide a query showing only the Employees who are Sales Agents.");
	// 		console.log(salesRepTable.toString());
	// 	}
	// )

// })

// db.close() //need for comman line apps


// now using knex and bookshelf
//#5 Provide a query showing a unique list of billing countries from the Invoice table.
// console.log("#5 Provide a query showing a unique list of billing countries from the Invoice table.");
// knex('Invoice').distinct('BillingCountry').orderBy('BillingCountry').then(console.log);

//#6 Provide a query showing the invoices of customers who are from Brazil.
// console.log('Provide a query showing the invoices of customers who are from Brazil.')
// knex('Invoice').where('BillingCountry', 'Brazil').then(console.log) //did not work for postgres because db import must have failed - no Brazil entries





//#7 Provide a query that shows the invoices associated with each sales agent. The resultant table should include the Sales Agent's full name.
	// SELECT Employee.FirstName || " " || Employee.LastName As "Sales Agent", Invoice.*
	// FROM Employee
	// JOIN Customer On Employee.EmployeeId = Customer.SupportRepId
	// JOIN Invoice On Customer.CustomerId = Invoice.CustomerId;
console.log(`Provide a query that shows the invoices associated with each sales agent. The resultant table should include the Sales Agent's full name.`)
knex('Employee')
	.join('Customer', 'Employee.EmployeeId', 'Customer.SupportRepId')
	.join('Invoice', 'Customer.CustomerId', 'Invoice.CustomerId')
	// .select('Employee.FirstName', 'Employee.LastName', 'Invoice.InvoiceId')
	// .select(knex.raw(`Employee.FirstName || " " || Employee.LastName As "SalesAgent"`), 'Invoice.InvoiceId') //sqlite3
	.select(knex.raw(`"Employee"."FirstName" || ' ' || "Employee"."LastName" As "SalesAgent"`), 'Invoice.InvoiceId') //postgres or sqlite3
	.orderBy('SalesAgent')
	// .then(console.log)
	.then((data7)=> {
		const table7 = new Table({
		    		head: ['Sales Agent', 'Invoice ID'],
		  			style: { compact: true }
					});

		data7.forEach(i => {
			let nextEntry = [i.SalesAgent, i.InvoiceId]
			table7.push(nextEntry)
		})

		console.log(table7.toString())
	})

//#8 Provide a query that shows the Invoice Total, Customer name, Country and Sale Agent name for all invoices and customers.
	// SELECT Customer.FirstName ||" "|| Customer.LastName As "Customer", Customer.Country, Employee.FirstName || " " || Employee.LastName As "Sales Agent", Invoice.Total
	// FROM Employee
	// JOIN Customer On Employee.EmployeeId = Customer.SupportRepId
	// JOIN Invoice On Customer.CustomerId = Invoice.CustomerId;
	knex('Invoice')
		.join('Customer', 'Invoice.CustomerId', 'Customer.CustomerId')
		.join('Employee', 'Customer.SupportRepId', 'Employee.EmployeeId')
		// .select(knex.raw(`Customer.FirstName || " " || Customer.LastName AS Customer`), 'Customer.Country', knex.raw(`Employee.FirstName || " " || Employee.LastName AS SalesAgent`)) //sqlite3
		.select(knex.raw(`"Customer"."FirstName" || ' ' || "Customer"."LastName" AS Customer`), 'Customer.Country', knex.raw(`"Employee"."FirstName" || ' ' || "Employee"."LastName" AS SalesAgent`)) //postgres
		.sum('Invoice.Total as Total')
		.groupBy('Customer.CustomerId', 'Employee.EmployeeId') //postgres needs 2nd arg
		.orderBy('Total', 'desc')
		.then(console.log)



knex.destroy();
