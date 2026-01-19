const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

const allowedCategories = ['art', 'science', 'technology', 'news', 'daily updates'];

const cleanupCategories = async () => {
    try {
        const res = await axios.get(`${API_URL}/categories`);
        const allCats = res.data;

        for (const cat of allCats) {
            if (!allowedCategories.includes(cat.name.toLowerCase())) {
                console.log(`Deleting unwanted category: ${cat.name} (${cat._id})`);
                await axios.delete(`${API_URL}/categories/${cat._id}`);
            }
        }
        console.log('Cleanup complete.');

    } catch (err) {
        console.error(err.message);
    }
};

cleanupCategories();
