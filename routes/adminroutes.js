const adminroutes = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl.js");
const jwtauth = require("../middlewares/auth");

try {
  adminroutes.post("/create", adminCtrl.addAdmin);

  adminroutes.post("/login", adminCtrl.loginAdmin);

  adminroutes.put("/update/:id", adminCtrl.updateAdmin);

  adminroutes.put("/remove/:id", adminCtrl.removeAdmin);

  adminroutes.get("/:id", adminCtrl.getAdminById);

  adminroutes.post("/contactus", adminCtrl.contactus);

  module.exports = adminroutes;
} catch (error) {
  console.log(error);
}