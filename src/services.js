import { connection } from './mysql_connection';

class RentalService {
  //Selects ID,sum date, start and end from rentals in the database, and counts the number of bikes and accessories in the booking.
  getRentals(success) {
    connection.query(
      'SELECT Rentals.RentalID as ID, Rentals.SUM, Rentals.Date, Rentals.RentStart, Rentals.RentEnd, Customers.FirstName, (SELECT COUNT(RentedBicycles.BicycleID) FROM Rentals INNER JOIN RentedBicycles ON Rentals.RentalID = RentedBicycles.RentalID WHERE Rentals.RentalID = ID) as Bicyclecount, (SELECT COUNT(RentedAccessories.AccessoryID) FROM Rentals INNER JOIN RentedAccessories ON Rentals.RentalID = RentedAccessories.RentalID WHERE Rentals.RentalID = ID) as Accessorycount FROM Rentals INNER JOIN Customers ON Rentals.CustomerID = Customers.CustomerID;',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //Selects a specific rental booking and extracts rental and customer information from the database.
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

  //Selects the rented bicycles on a specific order from the database.
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

  //Selects the rented accessories on a specific order from the database.
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

  //Removes a bicycle from an order.
  removeBicycle(bicycleID, rentalID) {
    connection.query('delete from RentedBicycles where BicycleID = ? and RentalID = ?', [bicycleID, rentalID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Removes an accessory from an order.
  removeAccessory(accessoryID, rentalID) {
    connection.query('delete from RentedAccessories where AccessoryID = ? and RentalID = ?', [accessoryID, rentalID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Updates an order with name and email.
  updateRental(id, name, email, success) {
    connection.query('update Rentals set name=?, email=? where id= ?', [name, email, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  //Adds an order with name, email, rent start and rent end.
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

  //Deletes an order.
  deleteRental(id) {
    connection.query('delete from Rentals where id=?', [id]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  showCount(success) {
    connection.query('select * from Rental_Count', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getAvailableBicycles(success) {
    connection.query('Select BicycleType from Bicycles where BicycleStatus = "Available"', (error, results) => {
      if(error) return console.error(error);

      success(results);
    })
  }

  getPickupLocation(success) {
    connection.query('Select * from Locations where LocationID in (9, 13)', (error, results) => {
      if(error) return console.error(error);

      success(results);
    })
  }

  getBicycleHomeLocation(LocationID, success) {
    connection.query(
      'select * from Bicycles inner join Locations on Locations.LocationID = Bicycles.CurrentLocation where LocationID=?',
      [LocationID],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
        console.log(results);
      }
    );
  }
}

class CustomerService {
  //Selects all the customers from the database.
  getCustomers(success) {
    connection.query('select * from Customers', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

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

class EmployeeService {
  //Selects all the employees from the database.
  getEmployees(success) {
    connection.query('select * from Employees', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

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

class BicycleService {
  //Selects all the bicycles from the database.
  getBicycles(success) {
    connection.query('select * from Bicycles inner join Locations on Locations.LocationID = Bicycles.CurrentLocation', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Selects a specific bicycle.
  getBicycle(bicycleID, success) {
    connection.query('select * from Bicycles where BicycleID = ?', [bicycleID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateBicycleStatus(BicycleID, BicycleStatus, CurrentLocation, success) {
    connection.query('update Bicycles set BicycleStatus=?, CurrentLocation=? where BicycleID=?', 
    [
      BicycleID,
      BicycleStatus,
      CurrentLocation,
      success
    ],
    (error, results) => {
      if(error) return console.error(error);

      success();
    })
  }

  //Selects the bicyclestatus from the database.
  getBicycleStatuses(success) {
    connection.query('select * from BicycleStatus', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Updates a bicycle with type, frametype, braketype, wheelsize, status, homelocation, price and current location.
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

  //Adds new bicycle with all variables to the database.
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
      [BicycleType, FrameType, BrakeType, Wheelsize, BicycleStatus, HomeLocation, DailyPrice, CurrentLocation]
    ),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Deletes a bicycle from the database.
  deleteBicycle(BicycleID) {
    connection.query('delete from Bicycles where BicycleID=?', [BicycleID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

class AccessoryService {
  //Selects all the accessories from the database.
  getAccessories(success) {
    connection.query('select * from Accessories', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Selects a specific accessory from the database.
  getAccessory(AccessoryID, success) {
    connection.query('select * from Accessories where AccessoryID=?', [AccessoryID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  //Selects a specific accessory from the database.
  getAccessoryType(success) {
    connection.query('select * from AccessoryTypes', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Updates an accessory with all variables.
  updateAccessory(AccessoryID, DailyPrice, success) {
    connection.query(
      'update Accessories set DailyPrice=? where AccessoryID=?',
      [DailyPrice, AccessoryID],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  //Adds new accessory type to the databse.
  insertAccessoryType(AccessoryType, success) {
    connection.query('insert into AccessoryTypes (AccessoryType) values (?)', [AccessoryType], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  //Adds new accessory price to the databse .
  insertAccessoryPrice(Type, DailyPrice, success) {
    connection.query(
      'insert into Accessories (Type, DailyPrice) values((SELECT AccessoryType FROM AccessoryTypes WHERE AccessoryTypes.AccessoryType = ?), ?)',
      [Type, DailyPrice]
    ),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Deletes an accessory from the database.
  deleteAccessory(AccessoryID) {
    connection.query('delete from Accessories where AccessoryID=?', [AccessoryID]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Deletes the AccessoryType from the AccessoryTypes table.
  deleteAccessoryType(AccessoryType) {
    connection.query('delete from AccessoryTypes where AccessoryType = ?', [AccessoryType]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }
}

class TransportService {
  // Selects all locations from the database.
  getLocations(success) {
    connection.query('select * from Locations', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Selects all locations except the one already chosen for transport. (Doesnt work yet)
  getLocationsRemove(LocationID, success) {
    connection.query('select * from Locations where LocationID <> ?;', [LocationID], (error, results) => {
      if (error) return console.error(error);

      success(results);
      console.log(results);
    });
  }

  //Selects a specific location.
  getLocation(LocationID, success) {
    connection.query('select * from Locations where LocationID=?', [LocationID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  //Selects all bicycles on the selected location.
  getBicycles(LocationID, success) {
    connection.query(
      'select * from Bicycles inner join Locations on Locations.LocationID = Bicycles.CurrentLocation where LocationID=?',
      [LocationID],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
        console.log(results);
      }
    );
  }
}

class RepairService {
  //Selects all bicycles that need repair from the database.
  getBicycles(success) {
    connection.query('select * from Bicycles where BicycleStatus = "Need Repair"', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Updates bicyclestatus.
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
