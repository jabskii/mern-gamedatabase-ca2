import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

import {
  Card,
  ListGroup,
  ListGroupItem,
  CardColumns,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl
} from "react-bootstrap";

//Functional component and handeling props
const Publisher = props => (
  <Card>
    <Card.Body>
      {/* <Card.Img src={defaultPublisher} roundedCircle /> */}
      <Card.Title>{props.publisher.name}</Card.Title>
    </Card.Body>
    {/* <ListGroup className="list-group-flush">
      {props.publisher.games.map(game => {
        return <ListGroupItem>{game.title}</ListGroupItem>;
      })}
    </ListGroup> */}
    <Card.Body>
      <Card.Link href={`publishers/${props.publisher._id}`}>Show Publisher</Card.Link>
    </Card.Body>

    <Card.Footer>
      <small className="text-muted">{props.publisher.name}</small>
    </Card.Footer>
  </Card>
);

export default class PublisherIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publishers: [],

      search: ""
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/publishers/")
      .then(response => {
        console.log(response);
        this.setState({
          publishers: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleInputChange = e => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  };

  render() {
    let filteredPublishers = this.state.publishers.filter(publisher => {
      return publisher.name.toLowerCase().indexOf(this.state.search) !== -1;
    });

    return (
      <>
        <Row>
          <Col sm={12}>
            <h3>Publisher List</h3>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={8}>
            {localStorage.jwtToken != null ? (
              <Button as={Link} to="/publishers/create">
                Add Publisher
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login">
                  Login to Create
                </Button>
              </>
            )}
          </Col>
          <Col sm={4}>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Search"
                name="search"
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={this.state.search}
                onChange={this.handleInputChange}
              />
            </InputGroup>
          </Col>
        </Row>

        <CardColumns>
          {/* mapping the functional components and looping through them */}
          {filteredPublishers.map(p => {
            return <Publisher publisher={p} key={p._id} />;
          })}
        </CardColumns>
      </>
    );
  }
}
//Prop types insuring that only a string is being inputed
PublisherIndex.propTypes = {
  search: propTypes.string
};
