const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { verifyToken } = require('../middleware/verifyToken');

// Create Comment
router.post('/', verifyToken, async (req, res) => {
    try {
        const newComment = new Comment({ ...req.body, author: req.user.id });
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Comments by Post ID
router.get('/post/:postId', async (req, res) => {
    try {
        // Simple fetch, we can handle nesting in frontend or do more complex aggregation here
        // Populating author for display
        const comments = await Comment.find({ postId: req.params.postId })
            .populate('author', ['username', 'email'])
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete Comment (Soft Delete)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json("Comment not found!");

        // Allow author or admin to delete
        if (comment.author.toString() === req.user.id || req.user.role === 'admin') {
            /* 
               Hard delete if no replies, or soft delete? 
               For simplicity let's do hard delete for now, or use isDeleted flag if you prefer strictly soft.
               The prompt asked for soft-delete.
            */
            comment.isDeleted = true;
            await comment.save();
            res.status(200).json("Comment has been deleted!");
        } else {
            res.status(403).json("You can delete only your comment!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
