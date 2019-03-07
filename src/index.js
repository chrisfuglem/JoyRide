<<<<<<< current
import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService, subjectService } from './services';
import { Card, List, Row, Column, NavBar, Button, Form } from './widgets';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="WhiteBoard">
        <NavBar.Link to="/students">Students</NavBar.Link>
        <NavBar.Link to="/subjects">Subjects</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render () {
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
              <NavLink to={'/students/' + student.id + '/edit'}>{student.name} | {student.email}</NavLink>
            </List.Item>
          ))}
        </List>
        <br></br>
        <NavLink to="/students/insert"><Button.Light>Add New Student</Button.Light></NavLink>
      </Card>
    );
  }

  mounted() {
    studentService.getStudents(students => {
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
        <br></br>
        <NavLink to="/students"><Button.Success onClick={this.save}>Save Changes</Button.Success></NavLink>
        <br></br>
        <br></br>
        <NavLink to="/students"><Button.Danger onClick={this.delete}>Delete Student</Button.Danger></NavLink>
      </Card>
    );
  }

  mounted() {
    studentService.getStudent(this.props.match.params.id, student => {
      this.name = student.name;
      this.email = student.email;
    });
  }

  save() {
    studentService.updateStudent(this.props.match.params.id, this.name, this.email, () => {
      history.push('/students');
    });
  }

  delete() {
    studentService.deleteStudent(this.props.match.params.id, () => {
      history.push('/students');
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
        <br></br>
        <NavLink to="/students"><Button.Success onClick={this.insert}>Add New Student</Button.Success></NavLink>
      </Card>
    );
  }

  insert() {
    studentService.insertStudent(this.name, this.email, () => {
      history.push('/students');
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
              <NavLink to={'/subjects/' + subject.id + '/edit'}>{subject.SubjectName} | {subject.SubjectCode}</NavLink>
            </List.Item>
          ))}
        </List>
        <br></br>
        <NavLink to="/subjects/insert"><Button.Light>Add New Subject</Button.Light></NavLink>
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
        <br></br>
        <NavLink to="/subjects"><Button.Success onClick={this.save}>Save Changes</Button.Success></NavLink>
        <br></br>
        <br></br>
        <NavLink to="/subjects"><Button.Danger onClick={this.delete}>Delete Subject</Button.Danger></NavLink>
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
      history.push('/subjects');
    });
  }

  delete() {
    subjectService.deleteSubject(this.props.match.params.id, () => {
      history.push('/subjects');
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
        <br></br>
        <NavLink to="/subjects"><Button.Success onClick={this.insert}>Add New Subject</Button.Success></NavLink>
      </Card>
    );
  }

  insert() {
    subjectService.insertSubject(this.SubjectCode, this.SubjectName, () => {
      history.push('/subjects');
    });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/students" component={StudentList} />
      <Route exact path="/subjects" component={SubjectList} />
      <Route path="/students/:id/edit" component={StudentEdit} />
      <Route path="/subjects/:id/edit" component={SubjectEdit} />
      <Route path="/students/insert" component={StudentInsert} />
      <Route path="/subjects/insert" component={SubjectInsert} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
=======
import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService } from './services';
import { Card, List, Row, Column, NavBar, Button, Form } from './widgets'

import createHashHistory from 'history/createHashHistory';
import { throws } from 'assert';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="JoyRide">
        <NavBar.Link to="/booking">Booking</NavBar.Link>
        <NavBar.Link to="/bicycles">Bicycles</NavBar.Link>
        <NavBar.Link to="/locations">Locations</NavBar.Link>
        <NavBar.Link to="/customer">Customer</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return <Card title="Welcome">Welcome to JoyRide</Card>;
  }
}

class Bookings extends Component {
  bookings = [];

  render() {
    <Card title="Booking">
      <List>
        {this.booking.map(booking => (
          <List.Item key={booking.id} to={'/bookings/' + booking.id + '/edit'}>

          </List.Item>
        ))}
      </List>
    </Card>
  }

  mounted() {
    studentService.getBooking(booking => {
      this.bookings = bookings;
    });
  }
}

class StudentList extends Component {
  students = [];

  render() {
    return (
      <Card title="Students">
        <List>
          {this.students.map(student => (
            <List.Item key={student.id} to={'/students/' + student.id + '/edit'}>
            {student.name}
            </List.Item>
          ))}
        </List>
      </Card>
    );
  }

  mounted() {
    studentService.getStudents(students => {
      this.students = students;
    });
  }
}


class StudentEdit extends Component {

  name = '';
  email = '';

  render() {


    return (
      <div>
      <Card title="Edit Student">
        <Form.Label>Name:</Form.Label>
        <Form.Input type="text" value={this.name} onChange={e => (this.name = e.target.value)} />
        <Form.Label>Email:</Form.Label>
        <Form.Input type="text" value={this.email} onChange={e => (this.email = e.target.value)} />
      </Card>
      <Row>
        <Column>
          <Button.Success onClick={this.save}>Save</Button.Success>
        </Column>
        <Column right>
          <Button.Light onClick={this.cancel}>Cancel</Button.Light>
        </Column>
        <Column left>
          <Button.Success onClick={this.delete}>Delete</Button.Success>
        </Column>
      </Row>
      </div>
    );
  }

  mounted() {
    studentService.getStudent(this.props.match.params.id, student => {
      console.log(student.name)
      this.name = student.name;
      this.email = student.email;
    });
  }

  save() {
    studentService.updateStudent(this.props.match.params.id, this.name, this.email, () => {
      history.push('/students');
    });
  }

  cancel() {
    history.push('/students' + this.props.match.params.id);
  }

  delete() {
    studentService.deleteStudent(this.props.match.params.id, () => {
      history.push('/students');
    })
  }
}

class SubjectList extends Component {
  subjects = [];

  render() {
    return(
      <Card title="Subjects">
      <List>
        {this.subjects.map(subject => (
          <List.Item key={subject.id} to={'/subjects/' + subject.id + '/edit'}>
        {subject.name}
        </List.Item>
        ))}
      </List>
      </Card>
    );
  }
  mounted() {
    studentService.getSubjects(subjects => {
      this.subjects = subjects;
    });
  }
}

class SubjectEdit extends Component {
  name = '';
  kode = '';

  render() {
    return (
      <div>
        <Card title="Edit Subject">
          <Form.Label>Name:</Form.Label>
          <Form.Input type="text" value={this.name} onChange={e => this.name = e.target.value} />
          <Form.Label>Code:</Form.Label>
          <Form.Input type="text" value={this.kode} onChange={e => this.kode = e.target.value} />
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
          <Column left>
            <Button.Success onClick={this.delete}>Delete</Button.Success>
          </Column>
        </Row>
      </div>
      );
  }

  mounted() {
    studentService.getSubject(this.props.match.params.id, subject => {
      this.name = subject.name;
      this.kode = subject.kode;
    });
  }

  cancel() {
    history.push('/subjects' + this.props.match.params.id);
  }

  save() {
    studentService.updateSubject(this.props.match.params.id, this.name, this.kode, () => {
      history.push('/subjects');
    });
  }

  delete() {
    studentService.deleteSubject(this.props.match.params.id, () => {
      history.push('/subjects');
    });
  }
}

class AddStudent extends Component {
  name = "";
  email = "";

  render() {
    return (
      <div>
        <Card title="Add Student">
          <Form.Label>Name:</Form.Label>
          <Form.Input type="text" value={this.name} onChange={e => (this.name = e.target.value)} />
          <Form.Label>Email:</Form.Label>
          <Form.Input type="text" value={this.email} onChange={e => (this.email = e.target.value)} />
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.add}>Add Student</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </div>
      )
  }
  add() {
    studentService.addStudent(this.props.match.params.id, this.name, this.email, () => {
      history.push('/students');
    });
  }
  cancel() {
    history.push('/students' + this.props.match.params.id);
  }
}

class AddSubject extends Component {
  name = "";
  kode = "";

  render() {
    return (
      <div>
        <Card title="Add Subject">
          <Form.Label>Name:</Form.Label>
          <Form.Input type="text" value={this.name} onChange={e => (this.name = e.target.value)} />
          <Form.Label>Code:</Form.Label>
          <Form.Input type="text" value={this.kode} onChange={e => (this.kode = e.target.value)} />
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.add}>Add Subject</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </div>
    )
  }
  add() {
    studentService.addSubject(this.props.match.params.id, this.name, this.kode, () => {
      history.push('/subjects');
    });
  }
  cancel() {
    history.push('/students' + this.props.match.params.id);
  }
}



ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/bookings" component={Bookings} />
      <Route exact path="/students" component={StudentList} />
      <Route exact path="/students/:id/edit" component={StudentEdit} />
      <Route exact path="/subjects" component={SubjectList} />
      <Route exact path="/subjects/:id/edit" component={SubjectEdit} />
      <Route exact path="/studentsadd" component={AddStudent} />
      <Route exact path="/subjectsadd" component={AddSubject} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
>>>>>>> before discard
