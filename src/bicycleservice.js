import { connection } from './mysql_connection';
import { connect } from 'net';

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

        success();
      }
    );
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
      'SELECT * FROM Bicycles inner join HomeLocation on HomeLocation.BicycleID = Bicycles.BicycleID inner join CurrentLocation on CurrentLocation.BicycleId = Bicycles.BicycleID  WHERE ' +
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

export let bicycleService = new BicycleService();
