import React from 'react';
import styles from './home.module.css';
import {BottomBar} from '../components/BottomBar'

export default function Home() {
	return (
		<div className={'view'}>
			<header>
				Home
			</header>
			<main>Home</main>
			<BottomBar selected={'home'}/>
		</div>
	);
}
