import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Alert, Row, Col, ListGroupItem, ListGroup } from 'react-bootstrap';

const Developer = props => {
	return <ListGroupItem>{props.developer}</ListGroupItem>;
};
const Publisher = props => {
	return <ListGroupItem>{props.publisher}</ListGroupItem>;
};
const Platform = props => {
	return <ListGroupItem>{props.platform}</ListGroupItem>;
};
const Game_mode = props => {
	return <ListGroupItem>{props.game_mode}</ListGroupItem>;
};
const Genre = props => <Badge variant='light'>{props.genre}</Badge>;

export default class GameShow extends Component {
	constructor(props) {
		super(props);

		this.state = {
			game: {},
			show: false,
			loading: true
		};
	}

	componentDidMount() {
		const { id } = this.props.match.params;

		axios
			.get(`http://localhost:5000/games/${id}`)
			.then(response => {
				console.log(response);
				this.setState({
					game: response.data,
					loading: false
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	delete() {
		const { id } = this.props.match.params;

		axios.defaults.headers.common['Authorization'] = localStorage.getItem(
			'jwtToken'
		);
		axios
			.delete(`http://localhost:5000/games/${id}`)
			.then(response => {
				console.log(response);
				window.location = '/';
			})
			.catch(error => {
				console.log(error);
			});
	}

	developerList() {
		return this.state.game.developer_id.map((currentDeveloper, index) => {
			return <Developer developer={currentDeveloper.name} key={index} />;
		});
	}

	publisherList() {
		return this.state.game.publisher_id.map((currentPublisher, index) => {
			return <Publisher publisher={currentPublisher.name} key={index} />;
		});
	}

	platformList() {
		return this.state.game.platform_id.map((currentPlatform, index) => {
			return <Platform platform={currentPlatform.name} key={index} />;
		});
	}

	game_modeList() {
		return this.state.game.game_mode_id.map((currentGame_mode, index) => {
			return <Game_mode game_mode={currentGame_mode.name} key={index} />;
		});
	}

	genreList() {
		return this.state.game.genre_id.map((currentGenre, index) => {
			return <Genre genre={currentGenre.name} key={index} />;
		});
	}

	AlertDismissible() {
		return (
			<>
				<Alert show={this.state.show} variant='secondary'>
					<Alert.Heading>Confirm</Alert.Heading>
					<p>
						Are you sure you want to delete this game - {this.state.game.title}
					</p>
					<hr />
					<div className='d-flex justify-content-end'>
						<Button
							onClick={() => {
								this.setState({ show: false });
								this.delete();
							}}
							variant='outline-danger'
						>
							Delete
						</Button>
					</div>
				</Alert>
			</>
		);
	}

	render() {
		const { game, loading, show } = this.state;

		if (loading) {
			return (
				<div>
					<h3>Loading...</h3>
				</div>
			);
		}

		return (
			<div>
				<br />
				<Card>
					{this.AlertDismissible()}
					<Card.Header as='h5'>
						{game.title} <span className='float-right'>{this.genreList()}</span>
					</Card.Header>

					<Row>
						<Col sm={12}>
							<Card.Body>
								<Card.Title>Description</Card.Title>
								<Card.Text>{this.state.game.description}</Card.Text>
							</Card.Body>
						</Col>
						<Col sm={6}>
							<Card.Body>
								<Card.Title>Developer(s)</Card.Title>
								<ListGroup>{this.developerList()}</ListGroup>
							</Card.Body>
							<Card.Body>
								<Card.Title>Publisher(s)</Card.Title>
								<ListGroup>{this.publisherList()}</ListGroup>
							</Card.Body>
						</Col>
						<Col sm={6}>
							<Card.Body>
								<Card.Title>Platform(s)</Card.Title>
								<ListGroup>{this.platformList()}</ListGroup>
							</Card.Body>
						</Col>
					</Row>
					<Card.Footer>
						<span className='float-left mr-2'>
							{
								<Button as={Link} to='/' variant='primary'>
									View all games
								</Button>
							}
						</span>
						{localStorage.jwtToken != null ? (
							<>
								<span className='float-left'>
									{
										<Button
											className='btn-warning'
											as={Link}
											to={`/games/update/${this.state.game._id}`}
											variant='primary'
										>
											Update game
										</Button>
									}
								</span>
								<span className='float-right'>
									<Button
										as={Link}
										onClick={() => {
											this.setState({
												show: true
											});
										}}
										variant='danger'
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
			</div>
		);
	}
}
