import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import {
  rentalService,
  customerService,
  employeeService,
  bicycleService,
  accessoryService,
  transportService,
  repairService
} from './services';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Joyride">
        <NavBar.Link to="/sales">Sales</NavBar.Link>
        <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <Card title="Welcome to Joyride">Navigate using the buttons above</Card>
      </div>
    );
  }
}

class Sales extends Component {
  render() {
    return (
      <NavBar brand="Sales">
        <NavBar.Link to="rentals">Rentals</NavBar.Link>
        <NavBar.Link to="customers">Customers</NavBar.Link>
        <NavBar.Link to="employees">Employees</NavBar.Link>
        <NavBar.Link to="bicycles">Bicycles</NavBar.Link>
        <NavBar.Link to="count">Rental Count</NavBar.Link>
      </NavBar>
    );
  }
}

class Warehouse extends Component {
  render() {
    return (
      <NavBar brand="Warehouse">
        <NavBar.Link to="/bicycles">Bicycles</NavBar.Link>
        <NavBar.Link to="/accessories">Accessories</NavBar.Link>
        <NavBar.Link to="/rentals">Rentals</NavBar.Link>
        <NavBar.Link to="/repair">Order Repair</NavBar.Link>
        <NavBar.Link to="/transport">Order Transport</NavBar.Link>
      </NavBar>
    );
  }
}

class RentalList extends Component {
  rentals = [];

  render() {
    return (
      <Card title="Rental List">
        <NavLink to="/rentals/insert">
          <Button.Light>Add New Rental</Button.Light>
        </NavLink>
        <p>Click the rentals to edit or delete them</p>
        <List>
          {this.rentals.map(rental => (
            <List.Item key={rental.ID}>
              <NavLink to={'/rentals/' + rental.ID + '/edit'}>
                Order {rental.ID} by {rental.FirstName} on {rental.RentalDate}
              </NavLink>
              <br />
              BicycleCount: {rental.Bicyclecount} | Accessorycount: {rental.Accessorycount} SUM: {rental.SUM}
            </List.Item>
          ))}
        </List>
        <br />
      </Card>
    );
  }

  mounted() {
    rentalService.getRentals(rentals => {
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

class RentalEdit extends Component {
  rentedBicycles = [];
  rentedAccessories = [];

  render() {
    return (
      <Card>
        <h3>Rental id {this.props.match.params.id}</h3>
        <h4>Bicycles</h4>
        {this.rentedBicycles.map(bicycle => (
          <List.Item key={bicycle.BicycleID}>
            <p>
              {bicycle.BicycleType} Bicycle id #{bicycle.BicycleID} | {bicycle.DailyPrice}kr per day
            </p>
            <NavLink to="/rentals">
              <button onClick={this.removeBicycle.bind(this, bicycle.BicycleID)}>Remove Bicycle</button>
            </NavLink>
          </List.Item>
        ))}
        <h4>Accessories</h4>
        {this.rentedAccessories.map(accessory => (
          <List.Item key={accessory.AccessoryID}>
            <p>
              {accessory.Type} Accessory id #{accessory.AccessoryID} | {accessory.DailyPrice}kr per day
            </p>
            <NavLink to="/rentals">
              <button onClick={this.removeAccessory.bind(this, accessory.AccessoryID)}>Remove Accessory</button>
            </NavLink>
          </List.Item>
        ))}
        <NavLink to="/rentals">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/rentals">
          <Button.Danger onClick={this.delete}>Cancel Rental</Button.Danger>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    rentalService.getRentedBicycles(this.props.match.params.id, bicycles => {
      this.rentedBicycles = bicycles;
      console.log(this.rentedBicycles);
    });
    rentalService.getRentedAccessories(this.props.match.params.id, accessories => {
      this.rentedAccessories = accessories;
      console.log(this.rentedAccessories);
    });
  }

  removeBicycle(id) {
    rentalService.removeBicycle(id, this.props.match.params.id, () => {
      history.push('/rentals');
    });
  }

  removeAccessory(id) {
    rentalService.removeAccessory(id, this.props.match.params.id, () => {
      history.push('/rentals');
    });
  }

  save() {
    rentalService.updateRental(this.props.match.params.id, this.name, this.email, () => {
      history.push('/rentals');
    });
  }

  delete() {
    rentalService.deleteRental(this.props.match.params.id, () => {
      history.push('/rentals');
    });
  }
}

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

  constructor(props) {
    super(props);
    this.customerDropdown = React.createRef();
    this.bicycleDropdown = React.createRef();
    this.accessoryDropdown = React.createRef();
    this.locationDropdown = React.createRef();
  }

  render() {
    return (
      <Card title="Adding Rental">
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
        <Form.Label>Find Customer By:</Form.Label>
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
        <Form.Label>Start date:</Form.Label>
        <Form.Input type="date" value={this.RentStart} onChange={e => (this.RentStart = e.target.value)} />
        <Form.Label>End date:</Form.Label>
        <Form.Input type="date" value={this.RentEnd} onChange={e => (this.RentEnd = e.target.value)} />
        <br />
        <div>
          <h4>Available Bicycles</h4>
          <select ref={this.bicycleDropdown}>
            {this.bicycleDropdownOptions.map(bicycle => (
              <option value={bicycle.Type}>
                {bicycle.Type} - {bicycle.TypeCount} Available
              </option>
            ))}
          </select>
          <button onClick={this.addBicycle}>Add Bicycle</button>
          {this.rentedBicycles.map(bicycle => (
            <List.Item>
              {bicycle.Type} <button onClick={this.removeBicycle.bind(this, bicycle.Type)}>Remove Bicycle</button>
            </List.Item>
          ))}
        </div>
        <div>
          <h4>Available Accessories</h4>
          <select ref={this.accessoryDropdown}>
            {this.accessoryDropdownOptions.map(accessory => (
              <option key={accessory.AccessoryID} value={accessory.accessoryType}>
                {accessory.accessoryType} - {accessory.TypeCount} Available
              </option>
            ))}
          </select>
          <button onClick={this.addAccessory}>Add Accessory</button>
          {this.rentedAccessories.map(accessory => (
            <List.Item>
              {accessory.accessoryType} <button onClick={this.removeAccessory.bind(this, accessory.accessoryType)}>Remove Accessory</button>
            </List.Item>
          ))}
        </div>
        <br />
        <Button.Success onClick={this.insert}>Add New Rental</Button.Success>
      </Card>
    );
  }

  mounted() {
    this.searchCategory = '' + document.getElementById('CustomerSearchCategory').value;
    this.searchValue = '%' + document.getElementById('CustomerSearchField').value + '%';
    customerService.searchCustomers(this.searchCategory, this.searchValue, customers => {
      this.customers = customers;
    });
    rentalService.getAvailableBicycles(bicycles => {
      this.bicycles = bicycles;
    });
    rentalService.getAvailableBicyclesByType(bicycles => {
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
    rentalService.getAvailableAccessoriesByType(accessories => {
      this.availableAccessoriesCount = accessories;
      for (let x = 0; x < this.availableAccessoriesCount.length; x++) {
        if (this.availableAccessoriesCount[x].TypeCount > 0) {
          this.accessoryDropdownOptions.push(this.availableAccessoriesCount[x]);
        }
      }
      console.log(this.accessoryDropdownOptions);
    });
    transportService.getLocations(locations => {
      this.locations = locations;
    });
  }

  addBicycle() {
    for (let x = 0; x < this.bicycleDropdownOptions.length; x++) {
      if (this.bicycleDropdownOptions[x].Type == this.bicycleDropdown.current.value) {
        if (this.bicycleDropdownOptions[x].TypeCount > 0) {
          this.rentedBicycles.push(this.bicycleDropdownOptions[x]);
          this.bicycleDropdownOptions[x].TypeCount--;
          break;
        }
      }
    }
    console.log(this.rentedBicycles);
  }

  removeBicycle(type) {
    for (let x = 0; x < this.rentedBicycles.length; x++) {
      if (this.rentedBicycles[x].Type == type) {
        for (let xx = 0; xx < this.bicycleDropdownOptions.length; xx++) {
          if (this.bicycleDropdownOptions[xx].Type == this.rentedBicycles[x].Type) {
              this.bicycleDropdownOptions[xx].TypeCount++;
          }
        }
        this.rentedBicycles.splice(x, 1); //Deletes the first bike with a matching Type
        console.log(this.rentedBicycles);
        break;
      }
    }
  }

  addAccessory() {
    for (let x = 0; x < this.accessoryDropdownOptions.length; x++) {
      if (this.accessoryDropdownOptions[x].accessoryType == this.accessoryDropdown.current.value) {
        if (this.accessoryDropdownOptions[x].TypeCount > 0) {
          this.rentedAccessories.push(this.accessoryDropdownOptions[x]);
          this.accessoryDropdownOptions[x].TypeCount--;
          break;
        }
      }
    }
    console.log(this.rentedAccessories);
  }

  removeAccessory(type) {
    for (let x = 0; x < this.rentedAccessories.length; x++) {
      if (this.rentedAccessories[x].accessoryType == type) {
        for (let xx = 0; xx < this.accessoryDropdownOptions.length; xx++) {
          if (this.accessoryDropdownOptions[xx].accessoryType == this.rentedAccessories[x].accessoryType) {
              this.accessoryDropdownOptions[xx].TypeCount++;
          }
        }
        this.rentedAccessories.splice(x, 1); //Deletes the first bike with a matching Type
        console.log(this.rentedAccessories);
        break;
      }
    }
  }

  insert() {
    console.log("Location: " + this.locationDropdown.current.value);
    console.log("CustomerID: " + this.customerDropdown.current.value);
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    if (month <= 9) {
      month = '0' + month;
    }
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let today = year + '-' + month + '-' + day;
    console.log('Date: ' + today);
    console.log('RentStart: ' + this.RentStart);
    console.log('RentEnd: ' + this.RentEnd);
    console.log('SUM: ');

    console.log(this.rentedBicycles);
    console.log(this.rentedAccessories);
    // name, date, rentstart, rentend, sum, pickuplocation, discountsum
    rentalService.insertRental(
      this.customerDropdown.current.value,
      today,
      this.RentStart,
      this.RentEnd,
      1000,
      this.locationDropdown.current.value,
      800,
      () => {
        history.push('/rentals');
      }
    );
  }
}

class CustomerList extends Component {
  customers = [];
  searchCategory = '';
  searchValue = '';

  render() {
    return (
      <div>
        <p>Click the customers to edit or delete them</p>
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
              <NavLink to={'/customers/' + customer.CustomerID + '/edit'}>
                {customer.FirstName} {customer.SurName} | tlf {customer.Phone}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/customers/insert">
          <Button.Light>Add New Customer</Button.Light>
        </NavLink>
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

class CustomerEdit extends Component {
  FirstName = '';
  SurName = '';
  Email = '';
  Phone = '';
  Address = '';

  render() {
    return (
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
        <NavLink to="/customers">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/customers">
          <Button.Danger onClick={this.delete}>Delete Customer</Button.Danger>
        </NavLink>
      </Card>
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

  save() {
    customerService.updateCustomer(
      this.props.match.params.id,
      this.FirstName,
      this.SurName,
      this.Email,
      this.Phone,
      this.Address,
      () => {
        history.push('/customers');
      }
    );
  }

  delete() {
    customerService.deleteCustomer(this.props.match.params.id, () => {
      history.push('/customers');
    });
  }
}

class CustomerInsert extends Component {
  render() {
    return (
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
        <NavLink to="/customers">
          <Button.Success onClick={this.insert}>Add New Customer</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    customerService.insertCustomer(this.FirstName, this.SurName, this.Email, this.Phone, this.Address, () => {
      history.push('/customers');
    });
  }
}

class EmployeeList extends Component {
  // employees = '';
  // searchCategory = '';
  // searchValue = '';
  //
  // render() {
  //   return (
  //     <div>
  //       <p>Click the employees to edit or delete them</p>
  //       <h3>Search by category</h3>
  //       <div id="EmployeeSearch">
  //         <input id="EmployeeSearchField" type="text" />
  //         <select id="EmployeeSearchCategory">
  //           <option>Firstname</option>
  //           <option>Surname</option>
  //         </select>
  //         <button id="EmployeeSearchButton" onClick={this.mounted}>
  //           Search
  //         </button>
  //       </div>
  //       <List>
  //         {this.employees.map(employee => (
  //           <List.Item key={employee.EmployeeID}>
  //             <NavLink to={'/employees/' + employee.EmployeeID + '/edit'}>
  //               {employee.Firstname} {employee.Surname}
  //             </NavLink>
  //           </List.Item>
  //         ))}
  //       </List>
  //       <br />
  //       <NavLink to="/employees/insert/">
  //         <Button.Light>Add New Employee</Button.Light>
  //       </NavLink>
  //     </div>
  //   );
  // }
  //
  // mounted() {
  //   this.searchCategory = '' + document.getElementById('EmployeeSearchCategory').value;
  //   this.searchValue = '%' + document.getElementById('EmployeeSearchField').value + '%';
  //   employeeService.searchEmployee(this.searchCategory, this.searchValue, employees => {
  //     this.employees = employees;
  //   });
  // }

  employees = [];

  render() {
    return (
      <Card title="Employee List">
        <List>
          {this.employees.map(employee => (
            <List.Item key={employee.EmployeeID}>
              <NavLink to={'/employees/' + employee.EmployeeID + '/edit'}>
                {employee.Firstname} {employee.Surname}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/employees/insert/">
          <Button.Light>Add New Employee</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }
}

class EmployeeEdit extends Component {
  Firstname = '';
  Surname = '';

  render() {
    return (
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
      </Card>
    );
  }

  mounted() {
    employeeService.getEmployee(this.props.match.params.id, employee => {
      this.Firstname = employee.Firstname;
      this.Surname = employee.Surname;
    });
  }

  save() {
    employeeService.updateEmployee(this.props.match.params.id, this.Firstname, this.Surname, () => {
      history.push('/employees');
    });
  }

  delete() {
    employeeService.deleteEmployee(this.props.match.params.id, () => {
      history.push('/employees');
    });
  }
}

class EmployeeInsert extends Component {
  render() {
    return (
      <Card title="Adding Employee">
        <Form.Label>Firstname:</Form.Label>
        <Form.Input type="text" value={this.Firstname} onChange={e => (this.Firstname = e.target.value)} />
        <Form.Label>Surname:</Form.Label>
        <Form.Input type="text" value={this.Surname} onChange={e => (this.Surname = e.target.value)} />
        <br />
        <NavLink to="/employees">
          <Button.Success onClick={this.insert}>Add New Employee</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    employeeService.insertEmployee(this.Firstname, this.Surname, () => {
      history.push('/employees');
    });
  }
}

class BicycleList extends Component {
  bicycles = [];
  home = [];

  render() {
    return (
      <Card title="Bicycle List">
        <p>Click the bicycles to edit or delete them</p>
        <NavLink to="/bicycles/insert">
          <Button.Light>Add New Bicycle</Button.Light>
        </NavLink>
        <NavLink to="/bicycles/update">
          <Button.Light>Update Bicycles</Button.Light>
        </NavLink>
        <List>
          {this.bicycles.map(bicycle => (
            <List.Item key={bicycle.BicycleID}>
              <NavLink to={'/bicycles/' + bicycle.BicycleID + '/edit'}>
                Bicycle Type: {bicycle.BicycleType} | Frametype: {bicycle.FrameType} | Braketype: {bicycle.BrakeType} |
                Wheelsize: {bicycle.Wheelsize} | Status: {bicycle.BicycleStatus} | Home Location: {bicycle.HomeLocationName}{' '}
                | Daily Price: {bicycle.DailyPrice}kr per day | Current Location: {bicycle.CurrentLocationName}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
      </Card>
    );
  }

  mounted() {
    bicycleService.getBicycles(bicycles => {
      this.bicycles = bicycles;
    });
    bicycleService.getBicyclesHome(homes => {
      this.homes = homes;
    });
  }
}

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
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
        </select>
        <br />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
        <Form.Label>Current Location</Form.Label> <br />
        <select
          id="CurrentLocation"
          value={this.CurrentLocation}
          onChange={e => (this.CurrentLocation = e.target.value)}
        >
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
        </select>
        <br />
        <br />
        <NavLink to="/bicycles">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/bicycles">
          <Button.Danger onClick={this.delete}>Delete Bicycle</Button.Danger>
        </NavLink>
      </Card>
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
        history.push('/bicycles');
      }
    );
  }

  delete() {
    bicycleService.deleteBicycle(this.props.match.params.id, () => {
      history.push('/bicycles');
    });
  }
}

class BicycleInsert extends Component {
  render() {
    return (
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
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
        </select>
        <br />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
        <Form.Label>Current Location</Form.Label> <br />
        <select id="CurrentLocation">
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
        </select>
        <br />
        <br />
        <NavLink to="/bicycles">
          <Button.Success onClick={this.insert}>Add New Bicycle</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
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
        history.push('/bicycles');
      }
    );
  }
}

class BicycleUpdate extends Component {
  bicycles = [];
  BicycleStatus = "";
  CurrentLocation = "";
  BicycleID = [];
  statuses = [];
  locations = [];

  render() {
    return (
      <Card title="Bicycle List">
        <p>Select the bicycles you want to update</p>
        <List>
          {this.bicycles.map(bicycle => (
            <List.Item key={bicycle.BicycleID}>
              <input type="checkbox" checked={bicycle.checked} onChange = {e => bicycle.checked = e.target.checked}/>
              Bicycle ID: {bicycle.BicycleID} | Bicycle Type: {bicycle.BicycleType} | Status: {bicycle.BicycleStatus} |
              Current Location: {bicycle.CurrentLocationName}
            </List.Item>
          ))}
        </List>
        <br />
        Select status:
        <select id="selectstatus">
          {this.statuses.map(status => (
            <option value={status.BicycleStatus}>{status.BicycleStatus}</option>
          ))}
        </select>{' '}
        Select Location:
        <select id="selectlocation">
          {this.locations.map(location => (
            <option value={location.LocationID}>{location.LocationName}</option>
          ))}
        </select>
        <br />
        <br />
        <NavLink to="/bicycles/update" onClick={this.save}>
          <Button.Success>Update Bicycle</Button.Success>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    bicycleService.getBicyclestoUpdate(bicycles => {
      this.bicycles = bicycles;
      for (let bicycle of bicycles) bicycle.checked = false;
    });
    bicycleService.getBicycleStatuses(statuses => {
      this.statuses = statuses;
    })
    rentalService.getPickupLocation(locations => {
      this.locations = locations;
    })
  }

  save() {
    console.log(this.bicycles);

    bicycleService.updateBicycles(
      (this.BicycleStatus = document.getElementById('selectstatus').value),
      (this.CurrentLocation = document.getElementById('selectlocation').value),
      (this.BicycleID = this.BicycleID),
      () => {
        history.push('/bicycles');
      }
    );
  }
}

class AccessoryList extends Component {
  accessories = [];

  render() {
    return (
      <Card title="Accessory List">
        <p>Click the accessories to edit or delete them</p>
        <List>
          {this.accessories.map(accessory => (
            <List.Item key={accessory.AccessoryID}>
              <NavLink to={'/accessories/' + accessory.AccessoryID + '/edit'}>
                {accessory.Type} | Price: {accessory.DailyPrice}kr per day | Home Location: {accessory.LocationName} |{' '}
                Current Location: {accessory.LocationName}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/accessories/insert">
          <Button.Light>Add New accessory</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    accessoryService.getAccessories(accessories => {
      this.accessories = accessories;
    });
  }
}

class AccessoryEdit extends Component {
  Type = '';
  DailyPrice = '';
  HomeLocation = '';
  CurrentLocation = '';

  render() {
    return (
      <Card title="Editing Accessory">
        <List.Item>
          <p>{this.Type}</p>
        </List.Item>
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
        <br />
        <Form.Label>Current Location</Form.Label> <br />
        <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
        </select>
        <br />
        <Form.Label>Current Location</Form.Label> <br />
        <select
          id="CurrentLocation"
          value={this.CurrentLocation}
          onChange={e => (this.CurrentLocation = e.target.value)}
        >
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
        </select>
        <br />
        <br />
        <NavLink to="/accessories">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/accessories">
          <Button.Danger onClick={this.delete}>Delete Accessory</Button.Danger>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    accessoryService.getAccessory(this.props.match.params.id, accessory => {
      this.Type = accessory.Type;
      this.DailyPrice = accessory.DailyPrice;
      this.HomeLocation = accessory.HomeLocation;
      this.CurrentLocation = accessory.CurrentLocation;
    });
  }

  save() {
    accessoryService.updateAccessory(
      this.props.match.params.id,
      this.DailyPrice,
      (this.HomeLocation = '' + document.getElementById('HomeLocation').value),
      (this.CurrentLocation = '' + document.getElementById('CurrentLocation').value),
      () => {
        history.push('/accessories');
      }
    );
  }

  delete() {
    accessoryService.deleteAccessory(this.props.match.params.id, () => {
      history.push('/accessories');
    });
    accessoryService.deleteAccessoryType(this.Type, () => {
      history.push('/accessories');
    });
  }

  deleteType() {}
}

class AccessoryTypeInsert extends Component {
  render() {
    return (
      <Card title="Adding Accessory">
        <Form.Label>Accessory Type</Form.Label>
        <Form.Input type="text" value={this.type} onChange={e => (this.type = e.target.value)} />
        <br />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.dailyprice} onChange={e => (this.dailyprice = e.target.value)} />
        <br />
        <Form.Label>Current Location</Form.Label> <br />
        <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
        </select>
        <br />
        <Form.Label>Current Location</Form.Label> <br />
        <select
          id="CurrentLocation"
          value={this.CurrentLocation}
          onChange={e => (this.CurrentLocation = e.target.value)}
        >
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
        </select>
        <br />
        <br />
        <Button.Success onClick={this.insert}>Add New Accessory</Button.Success>
      </Card>
    );
  }

  insert() {
    accessoryService.insertAccessoryType(this.type, () => {
      history.push('/accessories/');
    });
    accessoryService.insertAccessoryPrice(this.type, this.dailyprice, this.HomeLocation, this.CurrentLocation, () => {
      history.push('/accessories');
    });
  }
}

class TransportList extends Component {
  HomeLocation = "";
  locations = [];
  bicycles = [];

  render() {
    return (
      <Card title="Order Transport From:">
        <p>Select the location you want transport from</p>
        <select id="LocationDropdown" value={this.LocationID} onChange={this.getBicycles}>
        <option selected={true} disabled="disabled">Select Location</option>
        <option value="9">Finse</option>
        <option value="10">Flaam</option>
        <option value="11">Voss</option>
        <option value="12">Myrdal</option>
        <option value="13">Haugastøl</option>
        </select>
        <br />
        <p>Select the Bicycles you want to transport</p>
        <List>
          {this.bicycles.map(bicycle => (
            <List.Item key={bicycle.BicycleID}>ID: {bicycle.BicycleID} Type: {bicycle.BicycleType} Status: {bicycle.BicycleStatus} <input type="checkbox" value={this.BicycleID}></input></List.Item>
          ))}
        </List>
        <br />
        <select id="TransportDropdown" value={this.LocationID}>
        {this.locations.map(location => (
          <option value={location.LocationID}>{location.LocationName}</option>
        ))}
        </select>
        <br />
        <br />
        <Button.Success onClick={this.save}>Submit</Button.Success>
      </Card>
    );
  }

  mounted() {
    transportService.getLocations(locations => {
      this.locations = locations;
    });
  }

  getBicycles() {
    transportService.getBicycles(document.getElementById("LocationDropdown").value, bicycles => {
      this.bicycles = bicycles;
    });
    transportService.getTransportToLocation(document.getElementById("LocationDropdown").value, locations => {
      this.locations = locations;
    });
      }

  save() {
    transportService.saveStatus(this.props.match.params.id, bicycles, locations => {
      this.locations = locations;
      this.bicycles = bicycles;
    })
    var pdf = new jsPDF();
    var pickup = '' + document.getElementById('LocationDropdown').value;
    var drop = '' + document.getElementById('TransportDropdown').value

    var text =
      'Transport confirmation: \n \n' + 'Pickup Location: ' + pickup + '\nDelivery Location: ' + drop;

    pdf.text(text, 10, 10);
    pdf.save('Transport_order.pdf');
  }
}

class TransportBooking extends Component {
  bicycles = [];

  render() {
    return (
      <Card title="Bicycle List">
        <p>Choose Bicycles For Transport</p>
        <List>
          {this.bicycles.map(bicycle => (
            <List.Item key={bicycle.LocationID}>
              <input type="checkbox" value={this.CurrentLocation} /> Bicycle Type: {bicycle.BicycleType} | Bicycle ID:{' '}
              {bicycle.BicycleID}
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to={'/transport/' + this.props.match.params.id + '/booking/order'}>
          <Button.Light>Choose Delivery Location</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    transportService.getBicycles(this.props.match.params.id, bicycles => {
      this.bicycles = bicycles;
    });
  }
}

// class TransportOrder extends Component {
//   locations = [];

//   render() {
//     return (
//       <Card title="Order Transport To:">
//         <p>Click the location you want transport to</p>
//         <List>
//           {this.locations.map(location => (
//             <List.Item key={location.LocationID}>
//               <NavLink to={'/transport/' + location.LocationID + '/booking/order/confirm'}>
//                 {location.LocationName}
//               </NavLink>
//             </List.Item>
//           ))}
//         </List>
//       </Card>
//     );
//   }

//   mounted() {
//     transportService.getLocationsRemove(this.props.match.params.id, locations => {
//       this.locations = locations;
//     });
//   }
// }

class RepairList extends Component {
  bicycles = [];

  render() {
    return (
      <Card title="Order Repair for:">
        <List>
          {this.bicycles.map(bicycle => (
            <List.Item key={bicycle.BicycleID}>
              <NavLink to={'/repair/' + bicycle.BicycleID + '/edit'}>
                Bicycle Type: {bicycle.BicycleType} | Frametype: {bicycle.FrameType} | Braketype: {bicycle.BrakeType} |
                Wheelsize: {bicycle.Wheelsize} | Status: {bicycle.BicycleStatus} | Current Location:{' '}
                {bicycle.CurrentLocation}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <NavLink to="/repair/summary" />
      </Card>
    );
  }

  mounted() {
    repairService.getBicycles(bicycles => {
      this.bicycles = bicycles;
    });
  }
}

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
        <NavLink to="/bicycles">
          <Button.Success onClick={this.orderRepair}>Order Repair</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/bicycles" />
      </Card>
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
    bicycleService.getBicycleStatuses(statuses => {
      this.BicycleStatuses = statuses;
    });
  }

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
      'Repair confirmation: \n \n' +
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

  // repairPDF() {
  //   var pdf = new jsPDF();
  //
  //   var comment = '' + document.getElementById('comment').value;
  //   var frame = '' + document.getElementById('frame').value;
  //   var brake = '' + document.getElementById('brake').value;
  //   var wheel = '' + document.getElementById('wheel').value;;
  //   var text =
  //     'Repair confirmation: \n \n' +
  //     'Frametype: ' +
  //     frame +
  //     '\nBrake type: ' +
  //     brake +
  //     '\nWheel size:' +
  //     wheel +
  //     '\n\nExtra comments: ' +
  //     comment;
  //
  //   pdf.text(text, 10, 10);
  //   pdf.save('Repair_order.pdf');
  // }
}

class RentalCountList extends Component {
  Counts = [];

  render() {
    return (
      <Card title="Rental Count for Customers">
        <List>
          {this.Counts.map(count => (
            <List.Item key={count.FirstName}>
              Name: {count.FirstName} {count.SurName} Rental Count: {count.Orders}
            </List.Item>
          ))}
        </List>
        <NavLink to="/repair/summary" />
      </Card>
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
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/sales" component={Sales} />
      <Route exact path="/warehouse" component={Warehouse} />
      <Route exact path="/customers" component={CustomerList} />
      <Route exact path="/employees" component={EmployeeList} />
      <Route exact path="/bicycles" component={BicycleList} />
      <Route exact path="/accessories" component={AccessoryList} />
      <Route exact path="/repair" component={RepairList} />
      <Route exact path="/transport" component={TransportList} />
      <Route exact path="/transport/:id/booking" component={TransportBooking} />
      <Route exact path="/rentals" component={RentalList} />
      <Route exact path="/bicycles/update" component={BicycleUpdate} />
      <Route path="/rentals/:id/edit" component={RentalEdit} />
      <Route path="/customers/:id/edit" component={CustomerEdit} />
      <Route path="/employees/:id/edit" component={EmployeeEdit} />
      <Route path="/bicycles/:id/edit" component={BicycleEdit} />
      <Route path="/accessories/:id/edit" component={AccessoryEdit} />
      <Route path="/rentals/insert" component={RentalInsert} />
      <Route path="/customers/insert" component={CustomerInsert} />
      <Route path="/employees/insert" component={EmployeeInsert} />
      <Route path="/bicycles/insert" component={BicycleInsert} />
      <Route exact path="/accessories/insert" component={AccessoryTypeInsert} />
      <Route path="/repair/:id/edit" component={RepairDetails} />
      <Route path="/count" component={RentalCountList} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
