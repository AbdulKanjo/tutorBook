import React, { Component } from "react";
import { Col, Row, Container, Input, Collection, CollectionItem } from "react-materialize";
import Nav from "../../components/Navbar";
import StudentCard from "../../components/StudentCard";
import DeleteBtn from "../../components/DeleteBtn";
import TutorCard from "../../components/Tutor";
import "./Tutors.css";
import API from "../../utils/API";

class Tutors extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contract: "",
      totalStudents: 0,
      teacherKey: "",
      tutor: {},
      loggedIn: false,
      search: ""
    };
    this._tutorEventUpdate = this._tutorEventUpdate.bind(this)
    this.deleteStudent = this.deleteStudent.bind(this)
  }

  updateSearch(event) {
    this.setState({search: event.target.value})
  }

  _tutorEventUpdate () {
    //alert("trying to update events");
    this.componentDidMount();
  }

  componentDidMount() {
    const tutorSession = JSON.parse(localStorage.getItem("tutor"))
    if (tutorSession) {
      const query = tutorSession.id;
      API.getTutor(query)
        .then((res, err) => {
          if (err) {
            console.log(err)
          }
          //Parse events before trying to display
          res.data.events.forEach(function(event){
            event.start = new Date(event.start.replace(/"/g, ""));
            event.end = new Date(event.end.replace(/"/g, ""));
          })
          console.log(res.data);
          this.setState({
            totalStudents: res.data.students.length,
            tutor: res.data,
            loggedIn: true
          })
        })
    }
    else{
      this.setState({
        redirectTo: "/"
      });
    }
  }

  deleteStudent = id => {
    // console.log(id);
    // const query = {
    //   studentId: id,
    //   tutorId: this.state.tutor._id
    // }
    API.deleteStudent(id)
      .then((res,err) => {
        console.log(res.data) //not seeing a response from the delete route
        // this.setState({
        //   tutor: res.data
        // })
        // this.forceUpdate();
        // this.componentWillUnmount()
        window.location = "/Tutors"
        // if page doesn't refresh, force a re-rendering
      })
      .catch(err => console.log(err));
  };

  // counts the number of students the tutor has taught/input
  countStudents = () => {
    let count = 0;
    let len = this.state.tutor.students.length;
    for (let i = 0; i < len; i++) {
      count++;
    }
    this.setState({totalStudents: count})
    return `Total Students: ${this.state.totalStudents}`;
  }

  filterStudents = (students) => {
    let results = students.filter(
      (match) => {
        return match.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }
    )
    return results;
  }

  render(){
    return(
      <div>
        <Nav/>
        <div>
        <Container>
          <Row>
            <Col s={12}>
              {this.state.tutor && this.state.tutor.students && (
              <TutorCard _tutorEventUpdate={this._tutorEventUpdate}
                header={this.state.tutor.tutorPic}
                title={this.state.tutor.username}
                count={this.state.totalStudents}
                contract={this.state.tutor.contract}
                events={this.state.tutor.events}>
              </TutorCard>)}
            </Col>
          </Row>
          <Row>
            <Col s={12}>
            <Row>
              <Input className="search" type="text" placeholder={"Search student by name..."} value={this.state.search} onChange={this.updateSearch.bind(this)} />
            </Row>
            <Row>
               {/* <Collection> */}
               {this.state && this.state.tutor && this.state.tutor.students && this.filterStudents(this.state.tutor.students).map((match) => {
                 return (
                  <div>
                     <StudentCard _tutorEventUpdate={this._tutorEventUpdate}
                      key={match._id}
                      link={match._id}
                      header={match.picture}
                      reveal={match.notes}
                      title={match.firstName}
                      notes={match.notes}
                      likes={match.likes}
                      family={match.family}
                      birthday={match.birthday}
                      age={match.age}
                      location={match.location}>
                    </StudentCard>
                    <DeleteBtn onClick={() => this.deleteStudent(match._id)} />
                  </div>)
                })}
              </Row>
            </Col>
          </Row>
        </Container>
        </div>
      </div>
    );
  };
}; // end class

export default Tutors;
