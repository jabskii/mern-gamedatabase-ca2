import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const Developers = props => (
  <option value={props.developer._id}> {props.developer.name} </option>
);
const Publishers = props => (
  <option value={props.publisher._id}>{props.publisher.name}</option>
);
const Genres = props => (
  <option value={props.genre._id}>{props.genre.name}</option>
);
const Platforms = props => (
  <option value={props.platform._id}>{props.platform.name}</option>
);
const Game_modes = props => (
  <option value={props.game_mode._id}>{props.game_mode.name}</option>
);

export default class GameCreate extends Component {
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
      game_mode: []
    };
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );
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
    // console.log(this.state.developer_id);
    let developerJSON = this.state.developer_id;
    let publisherJSON = this.state.publisher_id;
    let genreJSON = this.state.genre_id;
    let platformJSON = this.state.platform_id;

    const book = {
      isbn: this.state.isbn,
      title: this.state.title,
      description: this.state.description,
      genre_id: genreJSON,
      author_id: authorJSON
      // cover: this.state.cover
    };

    console.log(book);
    axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'jwtToken'
    );

    axios
      .post('http://localhost:4000/books', book)
      .then(res => {
        console.log(res.data);
        window.location = '/';
      })
      .catch(err => {
        console.log(err);
        window.location = '/books/create';
      });
  };

  genreList() {
    return this.state.genres.map((currentGenre, index) => {
      return <Genre genre={currentGenre} key={index} />;
    });
  }
  authorList() {
    return this.state.authors.map((currentAuthor, index) => {
      return <Author author={currentAuthor} key={index} />;
    });
  }

  render() {
    return (
      <div>
        <h3>Add new Book</h3>
        <Form onSubmit={this.onSubmit} encType="multipart/form-data">
          <Form.Group as={Row} controlId="formHorizontalISBN">
            <Form.Label column sm={2}>
              ISBN
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                type="text"
                placeholder="ISBN"
                name="isbn"
                value={this.state.isbn}
                onChange={this.handleInputChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalTitle">
            <Form.Label column sm={2}>
              Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                type="text"
                placeholder="Title"
                name="title"
                value={this.state.title}
                onChange={this.handleInputChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalDescription">
            <Form.Label column sm={2}>
              Description
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                type="text"
                placeholder="Description"
                name="description"
                value={this.state.description}
                onChange={this.handleInputChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalGenre">
            <Form.Label column sm={2}>
              Genre
            </Form.Label>
            <Col sm={4}>
              <InputGroup>
                <Form.Control
                  required
                  as="select"
                  multiple
                  placeholder="Genre"
                  name="genre_id"
                  onChange={this.addGenre}
                >
                  {this.genreList()}
                </Form.Control>
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalAuthor">
            <Form.Label column sm={2}>
              Author
            </Form.Label>
            <Col sm={4}>
              <InputGroup>
                <Form.Control
                  required
                  as="select"
                  multiple
                  placeholder="Author"
                  name="author_id"
                  onChange={this.addAuthor}
                >
                  {this.authorList()}
                </Form.Control>
              </InputGroup>
            </Col>
          </Form.Group>

          {/* <Form.Group
            as={Row}
            controlId="formHorizontalAuthor"
            className="custome-file"
          >
            <Form.Label column sm={2}>
              Cover Upload
            </Form.Label>
            <Col sm={8}>
               <InputGroup> 
              <Form.Control
                type="file"
                placeholder="cover"
                name="file"
                onChange={this.cover}
              ></Form.Control>
            </Col>
          </Form.Group> */}

          <br />
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Add Book</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
