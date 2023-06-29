const Post = require("../models/Post");
const User = require("../models/User");
const { mapPostOutput } = require("../utils/Util");
const { success, errors } = require("../utils/responseWrapper");
// const cloudinary = require("cloudinary").v2;
const cloudinary = require("cloudinary").v2;

const createPostController = async (req, res) => {
    try {
        const { caption, postImg } = req.body;
        const owner = req._id;


        // console.log("hello i am image creator" , postImg);
        if (!caption || !postImg) {
            return res.send(errors(400, "Caption and Image are required"));
        }

        // const cloudImg = await cloudinary.uploader.upload(postImg , {
        //     folder: 'postImg'
        // })

        const cloudImg = await cloudinary.uploader.upload(postImg, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "insta",
        });

        // console.log("cloudImg post : " , cloudImg);

        const user = await User.findById(req._id);

        const post = await Post.create({
            owner,
            caption,
            image: {
                publicId: cloudImg.public_id,
                url: cloudImg.url,
            },
        });
        user.posts.push(post._id);

        await user.save();

        // console.log("user", user);
        // console.log("post", post);

        return res.send(success(201, { post }));
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const likeAndUnlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId).populate('owner');

        if (!post) {
            return res.send(errors(404, "Post not found"));
        }

        if (post.likes.includes(curUserId)) {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);

        } else {
            post.likes.push(curUserId);
        }

        await post.save();
        return res.send(success(200 , {post : mapPostOutput(post , curUserId)}));
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const updatePostController = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.send(errors(404, "Post not found"));
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(errors(403, "Only owners can update their posts"));
        }

        if (caption) {
            post.caption = caption;
        }

        await post.save();

        return res.send(success(200, { post }));
    } catch (e) {
        // console.log(e);
        return res.send(errors(500, e.message));
    }
};

const deletePostController = async (req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);
        const curUser = await User.findById(curUserId);

        if (!post) {
            return res.send(errors(404, "Post not found"));
        }

        if (post.owner.toString() != curUserId) {
            return res.send(errors(403, "Only owner can delete their posts"));
        }

        const index = curUser.posts.indexOf(postId);
        curUser.posts.splice(index, 1);
        await curUser.save();
        await post.remove();

        return res.send(success(200, "Post deleted Successfully"));
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const getMyPostsController = async (req, res) => {
    try {
        const curUserId = req._id;
        const allUserPosts = await Post.find({
            owner: curUserId,
        }).populate("likes");

        return res.send(success(200, { allUserPosts }));
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const getUserPostsController = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.send(errors(400, "User Id is required"));
        }
        const allUserPosts = await Post.find({
            owner: userId,
        }).populate("likes");

        return res.send(success(200, { allUserPosts }));
    } catch (e) {
        console.log(e);
        return res.send(errors(500, e.message));
    }
};

module.exports = {
    createPostController,
    likeAndUnlikePost,
    updatePostController,
    deletePostController,
    getMyPostsController,
    getUserPostsController,
};
