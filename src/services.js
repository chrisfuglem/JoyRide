import { connection } from './mysql_connection';

class RentalService {
  getRentals(success) {
    connection.query(
      'SELECT Rentals.RentalID as ID, Rentals.SUM, Rentals.Date, Rentals.RentStart, Rentals.RentEnd, (SELECT COUNT(RentedBicycles.BicycleID) FROM Rentals INNER JOIN RentedBicycles ON Rentals.RentalID = RentedBicycles.RentalID WHERE Rentals.RentalID = ID) as Bicyclecount, (SELECT COUNT(RentedAccessories.AccessoryID) FROM Rentals INNER JOIN RentedAccessories ON Rentals.RentalID = RentedAccessories.RentalID WHERE Rentals.RentalID = ID) as Accessorycount FROM Rentals',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getRental(id, success) {
    connection.query(
      'SELECT Rentals.RentalID, Customers.FirstName, Rentals.SUM, Rentals.Date, COUNT(RentedBicycles.BicycleID) FROM ((Rentals INNER JOIN Customers ON Rentals.CustomerID = Customers.CustomerID) INNER JOIN RentedBicycles ON Rentals.RentalID = RentedBicycles.RentalID) WHERE Rentals.RentalID=?',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
  }

  getRentedBicycles(id, success) {
    connection.query(
      'SELECT RentedBicycles.BicycleID, Bicycles.BicycleType, Bicycles.DailyPrice FROM RentedBicycles INNER JOIN Bicycles ON RentedBicycles.BicycleID = Bicycles.BicycleID WHERE RentalID = ?;',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getRentedAccessories(id, success) {
    connection.query(
      'SELECT RentedAccessories.AccessoryID, Accessories.Type, Accessories.DailyPrice FROM RentedAccessories INNER JOIN Accessories ON RentedAccessories.AccessoryID = Accessories.AccessoryID WHERE RentalID = ?;',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  removeBicycle(bicycleID, rentalID) {
    connection.query('delete from RentedBicycles where BicycleID = ? and RentalID = ?', [bicycleID, rentalID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  removeAccessory(accessoryID, rentalID) {
    connection.query('delete from RentedAccessories where AccessoryID = ? and RentalID = ?', [accessoryID, rentalID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  updateRental(id, name, email, success) {
    connection.query('update Rentals set name=?, email=? where id= ?', [name, email, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  insertRental(name, email, success) {
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

  deleteRental(id) {
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

  searchCustomers(category, value, success) {
    let query = 'SELECT * FROM Customers WHERE ' + category + ' LIKE ' + "'" + value + "'";
    connection.query(
      'SELECT * FROM Customers WHERE ' + category + ' LIKE ' + "'" + value + "'",
      [category, value],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
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

  getBicycle(bicycleID, success) {
    connection.query('select * from Bicycles where BicycleID = ?', [bicycleID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  getBicycleStatuses(success) {
    connection.query('select * from BicycleStatus', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  updateBicycle(
    BicycleID,
    BicycleType,
    FrameType,
    BrakeType,
    Wheelsize,
    BicycleStatus,
    HomeLocation,
    DailyPrice,
    CurrentLocation,
    success
  ) {
    connection.query(
      'update Bicycles set BicycleType=?, FrameType=?, BrakeType=?, Wheelsize=?, BicycleStatus=?, HomeLocation=?, DailyPrice=?, CurrentLocation=? where BicycleID=?',
      [
        BicycleType,
        FrameType,
        BrakeType,
        Wheelsize,
        BicycleStatus,
        HomeLocation,
        DailyPrice,
        CurrentLocation,
        BicycleID
      ],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  insertBicycle(
    BicycleType,
    FrameType,
    BrakeType,
    Wheelsize,
    BicycleStatus,
    HomeLocation,
    DailyPrice,
    CurrentLocation,
    success
  ) {
    connection.query(
      'insert into Bicycles (BicycleType, FrameType, BrakeType, Wheelsize, BicycleStatus, HomeLocation, DailyPrice, CurrentLocation) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        BicycleType,
        FrameType,
        BrakeType,
        Wheelsize,
        BicycleStatus,
        HomeLocation,
        DailyPrice,
        CurrentLocation,
        BicycleID
      ]
    ),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteBicycle(BicycleID) {
    connection.query('delete from Bicycles where BicycleID=?', [BicycleID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

class AccessoryService {
  getAccessories(success) {
    connection.query('select * from Accessories', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getAccessory(AccessoryID, success) {
    connection.query('select * from Accessories where AccessoryID=?', [AccessoryID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateAccessory(AccessoryID, Type, DailyPrice, success) {
    connection.query(
      'update Accessories inner join AccessoryTypes on Accessories.Type = AccessoryTypes.AccessoryType set AccessoryType=?, DailyPrice=? where Accessories.AccessoryID=?',
      [Type, Type, DailyPrice, AccessoryID],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  insertAccessory(Type, DailyPrice, success) {
    connection.query('insert into Accessories (Type, DailyPrice) values (?, ?)', [Type, DailyPrice]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  deleteAccessory(AccessoryID) {
    connection.query('delete from Accessories where AccessoryID=?', [AccessoryID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

class TransportService {
  getLocations(success) {
    connection.query('select * from Locations', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getLocation(LocationID, success) {
    connection.query('select * from Locations where LocationID=?', [LocationID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  getBikeLocation(BicycleType, BicycleID, LocationName, success) {
    connection.query(
      'select BicycleType, BicycleID, LocationName from Bicycles inner join Locations on Locations.LocationID = Bicycles.CurrentLocation where LocationID=?',
      [BicycleType],
      [BicycleID],
      [LocationName],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
  }

  getBicycles(success) {
    connection.query(
      'select * from Bicycles inner join Locations on Locations.LocationID = Bicycles.CurrentLocation where LocationID=?',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

class RepairService {
  updateStatus(BicycleID, BicycleStatus) {
    connection.query(
      "update Bicycles set BicycleStatus = 'In Repair' where BicycleID=?",
      [BicycleID, BicycleStatus],
      (error, results) => {
        if (error) return console.error(error);
      }
    );
  }
}

export let customerService = new CustomerService();

export let rentalService = new RentalService();

export let employeeService = new EmployeeService();

export let bicycleService = new BicycleService();

export let accessoryService = new AccessoryService();

export let transportService = new TransportService();

export let repairService = new RepairService();
