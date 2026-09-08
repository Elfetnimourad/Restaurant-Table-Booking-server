
const errorHandling = (error,req,res,next)=>{
  return res.status(error.statusCode || 500).json({
    success:false,
    message:error.message,
  });

}

module.exports = errorHandling;