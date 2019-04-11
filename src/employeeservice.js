import { connection } from './mysql_connection';
import { connect } from 'net';

class EmployeeService {
  //Selects a specific employee.
  getEmployee(EmployeeID, success) {
    connection.query('select * from Employees where EmployeeID=?', [EmployeeID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  //Updates an employee on firstname and surname.
  updateEmployee(EmployeeID, Firstname, Surname, success) {
    connection.query(
      'update Employees set Firstname=?, Surname=? where EmployeeID=?',
      [Firstname, Surname, EmployeeID],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  //Adds new employee with firstname and SurName.
  insertEmployee(Firstname, Surname, success) {
    connection.query('insert into Employees (Firstname, Surname) values (?, ?)', [Firstname, Surname]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Deletes an employee.
  deleteEmployee(EmployeeID) {
    connection.query('delete from Employees where EmployeeID=?', [EmployeeID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Search function for employees.
  searchEmployee(category, value, success) {
    connection.query(
      'SELECT * FROM Employees WHERE ' + category + ' LIKE ' + "'" + value + "'",
      [category, value],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

export let employeeService = new EmployeeService();
