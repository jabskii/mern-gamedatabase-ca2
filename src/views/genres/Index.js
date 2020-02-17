import React, { Component } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Card,
  CardColumns,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl
} from 'react-bootstrap';

//Functional React Component
const Game = props => (
  <Card>
    <Card.Body>
      <Card.Title>{props.game.title}</Card.Title>
      <Card.Text>{props.game.description}</Card.Text>
    </Card.Body>
    <Card.Body>
      <Card.Link href={`games/${props.game._id}`}>Show Game</Card.Link>
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">{props.game.lastUpdated}</small>
    </Card.Footer>
  </Card>
);

export default class GameIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      search: ''
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/games/')
      .then(response => {
        console.log(response);
        this.setState({
          games: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    console.log(`Input name ${name}. Input value ${value}.`);

    this.setState({
      [name]: value
    });
  };

  handleSearchInput = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    console.log(`Input name ${name}. Input value ${value}.`);

    this.setState({
      search: value
    });
  };

  gameList() {}

  render() {
    let filteredGames = this.state.games.filter(game => {
      console.log(game.title);
      return game.title.toLowerCase().indexOf(this.state.search) !== -1;
    });
    return (
      <>
        <Row>
          <Col sm={12}>
            <h3>Game List</h3>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={8}>
            {localStorage.jwtToken != null ? (
              <Button as={Link} to="/games/create">
                Add Game
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
                onChange={this.handleSearchInput}
              />
            </InputGroup>
          </Col>
        </Row>

        <CardColumns>
          {filteredGames.map(b => {
            return <Game game={b} key={b._id} />;
          })}
        </CardColumns>
      </>
    );
  }
}
GameIndex.propTypes = {
  search: propTypes.string
};
