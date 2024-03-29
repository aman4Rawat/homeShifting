const jwt = require("jsonwebtoken");
const utils = require("../libs/utils.js")
const JWTSECRET = process.env.JWTSECRET

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    return res.status(401).send(utils.error(error.message));
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token,JWTSECRET);
  } catch (err) {
    const error = new Error("Please Login First.");
    return res.status(500).send(utils.error(error.message));
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    return res.status(401).send(utils.error(error.message));
  }
  req.userId = decodedToken.admin_id??decodedToken.user_id;
  req.role = decodedToken.role;
  next();
};
