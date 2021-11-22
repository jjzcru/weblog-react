import React, { useContext } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../services/AppContext';
import styles from './auth.module.css';

export function SignIn() {
    const {api} = useContext(AppContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
        console.log({
            email,
            password
        })
		try {
			let token = await api.signIn({
				email,
				password,
			});
            console.log(token)
			if (token) {
				localStorage.setItem('token', token.authToken);
				localStorage.setItem('expiredAt', token.expiredAt);
				window.location = '/categories';
			} else {
				alert('Something happened please try again');
			}
		} catch (e) {
			alert(e.messae);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className={styles['view']}>
			<form onSubmit={onSubmit}>
				<picture>
					<img />
				</picture>
				<section>
					<input
						placeholder="Email"
						type="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
					<input
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
					<p>
						Need an account? <Link to={'/signup'}>Sign Up</Link>
					</p>
				</section>
				<section>
					<button disabled={!email || !password || isLoading}>
						Submit
					</button>
				</section>
			</form>
			<div
				className={styles['gradient']}
				style={{
					animation: 'gradient 10s ease infinite',
				}}
			/>
		</div>
	);
}

export function SignUp() {
	return (
		<div className={styles['view']}>
			<form>
				<picture>
					<img />
				</picture>
				<section>
					<input placeholder="Email" type="email" />
					<input placeholder="Password" type="password" />
					<p>
						Have an account? <Link to={'/signin'}>Sign In</Link>
					</p>
				</section>
				<section>
					<button>Submit</button>
				</section>
			</form>
			<div
				className={styles['gradient']}
				style={{
					animation: 'gradient 10s ease infinite',
				}}
			/>
		</div>
	);
}
