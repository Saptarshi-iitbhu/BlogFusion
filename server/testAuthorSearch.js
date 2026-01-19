const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

const testSearch = async () => {
    try {
        // Need to know a user first. We saw author ID earlier.
        // Let's search by string 'user' if usernames contain it? Or 'test'?
        // The earlier seed script output wasn't fully visible for users.
        // Let's query posts and get a username to search.

        console.log('1. Getting a username from existing posts...');
        const allPosts = await axios.get(`${API_URL}/posts`);
        if (allPosts.data.posts && allPosts.data.posts.length > 0) {
            const username = allPosts.data.posts[0].author.username;
            console.log(`Searching for posts by author: ${username}`);

            const searchRes = await axios.get(`${API_URL}/posts?search=${username}`);
            console.log(`Found ${searchRes.data.posts ? searchRes.data.posts.length : 0} posts.`);
            if (searchRes.data.posts) {
                searchRes.data.posts.forEach(p => console.log(`- ${p.title} (by ${p.author.username})`));
            }
        } else {
            console.log('No posts found to test with.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
};

testSearch();
