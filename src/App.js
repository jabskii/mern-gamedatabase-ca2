import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import GameIndex from './views/games/Index';
import GameShow from './views/games/Show';
import GameCreate from './views/games/Create';
import GameEdit from './views/games/Edit';

import DeveloperIndex from './views/developers/Index';
import DeveloperShow from './views/developers/Show';
import DeveloperCreate from './views/developers/Create';
import DeveloperEdit from './views/developers/Edit';

import PublisherIndex from './views/publishers/Index';
import PublisherShow from './views/publishers/Show';
import PublisherCreate from './views/publishers/Create';
import PublisherEdit from './views/publishers/Edit';

import GenreIndex from './views/genres/Index';
import GenreShow from './views/genres/Show';
import GenreCreate from './views/genres/Create';
import GenreEdit from './views/genres/Edit';

import PlatformIndex from './views/platforms/Index';
import PlatformShow from './views/platforms/Show';
import PlatformCreate from './views/platforms/Create';
import PlatformEdit from './views/platforms/Edit';

import GameModeIndex from './views/game_modes/Index';
import GameModeShow from './views/game_modes/Show';
import GameModeCreate from './views/game_modes/Create';
import GameModeEdit from './views/game_modes/Edit';

import NavBar from './components/NavBar';
import Register from './views/users/Register';
import Login from './views/users/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: localStorage.getItem('jwtToken') !== null
		};
	}

	authHandler = () => {
		this.setState((state, props) => ({
			loggedIn: state.loggedIn ? false : true
		}));
	};

	render() {
		const loggedIn = this.state.loggedIn;
		return (
			<BrowserRouter>
				<NavBar loggedIn={loggedIn} onLogout={this.authHandler} />
				<Container>
					<Row>
						<Col>
							<Switch>
								{/* Game Route Compnents */}
								<Route path='/' exact component={GameIndex} />
								<Route exact path='/games/create'>
									{loggedIn ? <GameCreate /> : <Redirect to='/' />}
								</Route>
								<Route path='/games/:id' exact component={GameShow} />
								<Route path='/games/update/:id' exact component={GameEdit} />

								{/* Developer Route Compnents */}
								<Route exact path='/developers/create'>
									{loggedIn ? (
										<DeveloperCreate />
									) : (
										<Redirect to='/developers' />
									)}
								</Route>
								<Route path='/developers' exact component={DeveloperIndex} />
								<Route path='/developers/:id' exact component={DeveloperShow} />
								<Route
									path='/developers/update/:id'
									exact
									component={DeveloperEdit}
								/>

								{/* Publisher Route Compnents */}
								<Route exact path='/publishers/create'>
									{loggedIn ? (
										<PublisherCreate />
									) : (
										<Redirect to='/publishers' />
									)}
								</Route>
								<Route path='/publishers' exact component={PublisherIndex} />
								<Route path='/publishers/:id' exact component={PublisherShow} />
								<Route
									path='/publishers/update/:id'
									exact
									component={PublisherEdit}
								/>

								{/* Genre Route Compnents */}
								<Route exact path='/genres/create'>
									{loggedIn ? <GenreCreate /> : <Redirect to='/genres' />}
								</Route>
								<Route path='/genres' exact component={GenreIndex} />
								<Route path='/genres/:id' exact component={GenreShow} />
								<Route path='/genres/update/:id' exact component={GenreEdit} />

								{/* Platform Route Compnents */}
								<Route exact path='/platforms/create'>
									{loggedIn ? <PlatformCreate /> : <Redirect to='/platforms' />}
								</Route>
								<Route path='/platforms' exact component={PlatformIndex} />
								<Route path='/platforms/:id' exact component={PlatformShow} />
								<Route
									path='/platforms/update/:id'
									exact
									component={PlatformEdit}
								/>

								{/* Game Mode Route Compnents */}
								<Route exact path='/game_modes/create'>
									{loggedIn ? (
										<GameModeCreate />
									) : (
										<Redirect to='/game_modes' />
									)}
								</Route>
								<Route path='/game_modes' exact component={GameModeIndex} />
								<Route path='/game_modes/:id' exact component={GameModeShow} />
								<Route
									path='/game_modes/update/:id'
									exact
									component={GameModeEdit}
								/>

								{/* User Route components */}
								<Route path='/register' exact component={Register} />
								<Route
									path='/login'
									exact
									component={props => (
										<Login {...props} onLogin={this.authHandler} />
									)}
								/>
							</Switch>
						</Col>
					</Row>
				</Container>
			</BrowserRouter>
		);
	}
}

export default App;
