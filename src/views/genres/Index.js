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
const Genre = props => (
  <Card>
    <Card.Body>
      <Card.Title>{props.genre.name}</Card.Title>
    </Card.Body>
    <ListGroup className="list-group-flush">
      {props.genre.games.map(game => {
        return <ListGroupItem>{game.title}</ListGroupItem>;
      })}
    </ListGroup>
    <Card.Body>
      <Card.Link href={`genres/${props.genre._id}`}>Show Genre</Card.Link>
    </Card.Body>

    <Card.Footer>
      {/* <small className="text-muted">{props.Plaform.igdb_id}</small> */}
    </Card.Footer>
  </Card>
);

export default class GenreIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genres: [],

      search: ""
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/genres/")
      .then(response => {
        console.log(response);
        this.setState({
          genres: response.data
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
    let filteredGenres = this.state.genres.filter(genre => {
      return genre.name.toLowerCase().indexOf(this.state.search) !== -1;
    });

    return (
      <>
        <Row>
          <Col sm={12}>
            <h3>Genre List</h3>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={8}>
            {localStorage.jwtToken != null ? (
              <Button as={Link} to="/genres/create">
                Add Genre
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
          {filteredGenres.map(a => {
            return <Genre genre={a} key={a._id} />;
          })}
        </CardColumns>
      </>
    );
  }
}
//Prop types insuring that only a string is being inputed
GenreIndex.propTypes = {
  search: propTypes.string
};
