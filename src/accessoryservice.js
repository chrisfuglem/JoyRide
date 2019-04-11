import { connection } from './mysql_connection';
import { connect } from 'net';

class AccessoryService {
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
      'SELECT * FROM Accessories inner join AccessoryHomeLocation on AccessoryHomeLocation.AccessoryID = Accessories.AccessoryID inner join AccessoryCurrentLocation on AccessoryCurrentLocation.AccessoryID = Accessories.AccessoryID  WHERE ' +
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

export let accessoryService = new AccessoryService();
