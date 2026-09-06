const pool = require("../config/db")


const addBookings = async(req,res)=>{
     const {name,user_id,table_id,table_number,capacity,booking_date,booking_time,guests,status} = req.body;
     pool.query("SELECT * FROM users where name = $1",[name],(errors,results)=>{
        //check the user is authenticated
        if(!results.rows.length) throw errors;
        const user = results.rows[0];
        console.log("user",user)
        
   
       // check the table is exist and the capacity is enough
       pool.query("SELECT * FROM tables where table_number = $1 AND capacity >= $2 ",[table_number,guests],(errors,results)=>{
        if(!results?.rows.length)throw errors;
        console.log("tables and capacity",results.rows[0]);
        
        pool.query("SELECT * FROM bookings where booking_date != $1 AND booking_time != $2",[booking_date,booking_time],(errors,results)=>{
       //check if the date/time booking
            if(!results.rows.length)console.error(errors);
        console.log("booking table",results);
    
        pool.query(
            "INSERT INTO bookings (user_id,table_id,booking_date,booking_time,guests,status) values ($1,$2,$3,$4,$5,$6) RETURNING *",
              [user_id,table_id,booking_date,booking_time,guests,status],(errors,results)=>{
                if(!results?.rows.length)console.error(errors);
                  console.log("add the booking",results.rows);
                  return res.status(201).json(results.rows[0]);
              })
       })
       })
         }); 
}

const getAllBookings = async(req,res)=>{
    try{
        pool.
        query("SELECT b.id,u.name,t.table_number,b.booking_date,b.booking_time,b.status FROM bookings b INNER JOIN users u ON b.user_id = u.id INNER JOIN tables t ON b.table_id = t.id",
            
            [],(errors,results)=>{
            if(!results.rows.length)throw errors;
            const bookings = results.rows
            console.log("all the bookings",bookings);
            return res.status(200).json(bookings)
        })  
    }catch(error){
        console.error(error)
        res.status(404).json(error)
    }
}

const getSingleBooking = async(req,res)=>{
    const {user_id} = req.body;
    try{
     pool.query("SELECT * FROM bookings where user_id = $1",[user_id],(errors,results)=>{
        if(!results.rows.length)throw errors;
       const booking = results.rows[0];
       return res.status(200).json(booking)
     })


    }catch(error){
     res.status(404).json(error)
    }
    
}
const cancelBooking = async(req,res)=>{

    try{
        const {user_id} = req.params;
        const {status} = req.body
        pool.query("UPDATE bookings SET status = $1 where user_id = $2 RETURNING *",[status,user_id],(errors,results)=>{
            if(!results?.rows.length)console.error(errors);
           console.log("update the booking",results.rows);
           return res.status(201).json("the booking updated successfully")
        })
    }catch(error){
        console.error(error)
      res.status(404).json(error)
    }
}



module.exports = {
    addBookings,
    getAllBookings,
    getSingleBooking,
    cancelBooking
}