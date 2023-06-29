const User = require("../models/User");
const { errors, success } = require("../utils/responseWrapper");
const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;
const { mapPostOutput } = require("../utils/Util");

const followOrUnfollowUserController = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const curUserId = req._id;

        // console.log("follow : " , userIdToFollow ,curUserId);

        const userToFollow = await User.findById(userIdToFollow);
        const curUser = await User.findById(curUserId);

        if (curUserId === userIdToFollow) {
            return res.send(errors(409, "Users cannot follow themselves"));
        }

        if (!userToFollow) {
            return res.send(errors(404, "User to Follow not found"));
        }

        if (curUser.followings.includes(userIdToFollow)) {
            // Already followed

            const followingIndex = curUser.followings.indexOf(userIdToFollow);
            curUser.followings.splice(followingIndex, 1);

            const followerIndex = userToFollow.followers.indexOf(curUserId);
            userToFollow.followers.splice(followerIndex, 1);
        } else {
            userToFollow.followers.push(curUserId);
            curUser.followings.push(userIdToFollow);
        }

        await userToFollow.save();
        await curUser.save();

        return res.send(success(200, { user: userToFollow }));
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const getPostsOfFollowings = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId).populate("followings");

        const fullPosts = await Post.find({
            owner: {
                $in: curUser.followings,
            },
        }).populate("owner");

        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        const followingsIds = curUser.followings.map((item) => item._id);
        followingsIds.push(curUserId);
        const suggestions = await User.find({
            _id: {
                $nin: followingsIds,
            },
        });

        return res.send(success(200, { ...curUser._doc, suggestions, posts }));
    } catch (e) {
        console.log(e);
        return res.send(errors(500, e.message));
    }
};

const deleteProfileController = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        await Post.deleteMany({
            owner: curUserId,
        });

        // remove myself from followers following
        curUser.followers.forEach(async (followerId) => {
            const follower = await User.findById(followerId);
            const index = follower.followings.indexOf(curUserId);
            follower.followings.splice(index, 1);
            await follower.save();
        });

        //remove myself from follower's followers
        curUser.followings.forEach(async (followingId) => {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(curUserId);
            following.followers.splice(index, 1);
            await following.save();
        });

        // remove myself from all likes
        const allPosts = await Post.find();
        allPosts.forEach(async (post) => {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);
            await post.save();
        });

        //delete user
        await curUser.remove();

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
        });

        return res.send(success(200, "user deleted"));
    } catch (e) {
        return res.send(errors(500, e.message));
    }
};

const getMyInfo = async (req, res) => {
    try {
        const user = await User.findById(req._id);
        // console.log("info here " , user);
        return res.send(success(200, { user }));
    } catch (e) {
        console.log(errors(500, e.message));
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { name, bio, userImage } = req.body;

        const user = await User.findById(req._id);

        if (name) {
            user.name = name;
        }
        if (bio) {
            user.bio = bio;
        }
        // console.log("userImage", userImage);
        if (userImage) {
            // const cloudImg = await cloudinary.uploader.upload(userImg , {
            //     folder:'profileImg'
            // });
            const cloudImg = await cloudinary.uploader.upload(userImage, {
                public_id: `${Date.now()}`,
                resource_type: "auto",
                folder: "insta",
            });
            //  console.log("cloudImg :" , cloudImg);
            user.avatar = {
                // url: cloudImg.secure_url,
                // publicId: cloudImg.public_id,
                publicId: cloudImg.public_id,
                url: cloudImg.url,
            };
        }

        await user.save();
        return res.send(success(200, { user }));
    } catch (e) {
        console.log(errors(500, e));
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate({
            path: "posts",
            populate: {
                path: "owner",
            },
        });

        // return res.send(success(200 , {user}));

        const fullPosts = user.posts;
        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

            console.log("hello how are u ");

        return res.send(success(200, { ...user._doc, posts }));
    } catch (e) {
        console.log("error put", e);
        return res.send(errors(500, e.message));
    }
};

module.exports = {
    followOrUnfollowUserController,
    getPostsOfFollowings,
    deleteProfileController,
    getMyInfo,
    updateUserProfile,
    getUserProfile,
};
