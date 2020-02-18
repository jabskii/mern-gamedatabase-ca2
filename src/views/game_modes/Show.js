import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";

//Functional Components
const Game_mode = props => (
  <>
  </>
);

export default class GameModeShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game_mode: {},
      show: false,
      loading: true
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    axios
      .get(`http://localhost:5000/game_modes/${ id }`)
      .then(response => {
        console.log(response);
        this.setState({
          game_mode: response.data,
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
      .delete(`http://localhost:5000/game_modes/${ id }`)
      .then(response => {
        window.location = "/game_modes";
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
        <Alert show={ this.state.show } variant="secondary">
          <Alert.Heading>Confirm</Alert.Heading>
          <p>
            Are you sure you want to delete this game mode -{" "}
            { this.state.game_mode.name }
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
    const { game_mode, loading, show } = this.state;

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
          <Card.Header as="h5">{this.state.game_mode.name}</Card.Header>

          <Game_mode game_mode={this.state.game_mode} />
          <Card.Footer>
            <span className="float-left">
              {
                <Button as={ Link } to="/game_modes" variant="primary">
                  View all Game modes
                </Button>
              }
            </span>
            {/* conditional component rendering, show buttons for crud abilities if signed in */}
            {localStorage.jwtToken != null ? (
              <>
                <span className="float-left">
                  {
                    <Button
                      className="btn-warning ml-2"
                      as={ Link }
                      to={`/game_modes/update/${ this.state.game_mode._id }`}
                      variant="primary"
                    >
                      Update Game mode
                    </Button>
                  }
                </span>
                <span className="float-right">
                  <Button
                    as={ Link }
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
