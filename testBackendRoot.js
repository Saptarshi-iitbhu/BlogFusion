const axios = require('axios');
// Don't rely on dotenv, just hardcode for test if possible or assume default
const API_URL = 'http://localhost:5000/api';

const testBackend = async () => {
    try {
        console.log(`Testing GET ${API_URL}/posts?cat=art`);
        const res = await axios.get(`${API_URL}/posts?cat=art`);

        console.log('Response Status:', res.status);
        if (res.data.posts) {
            console.log('Posts Count:', res.data.posts.length);
            console.log('Total Posts:', res.data.totalPosts);
            res.data.posts.forEach(p => {
                console.log(`- Post: ${p.title}, Categories:`, p.categories);
            });
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
};

testBackend();
