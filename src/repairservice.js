import { connection } from './mysql_connection';
import { connect } from 'net';

class RepairService {
  //Selects all bicycles that need repair from the database.
  getBicycles(success) {
    connection.query(
      'select * from Bicycles inner join HomeLocation on HomeLocation.BicycleID = Bicycles.BicycleID inner join CurrentLocation on CurrentLocation.BicycleID = Bicycles.BicycleID where BicycleStatus = "Need Repair"',
      (error, results) => {
        if (error) return console.error(error);

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

export let repairService = new RepairService();
