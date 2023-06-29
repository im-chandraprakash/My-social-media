const router = require("express").Router();
const postController = require("../controllers/postController");
const requireUser = require("../middlewares/requireUser");

router.post("/", requireUser, postController.createPostController);
router.post("/like", requireUser, postController.likeAndUnlikePost);
router.put("/", requireUser, postController.updatePostController);
router.delete("/", requireUser, postController.deletePostController);
router.get("/getMyPosts", requireUser, postController.getMyPostsController);
router.get("/getUserPosts", requireUser, postController.getUserPostsController);
module.exports = router;
