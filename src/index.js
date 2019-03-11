import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { bookingService, customerService, employeeService, bicycleService } from './services';
import { Card, List, Row, Column, NavBar, Button, Form } from './widgets';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Joyride">
        <NavBar.Link to="/sales">Bookings</NavBar.Link>
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
        <NavBar.Link to="/sales">Bookings</NavBar.Link>
      </NavBar>
    );
  }
}

class BookingList extends Component {
  rentals = [];

  render() {
    return (
      <Card title="Booking List">
        <p>Click the bookings to edit or delete them</p>
        <List>
          {this.rentals.map(rental => (
            <List.Item key={rental.RentalID}>
              <NavLink to={'/sales/' + rental.RentalID + '/edit'}>
                Rental ID: {rental.RentalID} | Name: {rental.FirstName} | SUM: {rental.SUM} | BicycleCount:{' '}
                {rental['COUNT(RentedBicycles.BicycleID)']}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/sales/insert">
          <Button.Light>Add New Booking</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    bookingService.getBookings(rentals => {
      this.rentals = rentals;
    });
  }
}

class BookingEdit extends Component {
  name = '';
  email = '';

  render() {
    return (
      <Card title="Editing booking">
        <Form.Label>Firstname</Form.Label>
        <Form.Input type="text" value={this.name} onChange={e => (this.name = e.target.value)} />
        <Form.Label>Surname</Form.Label>
        <Form.Input type="text" value={this.email} onChange={e => (this.email = e.target.value)} />
        <br />
        <NavLink to="/sales">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/sales">
          <Button.Danger onClick={this.delete}>Delete Student</Button.Danger>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    bookingService.getBooking(this.props.match.params.id, customer => {
      this.name = customer.name;
      this.email = customer.email;
    });
  }

  save() {
    bookingService.updateBooking(this.props.match.params.id, this.name, this.email, () => {
      history.push('/sales');
    });
  }

  delete() {
    bookingService.deleteBooking(this.props.match.params.id, () => {
      history.push('/sales');
    });
  }
}

class BookingInsert extends Component {
  render() {
    return (
      <Card title="Adding Booking">
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
          <Button.Success onClick={this.insert}>Add New Booking</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    bookingService.insertBooking(this.name, this.email, this.RentEnd, this.RendEnd, () => {
      history.push('/sales');
    });
  }
}

class CustomerList extends Component {
  customers = [];

  render() {
    return (
      <Card title="Customer List">
        <p>Click the customers to edit or delete them</p>
        <List>
          {this.customers.map(customer => (
            <List.Item key={customer.CustomerID}>
              <NavLink to={'/customers/' + customer.CustomerID + '/edit'}>
                {customer.FirstName} {customer.SurName} | {customer.Email} | {customer.Phone} | {customer.Address}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/customers/insert">
          <Button.Light>Add New Customer</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    customerService.getCustomers(customers => {
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
        <NavLink to="/employees/edit/" />
      </Card>
    );
  }

  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }
}

<<<<<<< HEAD
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
        <NavLink to="/warehouse">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/warehouse">
          <Button.Danger onClick={this.delete}>Delete Customer</Button.Danger>
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

=======
>>>>>>> 8fb34d0c84e902235f0f3403258625a311d04f03
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
                Bicycle ID: {bicycle.BicycleID} | Frametype: {bicycle.FrameType} | Braketype: {bicycle.BrakeType} |
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
  bicycletype = '';
  frametype = '';
  braketype = '';
  wheelsize = '';
  bicyclestatus = '';
  homelocation = '';
  dailyprice = '';
  currentlocation = '';

  render() {
    return (
      <Card title="Editing bicycle">
        <Form.Label>Bicycle Type</Form.Label>
        <Form.Input type="text" value={this.bicycletype} onChange={e => (this.bicycletype = e.target.value)} />
        <Form.Label>Frame Type</Form.Label>
        <Form.Input type="text" value={this.frametype} onChange={e => (this.frametype = e.target.value)} />
        <Form.Label>Brake Type</Form.Label>
        <Form.Input type="text" value={this.braketype} onChange={e => (this.BrakeType = e.target.value)} />
        <Form.Label>Wheelsize</Form.Label>
        <Form.Input type="text" value={this.wheelsize} onChange={e => (this.wheelsize = e.target.value)} />
        <Form.Label>Bicycle Status</Form.Label>
        <Form.Input type="text" value={this.bicyclestatus} onChange={e => (this.bicyclestatus = e.target.value)} />
        <Form.Label>Home Location</Form.Label>
        <Form.Input type="text" value={this.homelocation} onChange={e => (this.homelocation = e.target.value)} />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.dailyprice} onChange={e => (this.dailyprice = e.target.value)} />
        <Form.Label>Current Location</Form.Label>
        <Form.Input type="text" value={this.currentlocation} onChange={e => (this.currentlocation = e.target.value)} />
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
      this.bicycletype = bicycle.bicycletype;
      this.frametype = bicycle.frametype;
      this.braketype = bicycle.braketype;
      this.wheelsize = bicycle.wheelsize;
      this.bicyclestatus = bicycle.bicyclestatus;
      this.homelocation = bicycle.homelocation;
      this.dailyprice = bicycle.dailyprice;
      this.currentlocation = bicycle.currentlocation;
    });
  }

  save() {
    bicycleService.updateBicycle(
      this.props.match.params.id,
      this.bicycletype,
      this.frametype,
      this.braketype,
      this.wheelsize,
      this.bicyclestatus,
      this.homelocation,
      this.dailyprice,
      this.currentlocation,
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
        <Form.Input type="text" value={this.bicycletype} onChange={e => (this.bicycletype = e.target.value)} />
        <Form.Label>Frame Type</Form.Label>
        <Form.Input type="text" value={this.frametype} onChange={e => (this.frametype = e.target.value)} />
        <Form.Label>Brake Type</Form.Label>
        <Form.Input type="text" value={this.braketype} onChange={e => (this.BrakeType = e.target.value)} />
        <Form.Label>Wheelsize</Form.Label>
        <Form.Input type="text" value={this.wheelsize} onChange={e => (this.wheelsize = e.target.value)} />
        <Form.Label>Bicycle Status</Form.Label>
        <Form.Input type="text" value={this.bicyclestatus} onChange={e => (this.bicyclestatus = e.target.value)} />
        <Form.Label>Home Location</Form.Label>
        <Form.Input type="text" value={this.homelocation} onChange={e => (this.homelocation = e.target.value)} />
        <Form.Label>Daily Price</Form.Label>
        <Form.Input type="text" value={this.dailyprice} onChange={e => (this.dailyprice = e.target.value)} />
        <Form.Label>Current Location</Form.Label>
        <Form.Input type="text" value={this.currentlocation} onChange={e => (this.currentlocation = e.target.value)} />
        <br />
        <NavLink to="/bicycles">
          <Button.Success onClick={this.insert}>Add New Bicycle</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    bicycleService.insertBooking(
      this.bicycletype,
      this.frametype,
      this.braketype,
      this.wheelsize,
      this.bicyclestatus,
      this.homelocation,
      this.dailyprice,
      this.currentlocation,
      () => {
        history.push('/bicycles');
      }
    );
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/sales" component={BookingList} />
      <Route exact path="/warehouse" component={Warehouse} />
      <Route exact path="/customers" component={CustomerList} />
      <Route exact path="/employees" component={EmployeeList} />
      <Route path="/sales/:id/edit" component={BookingEdit} />
      <Route path="/customers/:CustomerID/edit" component={CustomerEdit} />
      <Route path="/sales/insert" component={BookingInsert} />
      <Route path="/customers/insert" component={CustomerInsert} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);

ReactDOM.render(
  <HashRouter>
    <div>
      <Warehouse />
      <Route exact path="/" component={Home} />
      <Route exact path="/bicycles" component={BicycleList} />
      <Route exact path="/accessories" component={AccessoriesList} />
      <Route exact path="/employees" component={EmployeeList} />
      <Route path="/bicycles/:BicycleID/edit" component={BicycleEdit} />
      <Route path="/accessories/:id/edit" component={AccessoriesEdit} />
      <Route path="/employees/:id/edit" component={EmployeesEdit} />
      <Route path="/bicycles/insert" component={BicycleInsert} />
      <Route path="/accessories/insert" component={AccessoriesInsert} />
      <Route path="/employees/insert" component={EmployeesInsert} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
