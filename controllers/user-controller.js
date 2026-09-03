const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const getAllUsers = async(req,res)=>{
    try{
       pool.query("SELECT * FROM users",[],(error,results)=>{
console.log(results)
        if(!results.rows.length){
            res.status(404).json("No Users")
        }
        return res.status(201).json(results.rows)
       })
    }catch(error){
        res.status(400).json(error)
    }

}


const register = async (req, res) => {
    try{
     const {name, email,password}  = req.body;
     const hashedPassword = await bcrypt.hash(password,10);
        pool.query("SELECT s From users s WHERE s.email = $1",[email],(error,results)=>{
         if(results.rows.length){
            res.status(400).json("You Already Registered")
        }

     pool.query("INSERT INTO users ( name, email, password) VALUES ($1, $2, $3) RETURNING *",[name,email,hashedPassword],(error,results)=>{
        if(error)console.log(error);
       const user = results.rows;
        console.log(results.rows[0])
        const token = jwt.sign({name:user[0].name,email:user[0].email},process.env.SECRET_PRIVATE_KEY)
       return res.status(201).json({message:"User registered successfully",token});
     })
     
       })
     }catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error"});
     }
}
const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
             

         pool.query("SELECT * From users WHERE email = $1",[email],async(error,results)=>{
           if(!results.rows.length){
            res.status(400).json("User Not Found")
        }
        console.log("results",results.rows[0].password)
const comparedPassword = await bcrypt.compare(password,results.rows[0].password);

const user = results.rows;
console.log("headers",req.headers);
console.log("user",user)
if(comparedPassword){

 return res.status(200).json(user);
}
if(comparedPassword && user){
    const decodedToken = await jwt.sign({name:user[0].name,email:user[0].email},process.env.SECRET_PRIVATE_KEY);
    console.log("decodedToken",decodedToken)
    res.status(200).json(decodedToken)
}else{
    res.status(404).json("not found")
}

        
         })
    }catch(error){
        res.status(404).json(error.message)
    }
}

module.exports = {
    register,
    login,
    getAllUsers
}