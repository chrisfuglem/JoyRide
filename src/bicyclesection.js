import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, withRouter } from 'react-router-dom';
import { rentalService } from './rentalservice';
import { bicycleService } from './bicycleservice';
import { Card, List, Row, Column, NavBar, Button, Form, TextInput } from './widgets';
import jsPDF from 'jspdf';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//Section where it lists all the bicycles with information. From here you can add/update bicycles.
export class BicycleList extends Component {
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
          <Card title="Bicycle List">
            <NavLink to="/warehouse/bicycles/insert">
              <Button.Light>Add New Bicycle</Button.Light>
            </NavLink>
            <NavLink to="/warehouse/bicycles/update">
              <Button.Light>Update Bicycles</Button.Light>
            </NavLink>
            <p>Click the bicycles to edit or delete them</p>
            <Form.Label>Find Bicycle By:</Form.Label>
            <div id="BicycleSearch">
              <input id="BicycleSearchField" type="text" width="200px" />
              <select id="BicycleSearchCategory">
                <option value="Bicycles.BicycleID">Bicycle ID</option>
                <option value="BicycleType">Bicycletype</option>
                <option value="FrameType">Frametype</option>
                <option value="BrakeType">Braketype</option>
                <option value="Wheelsize">Wheelsize</option>
                <option value="BicycleStatus">Status</option>
                <option value="HomeLocation.HomeLocationName">Homelocation</option>
                <option value="CurrentLocation.CurrentLocationName">Current location</option>
              </select>
              <button id="CustomerSearchButton" onClick={this.mounted}>
                Search
              </button>
            </div>
            <br />
            <List>
              {this.bicycles.map(bicycle => (
                <List.Item key={bicycle.BicycleID}>
                  <NavLink to={'/warehouse/bicycles/' + bicycle.BicycleID + '/edit'}>
                    Bicycle ID: {bicycle.BicycleID} | Bicycle Type: {bicycle.BicycleType} | Daily Price:{' '}
                    {bicycle.DailyPrice}kr per day
                  </NavLink>
                </List.Item>
              ))}
            </List>
            <p id="alert" />
            <br />
            <br />
          </Card>
        </div>
      );
    }
  
    mounted() {
      this.searchCategory = '' + document.getElementById('BicycleSearchCategory').value;
      this.searchValue = '%' + document.getElementById('BicycleSearchField').value + '%';
      bicycleService.searchBicycles(this.searchCategory, this.searchValue, bicycles => {
        this.bicycles = bicycles;
        if (this.bicycles.length === 0) {
          document.getElementById('alert').innerHTML = 'There are no bicycles in this category.';
        } else {
          document.getElementById('alert').innerHTML = '';
        }
      });
    }
  }
  
  //Section where you can edit ot delete the chosen bicycle.
  export class BicycleEdit extends Component {
    BicycleType = '';
    FrameType = '';
    BrakeType = '';
    Wheelsize = '';
    BicycleStatus = '';
    HomeLocation = '';
    DailyPrice = '';
    CurrentLocation = '';
    BicycleStatuses = [];
  
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
          <Card title="Editing bicycle">
            <Form.Label>Bicycle Type</Form.Label> <br />
            <select id="TypeDropdown" value={this.BicycleType} onChange={e => (this.BicycleType = e.target.value)}>
              <option>Beach Cruiser</option>
              <option>BMX</option>
              <option>Downhill</option>
              <option>Hybrid</option>
              <option>Kids</option>
              <option>Mountain Bike</option>
              <option>Racer</option>
              <option>Road Bike</option>
              <option>Tandem</option>
            </select>
            <br />
            <Form.Label>Frame Type</Form.Label> <br />
            <select id="FrameDropdown" value={this.FrameType} onChange={e => (this.FrameType = e.target.value)}>
              <option>City</option>
              <option>Hardtail</option>
              <option>Rigid</option>
              <option>Road</option>
              <option>Trail</option>
            </select>
            <br />
            <Form.Label>Brake Type</Form.Label> <br />
            <select id="BrakeDropdown" value={this.BrakeType} onChange={e => (this.BrakeType = e.target.value)}>
              <option>Caliper</option>
              <option>Cantilever</option>
              <option>Disk</option>
              <option>V</option>
            </select>
            <br />
            <Form.Label>Wheelsize</Form.Label>
            <Form.Input type="number" value={this.Wheelsize} onChange={e => (this.Wheelsize = e.target.value)} />
            <Form.Label>Bicycle Status</Form.Label>
            <br />
            <select id="StatusDropdown" value={this.BicycleStatus} onChange={e => (this.BicycleStatus = e.target.value)}>
              {this.BicycleStatuses.map(status => (
                <option value={status.BicycleStatus}>{status.BicycleStatus}</option>
              ))}
            </select>{' '}
            <br />
            <Form.Label>Home Location</Form.Label> <br />
            <select id="HomeLocation" value={this.HomeLocation} onChange={e => (this.HomeLocation = e.target.value)}>
              <option value="9">Finse</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <Form.Label>Daily Price</Form.Label>
            <Form.Input type="number" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
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
            <NavLink to="/warehouse/bicycles">
              <Button.Success onClick={this.save}>Save Changes</Button.Success>
            </NavLink>
            <br />
            <br />
            <NavLink to="/warehouse/bicycles">
              <Button.Danger onClick={this.delete}>Delete Bicycle</Button.Danger>
            </NavLink>
            <NavLink to="/warehouse/bicycles">
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
        this.DailyPrice = bicycle.DailyPrice;
        this.CurrentLocation = bicycle.CurrentLocation;
      });
      bicycleService.getBicycleStatuses(statuses => {
        this.BicycleStatuses = statuses;
      });
    }
  
    //Updates the bicycle.
    save() {
      bicycleService.updateBicycle(
        this.props.match.params.id,
        (this.BicycleType = '' + document.getElementById('TypeDropdown').value),
        (this.FrameType = '' + document.getElementById('FrameDropdown').value),
        (this.BrakeType = '' + document.getElementById('BrakeDropdown').value),
        this.Wheelsize,
        (this.BicycleStatus = '' + document.getElementById('StatusDropdown').value),
        (this.HomeLocation = '' + document.getElementById('HomeLocation').value),
        this.DailyPrice,
        (this.CurrentLocation = '' + document.getElementById('CurrentLocation').value),
        () => {
          history.push('/warehouse/bicycles');
        }
      );
    }
  
    //Deletes the bicycle.
    delete() {
      bicycleService.deleteBicycle(this.props.match.params.id, () => {
        history.push('/warehouse/bicycles');
      });
    }
  }
  
  //Section where you can add new bicycles.
  export class BicycleInsert extends Component {
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
          <Card title="Adding Bicycle">
            <Form.Label>Bicycle Type</Form.Label> <br />
            <select id="TypeDropdown">
              <option>Beach Cruiser</option>
              <option>BMX</option>
              <option>Downhill</option>
              <option>Hybrid</option>
              <option>Kids</option>
              <option>Mountain Bike</option>
              <option>Racer</option>
              <option>Road Bike</option>
              <option>Tandem</option>
            </select>
            <br />
            <Form.Label>Frame Type</Form.Label> <br />
            <select id="FrameDropdown">
              <option>City</option>
              <option>Hardtail</option>
              <option>Rigid</option>
              <option>Road</option>
              <option>Trail</option>
            </select>
            <br />
            <Form.Label>Brake Type</Form.Label> <br />
            <select id="BrakeDropdown">
              <option>Caliper</option>
              <option>Cantilever</option>
              <option>Disk</option>
              <option>V</option>
            </select>
            <br />
            <Form.Label>Wheelsize</Form.Label>
            <Form.Input type="number" value={this.Wheelsize} onChange={e => (this.Wheelsize = e.target.value)} />
            <Form.Label>Bicycle Status</Form.Label> <br />
            <select id="StatusDropdown">
              <option>Available</option>
              <option>In Repair</option>
              <option>In Transport</option>
              <option>Need Repair</option>
              <option>Need Transport</option>
              <option>Rented</option>
            </select>
            <br />
            <Form.Label>Home Location</Form.Label> <br />
            <select id="HomeLocation">
              <option value="9">Finse</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <Form.Label>Daily Price</Form.Label>
            <Form.Input type="number" value={this.DailyPrice} onChange={e => (this.DailyPrice = e.target.value)} />
            <Form.Label>Current Location</Form.Label> <br />
            <select id="CurrentLocation">
              <option value="9">Finse</option>
              <option value="10">Flaam</option>
              <option value="11">Voss</option>
              <option value="12">Myrdal</option>
              <option value="13">Haugastoel</option>
            </select>
            <br />
            <Form.Label>Number of bikes to add</Form.Label>
            <Form.Input type="number" id="NumberToAdd" value={this.Add} onChange={e => (this.Add = e.target.value)} />
            <br />
            <NavLink to="/warehouse/bicycles">
              <Button.Success onClick={this.insert}>Add New Bicycle</Button.Success>
            </NavLink>
            <NavLink to="/warehouse/bicycles">
              <Button.Light>Back</Button.Light>
            </NavLink>
          </Card>
        </div>
      );
    }
  
    //Adds the bicycle.
    insert() {
      //Loops the insert command for number of bikes to be added.
      for (let i = 0; i < this.Add; i++) {
        bicycleService.insertBicycle(
          (this.BicycleType = '' + document.getElementById('TypeDropdown').value),
          (this.FrameType = '' + document.getElementById('FrameDropdown').value),
          (this.BrakeType = '' + document.getElementById('BrakeDropdown').value),
          this.Wheelsize,
          (this.BicycleStatus = '' + document.getElementById('StatusDropdown').value),
          (this.HomeLocation = '' + document.getElementById('HomeLocation').value),
          this.DailyPrice,
          (this.CurrentLocation = '' + document.getElementById('CurrentLocation').value),
          () => {
            history.push('/warehouse/bicycles');
          }
        );
      }
    }
  }
  
  //Section where you can update several bicyclelocations at once.
  export class BicycleUpdate extends Component {
    bicycles = [];
    statuses = [];
    locations = [];
    CurrentLocation = '';
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
          <Card title="Bicycle List">
            <p>Select the bicycles you want to update</p>
            <List>
              {this.bicycles.map(bicycle => (
                <List.Item key={bicycle.BicycleID}>
                  <input type="checkbox" checked={bicycle.checked} onChange={e => (bicycle.checked = e.target.checked)} />
                  Bicycle ID: {bicycle.BicycleID} | Bicycle Type: {bicycle.BicycleType} | Status: {bicycle.BicycleStatus}{' '}
                  | Current Location: {bicycle.CurrentLocationName}
                </List.Item>
              ))}
            </List>
            <br />
            Select Location:
            <select id="CurrentLocation">
              <option value="9">Finse</option>
              <option value="10">Flaam</option>
              <option value="11">Voss</option>
              <option value="12">Myrdal</option>
              <option value="13">Haugastoel</option>
            </select>{' '}
            Select Status:
            <select id="StatusDropdown" value={this.BicycleStatus} onChange={e => (this.BicycleStatus = e.target.value)}>
              {this.statuses.map(status => (
                <option value={status.BicycleStatus}>{status.BicycleStatus}</option>
              ))}
            </select>
            <br />
            <br />
            <NavLink to="/warehouse/bicycles" onClick={this.save}>
              <Button.Success>Update Bicycle</Button.Success>
            </NavLink>
            <NavLink to="/warehouse/bicycles">
              <Button.Light>Back</Button.Light>
            </NavLink>
          </Card>
        </div>
      );
    }
  
    mounted() {
      bicycleService.getBicyclestoUpdate(bicycles => {
        this.bicycles = bicycles;
        for (let bicycle of bicycles) bicycle.checked = false;
      });
      bicycleService.getBicycleStatuses(statuses => {
        this.statuses = statuses;
      });
      rentalService.getPickupLocation(locations => {
        this.locations = locations;
      });
    }
  
    save() {
      for (let x = 0; x < this.bicycles.length; x++) {
        if (this.bicycles[x].checked == true) {
          bicycleService.updateBicycles(
            this.bicycles[x].BicycleID,
            (this.bicycles[x].BicycleStatus = '' + document.getElementById('StatusDropdown').value),
            (this.bicycles[x].CurrentLocation = '' + document.getElementById('CurrentLocation').value),
            () => {
              history.push('/warehouse/bicycles');
            }
          );
        }
      }
    }
  }