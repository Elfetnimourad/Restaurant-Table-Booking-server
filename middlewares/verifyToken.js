const jwt = require("jsonwebtoken")
const verifyToken = async(req,res,next)=>{
    try{
        // console.log("REQ",req)
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
         if(!authHeader){
           return res.status(404).json("User Not Found")
          }
           const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token,process.env.SECRET_PRIVATE_KEY);
        console.log("decodedToken",decodedToken);
       
       req.user = decodedToken;
       
         console.log("REQ from the verifyToken",req.user);
         
          next();

    }catch(error){
    return res.status(429).json("Not Authorized")
    }
}
module.exports = verifyToken;