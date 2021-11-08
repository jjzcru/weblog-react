import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import { AppContext } from '../services/AppContext';
import styles from './main.module.css';

export function Main() {
	const { api, isAuthenticated } = useContext(AppContext);
	const [categories, setCategories] = useState([]);
	if (!isAuthenticated) {
		return <Redirect to="/signin" />;
	}
	useEffect(() => {
		api.getCategories()
			.then((categories) => {
				setCategories(categories);
			})
			.catch((e) => alert(e.message));
	}, []);
	return (
		<main className={styles['home-view']}>
			<Categories categories={categories} />
			<Empty message={'Please select a category'} />
		</main>
	);
}

export function SelectedCategory() {
	const { isAuthenticated, api } = useContext(AppContext);
	const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState(null);
	const [posts, setPosts] = useState([]);
	const { categoryId } = useParams();

	if (!isAuthenticated) {
		return <Redirect to="/signin" />;
	}
	useEffect(() => {
		api.getCategories()
			.then((categories) => {
				let category = categories.filter(c => `${c.id}` === `${categoryId}`);
				if(!category.length) {
					window.location.href = '/categories';
					return;
				}
				category = category[0];
				setCategory(category);
				setCategories(categories);
				return api.getPostsByCategory({categoryId})
			})
			.then((posts) => {
				setPosts(posts);
			})
			.catch((e) => alert(e.message));
	}, [categoryId]);


	
	return (
		<main className={styles['posts-view']}>
			<Categories categories={categories} />
			{category ? <Posts category={category} posts={posts} /> : null}
			<Empty message={'Please select a post'} />
		</main>
	);
}

export function SelectedPost() {
	const { isAuthenticated, api } = useContext(AppContext);
	const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState(null);
	const [posts, setPosts] = useState([]);
	const [post, setPost] = useState(null);
	const { categoryId, postId } = useParams();
	if (!isAuthenticated) {
		return <Redirect to="/signin" />;
	}
	useEffect(() => {
		api.getCategories()
			.then((categories) => {
				let category = categories.filter(c => `${c.id}` === `${categoryId}`);
				if(!category.length) {
					window.location.href = '/categories';
					return;
				}
				category = category[0];
				setCategory(category);
				setCategories(categories);
				return api.getPostsByCategory({categoryId})
			})
			.then((posts) => {
				let post = posts.filter(p => `${p.id}` === `${postId}`);
				if(!post.length) {
					window.location.href = `/categories`;
					return;
				}
				post = post[0];
				setPost(post);
				setPosts(posts);
			})
			.catch((e) => alert(e.message));
	}, [categoryId]);

	return (
		<main className={styles['post-view']}>
			<Categories categories={categories} />
			{category ? <Posts category={category} posts={posts} /> : null}
			{post ? <Post post={post} /> : null}
		</main>
	);
}
function Categories({ img, username, categories }) {
	return (
		<section className={styles['categories']}>
			<header>
				<div>
					<img />
				</div>
				<div>User name</div>
			</header>
			<ul>
				{categories.map((category) => {
					const { id, name } = category;
					return (
						<li key={id}>
							<Link to={`/categories/${id}`}>{name}</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

function Posts({ category, posts }) {
	const { id, name } = category;

	let component = (
		<ul>
			{posts.map((post, i) => {
				const { title, description } = post;
				return (
					<li key={post.id}>
						<Link to={`/categories/${id}/${post.id}`}>
							<h3>{title}</h3>
							<p>{description}</p>
						</Link>
					</li>
				);
			})}
		</ul>
	);
	if (!posts.length) {
		component = <EmptyPosts />;
	}

	return (
		<section className={styles['posts']}>
			<header>
				<div>
					<img />
				</div>
				<div>{name}</div>
				<div>
					<button>X</button>
				</div>
			</header>
			{component}
		</section>
	);
}

function EmptyPosts() {
	return (
		<div className={styles['empty-posts']}>
			<h3>There are not posts in this category</h3>
		</div>
	);
}

function Post({ post }) {
	const { title, description, comments } = post;
	return (
		<section className={styles['post']}>
			<header>
				<div>{title}</div>
			</header>
			<section>
				<h2>{title}</h2>
				<p>{description}</p>
				<form>
					<textarea placeholder={'Comment'} />
				</form>
			</section>
			<ul className={styles['comments']}>
				{comments && comments.length
					? comments.map((comment, i) => {
							const { content, id, userImg } = comment;
							return (
								<li key={i}>
									<div>
										<img />
									</div>
									<span>{content}</span>
								</li>
							);
					  })
					: null}
			</ul>
		</section>
	);
}

function Empty({ message }) {
	return (
		<section className={styles['empty']}>
			<h2>{message}</h2>
		</section>
	);
}
