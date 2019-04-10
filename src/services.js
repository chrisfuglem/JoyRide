import { connection } from './mysql_connection';
import { connect } from 'net';

class RentalService {
  //Selects ID,sum date, start and end from rentals in the database, and counts the number of bikes and accessories in the booking.
  getRentals(success) {
    connection.query(
      'SELECT Rentals.RentalID as ID, Rentals.SUM, Rentals.Date, Rentals.RentStart, Rentals.RentEnd, Customers.FirstName, (SELECT COUNT(RentedBicycles.BicycleID) FROM Rentals INNER JOIN RentedBicycles ON Rentals.RentalID = RentedBicycles.RentalID WHERE Rentals.RentalID = ID) as Bicyclecount, (SELECT COUNT(RentedAccessories.AccessoryID) FROM Rentals INNER JOIN RentedAccessories ON Rentals.RentalID = RentedAccessories.RentalID WHERE Rentals.RentalID = ID) as Accessorycount FROM Rentals INNER JOIN Customers ON Rentals.CustomerID = Customers.CustomerID order by RentalID DESC;',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //Selects a specific rental booking and extracts rental and customer information from the database.
  getRental(id, success) {
    connection.query(
      'SELECT Rentals.RentalID, Customers.FirstName, Rentals.RentStart, Rentals.RentEnd, COUNT(RentedBicycles.BicycleID) as bicycleCount, Rentals.SUM FROM ((Rentals INNER JOIN Customers ON Rentals.CustomerID = Customers.CustomerID) INNER JOIN RentedBicycles ON Rentals.RentalID = RentedBicycles.RentalID) WHERE Rentals.RentalID=?',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
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

  //Remove all bicycles from an order
  removeAllBicycles(rentalID) {
    connection.query('delete from RentedBicycles where RentalID = ?', [rentalID]),
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

  //Removes all accessories from an order
  removeAllAccessories(rentalID) {
    connection.query('delete from RentedAccessories where RentalID = ?', [rentalID]),
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
  insertRental(customer, date, rentstart, rentend, sum, pickuplocation, discountsum, success) {
    connection.query('insert into Rentals (CustomerID, Date, RentStart, RentEnd, SUM, PickupLocation, SUMwithDiscount, RentalStatus) values (?, ?, ?, ?, ?, ?, ?, "Unactive")', [
      customer,
      date,
      rentstart,
      rentend,
      sum,
      pickuplocation,
      discountsum
    ]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  getLastInsertRental(success) {
    connection.query('SELECT MAX(RentalID) as RentalID from Rentals', (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  addBicycleToRental(rentalID, bicycleType, success) {
    connection.query('insert into RentedBicycles (RentalID, BicycleID) values ((SELECT RentalID from Rentals where RentalID = ?), (SELECT MIN(BicycleID) FROM Bicycles WHERE NOT EXISTS (SELECT * FROM (SELECT * from RentedBicycles) as RentedBicycles WHERE Bicycles.BicycleID = RentedBicycles.BicycleID) AND Bicycles.BicycleType = ? ));',
    [rentalID, bicycleType]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  addAccessoryToRental(rentalID, accessoryType, success) {
    connection.query('insert into RentedAccessories (RentalID, AccessoryID) values ((SELECT RentalID from Rentals where RentalID = ?), (SELECT MIN(AccessoryID) from Accessories where Type = ?))', [
      rentalID,
      accessoryType
    ]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Deletes an order.
  deleteRental(id) {
    connection.query('delete from Rentals where RentalID=?', [id]),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Shows the number of orders each customer have made.
  showCount(success) {
    connection.query('select * from Rental_Count', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Gets all bicycles with status 'Available'.
  getAvailableBicycles(success) {
    connection.query('Select BicycleType from Bicycles where BicycleStatus = "Available"', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Gets the Locations where you can pick up a bicycle.
  getPickupLocation(success) {
    connection.query('Select * from Locations where LocationID in (9, 13)', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Gets all details of bicycles.
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

  //Selects available accessories by the accessoryType, counts the number available.
  getAvailableAccessoriesByType(success) {
    connection.query(
      'select Accessories.Type as accessoryType, (SELECT COUNT(Accessories.AccessoryID) FROM Accessories WHERE Accessories.Status = "Available" AND Accessories.Type = accessoryType) as TypeCount FROM Accessories GROUP BY Accessories.Type;',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //Selects available accessories by the accessoryType.
  getAvailableAccessories(success) {
    connection.query('Select Type from Accessories where Status = "Available"', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Selects available bicycles by the bicycleType, counts the number available.
  getAvailableBicyclesByType(rentalID, success) {
    connection.query(
      'select Bicycles.BicycleType, (select count(Bicycles.BicycleID)) as TypeCount from Bicycles where Bicycles.BicycleID not in (select BicycleID from RentedBicycles inner join Rentals on Rentals.RentalID = RentedBicycles.RentalID where Rentals.RentStart <= (select Rentals.RentEnd from Rentals where Rentals.RentalID = ?) and Rentals.RentEnd >= (select Rentals.RentStart from Rentals where Rentals.RentalID = ?)) GROUP by Bicycles.BicycleType',
      [rentalID, rentalID],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //Sets the status of the Rental to 'Ended' in the database
  endRental(id) {
    connection.query('update Rentals set RentalStatus = "Ended" where RentalID=?', [id], (error) => {
      if(error) return console.error(error);
    })
  }

  //Sets the status of the Rental to 'Active' in the database
  activateRental(id) {
    connection.query('update Rentals set RentalStatus = "Active" where RentalID=?', [id], (error) => {
      if(error) return console.error(error);
    })
  }

  //Sets the status of the Bicycle to 'Rented' in the database
  setBicycleRented(RentalID) {
    connection.query('update Bicycles inner join RentedBicycles on RentedBicycles.BicycleID = Bicycles.BicycleID set BicycleStatus = "Rented" where RentedBicycles.RentalID=?', [RentalID], (error, results) => {
      if(error) return console.error(error);

      console.log(results);
    })
  }

  //Sets the status of the Accessory to 'Rented' in the database
  setAccessoryRented(RentalID) {
    connection.query('update Accessories inner join RentedAccessories on RentedAccessories.AccessoryID = Accessories.AccessoryID set Status = "Rented" where RentedAccessories.RentalID=?', [RentalID], (error, results) => {
      if(error) return console.error(error);

      console.log(results);
    });
  }

  //Sets the status of the Accessory to 'Available' in the database when the rental is ended
  setAccessoryBack(RentalID) {
    connection.query('update Accessories inner join RentedAccessories on RentedAccessories.AccessoryID = Accessories.AccessoryID set Status = "Available" where RentedAccessories.RentalID=?',
    [RentalID], (error, results) => {
      if(error) return console.error(error);

      console.log(results);
    });
  }

  setBicycleBack(RentalID) {
    connection.query('update Bicycles inner join RentedBicycles on RentedBicycles.BicycleID = Bicycles.BicycleID set BicycleStatus = "Available" where RentedBicycles.RentalID=?',
    [RentalID], (error, results) => {
      if(error) return console.error(error);

      console.log(results);
    });
  }
}

class CustomerService {
  //Selects all the customers from the database.
  getCustomers(results) {
    connection.query('select * from Customers', (error) => {
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
  getBicyclestoUpdate(success) {
    connection.query(
      'select * from Bicycles inner join HomeLocation on HomeLocation.BicycleID = Bicycles.BicycleID inner join CurrentLocation on CurrentLocation.BicycleID = Bicycles.BicycleID',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
  //gets details of all bicycles.
  getBicycles(success) {
    connection.query(
      'select * from Bicycles inner join HomeLocation on HomeLocation.BicycleID = Bicycles.BicycleID inner join CurrentLocation on CurrentLocation.BicycleID = Bicycles.BicycleID',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
  //Gets the Location of All Bicycles.
  getBicyclesHome(success) {
    connection.query(
      'select * from Bicycles inner join Locations on Locations.LocationID = Bicycles.HomeLocation',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //Selects a specific bicycle.
  getBicycle(bicycleID, success) {
    connection.query('select * from Bicycles where BicycleID = ?', [bicycleID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  //Updates the Status and Current Location of the Bicycle selected
  updateBicycles(BicycleID, BicycleStatus, CurrentLocation, success) {
    connection.query(
      'update Bicycles set BicycleStatus=?, CurrentLocation=? where BicycleID=?',
      [BicycleStatus, CurrentLocation, BicycleID],
      (error, results) => {
        if (error) return console.error(error);

        console.log(results);
        success();
      });
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

  //Search function for bicycles.
  searchBicycles(category, value, success) {
    connection.query(
      'SELECT * FROM Bicycles inner join HomeLocation on HomeLocation.BicycleID = Bicycles.BicycleID inner join CurrentLocation on CurrentLocation.BicycleId = Bicycles.BicycleID  WHERE ' + category + ' LIKE ' + "'" + value + "'",
      [category, value],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

class AccessoryService {
  //Selects all the accessories from the database.
  getAccessories(success) {
    connection.query(
      'select * from Accessories inner join AccessoryHomeLocation on AccessoryHomeLocation.AccessoryID = Accessories.AccessoryID inner join AccessoryCurrentLocation on AccessoryCurrentLocation.AccessoryID = Accessories.AccessoryID',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //Selects a specific accessory from the database.
  getAccessory(AccessoryID, success) {
    connection.query('select * from Accessories where AccessoryID=?', [AccessoryID], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  //Selects a specific accessory from the database.
  getAccessoryTypes(success) {
    connection.query('select * from AccessoryTypes', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Updates an accessory with all variables.
  updateAccessory(AccessoryID, DailyPrice, Status, HomeLocation, CurrentLocation, success) {
    connection.query(
      'update Accessories set DailyPrice=?, Status=((SELECT AccessoryStatus FROM AccessoryStatus WHERE AccessoryStatus.AccessoryStatus = ?)),  HomeLocation=?, CurrentLocation=? where AccessoryID=?',
      [DailyPrice, Status, HomeLocation, CurrentLocation, AccessoryID],
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
  insertAccessoryPrice(Type, DailyPrice, HomeLocation, CurrentLocation, Status, success) {
    connection.query(
      'insert into Accessories (Type, DailyPrice, HomeLocation, CurrentLocation, Status) values((SELECT AccessoryType FROM AccessoryTypes WHERE AccessoryTypes.AccessoryType = ?), ?, ?, ?, (SELECT AccessoryStatus FROM AccessoryStatus WHERE AccessoryStatus.AccessoryStatus = "Available"))',
      [Type, DailyPrice, HomeLocation, CurrentLocation, Status]
    ),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  //Adds new accessory price to the databse .
  insertExAccessory(Type, DailyPrice, HomeLocation, CurrentLocation, Status, success) {
    connection.query(
      'insert into Accessories (Type, DailyPrice, HomeLocation, CurrentLocation, Status) values((SELECT AccessoryType FROM AccessoryTypes WHERE AccessoryTypes.AccessoryType = ?), ?, ?, ?, (SELECT AccessoryStatus FROM AccessoryStatus WHERE AccessoryStatus.AccessoryStatus = "Available"))',
      [Type, DailyPrice, HomeLocation, CurrentLocation, Status]
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

  //Selects the bicyclestatus from the database.
  getAccessoryStatuses(success) {
    connection.query('select * from AccessoryStatus', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  //Search function for accessories.
  searchAccessories(category, value, success) {
    connection.query(
      'SELECT * FROM Accessories inner join AccessoryHomeLocation on AccessoryHomeLocation.AccessoryID = Accessories.AccessoryID inner join AccessoryCurrentLocation on AccessoryCurrentLocation.AccessoryID = Accessories.AccessoryID  WHERE ' + category + ' LIKE ' + "'" + value + "'",
      [category, value],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
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

  //Selects all locations except the one already chosen for transport.
  getLocationsRemove(LocationID, success) {
    connection.query('select * from Locations where LocationID <> ?;', [LocationID], (error, results) => {
      if (error) return console.error(error);

      success(results);
      console.log(results);
    });
  }

  //Selects transport locations, but removes the locations that is chosen, or not available for transport.
  getTransportToLocation(LocationID, success) {
    connection.query(
      'SELECT * from Locations WHERE LocationName <> ? and  LocationID <> 10 and LocationID <> 11 and LocationID <> 12;',
      [LocationID],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
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

        console.log(results);
        success(results);
      }
    );
  }

  //gets bicycles for transport.
  getBicyclesForTransport(LocationName, success) {
    connection.query(
      'select * from Bicycles inner join Locations on Locations.LocationID = Bicycles.CurrentLocation where LocationName=? and Bicycles.BicycleStatus = "Need Transport"',
      [LocationName],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //Saves the status of the bicycle(s) selected for Transport to 'In Transport'
  saveStatus(BicycleID) {
    connection.query('update Bicycles set BicycleStatus = "In Transport" where BicycleID=?', [BicycleID], (error) => {
      if(error) return console.error(error);
    })
  }
}

class RepairService {
  //Selects all bicycles that need repair from the database.
  getBicycles(success) {
    connection.query(
      'select * from Bicycles inner join HomeLocation on HomeLocation.BicycleID = Bicycles.BicycleID inner join CurrentLocation on CurrentLocation.BicycleID = Bicycles.BicycleID where BicycleStatus = "Need Repair"',
      (error, results) => {
        if (error) return console.error(error);

        console.log(results);
        success(results);
      }
    );
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
