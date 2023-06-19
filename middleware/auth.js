const jwt = require("jsonwebtoken");
const config = require("config");

/*
中间件：对request的header中的token进行解码，使某个访问路径变成私有
解码成功的话，在req上挂载user
*/

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, auth denied" });
  }

  //Verify token and try to decode it
  // mount user to req
  // user内容由user中的payload定义
  /*
    {
        "user": {
            "id": "用户的唯一标识符或用户 ID"
        }
    }
    */
  try {
    const decoded = jwt.verify(token, config.get("jwtToken"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
