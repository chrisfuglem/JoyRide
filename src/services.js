import { connection } from './mysql_connection';

class StudentService {
  getBooking(id, success) {
    connection.query('select * from Rentals where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    })
  }

  getStudents(success) {
    connection.query('select * from Students', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getStudent(id, success) {
    connection.query('select * from Students where id=?', [id], (error, results) => {
      if (error) return console.error(error);
      console.log(results)

      success(results[0]);
    });
  }

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

  updateSubject(id, name, kode, success) {
    connection.query('update Subjects set name=?, kode=? where id=?', [name, kode, id], (error, results) => {
      if (error) return console.error(error);

      success();
    })
  }

  updateStudent(id, name, email, success) {
    connection.query('update Students set name=?, email=? where id=?', [name, email, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  addStudent(id, name, email, success) {
    connection.query('insert into Students (name, email) values (?, ?)', [name, email, id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    })
  }

  addSubject(id, name, kode, success) {
    connection.query('insert into Subjects (name, kode) values (?, ?)', [name, kode, id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    })
  }

  deleteStudent(id, success) {
    connection.query('delete from Students where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    })
  }

deleteSubject(id, success) {
  connection.query('delete from Subjects where id=?', [id], (error, results) => {
    if (error) return console.error(error)

    success(results);
  })
}

}
export let studentService = new StudentService();
