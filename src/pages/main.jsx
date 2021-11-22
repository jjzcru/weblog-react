import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './main.module.css';
import Modal from 'react-modal';
import { AppContext } from '../services/AppContext';

Modal.setAppElement('#root');

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
			<Categories />
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
	const { api } = useContext(AppContext);
	const [category, setCategory] = useState(null);

	useEffect(() => {
		api.getCategories()
			.then((categories) => {
				for (const category of categories) {
					if (category.id === categoryId) {
						setCategory(category);
						break;
					}
				}
			})
			.catch(alert);
	}, [categoryId]);
	return (
		<main className={styles['posts-view']}>
			<Categories />
			<Posts category={category} />
			<Empty message={'Please select a post'} />
		</main>
	);
}

export function SelectedPost() {
	const { categoryId } = useParams();
	const { api } = useContext(AppContext);
	const [category, setCategory] = useState(null);

	useEffect(() => {
		api.getCategories()
			.then((categories) => {
				for (const category of categories) {
					if (category.id === categoryId) {
						setCategory(category);
						break;
					}
				}
			})
			.catch(alert);
	}, []);

	return (
		<main className={styles['post-view']}>
			<Categories />
			<Posts category={category} />
			<Post />
		</main>
	);
}
function Categories() {
	const { api, me } = useContext(AppContext);
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
				<div>{me?.name}</div>
				<div>
					<button
						onClick={() => {
							localStorage.removeItem('token');
							localStorage.removeItem('expiredAt');
							window.location.href = '/';
						}}
					>
						Log out
					</button>
				</div>
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

function Posts({ category }) {
	const { categoryId } = useParams();
	const { api } = useContext(AppContext);
	const [isNewPostOpen, setIsNewPostOpen] = useState(false);
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		if (category) {
			api.getPostsFromCategory(categoryId).then(setPosts).catch(alert);
		}
	}, [category]);

	if (!category) {
		return null;
	}

	const onPostCreated = () => {
		setIsNewPostOpen(false);
		api.getPostsFromCategory(categoryId)
			.then((response) => {
				setPosts(response);
			})
			.catch(alert);
	};

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
					<button
						onClick={() => {
							setIsNewPostOpen(true);
						}}
					>
						Add{' '}
					</button>
				</div>
			</header>
			<div>
				<NewPost
					category={category}
					onCreate={onPostCreated}
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

function NewPost({ onClose, isOpen, onCreate, category }) {
	const { api } = useContext(AppContext);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const onSubmit = (e) => {
		e.preventDefault();
		console.log(`I add a new post`);
		console.log({
			title,
			content,
		});
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
				<button className={styles['post-button']}>Post</button>
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

function EmptyPosts() {
	return (
		<div className={styles['empty-posts']}>
			<h3>There are not posts in this category</h3>
		</div>
	);
}

function Post() {
	const { categoryId, postId } = useParams();
	const { api, me } = useContext(AppContext);
	const [comment, setComment] = useState('');
	const [post, setPost] = useState(null);
	const [isEditPostOpen, setIsEditPostOpen] = useState(false);

	useEffect(() => {
		api.getPost(postId)
			.then((post) => {
				setPost(post);
				setComment('');
			})
			.catch(alert);
	}, [postId]);

	const onClickEditPost = () => {
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

	const onClickDelete = async () => {
		if (confirm(`Are you sure you want to delete: "${post.title}"`)) {
			api.deletePost(post.id)
				.then(() => {
					window.location.href = `/categories/${categoryId}`;
				})
				.catch(alert);
		}
	};

	if (!post) {
		return null;
	}

	const { title, description, content, comments, user } = post;

	let editButton = null;
	let deleteButton = null;
	if (me && user && me?.id === user?.id) {
		editButton = (
			<button onClick={onClickEditPost} className={styles['edit-button']}>
				Edit
			</button>
		);
		deleteButton = (
			<button onClick={onClickDelete} className={styles['edit-button']}>
				Delete
			</button>
		);
	}

	return (
		<>
			<section className={styles['post']}>
				<header>
					<div>{deleteButton}</div>
					<div>{title}</div>
					<div>{editButton}</div>
				</header>
				<section>
					<h2>{title}</h2>
					{description ? (
						<div>
							<small>{description}</small>
						</div>
					) : null}
					<p dangerouslySetInnerHTML={{ __html: content }}></p>
					<form
						onSubmit={onSubmitComment}
						className={styles['comment-container']}
					>
						<textarea
							value={comment}
							onChange={(e) => {
								setComment(e.target.value);
							}}
							placeholder={'Comment'}
						/>
						<div>
							<button>Send</button>
						</div>
					</form>
				</section>
				<ul className={styles['comments']}>
					{comments && comments.length
						? comments.map((comment, i) => {
								const { content, id } = comment;
								let deleteCommentBtn = null;
								if (me.id === comment.user.id) {
									deleteCommentBtn = (
										<button
											onClick={() => {
												onDeleteComment(id);
											}}
										>
											Delete
										</button>
									);
								}
								return (
									<li key={i}>
										<div>
											<img />
										</div>
										<span>{content}</span>
										<div>{deleteCommentBtn}</div>
									</li>
								);
						  })
						: null}
				</ul>
			</section>
			<EditPost
				isOpen={isEditPostOpen}
				post={post}
				onClose={() => {
					setIsEditPostOpen(false);
				}}
				onComplete={() => {
					api.getPost(postId)
						.then((post) => {
							setPost(post);
							setIsEditPostOpen(false);
						})
						.catch(alert);
				}}
			/>
		</>
	);
}

function EditPost({ post, isOpen, onClose, onComplete }) {
	const {api} = useContext(AppContext);
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
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
