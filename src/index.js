import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import {
  rentalService,
  employeeService,
  bicycleService,
  accessoryService,
  customerService,
  transportService,
  repairService
} from './services';
// import { rentalService } from './rentalservice';
// import { employeeService } from './employeeservice';
// import { bicycleService } from './bicycleservice';
// import { accessoryService } from './accessoryservice';
// import { customerService } from './customerservice';
// import { transportService } from './transportservice';
// import { repairService } from './repairservice';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//Main Menu
class Menu extends Component {
  render() {
    return <NavBar brand="Joyride" />;
  }
}

//Home Screen
class Home extends Component {
  render() {
    return (
      <div class="col text-center">
        <NavBar brand="Joyride" />
        <Card title="Welcome to Joyride">Navigate using the buttons below</Card>
        <NavLink to="/sales">
          <Button.Info>Sales</Button.Info>
        </NavLink>{' '}
        <br />
        <br />
        <NavLink to="/warehouse">
          <Button.Info>Warehouse</Button.Info>
        </NavLink>
        <br />
        <br />
        <NavLink to="/employees">
          <Button.Info>Employees</Button.Info>
        </NavLink>
      </div>
    );
  }
}

//Sales Menu
class Sales extends Component {
  render() {
    return (
      <div class="col text-center">
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <br />
        <NavLink to="/sales/rentals">
          <Button.Info>Rentals</Button.Info>
        </NavLink>{' '}
        <br />
        <br />
        <NavLink to="/sales/customers">
          <Button.Info>Customers</Button.Info>
        </NavLink>
        <br />
        <br />
        <NavLink to="/sales/count">
          <Button.Info>Rental Count</Button.Info>
        </NavLink>
      </div>
    );
  }
}

//Warehouse Menu
class Warehouse extends Component {
  render() {
    return (
      <div class="col text-center">
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <br />
        <NavLink to="/warehouse/bicycles">
          <Button.Info>Bicycles</Button.Info>
        </NavLink>{' '}
        <br />
        <br />
        <NavLink to="/warehouse/accessories">
          <Button.Info>Accessories</Button.Info>
        </NavLink>
        <br />
        <br />
        <NavLink to="/warehouse/repair">
          <Button.Info>Order Repair</Button.Info>
        </NavLink>
        <br />
        <br />
        <NavLink to="/warehouse/transport">
          <Button.Info>Order Transport</Button.Info>
        </NavLink>
      </div>
    );
  }
}

//List all rentals, from here you can add and edit rentals.
class RentalList extends Component {
  rentals = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar class="nav-link disabled" href="#" brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card title="Rental List">
          <NavLink to="/sales/rentals/insert">
            <Button.Light>Add New Rental</Button.Light>
          </NavLink>{' '}
          <NavLink to="/sales/rentals/ended">
            <Button.Light>Ended Rentals</Button.Light>
          </NavLink>
          <p>Click the rentals to edit or delete them</p>
          <div id="RentalSearch">
            <input id="RentalSearchField" type="text" width="200px" />
            <select id="RentalSearchCategory">
              <option value="Rentals.RentalID">Rental ID</option>
              <option value="Customers.CustomerID">Customer ID</option>
              <option value="Customers.FirstName">Customer Fistname</option>
              <option value="Customers.SurName">Customer Surname</option>
              <option value="Rentals.RentalStatus">Status</option>
            </select>
            <button id="RentalSearchButton" onClick={this.mounted}>
              Search
            </button>
          </div>
          <List>
            {this.rentals.map(rental => (
              <List.Item key={rental.ID}>
                <NavLink to={'/sales/rentals/' + rental.ID + '/edit'}>
                  Order {rental.ID} by {rental.FirstName} {rental.SurName} on {rental.RentalDate}
                </NavLink>
                <br />
                BicycleCount: {rental.Bicyclecount} | Accessorycount: {rental.Accessorycount} SUM: {rental.SUM} Status:{' '}
                {rental.RentalStatus}
              </List.Item>
            ))}
          </List>
          <br />
        </Card>
      </div>
    );
  }

  mounted() {
    // rentalService.getRentals(rentals => {
    //   this.rentals = rentals;
    //   for (let i = 0; i < rentals.length; i++) {
    //     // Siden datoer fra databasen lagres som et Object må de gjøres om til Strings
    //     let rentalDate = JSON.stringify(rentals[i].Date);
    //     rentalDate = rentalDate.slice(1, 11);
    //     this.rentals[i].RentalDate = rentalDate;
    //   }
    // });
    this.searchCategory = '' + document.getElementById('RentalSearchCategory').value;
    this.searchValue = '%' + document.getElementById('RentalSearchField').value + '%';
    rentalService.searchRentals(this.searchCategory, this.searchValue, rentals => {
      this.rentals = rentals;
      for (let i = 0; i < rentals.length; i++) {
        // Siden datoer fra databasen lagres som et Object må de gjøres om til Strings
        let rentalDate = JSON.stringify(rentals[i].Date);
        rentalDate = rentalDate.slice(1, 11);
        this.rentals[i].RentalDate = rentalDate;
      }
    });
  }
}

class EndedRentalList extends Component {
  rentals = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar class="nav-link disabled" href="#" brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card title="Ended Rental List">
          {' '}
          <NavLink to="/sales/rentals">
            <Button.Light>Back</Button.Light>
          </NavLink>
          <List>
            {this.rentals.map(rental => (
              <List.Item key={rental.ID}>
                Order {rental.ID} by {rental.FirstName} on {rental.RentalDate}
                <br />
                BicycleCount: {rental.Bicyclecount} | Accessorycount: {rental.Accessorycount} SUM: {rental.SUM} Status:{' '}
                {rental.RentalStatus}
              </List.Item>
            ))}
          </List>
          <br />
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getEndedRentals(rentals => {
      this.rentals = rentals;
      for (let i = 0; i < rentals.length; i++) {
        // Siden datoer fra databasen lagres som et Object må de gjøres om til Strings
        let rentalDate = JSON.stringify(rentals[i].Date);
        rentalDate = rentalDate.slice(1, 11);
        this.rentals[i].RentalDate = rentalDate;
      }
    });
  }
}

//Rental edit section. Shows information from the chosen rental.
class RentalEdit extends Component {
  rentedBicycles = [];
  rentedAccessories = [];
  rental = '';
  FirstName = '';
  RentStart = '';
  RentEnd = '';
  SUM = '';
  BikeStatus = '';
  AccessoryStatus = '';

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card>
          <h3>Rental id {this.props.match.params.id}</h3>
          <p>Customer: {this.FirstName}</p>
          <p>Start of rent: {this.RentStart}</p>
          <p>End of rent: {this.RentEnd}</p>
          <p>Order Sum: {this.SUM}</p>
          <NavLink to="RemoveFromRental">Edit Bicycles and Accessories</NavLink>
          <h4>Bicycles</h4>
          {this.rentedBicycles.map(bicycle => (
            <List.Item key={bicycle.BicycleID}>
              <p>
                {bicycle.BicycleType} Bicycle id #{bicycle.BicycleID} | {bicycle.DailyPrice}kr per day
              </p>
            </List.Item>
          ))}
          <h4>Accessories</h4>
          {this.rentedAccessories.map(accessory => (
            <List.Item key={accessory.AccessoryID}>
              <p>
                {accessory.Type} Accessory id #{accessory.AccessoryID} | {accessory.DailyPrice}kr per day
              </p>
            </List.Item>
          ))}
          <NavLink to="/sales/rentals">
            <Button.Success onClick={this.save}>Save Changes</Button.Success>
          </NavLink>{' '}
          <Button.Success onClick={this.setActive}>Activate Rental</Button.Success>
          <br />
          <br />
          <NavLink to="/sales/rentals">
            <Button.Danger onClick={this.delete}>Cancel Rental</Button.Danger>
          </NavLink>{' '}
          <Button.Danger onClick={this.setEnded}>End Rental</Button.Danger>
          <NavLink to="/sales/rentals">
            <br />
            <br />
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getRental(this.props.match.params.id, rental => {
      this.rental = rental;
      this.FirstName = this.rental[0].FirstName;

      let x = JSON.stringify(this.rental[0].RentStart);
      x = x.slice(1, 11);
      this.RentStart = x;

      let y = JSON.stringify(this.rental[0].RentEnd);
      y = y.slice(1, 11);
      this.RentEnd = y;

      this.SUM = this.rental[0].SUM;
    });
    rentalService.getRentedBicycles(this.props.match.params.id, bicycles => {
      this.rentedBicycles = bicycles;
    });
    rentalService.getRentedAccessories(this.props.match.params.id, accessories => {
      this.rentedAccessories = accessories;
    });
  }

  save() {
    rentalService.updateRental(this.props.match.params.id, this.name, this.email, () => {
      history.push('/sales/rentals');
    });
  }

  delete() {
    rentalService.removeAllBicycles(this.props.match.params.id, () => {
      history.push('/sales/rentals');
    });
    rentalService.removeAllAccessories(this.props.match.params.id, () => {
      history.push('/sales/rentals');
    });
    rentalService.deleteRental(this.props.match.params.id, () => {
      history.push('/sales/rentals');
    });
  }
  setActive() {
    rentalService.setBicycleRented(this.props.match.params.id, status, () => {
      this.BikeStatus = status;
    });
    rentalService.setAccessoryRented(this.props.match.params.id, status, () => {
      this.AccessoryStatus = status;
    });
    rentalService.activateRental(this.props.match.params.id, () => {
      history.push('/sales/rentals');
    });
  }

  setEnded() {
    rentalService.setBicycleBack(this.props.match.params.id, status, () => {
      this.BikeStatus = status;
    });
    rentalService.setAccessoryBack(this.props.match.params.id, status, () => {
      this.AccessoryStatus = status;
    });
    rentalService.endRental(this.props.match.params.id, () => {
      history.push('/sales/rentals');
    });
  }

  discount() {
    let discount = document.getElementByID('DiscountDropdown').value;
    let sum = this.rental.sum * dicount;
  }
}

//Section for selecting/deselecting bicycles and accessories.
class RemoveFromRental extends Component {
  rental = [];
  rentedBicycles = [];
  rentedAccessories = [];
  bicycles = [];
  availableBicyclesCount = [];
  bicycleDropdownOptions = [];
  accessories = [];
  availableAccessoriesCount = [];
  accessoryDropdownOptions = [];
  rentedBicycles = [];
  rentedAccessories = [];
  rental = [];
  rentstart = '';
  rentend = '';
  sum = 0;
  discountSUM = 0;

  constructor(props) {
    super(props);
    this.customerDropdown = React.createRef();
    this.bicycleDropdown = React.createRef();
    this.accessoryDropdown = React.createRef();
    this.locationDropdown = React.createRef();
  }

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card>
          <h2>Rental #{this.props.match.params.id}</h2>
          <h3>Bicycle and Accessory selection</h3>
          <p>Original Sum: {this.sum}kr</p>
          <p>
            <b>Final Sum: {this.discountSUM}kr</b>
          </p>
          <div>
            <h4>Available Bicycles</h4>
            <select ref={this.bicycleDropdown}>
              {this.bicycleDropdownOptions.map(bicycle => (
                <option key={bicycle.bicycleID} value={bicycle.BicycleType}>
                  {bicycle.BicycleType} - {bicycle.TypeCount} Available
                </option>
              ))}
            </select>
            <button onClick={this.addBicycle}>Add Bicycle</button>
          </div>
          <div>
            <h4>Available Accessories</h4>
            <select ref={this.accessoryDropdown}>
              {this.accessoryDropdownOptions.map(accessory => (
                <option key={accessory.AccessoryID} value={accessory.Type}>
                  {accessory.Type} - {accessory.TypeCount} Available
                </option>
              ))}
            </select>
            <button onClick={this.addAccessory}>Add Accessory</button>
          </div>
          <h4>Bicycles</h4>
          {this.rentedBicycles.map(bicycle => (
            <List.Item key={bicycle.BicycleID}>
              <p>
                {bicycle.BicycleType} Bicycle id #{bicycle.BicycleID} | {bicycle.DailyPrice}kr per day
              </p>
              <button onClick={this.removeBicycle.bind(this, bicycle.BicycleID)}>Remove Bicycle</button>
            </List.Item>
          ))}
          <h4>Accessories</h4>
          {this.rentedAccessories.map(accessory => (
            <List.Item key={accessory.AccessoryID}>
              <p>
                {accessory.Type} Accessory id #{accessory.AccessoryID} | {accessory.DailyPrice}kr per day
              </p>
              <button onClick={this.removeAccessory.bind(this, accessory.AccessoryID)}>Remove Accessory</button>
            </List.Item>
          ))}
          <NavLink to={'/sales/rentals/' + this.props.match.params.id + '/edit'}>
            <Button.Success>Finish</Button.Success>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    // Resets the options to prevent duplicates from being added when mounted is called a second time
    this.bicycleDropdownOptions = [];
    this.accessoryDropdownOptions = [];
    rentalService.getRental(this.props.match.params.id, rental => {
      this.rental = rental;
    });
    rentalService.getRentedBicycles(this.props.match.params.id, bicycles => {
      this.rentedBicycles = bicycles;
      this.calculateSum();
    });
    rentalService.getRentedAccessories(this.props.match.params.id, accessories => {
      this.rentedAccessories = accessories;
      this.calculateSum();
    });
    rentalService.getAvailableBicycles(bicycles => {
      this.bicycles = bicycles;
    });
    // Gets all available bicycles within the rentals period and sorts them by type inside the dropdown
    rentalService.getAvailableBicyclesByType(this.props.match.params.id, bicycles => {
      this.availableBicyclesCount = bicycles;
      for (let x = 0; x < this.availableBicyclesCount.length; x++) {
        if (this.availableBicyclesCount[x].TypeCount > 0) {
          this.bicycleDropdownOptions.push(this.availableBicyclesCount[x]);
        }
      }
    });
    rentalService.getAvailableAccessories(accessories => {
      this.accessories = accessories;
    });
    rentalService.getAvailableAccessoriesByType(this.props.match.params.id, accessories => {
      this.availableAccessoriesCount = accessories;
      for (let x = 0; x < this.availableAccessoriesCount.length; x++) {
        if (this.availableAccessoriesCount[x].TypeCount > 0) {
          this.accessoryDropdownOptions.push(this.availableAccessoriesCount[x]);
        }
      }
    });
  }

  calculateSum() {
    this.sum = 0; // Reset before calculating
    for (let x = 0; x < this.rentedBicycles.length; x++) {
      this.sum += this.rentedBicycles[x].DailyPrice;
    }
    for (let x = 0; x < this.rentedAccessories.length; x++) {
      this.sum += this.rentedAccessories[x].DailyPrice;
    }
    this.sum = Math.round(this.sum);
    if (this.rentedBicycles.length > 3) {
      this.discountSUM = Math.round(this.sum * 0.9);
    } else {
      this.discountSUM = this.sum;
    }
    rentalService.updateSUM(this.sum, this.discountSUM, this.props.match.params.id);
  }

  //Adds bicycle to the rental.
  addBicycle() {
    if (this.bicycleDropdown.current.value != '') {
      rentalService.addBicycleToRental(this.props.match.params.id, this.bicycleDropdown.current.value);
      this.mounted(); // Refresh page with new data
    } else {
      alert('No bicycles available');
    }
  }

  //Removes the bicycle from the rental.
  removeBicycle(id) {
    rentalService.removeBicycle(id, this.props.match.params.id, () => {
      history.push('/sales/rentals');
    });
    this.mounted(); // Refresh page with new data
  }

  //Adds accessory to the rental.
  addAccessory() {
    // Doesn't query the accessoryDropdown is empty
    if (this.accessoryDropdown.current.value != '') {
      rentalService.addAccessoryToRental(this.props.match.params.id, this.accessoryDropdown.current.value);
      this.mounted(); // Refresh page with new data
    } else {
      alert('No accessories available');
    }
  }

  //Removes accessory from the rental.
  removeAccessory(id) {
    rentalService.removeAccessory(id, this.props.match.params.id, () => {
      history.push('/sales/rentals');
    });
    this.mounted(); // Refresh page with new data
  }
}

//Section for adding rentals. Here you can choose pickuplocation,
//customer, start date, end date and add bicycles and accessories to the booking.
class RentalInsert extends Component {
  customers = [];
  locations = [];
  bicycles = [];
  availableBicyclesCount = [];
  bicycleDropdownOptions = [];
  accessories = [];
  availableAccessoriesCount = [];
  accessoryDropdownOptions = [];
  rentedBicycles = [];
  rentedAccessories = [];
  searchCategory = '';
  lastInsertedRental = 0;

  constructor(props) {
    super(props);
    this.customerDropdown = React.createRef();
    this.bicycleDropdown = React.createRef();
    this.accessoryDropdown = React.createRef();
    this.locationDropdown = React.createRef();
  }

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card title="Adding Rental">
          <NavLink to="/sales/rentals/insertcustomer">
            <Button.Light>Add New Customer</Button.Light>
          </NavLink>
          <br />
          <Form.Label>Find Customer By:</Form.Label>
          <div id="CustomerSearch">
            <input id="CustomerSearchField" type="text" width="200px" />
            <select id="CustomerSearchCategory">
              <option>FirstName</option>
              <option>SurName</option>
              <option>Phone</option>
              <option>Email</option>
              <option>Address</option>
            </select>
            <button id="CustomerSearchButton" onClick={this.mounted}>
              Search
            </button>
          </div>
          <Form.Label>Select Customer:</Form.Label>
          <br />
          <select ref={this.customerDropdown}>
            {this.customers.map(customer => (
              <option value={customer.CustomerID} key={customer.CustomerID}>
                {customer[this.searchCategory]}
              </option>
            ))}
          </select>
          <br />
          <Form.Label>Select Pickup Location:</Form.Label>
          <br />
          <select ref={this.locationDropdown}>
            {this.locations.map(location => (
              <option
                value={location.LocationID}
                key={location.LocationID}
                onChange={e => (this.LocationID = e.target.value)}
              >
                {location.LocationName}
              </option>
            ))}
          </select>
          <br />
          <Form.Label>Start date:</Form.Label>
          <Form.Input type="date" value={this.RentStart} onChange={e => (this.RentStart = e.target.value)} />
          <Form.Label>End date:</Form.Label>
          <Form.Input type="date" value={this.RentEnd} onChange={e => (this.RentEnd = e.target.value)} />
          <br />
          <NavLink to={'/sales/rentals/' + this.lastInsertedRental + '/RemoveFromRental'}>
            <Button.Success onClick={this.insert}>Add New Rental</Button.Success>
          </NavLink>
          <br />
          <NavLink to="/rentals">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    this.searchCategory = '' + document.getElementById('CustomerSearchCategory').value;
    this.searchValue = '%' + document.getElementById('CustomerSearchField').value + '%';
    customerService.searchCustomers(this.searchCategory, this.searchValue, customers => {
      this.customers = customers;
    });
    rentalService.getPickupLocation(locations => {
      this.locations = locations;
    });
    rentalService.getLastInsertRental(rental => {
      this.lastInsertedRental = rental.RentalID + 1;
    });
  }

  //tjall

  //Adds new rental.
  insert() {
    //Get todays date
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    if (month <= 9) {
      month = '0' + month;
    }
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let today = year + '-' + month + '-' + day;

    // name, date, rentstart, rentend, sum, pickuplocation, discountsum
    rentalService.insertRental(
      this.customerDropdown.current.value,
      today,
      this.RentStart,
      this.RentEnd,
      0,
      this.locationDropdown.current.value,
      0,
      () => {
        history.push('/sales/rentals/' + this.lastInsertedRental + '/RemoveFromRental');
      }
    );
  }
}

//Section to list all the customers. From here you can search and add/edit customers.
class CustomerList extends Component {
  customers = [];
  searchCategory = '';
  searchValue = '';

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card>
          <div>
            <p>Click the customers to edit or delete them</p>
            <NavLink to="/sales/customers/insert">
              <Button.Light>Add New Customer</Button.Light>
            </NavLink>
            <h3>Search by category</h3>
            <div id="CustomerSearch">
              <input id="CustomerSearchField" type="text" />
              <select id="CustomerSearchCategory">
                <option>FirstName</option>
                <option>SurName</option>
                <option>Phone</option>
                <option>Email</option>
                <option>Address</option>
              </select>
              <button id="CustomerSearchButton" onClick={this.mounted}>
                Search
              </button>
            </div>
            <List>
              {this.customers.map(customer => (
                <List.Item key={customer.CustomerID}>
                  <NavLink to={'/sales/customers/' + customer.CustomerID + '/edit'}>
                    {customer.FirstName} {customer.SurName} | tlf {customer.Phone}
                  </NavLink>
                </List.Item>
              ))}
            </List>
          </div>
        </Card>
      </div>
    );
  }

  mounted() {
    this.searchCategory = '' + document.getElementById('CustomerSearchCategory').value;
    this.searchValue = '%' + document.getElementById('CustomerSearchField').value + '%';
    customerService.searchCustomers(this.searchCategory, this.searchValue, customers => {
      this.customers = customers;
    });
  }
}

//Section where you can edit or delete the chosen customer.
class CustomerEdit extends Component {
  FirstName = '';
  SurName = '';
  Email = '';
  Phone = '';
  Address = '';

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card title="Editing Customer">
          <Form.Label>Firstname</Form.Label>
          <Form.Input type="text" value={this.FirstName} onChange={e => (this.FirstName = e.target.value)} />
          <Form.Label>Surname</Form.Label>
          <Form.Input type="text" value={this.SurName} onChange={e => (this.SurName = e.target.value)} />
          <Form.Label>Email</Form.Label>
          <Form.Input type="text" value={this.Email} onChange={e => (this.Email = e.target.value)} />
          <Form.Label>Phone</Form.Label>
          <Form.Input type="text" value={this.Phone} onChange={e => (this.Phone = e.target.value)} />
          <Form.Label>Address</Form.Label>
          <Form.Input type="text" value={this.Address} onChange={e => (this.Address = e.target.value)} />
          <br />
          <NavLink to="/sales/customers">
            <Button.Success onClick={this.save}>Save Changes</Button.Success>
          </NavLink>
          <br />
          <br />
          <NavLink to="/sales/customers">
            <Button.Danger onClick={this.delete}>Delete Customer</Button.Danger>
          </NavLink>
          <NavLink to="/sales/customers">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    customerService.getCustomer(this.props.match.params.id, customer => {
      this.FirstName = customer.FirstName;
      this.SurName = customer.SurName;
      this.Email = customer.Email;
      this.Phone = customer.Phone;
      this.Address = customer.Address;
    });
  }

  //Updates the customer.
  save() {
    customerService.updateCustomer(
      this.props.match.params.id,
      this.FirstName,
      this.SurName,
      this.Email,
      this.Phone,
      this.Address,
      () => {
        history.push('/sales/customers');
      }
    );
  }

  //Deletes the customer.
  delete() {
    customerService.deleteCustomer(this.props.match.params.id, () => {
      history.push('/sales/customers');
    });
  }
}

//Section where you can add new customers.
class CustomerInsert extends Component {
  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card title="Adding Customer">
          <Form.Label>Firstname:</Form.Label>
          <Form.Input type="text" value={this.FirstName} onChange={e => (this.FirstName = e.target.value)} />
          <Form.Label>Surname:</Form.Label>
          <Form.Input type="text" value={this.SurName} onChange={e => (this.SurName = e.target.value)} />
          <Form.Label>Email:</Form.Label>
          <Form.Input type="text" value={this.Email} onChange={e => (this.Email = e.target.value)} />
          <Form.Label>Phone:</Form.Label>
          <Form.Input type="text" value={this.Phone} onChange={e => (this.Phone = e.target.value)} />
          <Form.Label>Address:</Form.Label>
          <Form.Input type="text" value={this.Address} onChange={e => (this.Address = e.target.value)} />
          <br />
          <NavLink to="/sales/customers">
            <Button.Success onClick={this.insert}>Add New Customer</Button.Success>
          </NavLink>
          <NavLink to="/sales/customers">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  //Adds the new cutomer.
  insert() {
    customerService.insertCustomer(this.FirstName, this.SurName, this.Email, this.Phone, this.Address, () => {
      history.push('/sales/customers');
    });
  }
}

//Section where you can add new customers and navigate directly to add rental.
class BookingCustomerInsert extends Component {
  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card title="Adding Customer">
          <Form.Label>Firstname:</Form.Label>
          <Form.Input type="text" value={this.FirstName} onChange={e => (this.FirstName = e.target.value)} />
          <Form.Label>Surname:</Form.Label>
          <Form.Input type="text" value={this.SurName} onChange={e => (this.SurName = e.target.value)} />
          <Form.Label>Email:</Form.Label>
          <Form.Input type="text" value={this.Email} onChange={e => (this.Email = e.target.value)} />
          <Form.Label>Phone:</Form.Label>
          <Form.Input type="text" value={this.Phone} onChange={e => (this.Phone = e.target.value)} />
          <Form.Label>Address:</Form.Label>
          <Form.Input type="text" value={this.Address} onChange={e => (this.Address = e.target.value)} />
          <br />
          <NavLink to="/sales/rentals/insert">
            <Button.Success onClick={this.insert}>Add New Customer</Button.Success>
          </NavLink>
          <NavLink to="/sales/rentals/insert">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  //Adds the new cutomer.
  insert() {
    customerService.insertCustomer(this.FirstName, this.SurName, this.Email, this.Phone, this.Address, () => {
      history.push('/sales/rentals/insert');
    });
  }
}

//Section where it lists all the employees. From here you can search for employees based on firstname or surname.
class EmployeeList extends Component {
  employees = [];
  searchCategory = '';
  searchValue = '';

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <Card>
          <div>
            <p>Click the employees to edit or delete them</p>
            <NavLink to="/employees/insert/">
              <Button.Light>Add New Employee</Button.Light>
              <br />
              <br />
            </NavLink>
            <h3>Search by category</h3>
            <div id="EmployeeSearch">
              <input id="EmployeeSearchField" type="text" />
              <select id="EmployeeSearchCategory">
                <option>Firstname</option>
                <option>Surname</option>
              </select>
              <button id="EmployeeSearchButton" onClick={this.mounted}>
                Search
              </button>
            </div>
            <List>
              {this.employees.map(employee => (
                <List.Item key={employee.EmployeeID}>
                  <NavLink to={'/employees/' + employee.EmployeeID + '/edit'}>
                    {employee.Firstname} {employee.Surname}
                  </NavLink>
                </List.Item>
              ))}
            </List>
            <p id="alert" />
          </div>
        </Card>
      </div>
    );
  }

  mounted() {
    this.searchCategory = '' + document.getElementById('EmployeeSearchCategory').value;
    this.searchValue = '%' + document.getElementById('EmployeeSearchField').value + '%';
    employeeService.searchEmployee(this.searchCategory, this.searchValue, employees => {
      this.employees = employees;
      if (this.employees.length === 0) {
        document.getElementById('alert').innerHTML = 'There are no employees in this category.';
      } else {
        document.getElementById('alert').innerHTML = '';
      }
    });
  }
}

//Section where you can edit or delete the chosen customer.
class EmployeeEdit extends Component {
  Firstname = '';
  Surname = '';

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <br />
        <Card title="Editing Employee">
          <Form.Label>Firstname</Form.Label>
          <Form.Input type="text" value={this.Firstname} onChange={e => (this.Firstname = e.target.value)} />
          <Form.Label>Surname</Form.Label>
          <Form.Input type="text" value={this.Surname} onChange={e => (this.Surname = e.target.value)} />
          <br />
          <NavLink to="/employees">
            <Button.Success onClick={this.save}>Save Changes</Button.Success>
          </NavLink>
          <br />
          <br />
          <NavLink to="/employees">
            <Button.Danger onClick={this.delete}>Delete Employee</Button.Danger>
          </NavLink>
          <NavLink to="/employees">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    employeeService.getEmployee(this.props.match.params.id, employee => {
      this.Firstname = employee.Firstname;
      this.Surname = employee.Surname;
    });
  }

  //Updates the employee.
  save() {
    employeeService.updateEmployee(this.props.match.params.id, this.Firstname, this.Surname, () => {
      history.push('/employees');
    });
  }

  //Deletes the employee.
  delete() {
    employeeService.deleteEmployee(this.props.match.params.id, () => {
      history.push('/employees');
    });
  }
}

//Section where you can add new employees.
class EmployeeInsert extends Component {
  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <br />
        <Card title="Adding Employee">
          <Form.Label>Firstname:</Form.Label>
          <Form.Input type="text" value={this.Firstname} onChange={e => (this.Firstname = e.target.value)} />
          <Form.Label>Surname:</Form.Label>
          <Form.Input type="text" value={this.Surname} onChange={e => (this.Surname = e.target.value)} />
          <br />
          <NavLink to="/employees">
            <Button.Success onClick={this.insert}>Add New Employee</Button.Success>
          </NavLink>
          <NavLink to="/employees">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  //Adds the employee.
  insert() {
    employeeService.insertEmployee(this.Firstname, this.Surname, () => {
      history.push('/employees');
    });
  }
}

//Section where it lists all the bicycles with information. From here you can add/update bicycles.
class BicycleList extends Component {
  bicycles = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Bicycle List">
          <NavLink to="/warehouse/bicycles/insert">
            <Button.Light>Add New Bicycle</Button.Light>
          </NavLink>
          <NavLink to="/warehouse/bicycles/update">
            <Button.Light>Update Bicycles</Button.Light>
          </NavLink>
          <p>Click the bicycles to edit or delete them</p>
          <Form.Label>Find Bicycle By:</Form.Label>
          <div id="BicycleSearch">
            <input id="BicycleSearchField" type="text" width="200px" />
            <select id="BicycleSearchCategory">
              <option value="Bicycles.BicycleID">Bicycle ID</option>
              <option value="BicycleType">Bicycletype</option>
              <option value="FrameType">Frametype</option>
              <option value="BrakeType">Braketype</option>
              <option value="Wheelsize">Wheelsize</option>
              <option value="BicycleStatus">Status</option>
              <option value="HomeLocation.HomeLocationName">Homelocation</option>
              <option value="CurrentLocation.CurrentLocationName">Current location</option>
            </select>
            <button id="CustomerSearchButton" onClick={this.mounted}>
              Search
            </button>
          </div>
          <br />
          <List>
            {this.bicycles.map(bicycle => (
              <List.Item key={bicycle.BicycleID}>
                <NavLink to={'/warehouse/bicycles/' + bicycle.BicycleID + '/edit'}>
                  Bicycle ID: {bicycle.BicycleID} | Bicycle Type: {bicycle.BicycleType} | Daily Price:{' '}
                  {bicycle.DailyPrice}kr per day
                </NavLink>
              </List.Item>
            ))}
          </List>
          <p id="alert" />
          <br />
          <br />
        </Card>
      </div>
    );
  }

  mounted() {
    this.searchCategory = '' + document.getElementById('BicycleSearchCategory').value;
    this.searchValue = '%' + document.getElementById('BicycleSearchField').value + '%';
    bicycleService.searchBicycles(this.searchCategory, this.searchValue, bicycles => {
      this.bicycles = bicycles;
      if (this.bicycles.length === 0) {
        document.getElementById('alert').innerHTML = 'There are no bicycles in this category.';
      } else {
        document.getElementById('alert').innerHTML = '';
      }
    });
  }
}

//Section where you can edit ot delete the chosen bicycle.
class BicycleEdit extends Component {
  BicycleType = '';
  FrameType = '';
  BrakeType = '';
  Wheelsize = '';
  BicycleStatus = '';
  HomeLocation = '';
  DailyPrice = '';
  CurrentLocation = '';
  BicycleStatuses = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Editing bicycle">
          <Form.Label>Bicycle Type</Form.Label> <br />
          <select id="TypeDropdown" value={this.BicycleType} onChange={e => (this.BicycleType = e.target.value)}>
            <option>Beach Cruiser</option>
            <option>BMX</option>
            <option>Downhill</option>
            <option>Hybrid</option>
            <option>Kids</option>
            <option>Mountain Bike</option>
            <option>Racer</option>
            <option>Road Bike</option>
            <option>Tandem</option>
          </select>
          <br />
          <Form.Label>Frame Type</Form.Label> <br />
          <select id="FrameDropdown" value={this.FrameType} onChange={e => (this.FrameType = e.target.value)}>
            <option>City</option>
            <option>Hardtail</option>
            <option>Rigid</option>
            <option>Road</option>
            <option>Trail</option>
          </select>
          <br />
          <Form.Label>Brake Type</Form.Label> <br />
          <select id="BrakeDropdown" value={this.BrakeType} onChange={e => (this.BrakeType = e.target.value)}>
            <option>Caliper</option>
            <option>Cantilever</option>
            <option>Disk</option>
            <option>V</option>
          </select>
          <br />
          <Form.Label>Wheelsize</Form.Label>
          <Form.Input type="number" value={this.Wheelsize} onChange={e => (this.Wheelsize = e.target.value)} />
          <Form.Label>Bicycle Status</Form.Label>
          <br />
          <select id="StatusDropdown" value={this.BicycleStatus} onChange={e => (this.BicycleStatus = e.target.value)}>
            {this.BicycleStatuses.map(status => (
              <option value={status.BicycleStatus}>{status.BicycleStatus}</option>
            ))}
          </select>{' '}
          <br />
          <Form.Label>Home Location</Form.Label> <br />
          <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
            <option value="9">Finse</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <Form.Label>Daily Price</Form.Label>
          <Form.Input type="number" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
          <Form.Label>Current Location</Form.Label> <br />
          <select
            id="CurrentLocation"
            value={this.CurrentLocation}
            onChange={e => (this.CurrentLocation = e.target.value)}
          >
            <option value="9">Finse</option>
            <option value="10">Flaam</option>
            <option value="11">Voss</option>
            <option value="12">Myrdal</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <br />
          <NavLink to="/warehouse/bicycles">
            <Button.Success onClick={this.save}>Save Changes</Button.Success>
          </NavLink>
          <br />
          <br />
          <NavLink to="/warehouse/bicycles">
            <Button.Danger onClick={this.delete}>Delete Bicycle</Button.Danger>
          </NavLink>
          <NavLink to="/warehouse/bicycles">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    bicycleService.getBicycle(this.props.match.params.id, bicycle => {
      this.BicycleType = bicycle.BicycleType;
      this.FrameType = bicycle.FrameType;
      this.BrakeType = bicycle.BrakeType;
      this.Wheelsize = bicycle.Wheelsize;
      this.BicycleStatus = bicycle.BicycleStatus;
      this.HomeLocation = bicycle.HomeLocation;
      this.DailyPrice = bicycle.DailyPrice;
      this.CurrentLocation = bicycle.CurrentLocation;
    });
    bicycleService.getBicycleStatuses(statuses => {
      this.BicycleStatuses = statuses;
    });
  }

  //Updates the bicycle.
  save() {
    bicycleService.updateBicycle(
      this.props.match.params.id,
      (this.BicycleType = '' + document.getElementById('TypeDropdown').value),
      (this.FrameType = '' + document.getElementById('FrameDropdown').value),
      (this.BrakeType = '' + document.getElementById('BrakeDropdown').value),
      this.Wheelsize,
      (this.BicycleStatus = '' + document.getElementById('StatusDropdown').value),
      (this.HomeLocation = '' + document.getElementById('HomeLocation').value),
      this.DailyPrice,
      (this.CurrentLocation = '' + document.getElementById('CurrentLocation').value),
      () => {
        history.push('/warehouse/bicycles');
      }
    );
  }

  //Deletes the bicycle.
  delete() {
    bicycleService.deleteBicycle(this.props.match.params.id, () => {
      history.push('/warehouse/bicycles');
    });
  }
}

//Section where you can add new bicycles.
class BicycleInsert extends Component {
  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Adding Bicycle">
          <Form.Label>Bicycle Type</Form.Label> <br />
          <select id="TypeDropdown">
            <option>Beach Cruiser</option>
            <option>BMX</option>
            <option>Downhill</option>
            <option>Hybrid</option>
            <option>Kids</option>
            <option>Mountain Bike</option>
            <option>Racer</option>
            <option>Road Bike</option>
            <option>Tandem</option>
          </select>
          <br />
          <Form.Label>Frame Type</Form.Label> <br />
          <select id="FrameDropdown">
            <option>City</option>
            <option>Hardtail</option>
            <option>Rigid</option>
            <option>Road</option>
            <option>Trail</option>
          </select>
          <br />
          <Form.Label>Brake Type</Form.Label> <br />
          <select id="BrakeDropdown">
            <option>Caliper</option>
            <option>Cantilever</option>
            <option>Disk</option>
            <option>V</option>
          </select>
          <br />
          <Form.Label>Wheelsize</Form.Label>
          <Form.Input type="number" value={this.Wheelsize} onChange={e => (this.Wheelsize = e.target.value)} />
          <Form.Label>Bicycle Status</Form.Label> <br />
          <select id="StatusDropdown">
            <option>Available</option>
            <option>In Repair</option>
            <option>In Transport</option>
            <option>Need Repair</option>
            <option>Need Transport</option>
            <option>Rented</option>
          </select>
          <br />
          <Form.Label>Home Location</Form.Label> <br />
          <select id="HomeLocation">
            <option value="9">Finse</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <Form.Label>Daily Price</Form.Label>
          <Form.Input type="number" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
          <Form.Label>Current Location</Form.Label> <br />
          <select id="CurrentLocation">
            <option value="9">Finse</option>
            <option value="10">Flaam</option>
            <option value="11">Voss</option>
            <option value="12">Myrdal</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <Form.Label>Number of bikes to add</Form.Label>
          <Form.Input type="number" id="NumberToAdd" value={this.Add} onChange={e => (this.Add = e.target.value)} />
          <br />
          <NavLink to="/warehouse/bicycles">
            <Button.Success onClick={this.insert}>Add New Bicycle</Button.Success>
          </NavLink>
          <NavLink to="/warehouse/bicycles">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  //Adds the bicycle.
  insert() {
    //Loops the insert command for number of bikes to be added.
    for (let i = 0; i < this.Add; i++) {
      bicycleService.insertBicycle(
        (this.BicycleType = '' + document.getElementById('TypeDropdown').value),
        (this.FrameType = '' + document.getElementById('FrameDropdown').value),
        (this.BrakeType = '' + document.getElementById('BrakeDropdown').value),
        this.Wheelsize,
        (this.BicycleStatus = '' + document.getElementById('StatusDropdown').value),
        (this.HomeLocation = '' + document.getElementById('HomeLocation').value),
        this.DailyPrice,
        (this.CurrentLocation = '' + document.getElementById('CurrentLocation').value),
        () => {
          history.push('/warehouse/bicycles');
        }
      );
    }
  }
}

//Section where you can update several bicyclelocations at once.
class BicycleUpdate extends Component {
  bicycles = [];
  statuses = [];
  locations = [];
  CurrentLocation = '';
  BicycleStatus = '';

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Bicycle List">
          <p>Select the bicycles you want to update</p>
          <List>
            {this.bicycles.map(bicycle => (
              <List.Item key={bicycle.BicycleID}>
                <input type="checkbox" checked={bicycle.checked} onChange={e => (bicycle.checked = e.target.checked)} />
                Bicycle ID: {bicycle.BicycleID} | Bicycle Type: {bicycle.BicycleType} | Status: {bicycle.BicycleStatus}{' '}
                | Current Location: {bicycle.CurrentLocationName}
              </List.Item>
            ))}
          </List>
          <br />
          Select Location:
          <select id="CurrentLocation">
            <option value="9">Finse</option>
            <option value="10">Flaam</option>
            <option value="11">Voss</option>
            <option value="12">Myrdal</option>
            <option value="13">Haugastoel</option>
          </select>{' '}
          Select Status:
          <select id="StatusDropdown" value={this.BicycleStatus} onChange={e => (this.BicycleStatus = e.target.value)}>
            {this.statuses.map(status => (
              <option value={status.BicycleStatus}>{status.BicycleStatus}</option>
            ))}
          </select>
          <br />
          <br />
          <NavLink to="/warehouse/bicycles" onClick={this.save}>
            <Button.Success>Update Bicycle</Button.Success>
          </NavLink>
          <NavLink to="/warehouse/bicycles">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    bicycleService.getBicyclestoUpdate(bicycles => {
      this.bicycles = bicycles;
      for (let bicycle of bicycles) bicycle.checked = false;
    });
    bicycleService.getBicycleStatuses(statuses => {
      this.statuses = statuses;
    });
    rentalService.getPickupLocation(locations => {
      this.locations = locations;
    });
  }

  save() {
    for (let x = 0; x < this.bicycles.length; x++) {
      if (this.bicycles[x].checked == true) {
        bicycleService.updateBicycles(
          this.bicycles[x].BicycleID,
          (this.bicycles[x].BicycleStatus = '' + document.getElementById('StatusDropdown').value),
          (this.bicycles[x].CurrentLocation = '' + document.getElementById('CurrentLocation').value),
          () => {
            history.push('/warehouse/bicycles');
          }
        );
      }
    }
  }
}

//Section where it lists all the accessories. From here you can add/edit accessories.
class AccessoryList extends Component {
  accessories = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Accessory List">
          <NavLink to="/warehouse/accessories/insert">
            <Button.Light>Add New accessory</Button.Light>
          </NavLink>{' '}
          <NavLink to="/warehouse/accessories/exinsert">
            <Button.Light>Add Existing accessory</Button.Light>
          </NavLink>
          <p>Click the accessories to edit or delete them</p>
          <Form.Label>Find Bicycle By:</Form.Label>
          <div id="AccessorySearch">
            <input id="AccessorySearchField" type="text" width="200px" />
            <select id="AccessorySearchCategory">
              <option value="Accessories.AccessoryID">Accessory ID</option>
              <option value="Type">Accessorytype</option>
              <option value="Status">Status</option>
              <option value="AccessoryHomeLocation.HomeLocationName">Homelocation</option>
              <option value="AccessoryCurrentLocation.CurrentLocationName">Current location</option>
            </select>
            <button id="AccessorySearchButton" onClick={this.mounted}>
              Search
            </button>
          </div>
          <List>
            {this.accessories.map(accessory => (
              <List.Item key={accessory.AccessoryID}>
                <NavLink to={'/warehouse/accessories/' + accessory.AccessoryID + '/edit'}>
                  {accessory.Type} | Price: {accessory.DailyPrice}kr per day | Home Location:{' '}
                  {accessory.HomeLocationName} | Current Location: {accessory.CurrentLocationName} | Status{' '}
                  {accessory.Status}
                </NavLink>
              </List.Item>
            ))}
          </List>
          <p id="alert" />
        </Card>
      </div>
    );
  }

  mounted() {
    this.searchCategory = '' + document.getElementById('AccessorySearchCategory').value;
    this.searchValue = '%' + document.getElementById('AccessorySearchField').value + '%';
    accessoryService.searchAccessories(this.searchCategory, this.searchValue, accessories => {
      this.accessories = accessories;
      if (this.accessories.length === 0) {
        document.getElementById('alert').innerHTML = 'There are no accessories in this category.';
      } else {
        document.getElementById('alert').innerHTML = '';
      }
    });
  }
}

//Section where you edit/delete the chosen accessory.
class AccessoryEdit extends Component {
  Type = '';
  DailyPrice = '';
  Status = '';
  HomeLocation = '';
  CurrentLocation = '';
  AccessoryStatuses = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Editing Accessory">
          <List.Item>
            <p>{this.Type}</p>
          </List.Item>
          <Form.Label>Daily Price</Form.Label>
          <Form.Input type="number" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
          <br />
          <Form.Label>Accessory Status</Form.Label>
          <br />
          <select id="StatusDropdown" value={this.Status} onChange={e => (this.Status = e.target.value)}>
            {this.AccessoryStatuses.map(status => (
              <option value={status.Status}>{status.AccessoryStatus}</option>
            ))}
          </select>{' '}
          <br />
          <Form.Label>Home Location</Form.Label> <br />
          <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
            <option value="9">Finse</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <Form.Label>Current Location</Form.Label> <br />
          <select
            id="CurrentLocation"
            value={this.CurrentLocation}
            onChange={e => (this.CurrentLocation = e.target.value)}
          >
            <option value="9">Finse</option>
            <option value="10">Flaam</option>
            <option value="11">Voss</option>
            <option value="12">Myrdal</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <br />
          <NavLink to="/warehouse/accessories">
            <Button.Success onClick={this.save}>Save Changes</Button.Success>
          </NavLink>
          <br />
          <br />
          <NavLink to="/warehouse/accessories">
            <Button.Danger onClick={this.delete}>Delete Accessory</Button.Danger>
          </NavLink>
          <NavLink to="/warehouse/accessories">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    accessoryService.getAccessory(this.props.match.params.id, accessory => {
      this.Type = accessory.Type;
      this.DailyPrice = accessory.DailyPrice;
      this.Status = accessory.Status;
      this.HomeLocation = accessory.HomeLocation;
      this.CurrentLocation = accessory.CurrentLocation;
    });
    accessoryService.getAccessoryStatuses(statuses => {
      this.AccessoryStatuses = statuses;
    });
  }

  //Updates the accessory.
  save() {
    accessoryService.updateAccessory(
      this.props.match.params.id,
      this.DailyPrice,
      (this.AccessoryStatus = '' + document.getElementById('StatusDropdown').value),
      (this.HomeLocation = '' + document.getElementById('HomeLocation').value),
      (this.CurrentLocation = '' + document.getElementById('CurrentLocation').value),
      () => {
        history.push('/warehouse/accessories');
      }
    );
  }

  //Deletes the accessory.
  delete() {
    accessoryService.deleteAccessory(this.props.match.params.id, () => {
      history.push('/warehouse/accessories');
    });
    accessoryService.deleteAccessoryType(this.Type, () => {
      history.push('/warehouse/accessories');
    });
  }
}

//Section where you can add new accessories.
class AccessoryInsert extends Component {
  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Adding New Accessory">
          <Form.Label>Accessory Type</Form.Label>
          <Form.Input type="text" value={this.type} onChange={e => (this.type = e.target.value)} />
          <br />
          <Form.Label>Daily Price</Form.Label>
          <Form.Input type="number" value={this.dailyprice} onChange={e => (this.dailyprice = e.target.value)} />
          <br />
          <Form.Label>Home Location</Form.Label> <br />
          <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
            <option selected={true} disabled={true}>
              Select Location
            </option>
            <option value="9">Finse</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <Form.Label>Current Location</Form.Label> <br />
          <select
            id="CurrentLocation"
            value={this.CurrentLocation}
            onChange={e => (this.CurrentLocation = e.target.value)}
          >
            <option selected={true} disabled={true}>
              Select Location
            </option>
            <option value="9">Finse</option>
            <option value="10">Flaam</option>
            <option value="11">Voss</option>
            <option value="12">Myrdal</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <br />
          <Button.Success onClick={this.insert}>Add New Accessory</Button.Success>
          <NavLink to="/warehouse/accessories">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  //Adds the accessory.
  insert() {
    accessoryService.insertAccessoryType(this.type, () => {
      history.push('/warehouse/accessories/');
    });
    accessoryService.insertAccessoryPrice(this.type, this.dailyprice, this.HomeLocation, this.CurrentLocation, () => {
      history.push('/warehouse/accessories');
    });
  }
}

//Section where you can add new accessories.
class AccessoryInsertEx extends Component {
  AccessoryTypes = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Adding Existing Accessory">
          <Form.Label>Accessory Type</Form.Label>
          <br />
          <select id="TypeDropdown" value={this.AccessoryType} onChange={e => (this.AccessoryType = e.target.value)}>
            {this.AccessoryTypes.map(type => (
              <option value={type.AccessoryType}>{type.AccessoryType}</option>
            ))}
          </select>{' '}
          <br />
          <Form.Label>Daily Price</Form.Label>
          <Form.Input type="number" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
          <br />
          <Form.Label>Current Location</Form.Label> <br />
          <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
            <option selected={true} disabled={true}>
              Select Location
            </option>
            <option value="9">Finse</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <Form.Label>Current Location</Form.Label> <br />
          <select
            id="CurrentLocation"
            value={this.CurrentLocation}
            onChange={e => (this.CurrentLocation = e.target.value)}
          >
            <option selected={true} disabled={true}>
              Select Location
            </option>
            <option value="9">Finse</option>
            <option value="10">Flaam</option>
            <option value="11">Voss</option>
            <option value="12">Myrdal</option>
            <option value="13">Haugastoel</option>
          </select>
          <br />
          <Form.Label>Number to add</Form.Label>
          <Form.Input type="number" id="NumberToAdd" value={this.Add} onChange={e => (this.Add = e.target.value)} />
          <br />
          <NavLink to="/warehouse/accessories">
            <Button.Success onClick={this.insert}>Add Accessory</Button.Success>
          </NavLink>
          <NavLink to="/warehouse/accessories">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    accessoryService.getAccessoryTypes(types => {
      this.AccessoryTypes = types;
    });
  }

  //Adds the accessory.
  insert() {
    //Loops the insert command for number of bikes to be added.
    for (let i = 0; i < this.Add; i++) {
      accessoryService.insertAccessoryPrice(
        (this.AccessoryType = '' + document.getElementById('TypeDropdown').value),
        this.DailyPrice,
        this.HomeLocation,
        this.CurrentLocation,
        () => {
          history.push('/warehouse/accessories');
        }
      );
    }
  }
}

//Section where it lists all bicycles that need transport.
//You can choose location to select bicycles from and location to transport to.
class TransportList extends Component {
  locations = [];
  transportToLocations = [];
  bicycles = [];
  BicycleStatus = '';

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Order Transport From:">
          <p>Select the location you want transport from:</p>
          <select id="LocationDropdown" onChange={this.getBicyclesForTransport}>
            <option selected={true} disabled={true}>
              Select Location
            </option>
            {this.locations.map(location => (
              <option value={location.LocationName}>{location.LocationName}</option>
            ))}
          </select>
          <br />
          <p>Select the Bicycles you want to transport:</p>
          <List>
            {this.bicycles.map(bicycle => (
              <List.Item key={bicycle.BicycleID}>
                ID: {bicycle.BicycleID} Type: {bicycle.BicycleType} Status: {bicycle.BicycleStatus} Home Location:{' '}
                {bicycle.HomeLocation}{' '}
                <input type="checkbox" checked={bicycle.checked} onChange={e => (bicycle.checked = e.target.checked)} />
              </List.Item>
            ))}
          </List>
          <p id="alert" />
          <br />
          <p>Select the location you want transport to:</p>
          <select id="TransportDropdown" value={this.LocationID}>
            <option selected={true} disabled={true}>
              Select Location
            </option>
            {this.transportToLocations.map(location => (
              <option value={location.LocationName}>{location.LocationName}</option>
            ))}
          </select>
          <br />
          <br />
          <br />
          <input type="textarea" placeholder="Add additional comments" id="comment" />
          <br />
          <br />
          <p id="alert" />
          <br />
          <NavLink to="/warehouse/bicycles">
            <Button.Success onClick={this.save}>Submit</Button.Success>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    transportService.getLocations(locations => {
      this.locations = locations;
    });
  }

  //Gets all the bicycles on the chosen location
  getBicyclesForTransport() {
    transportService.getBicyclesForTransport(document.getElementById('LocationDropdown').value, bicycles => {
      this.bicycles = bicycles;
      for (let bicycle of bicycles) bicycle.checked = false;
      if (this.bicycles.length === 0) {
        document.getElementById('alert').innerHTML = 'There are no bicycles in need of transport at this location.';
      } else {
        document.getElementById('alert').innerHTML = '';
      }
    });
    transportService.getTransportToLocation(document.getElementById('LocationDropdown').value, locations => {
      this.transportToLocations = locations;
    });
  }

  //Updates the status on the bicycles set for transport.
  save() {
    let pdf = new jsPDF();
    let pickup = '' + document.getElementById('LocationDropdown').value;
    let drop = '' + document.getElementById('TransportDropdown').value;
    let comment = '\n\nAdditional comments:\n' + document.getElementById('comment').value;

    let input =
      'AS sykkelutleie\n\nTransport confirmation: \n \n' +
      'Pickup Location: ' +
      pickup +
      '\nDelivery Location: ' +
      drop +
      '\n\nBicycles:';
    for (let x = 0; x < this.bicycles.length; x++) {
      if (this.bicycles[x].checked == true) {
        input += '\n- Type: ' + this.bicycles[x].BicycleType + ' ID: ' + this.bicycles[x].BicycleID;
        transportService.saveStatus(this.bicycles[x].BicycleID, () => {
          history.push('/warehouse/bicycles');
        });
      }
    }

    pdf.text(input + comment, 10, 10);
    pdf.save('Transport_order.pdf');
  }
}

class RepairList extends Component {
  bicycles = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card title="Order Repair for:">
          <List>
            {this.bicycles.map(bicycle => (
              <List.Item key={bicycle.BicycleID}>
                <NavLink to={'/warehouse/repair/' + bicycle.BicycleID + '/edit'}>
                  Bicycle Type: {bicycle.BicycleType} | Frametype: {bicycle.FrameType} | Braketype: {bicycle.BrakeType}{' '}
                  | Wheelsize: {bicycle.Wheelsize} | Status: {bicycle.BicycleStatus} | Current Location:{' '}
                  {bicycle.CurrentLocationName}
                </NavLink>
              </List.Item>
            ))}
          </List>
          <NavLink to="/warehouse/repair/summary" />
          <p id="alert" />
        </Card>
      </div>
    );
  }

  mounted() {
    repairService.getBicycles(bicycles => {
      this.bicycles = bicycles;
      if (this.bicycles.length === 0) {
        document.getElementById('alert').innerHTML = 'There are no bicycles in need of repair.';
      } else {
        document.getElementById('alert').innerHTML = '';
      }
    });
  }
}

//Section where you get the detail for the bicycle you want to order repair for.
//Gives you an textarea for additional comments.
class RepairDetails extends Component {
  BicycleType = '';
  FrameType = '';
  BrakeType = '';
  Wheelsize = '';
  BicycleStatus = '';
  HomeLocation = '';
  CurrentLocation = '';

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Warehouse">
          <NavBar.Link to="/warehouse/bicycles">Bicycles</NavBar.Link>
          <NavBar.Link to="/warehouse/accessories">Accessories</NavBar.Link>
          <NavBar.Link to="/warehouse/repair">Order Repair</NavBar.Link>
          <NavBar.Link to="/warehouse/transport">Order Transport</NavBar.Link>
        </NavBar>
        <Card>
          <List>
            Bicycle Type:
            <List.Item>{this.BicycleType}</List.Item>
            Frame Type:
            <List.Item>{this.FrameType}</List.Item>
            Brake Type:
            <List.Item>{this.BrakeType}</List.Item>
            Wheelsize:
            <List.Item>{this.Wheelsize}</List.Item>
            Bicycle Status:
            <List.Item>Current status: {this.BicycleStatus}</List.Item>
          </List>
          <br />
          <input type="textarea" placeholder="Add additional comments" id="comment" />
          <br />
          <br />
          <NavLink to="/warehouse/repair">
            <Button.Success onClick={this.orderRepair}>Order Repair</Button.Success>
          </NavLink>
          <NavLink to="/warehouse/repair">
            <Button.Light>Back</Button.Light>
          </NavLink>
        </Card>
      </div>
    );
  }

  mounted() {
    bicycleService.getBicycle(this.props.match.params.id, bicycle => {
      this.BicycleType = bicycle.BicycleType;
      this.FrameType = bicycle.FrameType;
      this.BrakeType = bicycle.BrakeType;
      this.Wheelsize = bicycle.Wheelsize;
      this.BicycleStatus = bicycle.BicycleStatus;
      this.HomeLocation = bicycle.HomeLocation;
      this.CurrentLocation = bicycle.CurrentLocation;
    });
  }

  //Updates the status on the chosen bicycle to "In Repair", and saves and order confirmation as a PDF.
  orderRepair() {
    repairService.updateStatus(this.props.match.params.id, bicycle => {
      this.FrameType = bicycle.Frametype;
      this.BrakeType = bicycle.Braketype;
      this.Wheelsize = bicycle.Wheelsize;
    });
    var pdf = new jsPDF();

    var comment = '' + document.getElementById('comment').value;
    var type = this.BicycleType;
    var frame = this.FrameType;
    var brake = this.BrakeType;
    var wheel = this.Wheelsize;
    var text =
      'AS SykkelUtleie \n\nRepair confirmation: \n \n' +
      'Bicycle Type: ' +
      type +
      '\nFrametype: ' +
      frame +
      '\nBrake type: ' +
      brake +
      '\nWheel size:' +
      wheel +
      '\n\nExtra comments: ' +
      comment;

    pdf.text(text, 10, 10);
    pdf.save('Repair_order.pdf');
  }
}

//Section where you can see how many rentals the different customers have.
class RentalCountList extends Component {
  Counts = [];

  render() {
    return (
      <div>
        <NavBar brand="Joyride">
          <NavBar.Link to="/sales">Sales</NavBar.Link>
          <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
          <NavBar.Link to="/Employees">Employees</NavBar.Link>
        </NavBar>
        <NavBar brand="Sales">
          <NavBar.Link to="/sales/rentals">Rentals</NavBar.Link>
          <NavBar.Link to="/sales/customers">Customers</NavBar.Link>
          <NavBar.Link to="/sales/count">Rental Count</NavBar.Link>
        </NavBar>
        <Card title="Rental Count for Customers">
          <List>
            {this.Counts.map(count => (
              <List.Item key={count.FirstName}>
                Name: {count.FirstName} {count.SurName} | Rental Count: {count.Orders}
              </List.Item>
            ))}
          </List>
          <NavLink to="/warehouse/repair/summary" />
        </Card>
      </div>
    );
  }
  mounted() {
    rentalService.showCount(count => {
      this.Counts = count;
    });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/sales" component={Sales} />
      <Route exact path="/warehouse" component={Warehouse} />
      <Route exact path="/sales/customers" component={CustomerList} />
      <Route exact path="/employees" component={EmployeeList} />
      <Route exact path="/warehouse/bicycles" component={BicycleList} />
      <Route exact path="/warehouse/accessories" component={AccessoryList} />
      <Route exact path="/warehouse/repair" component={RepairList} />
      <Route exact path="/warehouse/transport" component={TransportList} />
      <Route exact path="/sales/rentals" component={RentalList} />
      <Route exact path="/sales/rentals/ended" component={EndedRentalList} />
      <Route exact path="/warehouse/bicycles/update" component={BicycleUpdate} />
      <Route exact path="/sales/rentals/:id/edit" component={RentalEdit} />
      <Route exact path="/sales/rentals/:id/RemoveFromRental" component={RemoveFromRental} />
      <Route exact path="/sales/customers/:id/edit" component={CustomerEdit} />
      <Route exact path="/employees/:id/edit" component={EmployeeEdit} />
      <Route exact path="/warehouse/bicycles/:id/edit" component={BicycleEdit} />
      <Route exact path="/warehouse/accessories/:id/edit" component={AccessoryEdit} />
      <Route exact path="/sales/rentals/insert" component={RentalInsert} />
      <Route exact path="/sales/rentals/insertcustomer" component={BookingCustomerInsert} />
      <Route exact path="/sales/customers/insert" component={CustomerInsert} />
      <Route exact path="/employees/insert" component={EmployeeInsert} />
      <Route exact path="/warehouse/bicycles/insert" component={BicycleInsert} />
      <Route exact path="/warehouse/accessories/insert" component={AccessoryInsert} />
      <Route exact path="/warehouse/accessories/exinsert" component={AccessoryInsertEx} />
      <Route exact path="/warehouse/repair/:id/edit" component={RepairDetails} />
      <Route exact path="/sales/count" component={RentalCountList} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
