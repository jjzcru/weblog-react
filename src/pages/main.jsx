import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './main.module.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const categories = [
	{
		name: 'Category 1',
		id: 1,
		posts: [
			{
				id: 1,
				title: 'Title 1',
				description: 'Description',
				comments: [
					{
						id: 1,
						userId: 1,
						userImg: '',
						content: 'Random comment',
					},
					{
						id: 2,
						userId: 1,
						userImg: '',
						content: 'Random comment 2',
					},
					{
						id: 3,
						userId: 1,
						userImg: '',
						content: 'Random comment 3',
					},
				],
			},
			{
				id: 2,
				title: 'Title 2',
				description: 'Description',
			},
		],
	},
	{
		name: 'Category 2',
		id: 2,
		posts: [],
	},
	{
		name: 'Category 3',
		id: 3,
		posts: [
			{
				id: 1,
				title: 'Title 3',
				description: 'Description',
			},
			{
				id: 2,
				title: 'Title 4',
				description: 'Description',
			},
			{
				id: 3,
				title: 'Title 5',
				description: 'Description',
			},
			{
				title: 'Title 6',
				description: 'Description',
			},
		],
	},
];

export function Main() {
	return (
		<main className={styles['home-view']}>
			<Categories categories={categories} />
			<Empty message={'Please select a category'} />
		</main>
	);
}

export function SelectedCategory() {
	const { categoryId } = useParams();
	let category = null;
	for (const c of categories) {
		if (`${c.id}` === `${categoryId}`) {
			category = c;
			break;
		}
	}
	return (
		<main className={styles['posts-view']}>
			<Categories categories={categories} />
			<Posts category={category} />
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

function Posts({ category }) {
	const { id, name, posts } = category;
	const [isNewPostOpen, setIsNewPostOpen] = React.useState(false);
  
	function createPost() {
		setIsNewPostOpen(true);
	}
  
	function closeNewPost() {
		setIsNewPostOpen(false);
	}

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
			<div>
				<button onClick={createPost} className={styles['post-button']}>New Post</button>
				<Modal isOpen={isNewPostOpen}
					onRequestClose={closeNewPost}
					className={styles['new-post-modal']}
					contentLabel="New Post Modal">
					<h2>Add new post to the {name} category</h2>
					<form>
						<input type="text" className={styles['post-title']} placeholder={'Title'} />
						<br /><br />
						<textarea placeholder={'Write new blog post...'} className={styles['post-textarea']} />
						<br />
						<br />
						<button onClick={closeNewPost} className={styles['post-button']}>Post</button>
					</form>
					<button onClick={closeNewPost} className={styles['cancel-button']}>Cancel</button>
				</Modal>
			</div>
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
					<button onClick={editPost} className={styles['edit-button']}>Edit Post</button>
					<Modal isOpen={isEditPostOpen}
						onRequestClose={closeEditPost}
						className={styles['new-post-modal']}
						contentLabel="New Post Modal">
						<h2>Editing "{title}"</h2>
						<form>
							<input type="text" className={styles['post-title']} value={title} />
							<br /><br />
							<textarea placeholder={'Write new blog post...'} className={styles['post-textarea']}>
								{description}
							</textarea>
							<br />
							<br />
							<button onClick={closeEditPost} className={styles['post-button']}>Save</button>
						</form>
						<button onClick={closeEditPost} className={styles['cancel-button']}>Cancel</button>
					</Modal>
				</div>
				<p>{description}</p>
				<form>
					<textarea placeholder={'Comment'} />
				</form>
			</section>
			<ul className={styles['comments']}>
				{comments && comments.length ? comments.map((comment, i) => {
					const { content, id, userImg } = comment;
					return (
						<li key={i}>
							<div>
								<img />
							</div>
							<span>{content}</span>
						</li>
					);
				}) : null}
				
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
