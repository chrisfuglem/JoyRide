import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { bookingService, customerService } from './services';
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
  students = [];

  render() {
    return (
      <Card title="Student List">
        <p>Click the students to edit or delete them</p>
        <List>
          {this.students.map(student => (
            <List.Item key={student.id}>
              <NavLink to={'/sales/' + student.id + '/edit'}>
                {student.name} | {student.email}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/sales/insert">
          <Button.Light>Add New Student</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    bookingService.getBookings(students => {
      this.students = students;
    });
  }
}

class BookingEdit extends Component {
  name = '';
  email = '';

  render() {
    return (
      <Card title="Editing student">
        <Form.Label>Name</Form.Label>
        <Form.Input type="text" value={this.name} onChange={e => (this.name = e.target.value)} />
        <Form.Label>Email</Form.Label>
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
      <Card title="Adding Student">
        <Form.Label>Name:</Form.Label>
        <Form.Input type="text" value={this.name} onChange={e => (this.name = e.target.value)} />
        <Form.Label>Email:</Form.Label>
        <Form.Input type="text" value={this.email} onChange={e => (this.email = e.target.value)} />
        <br />
        <NavLink to="/sales">
          <Button.Success onClick={this.insert}>Add New Student</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    bookingService.insertBooking(this.name, this.email, () => {
      history.push('/sales');
    });
  }
}

class CustomerList extends Component {
  subjects = [];

  render() {
    return (
      <Card title="Subject List">
        <p>Click the subjects to edit or delete them</p>
        <List>
          {this.subjects.map(subject => (
            <List.Item key={subject.id}>
              <NavLink to={'/warehouse/' + subject.id + '/edit'}>
                {subject.SubjectName} | {subject.SubjectCode}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/warehouse/insert">
          <Button.Light>Add New Subject</Button.Light>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    customerService.getCustomers(subjects => {
      this.subjects = subjects;
    });
  }
}

class CustomerEdit extends Component {
  SubjectCode = '';
  SubjectName = '';

  render() {
    return (
      <Card title="Editing Subject">
        <Form.Label>Subject Code</Form.Label>
        <Form.Input type="text" value={this.SubjectCode} onChange={e => (this.name = e.target.value)} />
        <Form.Label>Subject Name</Form.Label>
        <Form.Input type="text" value={this.SubjectName} onChange={e => (this.email = e.target.value)} />
        <br />
        <NavLink to="/warehouse">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/warehouse">
          <Button.Danger onClick={this.delete}>Delete Subject</Button.Danger>
        </NavLink>
      </Card>
    );
  }

  mounted() {
    customerService.getCustomer(this.props.match.params.id, subject => {
      this.SubjectCode = subject.SubjectCode;
      this.SubjectName = subject.SubjectName;
    });
  }

  save() {
    customerService.updateCustomer(this.props.match.params.id, this.SubjectCode, this.SubjectName, () => {
      history.push('/warehouse');
    });
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
      <Card title="Adding Subject">
        <Form.Label>Subject Code:</Form.Label>
        <Form.Input type="text" value={this.SubjectCode} onChange={e => (this.SubjectCode = e.target.value)} />
        <Form.Label>Subject Name:</Form.Label>
        <Form.Input type="text" value={this.SubjectName} onChange={e => (this.SubjectName = e.target.value)} />
        <br />
        <NavLink to="/warehouse">
          <Button.Success onClick={this.insert}>Add New Subject</Button.Success>
        </NavLink>
      </Card>
    );
  }

  insert() {
    customerService.insertCustomer(this.SubjectCode, this.SubjectName, () => {
      history.push('/warehouse');
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
