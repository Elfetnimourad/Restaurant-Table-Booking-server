const pool = require("../config/db")

const getAllTables = async(req,res) =>{
    try{
        pool.query("SELECT * FROM tables",[],(error,results)=>{
            if(!results.rows.length)console.log(error);
            const tables = results.rows;
            res.status(200).json(tables)
        })
    }catch(error){
        res.status(404).json("No Tables")
    }
}


const addTable = async(req,res)=>{
  try{
    const {table_number,capacity,location} = req.body;

    pool.query("INSERT INTO tables (table_number,capacity,location) VALUES ($1, $2, $3) RETURNING *",[table_number,capacity,location],(error,results)=>{
        if(error)console.log(error);
        const table = results.rows;
        console.log("table",table);
        console.log("req",req.body)
        res.status(201).json("the table is created")
    })
    }catch(error){
        res.status(404).json("Not Correct");
    }

}
const getSingleTable = async(req,res)=>{
    try{
       const {tableId} = req.params;
       pool.query("SELECT * FROM tables WHERE table_number = $1",[tableId],(error,results)=>{
        if(!results.rows.length)console.log(error);
        const table = results.rows[0];
        console.log("table",table);
        res.status(200).json(table)
       })
    }catch(error){
        res.status(404).json("This Table is Not Exist")
    }
} 

const updateTable = async(req,res)=>{
    try{
        const tableId = parseInt(req.params.tableId);
        const {table_number,capacity,location} = req.body;
        pool.query("SELECT * FROM tables WHERE table_number = $1",[tableId],(error,results)=>{
         if(!results.rows.length){
            res.status(404).json("This Table Is Not Found")
         }

        pool.query("UPDATE tables SET  table_number= $1, capacity = $2, location = $3 WHERE table_number = $4 RETURNING *",[table_number,capacity,location,tableId],(error,results)=>{
           if(error)throw error;
           const updateTable = results.rows[0];
           console.log("updateTable",updateTable);
           res.status(201).json(updateTable);
        })
        })
    }catch(error){
        res.status(400).json(error)
    }
};

const deleteTable = async(req,res)=>{
    try{
       const {tableId} = req.params;
       pool.query("DELETE FROM tables WHERE table_number = $1 RETURNING *",[tableId],(error,results)=>{
        if(!results.rows.length)console.log(error);
        const deleted_table = results.rows[0];
        console.log("deleted table",results.rows);
        res.status(200).json(deleted_table);
       })
    }catch(error){
      res.status(404).json(error);
    }
}

module.exports = {
    addTable,
    getAllTables,
    getSingleTable,
    deleteTable,
    updateTable
}