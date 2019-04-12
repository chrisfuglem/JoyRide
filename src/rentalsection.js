import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import { rentalService } from './rentalservice';
import { customerService } from './customerservice';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//List all rentals, from here you can add and edit rentals.
export class RentalList extends Component {
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
            <br />
            <br />
            <p>Click the rentals to edit or delete them</p>
            <div id="RentalSearch">
              <input id="RentalSearchField" type="text" width="200px" />
              <select id="RentalSearchCategory">
                <option value="Rentals.RentalID">Rental ID</option>
                <option value="Customers.CustomerID">Customer ID</option>
                <option value="Customers.FirstName">Customer Firstname</option>
                <option value="Customers.SurName">Customer Surname</option>
                <option value="Rentals.RentalStatus">Status</option>
              </select>
              <button id="RentalSearchButton" onClick={this.mounted}>
                Search
              </button>
            </div>
            <br />
            <List>
              {this.rentals.map(rental => (
                <List.Item key={rental.ID}>
                  <NavLink to={'/sales/rentals/' + rental.ID + '/edit'}>
                    Order {rental.ID} by {rental.FirstName} {rental.SurName} on {rental.RentalDate}
                  </NavLink>
                  <br />
                  BicycleCount: {rental.Bicyclecount} | Accessorycount: {rental.Accessorycount} SUM: {rental.SUMwithDiscount} Status:{' '}
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

  export class EndedRentalList extends Component {
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
  export class RentalEdit extends Component {
    rentedBicycles = [];
    rentedAccessories = [];
    rental = '';
    FirstName = '';
    RentStart = '';
    RentEnd = '';
    SUMwithDiscount = '';
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
            <p>Order Sum: {this.SUMwithDiscount}</p>
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
              <Button.Success>Save Changes</Button.Success>
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

        this.SUMwithDiscount = this.rental[0].SUMwithDiscount;
      });
      rentalService.getRentedBicycles(this.props.match.params.id, bicycles => {
        this.rentedBicycles = bicycles;
      });
      rentalService.getRentedAccessories(this.props.match.params.id, accessories => {
        this.rentedAccessories = accessories;
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
  }

  //Section for selecting/deselecting bicycles and accessories.
  export class RemoveFromRental extends Component {
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
    sumStore = 0;
    discountSUM = 0;
    extraSUM = 0;
    discountVariable = 1; // Assign any number from 0 - 1 to apply a discount

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
            <p id="discTag"> </p>
          <select id="discount">
            <option value="" selected={true}>
              No Discount
            </option>
            <option value="0.85">Student</option>
            <option value="0.75">Senior</option>
            <option value="0.8">Family</option>
            <option value="0.875">Friend</option>
            <option value="0.7">Returning Customer</option>
          </select>
          <button onClick={this.addDiscount}>Add discount</button>
          <button onClick={this.returnSum}>Remove discount</button>
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
        this.calculateSum(); // Sum is calculated each time the page reloads
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

    // Sum is calculated from inside mounted() each time the page reloads
    calculateSum() {
      this.sum = 0; // Reset before calculating
      for (let x = 0; x < this.rentedBicycles.length; x++) {
        this.sum += this.rentedBicycles[x].DailyPrice;
      }
      for (let x = 0; x < this.rentedAccessories.length; x++) {
        this.sum += this.rentedAccessories[x].DailyPrice;
      }
      this.sum = Math.round(this.sum);
      this.sumStore = this.sum;
      if (this.rentedBicycles.length > 3) {
        this.discountSUM = Math.round(this.sum * 0.9);
        this.extraSUM = this.sum;
      } else {
        this.discountSUM = this.sum;
        this.extraSUM = this.discountSUM;
    }
    rentalService.updateSUM(this.sum, this.extraSUM, this.props.match.params.id);
  }

  returnSum() {
    if (this.rentedBicycles.length > 3) {
      this.extraSUM = Math.round(this.sum * 0.9);
      document.getElementById('discTag').innerHTML = '';
    } else {
      this.extraSUM = this.sumStore;
      document.getElementById('discTag').innerHTML = '';
    }
    rentalService.updateSUM(this.sum, this.extraSUM, this.props.match.params.id);
  }

  addDiscount() {
    this.discount = '' + document.getElementById('discount').value;
    if (this.discount != '') {
      this.extraSUM = Math.round(this.sum * this.discount);
      document.getElementById('discTag').innerHTML = '<b> With extra discount: ' + this.extraSUM + ' kr</b>';
    } else {
      return;
      }
      rentalService.updateSUM(this.sum, this.extraSUM, this.props.match.params.id);
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
  export class RentalInsert extends Component {
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

  //Section where you can see how many rentals the different customers have.
export class RentalCountList extends Component {
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
