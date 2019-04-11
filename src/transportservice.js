import { connection } from './mysql_connection';
import { connect } from 'net';

class TransportService {
  // Selects all locations from the database.
  getLocations(success) {
    connection.query('select * from Locations', (error, results) => {
      if (error) return console.error(error);

      success(results);
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
    connection.query('update Bicycles set BicycleStatus = "In Transport" where BicycleID=?', [BicycleID], error => {
      if (error) return console.error(error);
    });
  }
}

export let transportService = new TransportService();
