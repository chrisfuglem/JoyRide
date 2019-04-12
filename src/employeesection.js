import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import { employeeService } from './employeeservice';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//Section where it lists all the employees. From here you can search for employees based on firstname or surname.
export class EmployeeList extends Component {
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
  export class EmployeeEdit extends Component {
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
  export class EmployeeInsert extends Component {
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