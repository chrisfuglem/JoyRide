import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import { customerService } from './customerservice';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//Section to list all the customers. From here you can search and add/edit customers.
export class CustomerList extends Component {
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
              <br />
              <br />
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
              <br />
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
  export class CustomerEdit extends Component {
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
  export class CustomerInsert extends Component {
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
  export class BookingCustomerInsert extends Component {
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
