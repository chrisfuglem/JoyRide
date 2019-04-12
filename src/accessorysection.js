import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import { accessoryService } from './accessoryservice';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//Section where it lists all the accessories. From here you can add/edit accessories.
export class AccessoryList extends Component {
    accessories = [];
  
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
          <Card title="Accessory List">
            <NavLink to="/warehouse/accessories/insert">
              <Button.Light>Add New accessory</Button.Light>
            </NavLink>{' '}
            <NavLink to="/warehouse/accessories/exinsert">
              <Button.Light>Add Existing accessory</Button.Light>
            </NavLink>
            <p>Click the accessories to edit or delete them</p>
            <Form.Label>Find Bicycle By:</Form.Label>
            <div id="AccessorySearch">
              <input id="AccessorySearchField" type="text" width="200px" />
              <select id="AccessorySearchCategory">
                <option value="Accessories.AccessoryID">Accessory ID</option>
                <option value="Type">Accessorytype</option>
                <option value="Status">Status</option>
                <option value="AccessoryHomeLocation.HomeLocationName">Homelocation</option>
                <option value="AccessoryCurrentLocation.CurrentLocationName">Current location</option>
              </select>
              <button id="AccessorySearchButton" onClick={this.mounted}>
                Search
              </button>
            </div>
            <List>
              {this.accessories.map(accessory => (
                <List.Item key={accessory.AccessoryID}>
                  <NavLink to={'/warehouse/accessories/' + accessory.AccessoryID + '/edit'}>
                    {accessory.Type} | Price: {accessory.DailyPrice}kr per day | Home Location:{' '}
                    {accessory.HomeLocationName} | Current Location: {accessory.CurrentLocationName} | Status{' '}
                    {accessory.Status}
                  </NavLink>
                </List.Item>
              ))}
            </List>
            <p id="alert" />
          </Card>
        </div>
      );
    }
  
    mounted() {
      this.searchCategory = '' + document.getElementById('AccessorySearchCategory').value;
      this.searchValue = '%' + document.getElementById('AccessorySearchField').value + '%';
      accessoryService.searchAccessories(this.searchCategory, this.searchValue, accessories => {
        this.accessories = accessories;
        if (this.accessories.length === 0) {
          document.getElementById('alert').innerHTML = 'There are no accessories in this category.';
        } else {
          document.getElementById('alert').innerHTML = '';
        }
      });
    }
  }
  
  //Section where you edit/delete the chosen accessory.
  export class AccessoryEdit extends Component {
    Type = '';
    DailyPrice = '';
    Status = '';
    HomeLocation = '';
    CurrentLocation = '';
    AccessoryStatuses = [];
  
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
          <Card title="Editing Accessory">
            <List.Item>
              <p>{this.Type}</p>
            </List.Item>
            <Form.Label>Daily Price</Form.Label>
            <Form.Input type="number" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
            <br />
            <Form.Label>Accessory Status</Form.Label>
            <br />
            <select id="StatusDropdown" value={this.Status} onChange={e => (this.Status = e.target.value)}>
              {this.AccessoryStatuses.map(status => (
                <option value={status.Status}>{status.AccessoryStatus}</option>
              ))}
            </select>{' '}
            <br />
            <Form.Label>Home Location</Form.Label> <br />
            <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
              <option value="9">Finse</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <Form.Label>Current Location</Form.Label> <br />
            <select
              id="CurrentLocation"
              value={this.CurrentLocation}
              onChange={e => (this.CurrentLocation = e.target.value)}
            >
              <option value="9">Finse</option>
              <option value="10">Flaam</option>
              <option value="11">Voss</option>
              <option value="12">Myrdal</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <br />
            <NavLink to="/warehouse/accessories">
              <Button.Success onClick={this.save}>Save Changes</Button.Success>
            </NavLink>
            <br />
            <br />
            <NavLink to="/warehouse/accessories">
              <Button.Danger onClick={this.delete}>Delete Accessory</Button.Danger>
            </NavLink>
            <NavLink to="/warehouse/accessories">
              <Button.Light>Back</Button.Light>
            </NavLink>
          </Card>
        </div>
      );
    }
  
    mounted() {
      accessoryService.getAccessory(this.props.match.params.id, accessory => {
        this.Type = accessory.Type;
        this.DailyPrice = accessory.DailyPrice;
        this.Status = accessory.Status;
        this.HomeLocation = accessory.HomeLocation;
        this.CurrentLocation = accessory.CurrentLocation;
      });
      accessoryService.getAccessoryStatuses(statuses => {
        this.AccessoryStatuses = statuses;
      });
    }
  
    //Updates the accessory.
    save() {
      accessoryService.updateAccessory(
        this.props.match.params.id,
        this.DailyPrice,
        (this.AccessoryStatus = '' + document.getElementById('StatusDropdown').value),
        (this.HomeLocation = '' + document.getElementById('HomeLocation').value),
        (this.CurrentLocation = '' + document.getElementById('CurrentLocation').value),
        () => {
          history.push('/warehouse/accessories');
        }
      );
    }
  
    //Deletes the accessory.
    delete() {
      accessoryService.deleteAccessory(this.props.match.params.id, () => {
        history.push('/warehouse/accessories');
      });
      accessoryService.deleteAccessoryType(this.Type, () => {
        history.push('/warehouse/accessories');
      });
    }
  }
  
  //Section where you can add new accessories.
  export class AccessoryInsert extends Component {
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
          <Card title="Adding New Accessory">
            <Form.Label>Accessory Type</Form.Label>
            <Form.Input type="text" value={this.type} onChange={e => (this.type = e.target.value)} />
            <br />
            <Form.Label>Daily Price</Form.Label>
            <Form.Input type="number" value={this.dailyprice} onChange={e => (this.dailyprice = e.target.value)} />
            <br />
            <Form.Label>Home Location</Form.Label> <br />
            <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
              <option selected={true} disabled={true}>
                Select Location
              </option>
              <option value="9">Finse</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <Form.Label>Current Location</Form.Label> <br />
            <select
              id="CurrentLocation"
              value={this.CurrentLocation}
              onChange={e => (this.CurrentLocation = e.target.value)}
            >
              <option selected={true} disabled={true}>
                Select Location
              </option>
              <option value="9">Finse</option>
              <option value="10">Flaam</option>
              <option value="11">Voss</option>
              <option value="12">Myrdal</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <br />
            <Button.Success onClick={this.insert}>Add New Accessory</Button.Success>
            <NavLink to="/warehouse/accessories">
              <Button.Light>Back</Button.Light>
            </NavLink>
          </Card>
        </div>
      );
    }
  
    //Adds the accessory.
    insert() {
      accessoryService.insertAccessoryType(this.type, () => {
        history.push('/warehouse/accessories/');
      });
      accessoryService.insertAccessoryPrice(this.type, this.dailyprice, this.HomeLocation, this.CurrentLocation, () => {
        history.push('/warehouse/accessories');
      });
    }
  }
  
  //Section where you can add new accessories.
  export class AccessoryInsertEx extends Component {
    AccessoryTypes = [];
  
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
          <Card title="Adding Existing Accessory">
            <Form.Label>Accessory Type</Form.Label>
            <br />
            <select id="TypeDropdown" value={this.AccessoryType} onChange={e => (this.AccessoryType = e.target.value)}>
              {this.AccessoryTypes.map(type => (
                <option value={type.AccessoryType}>{type.AccessoryType}</option>
              ))}
            </select>{' '}
            <br />
            <Form.Label>Daily Price</Form.Label>
            <Form.Input type="number" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
            <br />
            <Form.Label>Current Location</Form.Label> <br />
            <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
              <option selected={true} disabled={true}>
                Select Location
              </option>
              <option value="9">Finse</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <Form.Label>Current Location</Form.Label> <br />
            <select
              id="CurrentLocation"
              value={this.CurrentLocation}
              onChange={e => (this.CurrentLocation = e.target.value)}
            >
              <option selected={true} disabled={true}>
                Select Location
              </option>
              <option value="9">Finse</option>
              <option value="10">Flaam</option>
              <option value="11">Voss</option>
              <option value="12">Myrdal</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <Form.Label>Number to add</Form.Label>
            <Form.Input type="number" id="NumberToAdd" value={this.Add} onChange={e => (this.Add = e.target.value)} />
            <br />
            <NavLink to="/warehouse/accessories">
              <Button.Success onClick={this.insert}>Add Accessory</Button.Success>
            </NavLink>
            <NavLink to="/warehouse/accessories">
              <Button.Light>Back</Button.Light>
            </NavLink>
          </Card>
        </div>
      );
    }
  
    mounted() {
      accessoryService.getAccessoryTypes(types => {
        this.AccessoryTypes = types;
      });
    }
  
    //Adds the accessory.
    insert() {
      //Loops the insert command for number of bikes to be added.
      for (let i = 0; i < this.Add; i++) {
        accessoryService.insertAccessoryPrice(
          (this.AccessoryType = '' + document.getElementById('TypeDropdown').value),
          this.DailyPrice,
          this.HomeLocation,
          this.CurrentLocation,
          () => {
            history.push('/warehouse/accessories');
          }
        );
      }
    }
  }