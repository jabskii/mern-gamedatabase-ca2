import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';

const Publisher = props => <></>;

export default class PublisherShow extends Component {
	constructor(props) {
		super(props);

		this.state = {
			publisher: {},
			show: false,
			loading: true
		};
	}

	componentDidMount() {
		const { id } = this.props.match.params;

		axios
			.get(`http://localhost:5000/publishers/${id}`)
			.then(response => {
				console.log(response);
				this.setState({
					publisher: response.data,
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
			.delete(`http://localhost:5000/publishers/${id}`)
			.then(response => {
				window.location = '/publishers';
			})
			.catch(error => {
				console.log(error);
			});
	}

	AlertDismissible() {
		return (
			<>
				<Alert show={this.state.show} variant='secondary'>
					<Alert.Heading>Confirm</Alert.Heading>
					<p>
						Are you sure you want to delete this publisher -{' '}
						{this.state.publisher.name}
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
		const { publisher, loading, show } = this.state;

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
					<Card.Header as='h5'>{this.state.publisher.name}</Card.Header>

					<Publisher publisher={this.state.publisher} />
					<Card.Footer>
						<span className='float-left'>
							{
								<Button as={Link} to='/publishers' variant='primary'>
									View all publishers
								</Button>
							}
						</span>
						{localStorage.jwtToken != null ? (
							<>
								<span className='float-left'>
									{
										<Button
											className='btn-warning ml-2'
											as={Link}
											to={`/publishers/update/${this.state.publisher._id}`}
											variant='primary'
										>
											Update Publisher
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
			</>
		);
	}
}
