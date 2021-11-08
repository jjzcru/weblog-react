import React, { Component } from 'react';
import styles from './app.module.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppContext } from './services/AppContext';
import ReloadPrompt from './ReloadPrompt';

import { Main, SelectedCategory, SelectedPost } from './pages/main';
import { Home } from './pages/home';
import { SignIn } from './pages/auth';
import { Api } from './services/Api';

const host = 'https://weblog-next.vercel.app/api';

export class App extends Component {
	state = {
		api: new Api(host),
		isAuthenticated: false,
	};

	componentDidMount() {
		const { api } = this.state;
		if (localStorage.getItem('token')) {
			api.setToken(localStorage.getItem('token'));
			this.setState({ api, isAuthenticated: true });
		}
	}

	validateToken = () => {
		if (!localStorage.getItem('token')) {
			window.location = '/signin';
		}
	};

	render() {
		const { isAuthenticated, api } = this.state;
		return (
			<AppContext.Provider
				value={{
					isAuthenticated,
					api
				}}
			>
				<main className={styles['app']}>
					<Router>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/signin" component={SignIn} />
							<Route exact path="/categories" component={Main} />
							<Route
								exact
								path="/categories/:categoryId"
								component={SelectedCategory}
							/>
							<Route
								exact
								path="/categories/:categoryId/:postId"
								component={SelectedPost}
							/>
						</Switch>
					</Router>
				</main>
				<ReloadPrompt />
			</AppContext.Provider>
		);
	}
}
