const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");
const auth = require("./../controller/authentication");
//////////////////////////////////////////////////////////
router.post("/signup", auth.signup);
router.post("/login", auth.login);

// for adminstraion
router.route('/').get(userController.getUsers).post(userController.addUser);
router
    .route('/:id')
    .get(auth.protect, userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
//////////////////////////////////////////////////////////////
module.exports = router;