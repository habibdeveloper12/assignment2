///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

///////////////////////////////
// Router Specific Middleware
////////////////////////////////

///////////////////////////////
// Router Routes
////////////////////////////////

// SIGNUP "/auth/signup"
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  try {
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // create the user
    await User.create(req.body);

    // redirect to login
    res.redirect("/auth/login");
  } catch (error) {
    res.status(400).json(error);
  }
});

// Login "/auth/login"
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  try {
    // First Stop, does the user exist
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        req.session.user = {
          username: user.username,
          id: user._id,
        };
        res.redirect("/hopes")
      } else {
        res.status(400).json({ error: "Password Does Not Match" });
        
      }
    } else {
      res.status(400).json({ error: "User Does Not Exist" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// logout
router.get("/logout", (req, res) => {
  req.session.user = null
  res.redirect("/")
})

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
