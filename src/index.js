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
              <NavLink to={'/students/' + student.id + '/edit'}>
                {student.name} | {student.email}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/students/insert">
          <Button.Light>Add New Student</Button.Light>
        </NavLink>
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
        <br />
        <NavLink to="/students">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/students">
          <Button.Danger onClick={this.delete}>Delete Student</Button.Danger>
        </NavLink>
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
        <br />
        <NavLink to="/students">
          <Button.Success onClick={this.insert}>Add New Student</Button.Success>
        </NavLink>
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
              <NavLink to={'/subjects/' + subject.id + '/edit'}>
                {subject.SubjectName} | {subject.SubjectCode}
              </NavLink>
            </List.Item>
          ))}
        </List>
        <br />
        <NavLink to="/subjects/insert">
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
        <NavLink to="/subjects">
          <Button.Success onClick={this.save}>Save Changes</Button.Success>
        </NavLink>
        <br />
        <br />
        <NavLink to="/subjects">
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
        <br />
        <NavLink to="/subjects">
          <Button.Success onClick={this.insert}>Add New Subject</Button.Success>
        </NavLink>
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
