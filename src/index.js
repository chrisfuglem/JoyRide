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
  transportService
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
        <p>Click the rentals to edit or delete them</p>
        <List>
          {this.rentals.map(rental => (
            <List.Item key={rental.RentalID}>
              <NavLink to={'/sales/' + rental.RentalID + '/edit'}>
                Order {rental.RentalID} by {rental.FirstName} on {rental.RentalDate}
              </NavLink>
              <br />
              BicycleCount: {rental.BicycleCount} | SUM: {rental.SUM}
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/sales/insert">
          <Button.Light>Add New Rental</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    rentalService.getRentals(rentals => {
      this.rentals = rentals;
      for (let i = 0; i < rentals.length; i++) {
        this.rentals[i].BicycleCount = rentals[i]['COUNT(RentedBicycles.BicycleID)'];
        // Siden datoer fra databasen lagres som et Object må de gjøres om til Strings
        let rentalDate = JSON.stringify(rentals[i].Date);
        rentalDate = rentalDate.slice(1, 11);
        this.rentals[i].RentalDate = rentalDate;
      }
    });
  }
}

class RentalEdit extends Component {
  RentalID = '';
  FirstName = '';
  rentedStuff = [];

  render() {
    return (
      <Card>
        <h3>Rental id {this.props.match.params.id}</h3>
        <h4>Bicycles</h4>
        {this.rentedStuff.map(stuff => (
          <List.Item key={stuff.BicycleID}>
            <p>
              {stuff.BicycleType} #{stuff.BicycleID} - {stuff.DailyPrice}kr per day
            </p>
          </List.Item>
        ))}
        <h4>Accessories</h4>
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
  }

  GetRentedBicycles() {
    rentalService.getRentedStuff(this.props.match.params.id, stuff => {
      this.rentedStuff = stuff;
<<<<<<< HEAD
      console.log("yoooooo");
=======
      console.log(this.rentedStuff);
      console.log(this.rentedStuff[0]);
      console.log(this.rentedStuff[0]['BicycleType']);
>>>>>>> 24e4f02a25bb7db76dc74ae5564c40f36818c456
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
  render() {
    return (
      <Card title="Adding Rental">
        <Form.Label>Firstname:</Form.Label>
        <Form.Input type="text" value={this.name} onChange={e => (this.name = e.target.value)} />
        <Form.Label>Surname:</Form.Label>
        <Form.Input type="text" value={this.email} onChange={e => (this.email = e.target.value)} />
        <Form.Label>Start date:</Form.Label>
        <Form.Input type="text" value={this.RentStart} onChange={e => (this.RentStart = e.target.value)} />
        <Form.Label>End date:</Form.Label>
        <Form.Input type="text" value={this.RentEnd} onChange={e => (this.RentEnd = e.target.value)} />
        <br />
        <NavLink to="/sales">
          <Button.Success onClick={this.insert}>Add New Rental</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    rentalService.insertRental(this.name, this.email, this.RentEnd, this.RendEnd, () => {
      history.push('/sales');
    });
  }
}

class CustomerList extends Component {
  customers = [];
  searchCategory= "";
  searchValue = "";

  render() {
    return (
      <div>
        <p>Click the customers to edit or delete them</p>
        <h3>Search by category</h3>
        <div id="CustromerSearch">
          <input id="CustomerSearchField" type="text"></input>
          <select id="CustomerSearchCategory">
            <option>FirstName</option>
            <option>SurName</option>
            <option>Phone</option>
            <option>Email</option>
            <option>Address</option>
          </select>
          <button id="CustomerSearchButton" onClick={this.mounted}>Search</button>
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
    console.log("Searching...");
    this.searchCategory = "" + document.getElementById("CustomerSearchCategory").value;
    this.searchValue = "%" + document.getElementById("CustomerSearchField").value + "%";
    console.log("category: " + this.searchCategory + " value: " + this.searchValue);
    customerService.searchCustomers(this.searchCategory, this.searchValue, customers => {
      this.customers = customers;
      console.log("Search complete");
      console.log(this.customers);
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
                | Daily Price: {bicycle.DailyPrice} | Current Location: {bicycle.CurrentLocation}
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
                {accessory.Type} {accessory.DailyPrice}
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

class AccessoryInsert extends Component {
  render() {
    return (
      <Card title="Adding Accessory">
        <Form.Label>Accessory Type</Form.Label>
        <Form.Input type="text" value={this.type} onChange={e => (this.type = e.target.value)} />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.dailyprice} onChange={e => (this.dailyprice = e.target.value)} />
        <br />
        <NavLink to="/accessories">
          <Button.Success onClick={this.insert}>Add New Accessory</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    accessoryService.insertAccessory(this.type, this.dailyprice, () => {
      history.push('/accessories');
    });
  }
}

class TransportList extends Component {
  locations = [];
  bicycles = [];

  render() {
    return (
      <Card title="Order Transport From:">
        <p>Click the location you want transport from</p>
        <List>
          {this.locations.map(location => (
            <List.Item key={location.LocationID}>
              {location.LocationName}{' '}
              <input value={location.LocationID} type="checkbox" onClick={this.loadBikeLocation} />
            </List.Item>
          ))}
        </List>
        <br />
        <p>Click the bike you want to transport</p>
        <List>
          {this.bicycles.map(bicycle => (
            <List.Item key={bicycle.BicycleID}>
              Type: {bicycle.BicycleType} ID: {bicycle.BicycleID} <input value={bicycle.BicycleID} type="checkbox" />
            </List.Item>
          ))}
        </List>
        <br />
        <p>Click the location you want transport to</p>
        <List>
          {this.locations.map(location => (
            <List.Item key={location.LocationID}>
              {location.LocationName} <input value={location.LocationID} type="checkbox" />
            </List.Item>
          ))}
        </List>
        <input type="textarea" rows="10" cols="50" placeholder="Add additional comments" />
        <br />
        <br />
        <NavLink to="/transport/booking">
          <Button.Light>Order Transport</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    transportService.getLocations(locations => {
      this.locations = locations;
    });
    bicycleService.getBicycles(bicycles => {
      this.bicycles = bicycles;
    });
  }

  loadBikeLocation() {
    transportService.getBikeLocation(locations, bicycles => {
      this.locations = locations.LocationID;
      this.bicycles = bicycles.BicycleID;
      this.bicycles = bicycles.CurrentLocation;
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
              {bicycle.BicycleType} {bicycle.BicycleID} <input type="checkbox" value={bicycle.BicycleID} />
            </List.Item>
          ))}
        </List>
        <input type="textarea" placeholder="Add comments on repair here" />
        <NavLink to="/repairs/summary">
          <br />
          <br />
          <Button.Light>Order Repair</Button.Light>
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
      <Route path="/sales/:id/edit" component={RentalEdit} />
      <Route path="/customers/:id/edit" component={CustomerEdit} />
      <Route path="/employees/:id/edit" component={EmployeeEdit} />
      <Route path="/bicycles/:id/edit" component={BicycleEdit} />
      <Route path="/accessories/:id/edit" component={AccessoryEdit} />
      <Route path="/sales/insert" component={RentalInsert} />
      <Route path="/customers/insert" component={CustomerInsert} />
      <Route path="/employees/insert" component={EmployeeInsert} />
      <Route path="/bicycles/insert" component={BicycleInsert} />
      <Route path="/accessories/insert" component={AccessoryInsert} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
