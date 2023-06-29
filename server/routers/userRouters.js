const requireUser = require('../middlewares/requireUser');
const UserController = require('../controllers/userController');
const router = require('express').Router();

router.post('/follow' , requireUser , UserController.followOrUnfollowUserController);
router.get('/getFeedData' , requireUser , UserController.getPostsOfFollowings);
router.delete('/' , requireUser , UserController.deleteProfileController);
router.get('/getMyInfo' , requireUser , UserController.getMyInfo);
router.put('/' ,requireUser , UserController.updateUserProfile);
router.post('/getUserProfile' , requireUser , UserController.getUserProfile);

module.exports = router;