const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const categories = [
    { name: 'art' },
    { name: 'science' },
    { name: 'technology' },
    { name: 'news' },
    { name: 'daily updates' }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://bloguser:bloguser123@cluster0.kl8n6.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to MongoDB');

        // Upsert categories
        for (const cat of categories) {
            await Category.findOneAndUpdate(
                { name: cat.name },
                { name: cat.name },
                { upsert: true, new: true }
            );
        }
        console.log('Categories synced successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCategories();
