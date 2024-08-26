const express = require("express");
const { dbQuery } = require("./src/utils");
const cors = require ('cors'); 
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000
const rateLimit = require("express-rate-limit");



app.use(cors(),express.json(), express.urlencoded({ extended: true }))

 app.get("", async (req, res) => {
     const result = await dbQuery('select 1 ;')
     res.send({ status: true, msg: "hello world1", result })
})




const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { status: false, msg: "Too many requests, please try again later." },
});

app.use(limiter);


app.post("/bulk-to-do-list", async (req, res) => {
    try {
        const users = req.body.users;

        // Log incoming users data
        console.log("Received users data:", users);

        if (!users || !Array.isArray(users) || users.length === 0) {
            return res.status(400).send({ 
                status: false, 
                msg: "An array of users is required" 
            });
        }

        let sql = `INSERT INTO dataalluser.user (name, age, number, email, time) VALUES `;
        const values = users.map(user => 
            `('${user.name}', '${user.age}', '${user.number}', '${user.email}', '${new Date().toISOString()}')`
        ).join(", ");

        sql += values;

        // Log final SQL query
        console.log("Executing SQL Query:", sql);

        const result = await dbQuery(sql);
        res.send({ status: true, result });
    } catch (error) {
        console.error("Error during bulk insert:", error);
        res.status(500).send({ 
            status: false, 
            msg: error.message 
        });
    }
});

// app.post("/to-do-list", async (req, res) => {
//     try { 
//         const name = req.body.name;
//         const age = req.body.age;
//         const number = req.body.number;
//         const email = req.body.email;
        
//         const time = new Date().toISOString();
    

//         // Check that all required fields are provided
//         if (!name || !age || !number || !email ) {
//             return res.status(400).send({ status: false, msg: "All fields (name, age, number, email) are required" });
//         }

      
//         // Insert into the database
//         const sql = `INSERT INTO dataalluser.user (name, age, number, email,time) VALUES  ('${name}','${age}','${number}','${email}','${time}');`
//         const result = await dbQuery(sql, [name, age, number, email,time]);

//         res.send({ status: true, result });
        
//     } catch (error) { 
//         res.status(500).send({ status: false, msg: error.message });
//     }
// });


app.get("/search", async (req, res) => {
    try {
        const { name, age, number, email } = req.query;
        let sql = `SELECT * FROM dataalluser.user WHERE 1=1`;
        
        if (name) sql += ` AND name LIKE '%${name}%'`;
        if (age) sql += ` AND age = ${age}`;
        if (number) sql += ` AND number LIKE '%${number}%'`;
        if (email) sql += ` AND email LIKE '%${email}%'`;

        const result = await dbQuery(sql);
        res.send({ status: true, result });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
});


app.get("/to-do-list", async (req, res) => {
    try {
        const { page = 1, limit = 1000000000 } = req.query;
        const offset = (page - 1) * limit;
        const sql = `SELECT * FROM dataalluser.user LIMIT ${limit} OFFSET ${offset};`;
        const result = await dbQuery(sql);

        res.send({ status: true, result });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
});



// app.get("/to-do-list", async(req,res)=>{
//     try {
//         const sql=`SELECT * FROM dataalluser.user;`
//         const result = await dbQuery(sql)
//         res.send({ status: true, result })
        
//     } catch (error) {
//         res.send({ status: false, msg:error.message})
//     }
     
// })

app.patch("/to-do-list", async (req, res) => {
    try {
        const { name, age, number, email, id } = req.body;
        
        // Validation to check if ID is provided and greater than 0
        if (!id || id <= 0) {
            return res.status(400).send({ status: false, msg: "ID is required and must be greater than 0" });
        }
        
        // Validation to check if all fields are provided
        if (!name || !age || !number || !email) {
            return res.status(400).send({ status: false, msg: "All fields (name, age, number, email) are required" });
        }
        
        // Generate the current datetime
        const time = new Date().toISOString(); // Format as per your database's requirements

        // Update the user record in the database
        const sql = `UPDATE dataalluser.user SET name = '${name}', age = ${age}, number = '${number}', email = '${email}', time = '${time}' WHERE id = ${id}`;
        const result = await dbQuery(sql);

        // Check if the update affected any rows
        if (result.affectedRows === 0) {
            return res.status(404).send({ status: false, msg: "No record found with the provided ID" });
        }

        // Send a success response
        res.send({ status: true, result });
    } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        res.status(500).send({ status: false, msg: error.message });
    }
});


app.patch("/to-do-list/:id", async (req, res) => {
    try {
        const id = req.body.id;
        const newId = req.body.newId;
        const time = new Date().toISOString(); 

        if (!id||!newId)
             return res.status(400).send({ status: false, msg: "Both current ID and new ID are required" });

        const sql = `UPDATE dataalluser.user SET id = ${id} ,newId = ${newId},time = ${time}, WHERE id = ${id}`;
        const result = await dbQuery(sql, [newId,time, id]);

        res.send({ status: true, result });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
});


app.delete("/to-do-list", async (req, res) => {
    try {
        const id = req.body.id;
        if (!id) return res.status(400).send({ status: false, msg: "ID is required" });

        const sql = `UPDATE dataalluser.user SET id = ${id} WHERE id = ${id};`;
        const result = await dbQuery(sql);

        if (result.affectedRows === 0) {
            return res.status(404).send({ status: false, msg: "No record found with the provided ID" });
        }

        res.send({ status: true, msg: "Record soft-deleted successfully" });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
});

// app.delete("/to-do-list", async (req, res) => {
//     try { 
//         const id = req.body.id;
//         if (!id) return res.status(400).send({ status: false, msg: "ID is required" });

//         let sql = `DELETE FROM datauser.user WHERE id = "${id}";`;
//         const result = await dbQuery(sql);

//         if (result.affectedRows === 0) {
//             return res.status(404).send({ status: false, msg: "No record found with the provided ID" });
//         }

//         res.send({ status: true, msg: "Record deleted successfully" });
//     } catch (error) {
//         res.status(500).send({ status: false, msg: error.message });
//     }
// });


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: false, msg: "Something broke!" });
});

app.listen(port, () => console.log('Server is running on port', port));