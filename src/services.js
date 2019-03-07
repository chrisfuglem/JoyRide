import { connection } from './mysql_connection';

class BookingService {
  getBookings(success) {
    connection.query('select * from Students', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getStudent(id, success) {
    connection.query('select * from Students where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateStudent(id, name, email, success) {
    connection.query('update Students set name=?, email=? where id=?', [name, email, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  insertStudent(name, email, success) {
    connection.query('insert into Students (name, email) values (?, ?)', [name, email]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteStudent(id) {
    connection.query('delete from Students where id=?', [id]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

class SubjectService {
  getSubjects(success) {
    connection.query('select * from Subjects', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getSubject(id, success) {
    connection.query('select * from Subjects where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateSubject(id, SubjectCode, SubjectName, success) {
    connection.query(
      'update Subjects set SubjectCode=?, SubjectName=? where id=?',
      [SubjectCode, SubjectName, id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  insertSubject(SubjectCode, SubjectName, success) {
    connection.query('insert into Subjects (SubjectCode, SubjectName) values (?, ?)', [SubjectCode, SubjectName]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteSubject(id) {
    connection.query('delete from Subjects where id=?', [id]),
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
    connection.query('select * from Customers where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }
}

export let subjectService = new SubjectService();
export let bookingService = new BookingService();
