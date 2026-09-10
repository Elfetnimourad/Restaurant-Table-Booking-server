

const AuthorizedTo = (...roles)=>{
    return (req,res,next)=>{
        // console.log("REQ",req);
         
        if(!roles.includes(req.user.role)){
         return res.status(401).json({
            message:"Not Authorized",
          })

        };

        next()
    }
}
module.exports = AuthorizedTo;