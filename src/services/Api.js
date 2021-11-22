import * as axios from 'axios';
import moment from 'moment';

export class Api {
	token = '';
	timezone = '';
	constructor(host) {
		this.host = host;
	}

	setToken = (token) => {
		this.token = token;
	};

	signUp = async ({ email, password }) => {
		const url = `${this.host}/login`;
		try {
			const { data } = await axios.post(url, {
				email,
				password,
			});
			return {
				success: true,
			};
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	signIn = async ({ email, password }) => {
		const url = `${this.host}/login`;
		try {
			const { data } = await axios.post(url, {
				email,
				password,
			});
			return data;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	getMe = async () => {
		const url = `${this.host}/me`;
		try {
			const { data } = await axios.get(url, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});

			let { employee } = data;
			return employee;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	getMe = async () => {
		const url = `${this.host}/me`;
		try {
			const { data } = await axios.get(url, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});

			let { me } = data;
			return me[0];
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	getCategories = async () => {
		const url = `${this.host}/categories`;
		try {
			const { data } = await axios.get(url, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});

			let { categories } = data;
			return categories;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	getPostsFromCategory = async (id) => {
		const url = `${this.host}/categories/${id}`;
		try {
			const { data } = await axios.get(url, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});

			let { posts } = data;
			return posts;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	createPost = async ({ title, description, content, categoryId }) => {
		const url = `${this.host}/categories/${categoryId}`;
		const body = {
			title,
			description,
			content,
		};
		try {
			const { data } = await axios.post(url, body, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});
			return data.id;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	updatePost = async ({ id, title, description, content }) => {
		const url = `${this.host}/posts/${id}`;
		const body = {
			title,
			description,
			content,
		};
		try {
			const { data } = await axios.put(url, body, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});
			return data.id;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	getPost = async (id) => {
		const url = `${this.host}/posts/${id}`;
		try {
			const { data } = await axios.get(url, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});

			let { post } = data;
			return post;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	deletePost = async (id) => {
		const url = `${this.host}/posts/${id}`;
		try {
			const { data } = await axios.delete(url, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});
			const { id } = data;
			return id;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	addComment = async ({ postId, content }) => {
		const url = `${this.host}/comments`;
		const body = {
			postId,
			content,
		};
		try {
			const { data } = await axios.post(url, body, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});
			return data.id;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

	deleteComment = async (id) => {
		const url = `${this.host}/comments/${id}`;
		try {
			const { data } = await axios.delete(url, {
				headers: {
					authorization: `Bearer ${this.token}`,
				},
			});
			const { id } = data;
			return id;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};
}
