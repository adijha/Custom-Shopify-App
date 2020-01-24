const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
  const token = req.header('auth_token');
  if(!token) return res.status(401).send("Access Denied!!!!!!");

  try {
    const verifySupplier = jwt.verify(token, process.env.TOKEN_SECRET);
    req.Supplier = verifySupplier;
    next();
  } catch (error) {
    res.status(400).send("Invalid Supplier"+error);
  }
}
