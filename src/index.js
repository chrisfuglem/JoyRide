import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { bookingService, customerService, employeeService } from './services';
import { Card, List, Row, Column, NavBar, Button, Form } from './widgets';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Joyride">
        <NavBar.Link to="/sales">Sales</NavBar.Link>
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
                Rental ID: {rental.RentalID} | Name: {rental.FirstName} | SUM: {rental.SUM} | BicycleCount: {rental["COUNT(RentedBicycles.BicycleID)"]}
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
      <Card title="Editing student">
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
    bookingService.getBooking(this.props.match.params.id, student => {
      this.name = student.name;
      this.email = student.email;
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
            <List.Item key={customer.id}>
              <NavLink to={'/warehouse/' + customer.id + '/edit'}>
                {customer.FirstName} | {customer.SurName} | {customer.Email} | {customer.Phone} | {customer.Address}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/warehouse/insert">
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
        history.push('/warehouse');
      }
    );
  }

  delete() {
    customerService.deleteCustomer(this.props.match.params.id, () => {
      history.push('/warehouse');
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
        <NavLink to="/warehouse">
          <Button.Success onClick={this.insert}>Add New Customer</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    customerService.insertCustomer(this.FirstName, this.SurName, this.Email, this.Phone, this.Address, () => {
      history.push('/warehouse');
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
              <NavLink to={'/warehouse/' + employee.EmployeeID}>
                {employee.Firstname} {employee.Surname}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/warehouse/insert" />
      </Card>
    );
  }

  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/sales" component={BookingList} />
      <Route exact path="/warehouse" component={CustomerList} />
      <Route exact path="/customers" component={CustomerList} />
      <Route exact path="/employees" component={EmployeeList} />
      <Route path="/sales/:id/edit" component={BookingEdit} />
      <Route path="/warehouse/:id/edit" component={CustomerEdit} />
      <Route path="/customers/:id/edit" component={CustomerEdit} />
      <Route path="/sales/insert" component={BookingInsert} />
      <Route path="/warehouse/insert" component={CustomerInsert} />
      <Route path="/customers/insert" component={CustomerInsert} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
