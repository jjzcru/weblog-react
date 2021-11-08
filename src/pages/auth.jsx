import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { AppContext } from '../services/AppContext';
import styles from './auth.module.css';

export function SignIn() {
	const { api, isAuthenticated } = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

    if(isAuthenticated) {
		return <Redirect to='/categories'/>
	}

	const onSubmit = async (e) => {
		e.preventDefault();
        setIsLoading(true);
		try {
			const token = await api.signIn({ email, password });
			if (token) {
				localStorage.setItem('token', token.authToken);
				localStorage.setItem('expiredAt', token.expiredAt);
				window.location = '/categories';
			} else {
				alert('Something happened please try again');
			}
		} catch (e) {
			alert(e.message);
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
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						placeholder="Email"
						type="email"
						required
					/>
					<input
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						placeholder="Password"
						type="password"
						required
					/>
					<p style={{ diplay: 'none' }}>
						Need an account? <Link to={'/signup'}>Sign Up</Link>
					</p>
				</section>
				<section>
					{isLoading ? (
						<button disabled>Submit</button>
					) : (
						<button>Submit</button>
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
