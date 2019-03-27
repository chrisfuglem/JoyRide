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

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Joyride">
        <NavBar.Link to="/sales">Rentals</NavBar.Link>
        <NavBar.Link to="/warehouse">Warehouse</NavBar.Link>
        <NavBar.Link to="/customers">Customers</NavBar.Link>
        <NavBar.Link to="/employees">Employees</NavBar.Link>
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

class Warehouse extends Component {
  render() {
    return (
      <NavBar brand="Warehouse">
        <NavBar.Link to="/bicycles">Bicycles</NavBar.Link>
        <NavBar.Link to="/accessories">Accessories</NavBar.Link>
        <NavBar.Link to="/sales">Rentals</NavBar.Link>
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
        <NavLink to="/sales/insert">
          <Button.Light>Add New Rental</Button.Light>
        </NavLink>
        <p>Click the rentals to edit or delete them</p>
        <List>
          {this.rentals.map(rental => (
            <List.Item key={rental.ID}>
              <NavLink to={'/sales/' + rental.ID + '/edit'}>
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
            <NavLink to="/sales">
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
            <NavLink to="/sales">
              <button onClick={this.removeAccessory.bind(this, accessory.AccessoryID)}>Remove Accessory</button>
            </NavLink>
          </List.Item>
        ))}
        <NavLink to="/sales">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/sales">
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
      history.push('/sales');
    });
  }

  removeAccessory(id) {
    rentalService.removeAccessory(id, this.props.match.params.id, () => {
      history.push('/sales');
    });
  }

  save() {
    rentalService.updateRental(this.props.match.params.id, this.name, this.email, () => {
      history.push('/sales');
    });
  }

  delete() {
    rentalService.deleteRental(this.props.match.params.id, () => {
      history.push('/sales');
    });
  }
}

class RentalInsert extends Component {
  customers = [];
  bicycles = [];
  accessories = [];
  rentedBicycles = [];
  rentedAccessories = [];
  searchCategory = '';

  constructor(props) {
    super(props);
    this.bicycleDropdown = React.createRef();
  }

  render() {
    return (
      <Card title="Adding Rental">
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
        <select>
          {this.customers.map(customer => (
            <option key={customer.CustomerID}>{customer[this.searchCategory]}</option>
          ))}
        </select>
        <br />
        <Form.Label>Start date:</Form.Label>
        <Form.Input type="date" value={this.RentStart} onChange={e => (this.RentStart = e.target.value)} />
        <Form.Label>End date:</Form.Label>
        <Form.Input type="date" value={this.RentEnd} onChange={e => (this.RentEnd = e.target.value)} />
        <br />
        <div>
          <h3>Bicycles</h3>
          <select ref={this.bicycleDropdown}>
            {this.bicycles.map(bicycle => (
              <option key={bicycle.BicycleID}>
                {bicycle.BicycleType} {bicycle.BicycleID}
              </option>
            ))}
          </select>
          <button onClick={this.addBicycle}>Add Bicycle</button>
        </div>
        <div>
          <h3>Accessories</h3>
          <select>
            {this.accessories.map(accessory => (
              <option key={accessory.AccessoryID}>
                {accessory.Type} {accessory.AccessoryID}
              </option>
            ))}
          </select>
          <button>Add Accessory</button>
        </div>
        <br />
        <NavLink to="/sales">
          <Button.Success onClick={this.insert}>Add New Rental</Button.Success>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    this.searchCategory = '' + document.getElementById('CustomerSearchCategory').value;
    this.searchValue = '%' + document.getElementById('CustomerSearchField').value + '%';
    customerService.searchCustomers(this.searchCategory, this.searchValue, customers => {
      this.customers = customers;
    });
    bicycleService.getBicycles(bicycles => {
      this.bicycles = bicycles;
    });
    accessoryService.getAccessories(accessories => {
      this.accessories = accessories;
    });
  }

  addBicycle() {
    this.rentedBicycles.push(this.bicycleDropdown.current.value);
    console.log(this.rentedBicycles);
  }

  insert() {
    rentalService.insertRental(this.name, this.email, this.RentEnd, this.RentEnd, () => {
      history.push('/sales');
    });
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

  render() {
    return (
      <Card title="Bicycle List">
        <p>Click the bicycles to edit or delete them</p>
        <List>
          {this.bicycles.map(bicycle => (
            <List.Item key={bicycle.BicycleID}>
              <NavLink to={'/bicycles/' + bicycle.BicycleID + '/edit'}>
                Bicycle Type: {bicycle.BicycleType} | Frametype: {bicycle.FrameType} | Braketype: {bicycle.BrakeType} |
                Wheelsize: {bicycle.Wheelsize} | Status: {bicycle.BicycleStatus} | Home Location: {bicycle.HomeLocation}{' '}
                | Daily Price: {bicycle.DailyPrice}kr per day | Current Location: {bicycle.CurrentLocation}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/bicycles/insert">
          <Button.Light>Add New Bicycle</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    bicycleService.getBicycles(bicycles => {
      this.bicycles = bicycles;
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

  render() {
    return (
      <Card title="Editing bicycle">
        <Form.Label>Bicycle Type</Form.Label>
        <Form.Input type="text" value={this.BicycleType} onChange={e => (this.BicycleType = e.target.value)} />
        <Form.Label>Frame Type</Form.Label>
        <Form.Input type="text" value={this.FrameType} onChange={e => (this.FrameType = e.target.value)} />
        <Form.Label>Brake Type</Form.Label>
        <Form.Input type="text" value={this.BrakeType} onChange={e => (this.BrakeType = e.target.value)} />
        <Form.Label>Wheelsize</Form.Label>
        <Form.Input type="text" value={this.Wheelsize} onChange={e => (this.Wheelsize = e.target.value)} />
        <Form.Label>Bicycle Status</Form.Label>
        <Form.Input type="text" value={this.BicycleStatus} onChange={e => (this.BicycleStatus = e.target.value)} />
        <Form.Label>Home Location</Form.Label>
        <Form.Input type="text" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)} />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
        <Form.Label>Current Location</Form.Label>
        <Form.Input type="text" value={this.CurrentLocation} onChange={e => (this.CurrentLocation = e.target.value)} />
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
  }

  save() {
    bicycleService.updateBicycle(
      this.props.match.params.id,
      this.BicycleType,
      this.FrameType,
      this.BrakeType,
      this.Wheelsize,
      this.BicycleStatus,
      this.HomeLocation,
      this.DailyPrice,
      this.CurrentLocation,
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
        <Form.Label>Bicycle Type</Form.Label>
        <Form.Input type="text" value={this.BicycleType} onChange={e => (this.BicycleType = e.target.value)} />
        <Form.Label>Frame Type</Form.Label>
        <Form.Input type="text" value={this.FrameType} onChange={e => (this.FrameType = e.target.value)} />
        <Form.Label>Brake Type</Form.Label>
        <Form.Input type="text" value={this.BrakeType} onChange={e => (this.BrakeType = e.target.value)} />
        <Form.Label>Wheelsize</Form.Label>
        <Form.Input type="text" value={this.Wheelsize} onChange={e => (this.Wheelsize = e.target.value)} />
        <Form.Label>Bicycle Status</Form.Label>
        <Form.Input type="text" value={this.BicycleStatus} onChange={e => (this.BicycleStatus = e.target.value)} />
        <Form.Label>Home Location</Form.Label>
        <Form.Input type="text" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)} />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
        <Form.Label>Current Location</Form.Label>
        <Form.Input type="text" value={this.CurrentLocation} onChange={e => (this.CurrentLocation = e.target.value)} />
        <br />
        <NavLink to="/bicycles">
          <Button.Success onClick={this.insert}>Add New Bicycle</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    bicycleService.insertRental(
      this.BicycleType,
      this.FrameType,
      this.BrakeType,
      this.Wheelsize,
      this.BicycleStatus,
      this.HomeLocation,
      this.DailyPrice,
      this.CurrentLocation,
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
                {accessory.Type} | Price: {accessory.DailyPrice}kr per day
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

  render() {
    return (
      <Card title="Editing Accessory">
        <Form.Label>Accessory Type</Form.Label>
        <Form.Input type="text" value={this.Type} onChange={e => (this.Type = e.target.value)} />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
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
    });
  }

  save() {
    accessoryService.updateAccessory(this.props.match.params.id, this.Type, this.DailyPrice, () => {
      history.push('/accessories');
    });
  }

  delete() {
    accessoryService.deleteAccessory(this.props.match.params.id, () => {
      history.push('/accessories');
    });
  }
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
        <Button.Success onClick={this.insert}>Add New Accessory</Button.Success>
      </Card>
    );
  }

  // insert() {
  //   accessoryService.insertAccessoryType(this.type, () => {
  //     history.push('/accessories/');
  //   });
  //   accessoryService.insertAccessoryPrice(this.dailyprice, () => {
  //     history.push('/accessories/');
  //   });
  // }

  insert() {
    accessoryService.insertAccessoryType(this.type, () => {
      history.push('/accessories/insert/' + this.type + '/price/');
    });
  }
}

class AccessoryPriceInsert extends Component {
  render() {
    return (
      <Card title="Setting Accessory Price">
        {this.props.match.params.type} <br />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.dailyprice} onChange={e => (this.dailyprice = e.target.value)} />
        <br />
        <NavLink to="/accessories">
          <Button.Success onClick={this.insert}>Set Accessory Price</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    accessoryService.insertAccessoryPrice(this.props.match.params.type, this.dailyprice, () => {
      history.push('/accessories');
    });
  }
}

class TransportList extends Component {
  locations = [];

  render() {
    return (
      <Card title="Order Transport From:">
        <p>Click the location you want transport from</p>
        <List>
          {this.locations.map(location => (
            <List.Item key={location.LocationID}>
              <NavLink to={'/transport/' + location.LocationID + '/booking/'}>{location.LocationName}</NavLink>
            </List.Item>
          ))}
        </List>
      </Card>
    );
  }

  mounted() {
    transportService.getLocations(locations => {
      this.locations = locations;
    });
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
            <List.Item key={bicycle.BicycleID}>
              <input type="checkbox" value={this.BicycleID} /> Bicycle Type: {bicycle.BicycleType} | Bicycle ID:{' '}
              {bicycle.BicycleID}
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to={'/transport/' + location.LocationID + '/booking/order'}>
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

class TransportOrder extends Component {
  locations = [];

  render() {
    return (
      <Card title="Order Transport To:">
        <p>Click the location you want transport to</p>
        <List>
          {this.locations.map(location => (
            <List.Item key={location.LocationID}>
              <NavLink to={'/transport/' + location.LocationID + '/booking/order/confirm'}>
                {location.LocationName}
              </NavLink>
            </List.Item>
          ))}
        </List>
      </Card>
    );
  }

  mounted() {
    transportService.getLocationsRemove(this.props.match.params.id, locations => {
      this.locations = locations;
    });
  }
}

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
    bicycleService.getBicycles(bicycles => {
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
  BicycleStatuses = [];

  render() {
    return (
      <Card>
        <List>
          Bicycle Type:
          <List.Item>{this.BicycleType}</List.Item>
          Frame Type:
          <List.Item>
            {this.FrameType} <input type="checkbox" value={this.FrameType} />
          </List.Item>
          Brake Type:
          <List.Item>
            {this.BrakeType} <input type="checkbox" value={this.BrakeType} />
          </List.Item>
          Wheelsize:
          <List.Item>
            {this.Wheelsize} <input type="checkbox" value={this.Wheelsize} />
          </List.Item>
          Bicycle Status:
          <List.Item>
            Current status: {this.BicycleStatus}
            <select id="statusDropdown">
              {this.BicycleStatuses.map(status => (
                <option value={status.BicycleStatus}>{status.BicycleStatus}</option>
              ))}
            </select>
          </List.Item>
        </List>
        <br />
        <input type="textarea" placeholder="Add additional comments" />
        <br />
        <br />
        <NavLink to="/bicycles">
          <Button.Success onClick={this.save} onClick={this.orderRepair}>
            Order Repair
          </Button.Success>
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
    console.log(document.getElementById('statusDropdown').value);
  }

  orderRepair() {
    repairService.updateStatus(this.props.match.params.id, bicycle => {
      this.FrameType = bicycle.Frametype;
      this.BrakeType = bicycle.Braketype;
      this.Wheelsize = bicycle.Wheelsize;
      this.BicycleStatus = bicycle.BicycleStatus;
    });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/sales" component={RentalList} />
      <Route exact path="/warehouse" component={Warehouse} />
      <Route exact path="/customers" component={CustomerList} />
      <Route exact path="/employees" component={EmployeeList} />
      <Route exact path="/bicycles" component={BicycleList} />
      <Route exact path="/accessories" component={AccessoryList} />
      <Route exact path="/repair" component={RepairList} />
      <Route exact path="/transport" component={TransportList} />
      <Route exact path="/transport/:id/booking" component={TransportBooking} />
      <Route exact path="/transport/:id/booking/order" component={TransportOrder} />
      <Route path="/sales/:id/edit" component={RentalEdit} />
      <Route path="/customers/:id/edit" component={CustomerEdit} />
      <Route path="/employees/:id/edit" component={EmployeeEdit} />
      <Route path="/bicycles/:id/edit" component={BicycleEdit} />
      <Route path="/accessories/:id/edit" component={AccessoryEdit} />
      <Route path="/sales/insert" component={RentalInsert} />
      <Route path="/customers/insert" component={CustomerInsert} />
      <Route path="/employees/insert" component={EmployeeInsert} />
      <Route path="/bicycles/insert" component={BicycleInsert} />
      <Route exact path="/accessories/insert" component={AccessoryTypeInsert} />
      <Route exact path="/accessories/insert/:type/price" component={AccessoryPriceInsert} />
      <Route path="/repair/:id/edit" component={RepairDetails} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
