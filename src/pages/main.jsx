import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './main.module.css';
import Modal from 'react-modal';
import { AppContext } from '../services/AppContext';

Modal.setAppElement('#root');

export function Main() {
	return (
		<main className={styles['home-view']}>
			<Categories />
			<Empty message={'Please select a category'} />
		</main>
	);
}

export function SelectedCategory() {
	const { categoryId } = useParams();
	const {api} = useContext(AppContext);
	const [category, setCategory] = useState(null);
	const [categories, setCategories] = useState([])
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		api.getCategories()
			.then((categories) => {
				setCategories(categories);
				for (const category of categories) {
					if (category.id === categoryId) {
						setCategory(category);
						break;
					}
				}
				return api.getPostsFromCategory(categoryId);
			})
			.then(setPosts)
			.catch(alert);
	}, []);
	return (
		<main className={styles['posts-view']}>
			<Categories categories={categories} />
			<Posts posts={posts} category={category} />
			<Empty message={'Please select a post'} />
		</main>
	);
}

export function SelectedPost() {
	const { categoryId, postId } = useParams();
	let category = null;
	for (const c of categories) {
		if (`${c.id}` === `${categoryId}`) {
			category = c;
			break;
		}
	}

	let post = null;
	for (const p of category.posts) {
		if (`${p.id}` === `${postId}`) {
			post = p;
			break;
		}
	}

	return (
		<main className={styles['post-view']}>
			<Categories categories={categories} />
			<Posts category={category} />
			<Post post={post} />
		</main>
	);
}
function Categories({ img, username }) {
	const { api } = useContext(AppContext);
	const [categories, setCategories] = useState([]);
	useEffect(() => {
		api.getCategories().then(setCategories).catch(alert);
	}, []);
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
	const [isNewPostOpen, setIsNewPostOpen] = useState(false);
	if(!category) {
		return null;
	}
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
					<button onClick={() => {
						setIsNewPostOpen(true);
					}}>Add </button>
				</div>
			</header>
			<div>
				<NewPost
					isOpen={isNewPostOpen}
					onClose={() => {
						setIsNewPostOpen(false);
					}}
				/>
			</div>
			{component}
		</section>
	);
}

function NewPost({ onClose, isOpen }) {
	const onSubmit = (e) => {
		e.preventDefault();
		console.log(`I add a new post`);
	};
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className={styles['new-post-modal']}
			contentLabel="New Post Modal"
		>
			<h2>Add new post to the category</h2>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					className={styles['post-title']}
					placeholder={'Title'}
				/>
				<br />
				<br />
				<textarea
					placeholder={'Write new blog post...'}
					className={styles['post-textarea']}
				/>
				<br />
				<br />
				<button onClick={onClose} className={styles['post-button']}>
					Post
				</button>
			</form>
			<button onClick={onClose} className={styles['cancel-button']}>
				Cancel
			</button>
		</Modal>
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
	const [isEditPostOpen, setIsEditPostOpen] = React.useState(false);

	function editPost() {
		setIsEditPostOpen(true);
	}

	function closeEditPost() {
		setIsEditPostOpen(false);
	}

	return (
		<section className={styles['post']}>
			<header>
				<div>{title}</div>
			</header>
			<section>
				<h2>{title}</h2>
				<div>
					<button
						onClick={editPost}
						className={styles['edit-button']}
					>
						Edit Post
					</button>
					<Modal
						isOpen={isEditPostOpen}
						onRequestClose={closeEditPost}
						className={styles['new-post-modal']}
						contentLabel="New Post Modal"
					>
						<h2>Editing "{title}"</h2>
						<form>
							<input
								type="text"
								className={styles['post-title']}
								value={title}
							/>
							<br />
							<br />
							<textarea
								placeholder={'Write new blog post...'}
								className={styles['post-textarea']}
							>
								{description}
							</textarea>
							<br />
							<br />
							<button
								onClick={closeEditPost}
								className={styles['post-button']}
							>
								Save
							</button>
						</form>
						<button
							onClick={closeEditPost}
							className={styles['cancel-button']}
						>
							Cancel
						</button>
					</Modal>
				</div>
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
