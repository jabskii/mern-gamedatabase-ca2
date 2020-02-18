import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";

//Functional Components
const Genre = props => (
  <>
    <Row>
      <Col sm={6}>
        <Card.Body>
          {/* <Card.Img src={defaultDeveloper} roundedCircle /> */}
        </Card.Body>
      </Col>
      <Col sm={6}>
        <Card.Body>
          <Card.Title>Games</Card.Title>
          {/* <ListGroup>
            {props.genre.games.map(game => {
              return <ListGroupItem>{game.title}</ListGroupItem>;
            })}
          </ListGroup> */}
        </Card.Body>
        <Card.Body>
          <Card.Title>Genre</Card.Title>
          <ListGroup>
            {/* <ListGroupItem>{props.platform.igdb_id}</ListGroupItem> */}
            <ListGroupItem>{props.genre.name}</ListGroupItem>
          </ListGroup>
        </Card.Body>
      </Col>
    </Row>
  </>
);

export default class GenreShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genre: {},
      show: false,
      loading: true
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    axios
      .get(`http://localhost:5000/genres/${id}`)
      .then(response => {
        console.log(response);
        this.setState({
          genre: response.data,
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  delete() {
    const { id } = this.props.match.params;

    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );
    axios
      .delete(`http://localhost:5000/genres/${id}`)
      .then(response => {
        window.location = "/genres";
      })
      .catch(error => {
        console.log(error);
      });
    // window.location
  }

  // DELETE confirmation before hitting endpoint. Show and hide by setting state
  AlertDismissible() {
    return (
      <>
        <Alert show={this.state.show} variant="secondary">
          <Alert.Heading>Confirm</Alert.Heading>
          <p>
            Are you sure you want to delete this genre -{" "}
            {this.state.genre.name}
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => {
                this.setState({ show: false });
                this.delete();
              }}
              variant="outline-danger"
            >
              Delete
            </Button>
          </div>
        </Alert>
      </>
    );
  }

  render() {
    const { genre, loading, show } = this.state;

    if (loading) {
      return (
        <>
          <h3>Loading...</h3>
        </>
      );
    }

    return (
      <>
        <br />
        <Card>
          {this.AlertDismissible()}
          <Card.Header as="h5">{this.state.genre.name}</Card.Header>

          <Genre genre={this.state.genre} />
          <Card.Footer>
            <span className="float-left">
              {
                <Button as={Link} to="/genres" variant="primary">
                  View all genres
                </Button>
              }
            </span>
            {/* conditional component rendering, show buttons for crud abilities if signed in */}
            {localStorage.jwtToken != null ? (
              <>
                <span className="float-left">
                  {
                    <Button
                      as={Link}
                      to={`/genres/update/${this.state.genre._id}`}
                      variant="primary"
                    >
                      Update Genre
                    </Button>
                  }
                </span>
                <span className="float-right">
                  <Button
                    as={Link}
                    onClick={() => {
                      this.setState({
                        show: true
                      });
                    }}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </span>
              </>
            ) : (
              <></>
            )}
          </Card.Footer>
        </Card>
      </>
    );
  }
}
