import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

//ACCESSORIES
import { AccessoryList, AccessoryEdit, AccessoryInsert, AccessoryInsertEx } from './accessorysection';
//BICYCLES
import { BicycleList, BicycleInsert, BicycleUpdate, BicycleEdit } from './bicyclesection';
//CUSTOMERS
import { CustomerList, CustomerEdit, CustomerInsert, BookingCustomerInsert } from './customersection';
//EMPLOYEES
import { EmployeeList, EmployeeEdit, EmployeeInsert } from './employeesection';
//RENTALS
import {
  RentalList,
  EndedRentalList,
  RentalEdit,
  RemoveFromRental,
  RentalInsert,
  RentalCountList
} from './rentalsection';
//REPAIRS
import { RepairList, RepairDetails } from './repairsection';
//TRANSPORTS
import { TransportList } from './transportsection';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//Home Screen
class Home extends Component {
  render() {
    return (
      <div className="col text-center">
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
      <div className="col text-center">
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
      <div className="col text-center">
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
