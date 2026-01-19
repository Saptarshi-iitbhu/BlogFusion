const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const Category = require('./models/Category');

dotenv.config();

const debugData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        const categories = await Category.find();
        console.log('Categories:', categories);

        const posts = await Post.find().populate('categories');
        console.log('Posts:', posts.map(p => ({
            title: p.title,
            categories: p.categories,
            catRef: p.categories // To see if it's populated
        })));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugData();
