import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './main.module.css';
import Modal from 'react-modal';
import { AppContext } from '../services/AppContext';
import { Redirect } from 'react-router-dom';

Modal.setAppElement('#root');

export function Main() {
	const { api } = useContext(AppContext);
	const [categories, setCategories] = useState([]);
	useEffect(() => {
		api.getCategories().then(setCategories).catch(alert);
	}, []);
	return (
		<main className={styles['home-view']}>
			<Categories categories={categories} />
			<Empty message={'Please select a category'} />
		</main>
	);
}

export function SelectedCategory() {
	const { categoryId } = useParams();
	const { api } = useContext(AppContext);
	const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState(null);
	const [posts, setPosts] = useState([]);
	const [isNewPostOpen, setIsNewPostOpen] = useState(false);

	useEffect(() => {
		api.getCategories()
			.then((categories) => {
				setCategories(categories);
				for (const category of categories) {
					if (category.id === categoryId) {
						setCategory(category);
						return api.getPostsFromCategory(categoryId);
					}
				}
			})
			.then(setPosts)
			.catch(alert);
	}, [categoryId]);

	useEffect(() => {
		for (const category of categories) {
			if (category.id === categoryId) {
				api.getPostsFromCategory(categoryId)
					.then(setPosts)
					.catch(alert);
				break;
			}
		}
	}, [categoryId]);

	const onPostCreated = () => {
		setIsNewPostOpen(false);
		api.getPostsFromCategory(categoryId)
			.then((response) => {
				setPosts(response);
			})
			.catch(alert);
	};

	return (
		<main className={styles['posts-view']}>
			<Categories categories={categories} selected={categoryId} />
			<Posts
				category={category}
				posts={posts}
				onClickCreate={() => {
					setIsNewPostOpen(true);
				}}
			/>
			<Empty message={'Please select a post'} />
			<NewPost
				category={category}
				onCreate={onPostCreated}
				isOpen={isNewPostOpen}
				onClose={() => {
					setIsNewPostOpen(false);
				}}
			/>
		</main>
	);
}

export function SelectedPost() {
	const { categoryId, postId } = useParams();
	const { api } = useContext(AppContext);
	const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState(null);
	const [posts, setPosts] = useState([]);
	const [comment, setComment] = useState('');
	const [post, setPost] = useState(null);
	const [isNewPostOpen, setIsNewPostOpen] = useState(false);
	const [isEditPostOpen, setIsEditPostOpen] = useState(false);
	const [redirect, setRedirect] = useState('');

	useEffect(() => {
		api.getCategories()
			.then((categories) => {
				setCategories(categories);
				for (const category of categories) {
					if (category.id === categoryId) {
						setCategory(category);
						return api.getPostsFromCategory(categoryId);
					}
				}
			})
			.then((posts) => {
				if (posts) {
					setPosts(posts);
					for (const post of posts) {
						if (post.id === postId) {
							setPost(post);
							setComment('');
							break;
						}
					}
				}
			})
			.catch(alert);
	}, []);

	useEffect(() => {
		for (const post of posts) {
			if (post.id === postId) {
				setPost(post);
				setComment('');
				break;
			}
		}
	}, [postId]);

	if (redirect) {
		return <Redirect to={redirect} />;
	}

	const onPostCreated = () => {
		setIsNewPostOpen(false);
		api.getPostsFromCategory(categoryId)
			.then((response) => {
				setPosts(response);
			})
			.catch(alert);
	};

	const onClickEditPost = () => {
		setPost(post);
		setIsEditPostOpen(true);
	};

	const onSubmitComment = (e) => {
		e.preventDefault();
		api.addComment({ postId, content: comment })
			.then(() => api.getPost(postId))
			.then((post) => {
				setPost(post);
				setComment('');
			})
			.catch(alert);
	};

	const onDeleteComment = (id) => {
		api.deleteComment(id)
			.then(() => api.getPost(postId))
			.then((post) => {
				setPost(post);
			})
			.catch(alert);
	};

	const onClickDeletePost = async () => {
		if (confirm(`Are you sure you want to delete: "${post.title}"`)) {
			api.deletePost(post.id)
				.then(() => {
					setRedirect(`/categories/${categoryId}`);
				})
				.catch(alert);
		}
	};

	if (!post) {
		return null;
	}

	const onCommentChange = (comment) => {
		setComment(comment);
	};

	return (
		<main className={styles['post-view']}>
			<Categories categories={categories} selected={categoryId} />
			<Posts
				onClickCreate={() => {
					setIsNewPostOpen(true);
				}}
				selected={postId}
				category={category}
				posts={posts}
			/>
			<Post
				post={post}
				comment={comment}
				onSubmitComment={onSubmitComment}
				onClickEditPost={onClickEditPost}
				onClickDeletePost={onClickDeletePost}
				onClickDeleteComment={(id) => {
					onDeleteComment(id);
				}}
				onCommentChange={onCommentChange}
			/>
			<NewPost
				category={category}
				onCreate={onPostCreated}
				isOpen={isNewPostOpen}
				onClose={() => {
					setIsNewPostOpen(false);
				}}
			/>
			<EditPost
				isOpen={isEditPostOpen}
				post={post}
				onClose={() => {
					setIsEditPostOpen(false);
				}}
				onComplete={() => {
					api.getPost(postId)
						.then((post) => {
							console.log(`Updated post`);
							console.log(post);
							setPost(post);
							setIsEditPostOpen(false);
							return api.getPostsFromCategory(categoryId);
						})
						.then(setPosts)
						.catch(alert);
				}}
			/>
		</main>
	);
}
function Categories({ selected, categories }) {
	const { me } = useContext(AppContext);
	return (
		<section className={styles['categories']}>
			<header>
				<div>{me?.name}</div>
				<div><label htmlFor="logoutButton" />
					<button
						id="logoutButton"
						onClick={() => {
							localStorage.removeItem('token');
							localStorage.removeItem('expiredAt');
							window.location.href = '/';
						}}
					>
						<div />
					</button>
				</div>
			</header>
			<ul>
				{categories.map((category) => {
					const { id, name } = category;
					return (
						<li
							key={id}
							className={
								selected === id ? styles['selected'] : ''
							}
						>
							<Link to={`/categories/${id}`}>{name}</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

function Posts({ category, posts, onClickCreate, selected }) {
	if (!category) {
		return null;
	}

	const { id, name } = category;
	let component = (
		<ul>
			{posts.map((post, i) => {
				const { title, content } = post;
				return (
					<li
						key={post.id}
						className={
							selected === post.id ? styles['selected'] : ''
						}
					>
						<Link to={`/categories/${id}/${post.id}`}>
							<h1></h1><h2></h2>
							<h3>{title}</h3>
							<p>{content}</p>
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
				<div></div>
				<div>{name}</div>
				<div>
					<label htmlFor="createPost" />
					<button id="createPost" onClick={onClickCreate}>
						<div />
					</button>
				</div>
			</header>
			{component}
		</section>
	);
}

function NewPost({ onClose, isOpen, onCreate, category }) {
	const { api } = useContext(AppContext);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const onSubmit = (e) => {
		e.preventDefault();
		if (!confirm('Are you sure you want to create a new post')) {
			return;
		}
		api.createPost({
			title,
			description: '',
			content,
			categoryId: category.id,
		})
			.then(() => {
				setTitle('');
				setContent('');
				onCreate();
			})
			.catch(alert);
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
					value={title}
					onChange={(e) => {
						e.preventDefault();
						setTitle(e.target.value);
					}}
				/>
				<br />
				<br />
				<textarea
					placeholder={'Write new blog post...'}
					className={styles['post-textarea']}
					value={content}
					onChange={(e) => {
						e.preventDefault();
						setContent(e.target.value);
					}}
				/>
				<br />
				<br />
				<label htmlFor="submitPost" />
				<button id="submitPost" className={styles['post-button']}>Post</button>
			</form>
			<label htmlFor="cancelPost" />
			<button
				type={'button'}
				onClick={onClose}
				id="cancelPost"
				className={styles['cancel-button']}
			>
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

function Post({
	post,
	comment,
	onSubmitComment,
	onClickEditPost,
	onClickDeletePost,
	onClickDeleteComment,
	onCommentChange,
}) {
	const { me } = useContext(AppContext);

	if (!post) {
		return null;
	}

	const { title, description, content, comments, user } = post;

	let editButton = null;
	let deleteButton = null;
	if (me && user && me?.id === user?.id) {
		editButton = (
			<div>
				<label htmlFor="editPostButton" />
				<button id="editPostButton" onClick={onClickEditPost} className={styles['edit']}>
					<div />
				</button>
			</div>
		);
		deleteButton = (
			<div>
				<label htmlFor="deletePostButton" />
				<button id="deletePostButton" onClick={onClickDeletePost} className={styles['delete']}>
					<div />
				</button>
			</div>
		);
	}

	return (
		<>
			<section className={styles['post']}>
				<header>
					<div></div>
					<div aria-label={title}>{title}</div>
					<div>
						{deleteButton}
						{editButton}
					</div>
				</header>
				<section>
					{description ? (
						<div>
							<small>{description}</small>
						</div>
					) : null}
					<p>{content}</p>
					<div>
					<small>{user.name}</small>
					</div>
					
					<form
						onSubmit={onSubmitComment}
						className={styles['comment-container']}
					>
						<label htmlFor="commentArea" />
						<textarea
							value={comment}
							id="commentArea"
							onChange={(e) => {
								onCommentChange(e.target.value);
							}}
							placeholder={'Write your comment....'}
						/>
						<div>
							<button>Comment</button>
						</div>
					</form>
				</section>
				<ul className={styles['comments']}>
					{comments && comments.length
						? comments.map((comment, i) => (
								<Comment
									key={i}
									comment={comment}
									onDelete={onClickDeleteComment}
								/>
						  ))
						: null}
				</ul>
			</section>
		</>
	);
}

function Comment({ comment, onDelete }) {
	const { me } = useContext(AppContext);
	const { content, id, user } = comment;
	let deleteCommentBtn = null;
	if (me.id === user.id) {
		deleteCommentBtn = (
			<div>
				<label htmlFor="deleteComment" />
				<button
					id="deleteComment"
					onClick={() => {
						onDelete(id);
					}}
				>
					<div />
				</button>
			</div>
		);
	}
	return (
		<li>
			<span>{content}</span>
			<small className={me.id === user.id ? styles['me'] : ''}>{user.name}</small>
			<div>{deleteCommentBtn}</div>
		</li>
	);
}

function EditPost({ post, isOpen, onClose, onComplete }) {
	const { api } = useContext(AppContext);
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
	useEffect(() => {
		setTitle(post.title);
		setContent(post.content);
	}, [post.id]);
	const onSubmit = (e) => {
		e.preventDefault();
		api.updatePost({
			id: post.id,
			title,
			description: '',
			content,
		})
			.then(onComplete)
			.catch(alert);
	};
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className={styles['new-post-modal']}
			contentLabel="New Post Modal"
		>
			<h2>Editing "{title}"</h2>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					className={styles['post-title']}
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<br />
				<br />
				<textarea
					value={content}
					onChange={(e) => {
						setContent(e.target.value);
					}}
					placeholder={'Write new blog post...'}
					className={styles['post-textarea']}
				>
					{content}
				</textarea>
				<br />
				<br />
				<button type={'submit'} className={styles['post-button']}>
					Save
				</button>
			</form>
			<button
				type={'button'}
				onClick={onClose}
				className={styles['cancel-button']}
			>
				Cancel
			</button>
		</Modal>
	);
}

function Empty({ message }) {
	return (
		<section className={styles['empty']}>
			<h2>{message}</h2>
		</section>
	);
}
