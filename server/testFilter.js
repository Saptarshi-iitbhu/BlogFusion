const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

const testFilter = async () => {
    try {
        console.log('1. Fetching Categories...');
        const catsRes = await axios.get(`${API_URL}/categories`);
        const techCat = catsRes.data.find(c => c.name === 'technology');

        if (!techCat) {
            console.error('Technology category not found!');
            return;
        }
        console.log('Technology Category ID:', techCat._id);

        console.log('2. Creating Post in Technology...');
        const newPost = {
            title: 'Test Tech Post ' + Date.now(),
            summary: 'This is a test post summary.',
            content: 'Content of the test post.',
            categories: [techCat._id], // Send ID array
            status: 'published',
            author: '659c0f5f9a2e4c001c8e4e1a' // Just a dummy ID, hopefully backend doesn't validate strict author existence for this test or I can login first. 
            // Wait, create post requires token? 
            // server/routes/posts.js: router.post('/create', verifyToken, ...
        };

        // I need to login first or hack the backend to allow public create for test.
        // Hacking backend is faster/easier for debug script context. 
        // But let's try to do it right? 
        // I'll assume I can't easily auth in this script without credentials.

        // Plan B: Just search for ANY existing posts with that category. 
        // If none exist, I can't test filtering.

        // Let's modify the backend temporarily to allow public create? No, unsafe.

        // Let's just create a post manually via the UI? 
        // Or easier: I'll use the "verifyToken" bypass or mock in the script? No.

        // Better: I'll try to find a post via GET /posts first, if any exist, update one?
        // No, update also needs token.

        // Okay, `server/testFilter.js` will just query. 
        // I'll trust my manual UI verification or ask user to verify if I can't auth.

        // Wait, I can LOGIN as the user if I knew credentials. 
        // 'bloguser' / 'bloguser123' mentioned in seed script connection string might be unrelated to app users.

        // Let's just QUERY. If 0 results, I can't confirm success but I can confirm "no error".
        console.log(`3. Querying posts with cat=technology...`);
        const res = await axios.get(`${API_URL}/posts?cat=technology`);
        console.log('Filtered Posts Count:', res.data.posts ? res.data.posts.length : 0);
        if (res.data.posts) {
            res.data.posts.forEach(p => console.log(`- ${p.title} (Cats: ${p.categories.map(c => c.name)})`));
        }

        console.log(`4. Querying ALL posts...`);
        const allRes = await axios.get(`${API_URL}/posts`);
        console.log('All Posts Count:', allRes.data.posts ? allRes.data.posts.length : 0);

    } catch (err) {
        console.error('Error:', err.message);
    }
};

testFilter();
