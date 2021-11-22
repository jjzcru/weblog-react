import React, { Component } from 'react';
import styles from './app.module.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppContext } from './services/AppContext';
import ReloadPrompt from './ReloadPrompt';

import { Main, SelectedCategory, SelectedPost } from './pages/main';
import { Home } from './pages/home';
import { SignIn, SignUp } from './pages/auth';
import { Api } from './services/Api';

const host = 'https://weblog-next.vercel.app/api';

export class App extends Component {
	state = {
		api: new Api(host),
		me: null,
		isAuthenticated: false,
	};
	componentDidMount() {
		const { api } = this.state;
		if (localStorage.getItem('token')) {
			api.setToken(localStorage.getItem('token'));
			this.setState({ isAuthenticated: true });
			this.getMe(api)
				.then((me) => {
					this.setState({ me });
				})
				.then(() => {
					console.log(`Load successfully`);
				})
				.catch(console.error);
		}
	}

	getMe = async (api) => {
		return await api.getMe();
	};

	render() {
		const { api, me, isAuthenticated } = this.state;
		return (
			<AppContext.Provider
				value={{
					api,
					me,
					isAuthenticated
				}}
			>
				<main className={styles['app']}>
					<Router>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/signin" component={SignIn} />
							<Route exact path="/signup" component={SignUp} />
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
