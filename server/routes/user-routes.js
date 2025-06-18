const express = require("express");
const {
  signUpHandler,
  loginHandler,
} = require("../controllers/user-controller");
const router = express.Router();

router.post("/register", signUpHandler);
router.post("/login", loginHandler);

module.exports = router;
