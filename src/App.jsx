import React, { Component } from 'react';
import styles from './app.module.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppContext } from './services/AppContext';
import ReloadPrompt from './ReloadPrompt';

import {Main, SelectedCategory, SelectedPost} from './pages/main';
import {Home} from './pages/home';

export class App extends Component {
	state = {};
	componentDidMount() {
		
	}

	render() {
		return (
			<AppContext.Provider
				value={{
				}}
			>
				<main className={styles['app']}>
					<Router>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/categories" component={Main} />
							<Route exact path="/categories/:categoryId" component={SelectedCategory} />
							<Route exact path="/categories/:categoryId/:postId" component={SelectedPost} />
						</Switch>
					</Router>
				</main>
				<ReloadPrompt />
			</AppContext.Provider>
		);
	}
}

