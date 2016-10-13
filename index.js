'use strict';

const { Database } = require('sqlite3').verbose();
const Table = require('cli-table');

const db = new Database('db/Chinook_Sqlite.sqlite');



db.serialize(() => {

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


	// #4
	db.all(`
		SELECT Employee.FirstName || " " || Employee.LastName AS "Name"
		FROM Employee
		JOIN Customer ON Customer.SupportRepId = Employee.EmployeeId
		GROUP BY Name;
		`, (err, salesReps) => {
			// console.log("name", Name);
			const salesRepTable = new Table({
    		head: ['Sales Rep'],
  			style: { compact: true }
			});

			salesRepTable.push(...salesReps.map(i => [i.Name]));
			console.log("#4 Provide a query showing only the Employees who are Sales Agents.");
			console.log(salesRepTable.toString());
		}
	)

	// now using knex and bookshelf
	//#5 Provide a query showing a unique list of billing countries from the Invoice table.
	console.log("#5 Provide a query showing a unique list of billing countries from the Invoice table.");




})

db.close()
