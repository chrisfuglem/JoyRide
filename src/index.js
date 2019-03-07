import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { bookingService, subjectService } from './services';
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
        <Card title="Welcome to WhiteBoard">Navigate using the buttons above</Card>
      </div>
    );
  }
}

class StudentList extends Component {
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

class StudentEdit extends Component {
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
    bookingService.getStudent(this.props.match.params.id, student => {
      this.name = student.name;
      this.email = student.email;
    });
  }

  save() {
    bookingService.updateStudent(this.props.match.params.id, this.name, this.email, () => {
      history.push('/sales');
    });
  }

  delete() {
    bookingService.deleteStudent(this.props.match.params.id, () => {
      history.push('/sales');
    });
  }
}

class StudentInsert extends Component {
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
    bookingService.insertStudent(this.name, this.email, () => {
      history.push('/sales');
    });
  }
}

class SubjectList extends Component {
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
    subjectService.getSubjects(subjects => {
      this.subjects = subjects;
    });
  }
}

class SubjectEdit extends Component {
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
    subjectService.getSubject(this.props.match.params.id, subject => {
      this.SubjectCode = subject.SubjectCode;
      this.SubjectName = subject.SubjectName;
    });
  }

  save() {
    subjectService.updateSubject(this.props.match.params.id, this.SubjectCode, this.SubjectName, () => {
      history.push('/warehouse');
    });
  }

  delete() {
    subjectService.deleteSubject(this.props.match.params.id, () => {
      history.push('/warehouse');
    });
  }
}

class SubjectInsert extends Component {
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
    subjectService.insertSubject(this.SubjectCode, this.SubjectName, () => {
      history.push('/warehouse');
    });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/sales" component={StudentList} />
      <Route exact path="/warehouse" component={SubjectList} />
      <Route exact path="/customers" component={SubjectList} />
      <Route path="/sales/:id/edit" component={StudentEdit} />
      <Route path="/warehouse/:id/edit" component={SubjectEdit} />
      <Route path="/customers/:id/edit" component={SubjectEdit} />
      <Route path="/sales/insert" component={StudentInsert} />
      <Route path="/warehouse/insert" component={SubjectInsert} />
      <Route path="/customers/insert" component={SubjectInsert} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
