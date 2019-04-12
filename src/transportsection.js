import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import { transportService } from './transportservice';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//Section where it lists all bicycles that need transport.
//You can choose location to select bicycles from and location to transport to.
export class TransportList extends Component {
    locations = [];
    transportToLocations = [];
    bicycles = [];
    BicycleStatus = '';
  
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
          <Card title="Order Transport From:">
            <p>Select the location you want transport from:</p>
            <select id="LocationDropdown" onChange={this.getBicyclesForTransport}>
              <option selected={true} disabled={true}>
                Select Location
              </option>
              {this.locations.map(location => (
                <option value={location.LocationName}>{location.LocationName}</option>
              ))}
            </select>
            <br />
            <p>Select the Bicycles you want to transport:</p>
            <List>
              {this.bicycles.map(bicycle => (
                <List.Item key={bicycle.BicycleID}>
                  ID: {bicycle.BicycleID} Type: {bicycle.BicycleType} Status: {bicycle.BicycleStatus} Home Location:{' '}
                  {bicycle.HomeLocation}{' '}
                  <input type="checkbox" checked={bicycle.checked} onChange={e => (bicycle.checked = e.target.checked)} />
                </List.Item>
              ))}
            </List>
            <p id="alert" />
            <br />
            <p>Select the location you want transport to:</p>
            <select id="TransportDropdown" value={this.LocationID}>
              <option selected={true} disabled={true}>
                Select Location
              </option>
              {this.transportToLocations.map(location => (
                <option value={location.LocationName}>{location.LocationName}</option>
              ))}
            </select>
            <br />
            <br />
            <br />
            <input type="textarea" placeholder="Add additional comments" id="comment" />
            <br />
            <br />
            <p id="alert" />
            <br />
            <NavLink to="/warehouse/bicycles">
              <Button.Success onClick={this.save}>Submit</Button.Success>
            </NavLink>
          </Card>
        </div>
      );
    }
  
    mounted() {
      transportService.getLocations(locations => {
        this.locations = locations;
      });
    }
  
    //Gets all the bicycles on the chosen location
    getBicyclesForTransport() {
      transportService.getBicyclesForTransport(document.getElementById('LocationDropdown').value, bicycles => {
        this.bicycles = bicycles;
        for (let bicycle of bicycles) bicycle.checked = false;
        if (this.bicycles.length === 0) {
          document.getElementById('alert').innerHTML = 'There are no bicycles in need of transport at this location.';
        } else {
          document.getElementById('alert').innerHTML = '';
        }
      });
      transportService.getTransportToLocation(document.getElementById('LocationDropdown').value, locations => {
        this.transportToLocations = locations;
      });
    }
  
    //Updates the status on the bicycles set for transport.
    save() {
      let pdf = new jsPDF();
      let pickup = '' + document.getElementById('LocationDropdown').value;
      let drop = '' + document.getElementById('TransportDropdown').value;
      let comment = '\n\nAdditional comments:\n' + document.getElementById('comment').value;
  
      let input =
        'AS sykkelutleie\n\nTransport confirmation: \n \n' +
        'Pickup Location: ' +
        pickup +
        '\nDelivery Location: ' +
        drop +
        '\n\nBicycles:';
      for (let x = 0; x < this.bicycles.length; x++) {
        if (this.bicycles[x].checked == true) {
          input += '\n- Type: ' + this.bicycles[x].BicycleType + ' ID: ' + this.bicycles[x].BicycleID;
          transportService.saveStatus(this.bicycles[x].BicycleID, () => {
            history.push('/warehouse/bicycles');
          });
        }
      }
  
      pdf.text(input + comment, 10, 10);
      pdf.save('Transport_order.pdf');
    }
  }