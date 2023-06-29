const router = require("express").Router();
const authController = require("../controllers/authControllers");

router.post("/signup", authController.signupController);
router.post("/logout", authController.logoutController);
router.post("/login", authController.loginController);
router.get("/refresh", authController.refreshAcceessTokenController);

module.exports = router;
