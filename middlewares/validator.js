

const validator = (schema) =>{
    return (req,res,next)=>{
        console.log("result",req.body)
        const result = schema.safeParse(req.body);
        
        if(!result.success){
            return res.status(500).json({
                success:false,
                message:"Validation Invalid",
                errors:result.error.issues,
            })
        }
        req.body = result.data;
        next()
    }
};
module.exports = validator;