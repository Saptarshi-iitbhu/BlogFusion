const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

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
        } else {
            console.log('Response data:', res.data);
        }

    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
};

testBackend();
