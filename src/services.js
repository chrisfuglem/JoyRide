import { connection } from './mysql_connection';

class BookingService {
  getBookings(success) {
    connection.query('select * from Rentals', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getBooking(id, success) {
    connection.query('select * from Rentals where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateBooking(id, name, email, success) {
    connection.query('update Rentals set name=?, email=? where id=?', [name, email, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  insertBooking(name, email, success) {
    connection.query('insert into Rentals (name, email, RentStart, RentEnd) values (?, ?)', [
      name,
      email,
      rentstart,
      rentend
    ]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteBooking(id) {
    connection.query('delete from Rentals where id=?', [id]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

class CustomerService {
  getCustomers(success) {
    connection.query('select * from Customers', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getCustomer(id, success) {
    console.log(id);
    connection.query('select * from Customers where CustomerID=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateCustomer(id, FirstName, SurName, Email, Phone, Address, success) {
    connection.query(
      'update Customers set FirstName=?, SurName=?, Email=?, Phone=?, Address=? where id=?',
      [firstname, surname, email, phone, address, id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  insertCustomer(FirstName, SurName, Email, Phone, Address, success) {
    connection.query('insert into Customers (FirstName, SurName, Email, Phone, Address) values (?, ?, ?, ?, ?)', [
      firstname,
      surname,
      email,
      phone,
      address
    ]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteCustomer(id) {
    connection.query('delete from Customers where id=?', [id]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

export let customerService = new CustomerService();

export let bookingService = new BookingService();
