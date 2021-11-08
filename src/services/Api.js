import * as axios from 'axios';
export class Api {
    token = '';
    host = '';
    
    constructor(host) {
        this.host = host;
    }

    setToken = (token) => {
        this.token = token;
    }

    signIn = async ({ email, password }) => {
		const url = `${this.host}/login`;
		try {
			const { data } = await axios.post(url, {
				email,
				password,
			});
			const { authToken, expiredAt } = data;
			return {
				authToken,
				expiredAt,
			};
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
					authorization: `Bearer ${this.token}`
				},
			});
			const { categories } = data;
			return categories;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

    getPostsByCategory = async ({categoryId}) => {
		const url = `${this.host}/categories/${categoryId}`;
		try {
			const { data } = await axios.get(url, {
				headers: {
					authorization: `Bearer ${this.token}`
				},
			});
			const { posts } = data;
			return posts;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

    getPosts = async () => {
		const url = `${this.host}/posts`;
		try {
			const { data } = await axios.get(url, {
				headers: {
					authorization: `Bearer ${this.token}`
				},
			});
			const { posts } = data;
			return posts;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

    getPost = async ({id}) => {
		const url = `${this.host}/posts/${id}`;
		try {
			const { data } = await axios.get(url, {
				headers: {
					authorization: `Bearer ${this.token}`
				},
			});
			const { post } = data;
			return post;
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

    addPost = async ({ categoryId, title, description, content }) => {
		const url = `${this.host}/categories/${categoryId}`;

		try {
			const { data } = await axios.post(
				url,
				{
                    title, 
                    description,
                    content
                },
				{
					headers: {
						authorization: `Bearer ${this.token}`,
					},
				}
			);
			const { status } = data;
			return status === 'success';
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

    updatePost = async ({ id, title, description, content }) => {
		const url = `${this.host}/post/${id}`;

		try {
			const { data } = await axios.put(
				url,
				{
                    title, 
                    description,
                    content
                },
				{
					headers: {
						authorization: `Bearer ${this.token}`,
					},
				}
			);
			const { status } = data;
			return status === 'success';
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

    deletePost = async ({ id }) => {
		const url = `${this.host}/post/${id}`;

		try {
			const { data } = await axios.delete(url, {
				headers: {
					authorization: `Bearer ${this.token}`
				},
			});
			const { status } = data;
			return status === 'success';
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

    addComment = async ({postId, content}) => {
        const url = `${this.host}/comments`;

		try {
			const { data } = await axios.post(
				url,
				{
                    postId, 
                    content
                },
				{
					headers: {
						authorization: `Bearer ${this.token}`,
					},
				}
			);
			const { status } = data;
			return status === 'success';
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
    }

    updateComment = async ({ id, content }) => {
		const url = `${this.host}/comments/${id}`;

		try {
			const { data } = await axios.put(
				url,
				{
                    content
                },
				{
					headers: {
						authorization: `Bearer ${this.token}`,
					},
				}
			);
			const { status } = data;
			return status === 'success';
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};

    deleteComment = async ({ id }) => {
		const url = `${this.host}/comments/${id}`;

		try {
			const { data } = await axios.delete(url, {
				headers: {
					authorization: `Bearer ${this.token}`
				},
			});
			const { status } = data;
			return status === 'success';
		} catch (e) {
			if (e.response?.data?.message) {
				throw new Error(e.response?.data.message);
			}

			throw new Error(e.message);
		}
	};
}