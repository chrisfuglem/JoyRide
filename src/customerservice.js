import { connection } from './mysql_connection';
import { connect } from 'net';

class CustomerService {
  //Selects all the information about a specific customer.
  getCustomer(id, success) {
    connection.query('select * from Customers where CustomerID=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  //Search function for customers.
  searchCustomers(category, value, success) {
    connection.query(
      'SELECT * FROM Customers WHERE ' + category + ' LIKE ' + "'" + value + "'",
      [category, value],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //Updates customers with firstname, surname, email, phone and address.
  updateCustomer(CustomerID, FirstName, SurName, Email, Phone, Address, success) {
    connection.query(
      'update Customers set FirstName=?, SurName=?, Email=?, Phone=?, Address=? where CustomerID=?',
      [FirstName, SurName, Email, Phone, Address, CustomerID],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  //Adds new customer with firstname, surname, phone and address.
  insertCustomer(FirstName, SurName, Email, Phone, Address, success) {
    connection.query('insert into Customers (FirstName, SurName, Email, Phone, Address) values (?, ?, ?, ?, ?)', [
      FirstName,
      SurName,
      Email,
      Phone,
      Address
    ]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Deletes an customer from the database.
  deleteCustomer(CustomerID) {
    connection.query('delete from Customers where CustomerID=?', [CustomerID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

export let customerService = new CustomerService();
