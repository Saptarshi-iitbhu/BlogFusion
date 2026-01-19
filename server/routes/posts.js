const express = require('express');
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

// Create
// Create
router.post('/create', verifyToken, async (req, res) => {
    try {
        const newPost = new Post({ ...req.body, author: req.user.id });
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.toString() === req.userId) {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).json(updatedPost);
        } else {
            res.status(401).json('You can update only your post!');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.toString() === req.userId) {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json('Post has been deleted!');
        } else {
            res.status(401).json('You can delete only your post!');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Post Details
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', ['username', 'email'])
            .populate('categories', ['name']);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Posts
router.get('/', async (req, res) => {
    const query = req.query;
    console.log("Query params:", query); // DEBUG LOG
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 9;
    const skip = (page - 1) * limit;

    try {
        let searchFilter = {};

        if (query.search) {
            // Find users that match the search term
            const matchingUsers = await User.find({
                username: { $regex: query.search || '', $options: 'i' }
            }).select('_id');
            const matchingUserIds = matchingUsers.map(user => user._id);

            searchFilter = {
                $or: [
                    { title: { $regex: query.search || '', $options: 'i' } },
                    { tags: { $in: [new RegExp(query.search, 'i')] } },
                    { author: { $in: matchingUserIds } }
                ]
            };
        }

        // Filter: default to published OR missing status (for legacy compatibility)
        let filter = {
            ... (query.search ? searchFilter : {}),
            $or: [{ status: 'published' }, { status: { $exists: false } }]
        };

        // Handle category filter
        if (query.cat) {
            const category = await Category.findOne({ name: query.cat });
            if (category) {
                // Base condition matches published or legacy
                const statusCondition = { $or: [{ status: 'published' }, { status: { $exists: false } }] };

                if (query.search) {
                    filter = {
                        $and: [
                            filter,
                            { categories: { $in: [category._id] } }
                        ]
                    };
                } else {
                    filter = { ...statusCondition };
                    filter.categories = { $in: [category._id] };
                }
            } else {
                // If category not found, return empty or handle as needed. 
                // For now, let's force a no-match
                filter.categories = { $in: [] };
            }
        }

        // Handle tag filter (overrides search usually, or additive?)
        if (query.tag) {
            const statusCondition = { $or: [{ status: 'published' }, { status: { $exists: false } }] };
            filter = { ...statusCondition, tags: { $in: [query.tag] } };
        }

        console.log("Final Filter:", JSON.stringify(filter, null, 2)); // DEBUG LOG

        const posts = await Post.find(filter)
            .populate('author', ['username', 'email'])
            .populate('categories', ['name'])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(filter);

        res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Get User Posts
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Like/Unlike Post
router.put('/:id/like', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user.id)) {
            await post.updateOne({ $push: { likes: req.user.id } });
            res.status(200).json("The post has been liked!");
        } else {
            await post.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).json("The post has been disliked!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
