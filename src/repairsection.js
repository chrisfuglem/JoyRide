import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import { bicycleService } from './bicycleservice';
import { repairService } from './repairservice';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

export class RepairList extends Component {
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
  export class RepairDetails extends Component {
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