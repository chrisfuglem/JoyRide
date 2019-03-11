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
    connection.query('select * from Customers where CustomerID=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

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

  deleteCustomer(CustomerID) {
    connection.query('delete from Customers where CustomerID=?', [CustomerID]),
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
    });
  }

  getEmployee(EmployeeID, success) {
    connection.query('select * from Employees where EmployeeID=?', [EmployeeID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

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

  insertEmployee(Firstname, Surname, success) {
    connection.query('insert into Employees (Firstname, Surname) values (?, ?)', [Firstname, Surname]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteEmployee(EmployeeID) {
    connection.query('delete from Employees where EmployeeID=?', [EmployeeID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
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
      [
        Bicycles.BicycleType,
        Bicycles.FrameType,
        Bicycles.BrakeType,
        Bicycles.Wheelsize,
        Bicycles.BicycleStatus,
        Bicycles.HomeLocation,
        Bicycles.DailyPrice,
        Bicycles.CurrentLocation,
        Bicycles.BicycleID
      ],
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
