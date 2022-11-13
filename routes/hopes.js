///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const auth = require("./authMiddleware");

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(auth);
router.use(async (req, res, next) => {
  req.user = await User.findById(req.session.user.id);
  next();
});

///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", async (req, res) => {
  const user = req.user;
  const last = user.hopes;
 let hopes = last.sort(function(a, b) {
      const nameA = a.text.toUpperCase(); // ignore upper and lowercase
      const nameB = b.text.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
  console.log(hopes)
  res.render("hopes/index", {
    hopes,title:"update",
  });
});
router.get("/add", async (req, res) => {
 
  res.render("hopes/show",{title:"addpage"});
});

router.post("/", async (req, res) => {
  
  const user = req.user;
  user.hopes.push(req.body);
  user.save();
  
  res.redirect("/dashboard/")
  
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const index = req.user.hopes.findIndex((hope) => `${hope._id}` === id);
  const hope = req.user.hopes[index];
  console.log(hope);
  res.render("hopes/show", {
    hope,title:"update"
  });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const index = req.user.hopes.findIndex((hope) => `${hope._id}` === id);
  req.user.hopes[index].text = req.body.text;
  req.user.hopes[index].email = req.body.email;
  req.user.hopes[index].number = req.body.number;
  req.user.save();
  res.redirect("/hopes");
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const index = req.user.hopes.findIndex((hope) => `${hope._id}` === id);
  req.user.hopes.splice(index, 1);
  req.user.save();
  res.redirect("/hopes");
});
///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
