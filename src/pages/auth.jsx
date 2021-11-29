import React, { useContext } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { AppContext } from '../services/AppContext';
import styles from './auth.module.css';

export function SignIn() {
	const { api } = useContext(AppContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		console.log({
			email,
			password,
		});
		try {
			let token = await api.signIn({
				email,
				password,
			});
			console.log(token);
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
	const { api } = useContext(AppContext);
	const [redirect, setRedirect] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');

	const viewPassword = (event) => {
		event.preventDefault();
		setShowPassword(!showPassword);
	};

	const disable =
		!email || !firstName || !lastName || !password || password.length < 6;

	const onSubmit = (e) => {
		e.preventDefault();
		const name = `${firstName} ${lastName}`;
		console.log({
			name,
			email,
			password,
		});
		api.signUp({
			name,
			email,
			password,
		})
			.then(() => {
				alert('Account created succesfully, please login');
				setRedirect('/signin');
			})
			.catch((e) => {
				alert(e.message);
			});
	};

	if (redirect) {
		return <Redirect to={redirect} />;
	}

	return (
		<div className={styles['view']}>
			<form onSubmit={onSubmit}>
				<picture>
					<img />
				</picture>
				<section>
					<input
						placeholder="Email"
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						value={email}
						type="email"
					/>
					<input
						placeholder="First Name"
						onChange={(e) => {
							setFirstName(e.target.value);
						}}
						value={firstName}
						type="text"
					/>
					<input
						placeholder="Last Name"
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value);
						}}
						type="text"
					/>
					<div className={styles['signup-password']}>
						<input
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							placeholder="Password"
							type={showPassword ? 'text' : 'password'}
						></input>
						<button type={'button'} onClick={viewPassword}>
							<div
								className={
									showPassword ? styles['not-show'] : ''
								}
							/>
						</button>
					</div>

					<p>
						Have an account? <Link to={'/signin'}>Sign In</Link>
					</p>
				</section>
				<section>
					{disable ? (
						<button
							disabled
							type={'button'}
							className={styles['submit-btn']}
						>
							Submit
						</button>
					) : (
						<button
							type={'submit'}
							className={styles['submit-btn']}
						>
							Submit
						</button>
					)}
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
