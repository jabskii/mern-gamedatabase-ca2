import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const Developer = props => (
  <option value={ props.developer._id }> { props.developer.name } </option>
);
const Publisher = props => (
  <option value={ props.publisher._id }>{ props.publisher.name }</option>
);
const Genre = props => (
  <option value={ props.genre._id }>{ props.genre.name }</option>
);
const Platform = props => (
  <option value={ props.platform._id }>{ props.platform.name }</option>
);
const Game_mode = props => (
  <option value={ props.game_mode._id }>{ props.game_mode.name }</option>
);

export default class BookEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      igdb_id: '',
      title: '',
      release_date: '',
      metacritic_rating: '',
      description: '',
      developers: [],
      developer_id: [],
      publishers: [],
      publisher_id: [],
      genres: [],
      genre_id: [],
      platforms: [],
      platform_id: [],
      game_modes: [],
      game_mode_id: []
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    console.log(id);

    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );
    axios.get(`http://localhost:5000/games/${ id }`).then(result => {
      console.log(result);
      this.setState({
        igdb_id: result.data.igdb_id,
        title: result.data.title,
        release_date: result.data.release_date,
        metacritic_rating: result.data.metacritic_rating,
        description: result.data.description,
        developer_id: result.data.developer_id,
        publisher_id: result.data.publisher_id,
        genre_id: result.data.genre_id,
        platform_id: result.data.platform_id,
        game_mode_id: result.data.game_mode_id
      });
    });

    axios.get(`http://localhost:5000/developers`).then(developers => {
      console.log(developers);
      this.setState({
        developers: developers.data
      });
    });

    axios.get(`http://localhost:5000/publishers`).then(publishers => {
      console.log(publishers);
      this.setState({
        publishers: publishers.data
      });
    });

    axios.get(`http://localhost:5000/genres`).then(genres => {
      console.log(genres);
      this.setState({
        genres: genres.data
      });
    });

    axios.get(`http://localhost:5000/platforms`).then(platforms => {
      console.log(platforms);
      this.setState({
        platforms: platforms.data
      });
    });

    axios.get(`http://localhost:5000/game_modes`).then(game_modes => {
      console.log(game_modes);
      this.setState({
        game_modes: game_modes.data
      });
    });
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log(`Input name ${ name }. Input value ${ value }.`);

    this.setState({
      [name]: value
    });
  };

  addDeveloper = e => {
    const target = e.target;
    const name = target.name;

    var options = target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({
      [name]: value
    });
  };

  addPublisher = e => {
    const target = e.target;
    const name = target.name;

    var options = target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({
      [name]: value
    });
  };

  addGenre = e => {
    const target = e.target;
    const name = target.name;

    var options = target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({
      [name]: value
    });
  };

  addPlatform = e => {
    const target = e.target;
    const name = target.name;

    var options = target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({
      [name]: value
    });
  };

  addGame_mode = e => {
    const target = e.target;
    const name = target.name;

    var options = target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({
      [name]: value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { id } = this.props.match.params;

    const game = {
      igdb_id: this.state.igdb_id,
      title: this.state.title,
      description: this.state.description,
      release_date: this.state.release_date,
      metacritic_rating: this.state.metacritic_rating,
      developer_id: this.state.developer_id,
      publisher_id: this.state.publisher_id,
      genre_id: this.state.genre_id,
      platform_id: this.state.platform_id,
      game_mode_id: this.state.game_mode_id
    };
    console.log(game);

    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );

    axios
      .put(`http://localhost:5000/games/${ id }`, game)
      .then(res => {
        console.log(res.data);
        window.location = '/';
        console.log(game);
      })
      .catch(err => {
        console.log(err);
      });
  };

  developerList() {
    return this.state.developers.map((currentDeveloper, index) => {
      return <Developer developer={ currentDeveloper } key={ index } />;
    });
  }
  publisherList() {
    return this.state.publishers.map((currentPublisher, index) => {
      return <Publisher publisher={ currentPublisher } key={ index } />;
    });
  }
  genreList() {
    return this.state.genres.map((currentGenre, index) => {
      return <Genre genre={ currentGenre } key={ index } />;
    });
  }
  platformList() {
    return this.state.platforms.map((currentPlatform, index) => {
      return <Platform platform={ currentPlatform } key={ index } />;
    });
  }
  game_modeList() {
    return this.state.game_modes.map((currentGame_mode, index) => {
      return <Game_mode game_mode={ currentGame_mode } key={ index } />;
    });
  }

  render() {
    return (
      <div>
        <h3>Update Game</h3>
        <Form onSubmit={ this.onSubmit }>
          <Form.Group as={ Row } controlId="formHorizontalIGDB">
            <Form.Label column sm={ 2 }>
              igdb_id
            </Form.Label>
            <Col sm={ 10 }>
              <Form.Control
                required
                type="text"
                placeholder="igdb_id"
                name="igdb_id"
                value={ this.state.igdb_id }
                onChange={ this.handleInputChange }
              />
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalTitle">
            <Form.Label column sm={ 2 }>
              Title
            </Form.Label>
            <Col sm={ 10 }>
              <Form.Control
                required
                type="text"
                placeholder="Title"
                name="title"
                value={ this.state.title }
                onChange={ this.handleInputChange }
              />
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalDescription">
            <Form.Label column sm={ 2 }>
              Description
            </Form.Label>
            <Col sm={ 10 }>
              <Form.Control
                required
                as="textarea"
                rows="4"
                type="text"
                placeholder="Description"
                name="description"
                value={ this.state.description }
                onChange={ this.handleInputChange }
              />
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalReleaseDate">
            <Form.Label column sm={ 2 }>
              Release Date
            </Form.Label>
            <Col sm={ 10 }>
              <Form.Control
                required
                type="text"
                placeholder="Release Date"
                name="release_date"
                value={ this.state.release_date }
                onChange={ this.handleInputChange }
              />
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalMetacriticRating">
            <Form.Label column sm={ 2 }>
              Metacritic Rating
            </Form.Label>
            <Col sm={ 10 }>
              <Form.Control
                required
                type="text"
                placeholder="Metacritic Rating"
                name="metacritic_rating"
                value={ this.state.metacritic_rating }
                onChange={ this.handleInputChange }
              />
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalDeveloper">
            <Form.Label column sm={ 2 }>
              Developer
            </Form.Label>
            <Col sm={ 4 }>
              <InputGroup>
                <Form.Control
                  required
                  as="select"
                  multiple
                  placeholder="Developer"
                  name="developer_id"
                  onChange={ this.addDeveloper }
                >
                  {this.developerList()}
                </Form.Control>
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalPublisher">
            <Form.Label column sm={ 2 }>
              Publisher
            </Form.Label>
            <Col sm={ 4 }>
              <InputGroup>
                <Form.Control
                  required
                  as="select"
                  multiple
                  placeholder="Publsiher"
                  name="publisher_id"
                  onChange={ this.addPublisher }
                >
                  { this.publisherList() }
                </Form.Control>
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalGenre">
            <Form.Label column sm={ 2 }>
              Genre
            </Form.Label>
            <Col sm={ 4 }>
              <InputGroup>
                <Form.Control
                  required
                  as="select"
                  multiple
                  placeholder="Genre"
                  name="genre_id"
                  onChange={ this.addGenre }
                >
                  { this.genreList() }
                </Form.Control>
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalPlatform">
            <Form.Label column sm={ 2 }>
              Platform
            </Form.Label>
            <Col sm={ 4 }>
              <InputGroup>
                <Form.Control
                  required
                  as="select"
                  multiple
                  placeholder="Platform"
                  name="platform_id"
                  onChange={ this.addPlatform }
                >
                  { this.platformList() }
                </Form.Control>
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={ Row } controlId="formHorizontalGameMode">
            <Form.Label column sm={ 2 }>
              Game Mode(s)
            </Form.Label>
            <Col sm={ 4 }>
              <InputGroup>
                <Form.Control
                  required
                  as="select"
                  multiple
                  placeholder="Game Mode(s)"
                  name="game_mode_id"
                  onChange={ this.addame_mode }
                >
                  { this.game_modeList() }
                </Form.Control>
              </InputGroup>
            </Col>
          </Form.Group>

          <br />
          <Form.Group as={ Row }>
            <Col sm={ { span: 10, offset: 2 } }>
              <Button type="submit">Finish</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
