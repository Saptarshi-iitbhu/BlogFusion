const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

const categories = [
    { name: 'art' },
    { name: 'science' },
    { name: 'technology' },
    { name: 'news' },
    { name: 'daily updates' }
];

const setupCategories = async () => {
    try {
        console.log('Fetching existing categories...');
        const existingRes = await axios.get(`${API_URL}/categories`);
        const existingNames = existingRes.data.map(c => c.name);

        for (const cat of categories) {
            if (!existingNames.includes(cat.name)) {
                console.log(`Creating category: ${cat.name}`);
                await axios.post(`${API_URL}/categories`, cat);
            } else {
                console.log(`Category exists: ${cat.name}`);
            }
        }
        console.log('Categories synced via API.');
    } catch (err) {
        console.error('Error setting up categories:', err.message);
    }
};

setupCategories();
