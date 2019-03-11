import { connection } from './mysql_connection';

class BookingService {
  getBookings(success) {
    connection.query(
      'SELECT Rentals.RentalID, Customers.FirstName, Rentals.SUM, Rentals.Date, COUNT(RentedBicycles.BicycleID) FROM ((Rentals INNER JOIN Customers ON Rentals.CustomerID = Customers.CustomerID) INNER JOIN RentedBicycles ON Rentals.RentalID = RentedBicycles.RentalID) GROUP BY Rentals.RentalID;',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getBooking(id, success) {
    connection.query('select * from Rentals where RentalID=?', [id], (error, results) => {
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

class EmployeeService {
  getEmployees(success) {
    connection.query('select * from Employees', (error, results) => {
      if (error) return console.error(error);

      success(results);
      console.log(results);
    });
  }

  getEmployee(id, success) {
    connection.query('select * from Employees where EmployeeID=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }
}

class BicycleService {
  getBicycles(success) {
    connection.query('select * from Bicycles', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getBicycle(id, success) {
    connection.query('select * from Bicycle where BicycleID=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateBicycle(
    id,
    type,
    framtype,
    braketype,
    wheelsize,
    bicyclestatus,
    homelocation,
    dailyprice,
    currentlocation,
    success
  ) {
    connection.query(
      'update Bicycles set BicycleType=?, FrameType=?, BrakeType=?, Wheelsize=?, BicycleStatus=?, HomeLocation=?, DailyPrice=?, CurrentLocation=? where BicycleID=?',
      [type, framtype, braketype, wheelsize, bicyclestatus, homelocation, dailyprice, currentlocation, id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  insertBicycle(
    type,
    framtype,
    braketype,
    wheelsize,
    bicyclestatus,
    homelocation,
    dailyprice,
    currentlocation,
    success
  ) {
    connection.query(
      'insert into Bicycles (BicycleType, FrameType, BrakeType, Wheelsize, BicycleStatus, HomeLocation, DailyPrice, CurrentLocation) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [type, frametype, braketype, wheelsize, bicyclestatus, homelocation, dailyprice, currentlocation]
    ),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteBicycle(id) {
    connection.query('delete from Bicycles where id=?', [id]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

export let customerService = new CustomerService();

export let bookingService = new BookingService();

export let employeeService = new EmployeeService();

export let bicycleService = new BicycleService();
