import { connection } from './mysql_connection';

class BookingService {
  getBookings(success) {
    connection.query('select * from Students', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getBooking(id, success) {
    connection.query('select * from Students where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateBooking(id, name, email, success) {
    connection.query('update Students set name=?, email=? where id=?', [name, email, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  insertBooking(name, email, success) {
    connection.query('insert into Students (name, email) values (?, ?)', [name, email]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteBooking(id) {
    connection.query('delete from Students where id=?', [id]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

class CustomerService {
  getCustomers(success) {
    connection.query('select * from Subjects', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getCustomer(id, success) {
    connection.query('select * from Subjects where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateCustomer(id, SubjectCode, SubjectName, success) {
    connection.query(
      'update Subjects set SubjectCode=?, SubjectName=? where id=?',
      [SubjectCode, SubjectName, id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  insertCustomer(SubjectCode, SubjectName, success) {
    connection.query('insert into Subjects (SubjectCode, SubjectName) values (?, ?)', [SubjectCode, SubjectName]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteCustomer(id) {
    connection.query('delete from Subjects where id=?', [id]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}
export let customerService = new CustomerService();
export let bookingService = new BookingService();
