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
    connection.query(
      'insert into Rentals (CustomerID, Date, RentStart, RentEnd, SUM, PickupLocation, SUMwithDiscount, RentalStatus) values (?, ?, ?, ?, ?, ?, ?, "Unactive")',
      [customer, date, rentstart, rentend, sum, pickuplocation, discountsum]
    ),
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
    connection.query(
      'insert into RentedBicycles (RentalID, BicycleID) values ((SELECT RentalID from Rentals where RentalID = ?), (SELECT MIN(BicycleID) FROM Bicycles WHERE NOT EXISTS (SELECT * FROM (SELECT * from RentedBicycles) as RentedBicycles WHERE Bicycles.BicycleID = RentedBicycles.BicycleID) AND Bicycles.BicycleType = ? ));',
      [rentalID, bicycleType]
    ),
      (error, results) => {
        if (error) return console.error(error);

        success();
      };
  }

  addAccessoryToRental(rentalID, accessoryType, success) {
    connection.query(
      'insert into RentedAccessories (RentalID, AccessoryID) values ((SELECT RentalID from Rentals where RentalID = ?), (SELECT MIN(AccessoryID) from Accessories where Type = ?))',
      [rentalID, accessoryType]
    ),
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
    connection.query('update Rentals set RentalStatus = "Ended" where RentalID=?', [id], error => {
      if (error) return console.error(error);
    });
  }

  //Sets the status of the Rental to 'Active' in the database
  activateRental(id) {
    connection.query('update Rentals set RentalStatus = "Active" where RentalID=?', [id], error => {
      if (error) return console.error(error);
    });
  }

  //Sets the status of the Bicycle to 'Rented' in the database
  setBicycleRented(RentalID) {
    connection.query(
      'update Bicycles inner join RentedBicycles on RentedBicycles.BicycleID = Bicycles.BicycleID set BicycleStatus = "Rented" where RentedBicycles.RentalID=?',
      [RentalID],
      (error, results) => {
        if (error) return console.error(error);
      }
    );
  }

  //Sets the status of the Accessory to 'Rented' in the database
  setAccessoryRented(RentalID) {
    connection.query(
      'update Accessories inner join RentedAccessories on RentedAccessories.AccessoryID = Accessories.AccessoryID set Status = "Rented" where RentedAccessories.RentalID=?',
      [RentalID],
      (error, results) => {
        if (error) return console.error(error);
      }
    );
  }

  //Sets the status of the Accessory to 'Available' in the database when the rental is ended
  setAccessoryBack(RentalID) {
    connection.query(
      'update Accessories inner join RentedAccessories on RentedAccessories.AccessoryID = Accessories.AccessoryID set Status = "Available" where RentedAccessories.RentalID=?',
      [RentalID],
      (error, results) => {
        if (error) return console.error(error);
      }
    );
  }

  setBicycleBack(RentalID) {
    connection.query(
      'update Bicycles inner join RentedBicycles on RentedBicycles.BicycleID = Bicycles.BicycleID set BicycleStatus = "Available" where RentedBicycles.RentalID=?',
      [RentalID],
      (error, results) => {
        if (error) return console.error(error);
      }
    );
  }

  //Search function for rentals.
  searchRentals(category, value, success) {
    connection.query(
      'SELECT Rentals.RentalID as ID, Rentals.SUM, Rentals.Date, Rentals.RentStart, Rentals.RentEnd, Customers.FirstName, (SELECT COUNT(RentedBicycles.BicycleID) FROM Rentals INNER JOIN RentedBicycles ON Rentals.RentalID = RentedBicycles.RentalID WHERE Rentals.RentalID = ID) as Bicyclecount, (SELECT COUNT(RentedAccessories.AccessoryID) FROM Rentals INNER JOIN RentedAccessories ON Rentals.RentalID = RentedAccessories.RentalID WHERE Rentals.RentalID = ID) as Accessorycount FROM Rentals INNER JOIN Customers ON Rentals.CustomerID = Customers.CustomerID order by RentalID DESC WHERE ' +
        category +
        ' LIKE ' +
        "'" +
        value +
        "'",
      [category, value],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

export let rentalService = new RentalService();
