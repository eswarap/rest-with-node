const express = require('express');

const router = express.Router();

const Post = require('../models/posts.js');

// get all the documents
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts)
    } catch (error) {
        res.json({message: err})
    }
});

// get one document
router.get('/:postId', async (req, res) => {
    const postId = req.params.postId
    try {
        const posts = await Post.findOne({_id: postId});
        res.json(posts)
    } catch (error) {
        res.json({message: err})
    }
});


// Delete post
router.delete('/:postId', async (req, res) => {
    const postId = req.params.postId
    try {
        const removedPost = await Post.remove({_id: postId});
        res.json(removedPost);
    } catch (error) {
        res.json({message: err})
    }
});

// Update post
router.patch('/:postId', async (req, res) => {
    const postId = req.params.postId
    try {
        const updatedPost = await Post.updateOne({
            _id: postId
        }, {
            $set: {
                title: req.body.title
            }
        });
        res.json(updatedPost);
    } catch (error) {
        res.json({message: err})
    }
});

// Submit a post
router.post('/', async (req, res) => {
    const postData = new Post({title: req.body.title, description: req.body.description});

    try {
        const savedPost = await postData.save();
        res.json(savedPost)
    } catch (error) {
        res.json({message: err})
    }

});

module.exports = router;
