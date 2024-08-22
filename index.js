const express = require("express");
const { dbQuery } = require("./src/utils");
const cors = require ('cors'); 
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000




app.use(cors(),express.json(), express.urlencoded({ extended: true }))

 app.get("", async (req, res) => {
     const result = await dbQuery('select 1 ;')
     res.send({ status: true, msg: "hello world1", result })
})

app.post("/to-do-list", async (req, res) => {
    try { 
        const name = req.body.name;
        const age = req.body.age;
        const number = req.body.number;
        const email = req.body.email;
        const time = req.body.time;
    

        // Check that all required fields are provided
        if (!name || !age || !number || !email||!time ) {
            return res.status(400).send({ status: false, msg: "All fields (name, age, number, email) are required" });
        }

      
        // Insert into the database
        const sql = `INSERT INTO dataalluser.user (name, age, number, email,time) VALUES  ('${name}','${age}','${number}','${email}','${time}');`
        const result = await dbQuery(sql, [name, age, number, email,time]);

        res.send({ status: true, result });
        
    } catch (error) { 
        res.status(500).send({ status: false, msg: error.message });
    }
});




app.get("/to-do-list", async(req,res)=>{
    try {
        const sql=`SELECT * FROM dataalluser.user;`
        const result = await dbQuery(sql)
        res.send({ status: true, result })
        
    } catch (error) {
        res.send({ status: false, msg:error.message})
    }
     
})

// app.patch("/to-do-list", async (req, res) => {
//     try {
//         const name = req.body.name;
//         const age = req.body.age;
//         const number = req.body.number;
//         const email = req.body.email;
//         const id = req.body.id;
        
//         if (!id || !id ==0 ) return res.status(400).send({ status: false, msg: "ID is required" });
//         if (!name || !age || !number || !email) {
//             return res.status(400).send({ status: false, msg: "All fields (name, age, number, email) are required" });
//         }
    
//         const sql = `UPDATE dataalluser.user SET name = '${name}', age = ${age}, number = '${number}', email = '${email}' WHERE id = ${id}`;

//         const result = await dbQuery(sql);


//         if (result.affectedRows === 0) {
//             return res.status(404).send({ status: false, msg: "No record found with the provided ID" });
//         }
//         res.send({ status: true, result });
//     } catch (error) {
//         console.error(`Error updating user: ${error.message}`);
//         res.status(500).send({ status: false, msg: error.message });
//     }
// });


app.patch("/to-do-list/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const{name,age,number,email,time}=req.body

        if (!name || !age || !number || !email || !time)
             return res.status(400).send({ status: false, msg: "Both current ID and new ID are required" });

        const sql = `UPDATE dataalluser.user SET id = ${id}, name = ${name}, age = ${age}, number = ${number}, email = ${email},time = ${time}, WHERE id = ${id}`;
        const result = await dbQuery(sql, [name, age, number, email,time, id]);

        res.send({ status: true, result });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
});

app.delete("/to-do-list", async (req, res) => {
    try { 
        const id = req.body.id;
        if (!id) return res.status(400).send({ status: false, msg: "ID is required" });

        let sql = `DELETE FROM datauser.user WHERE id = "${id}";`;
        const result = await dbQuery(sql);

        if (result.affectedRows === 0) {
            return res.status(404).send({ status: false, msg: "No record found with the provided ID" });
        }

        res.send({ status: true, msg: "Record deleted successfully" });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
});

app.listen(port, () => console.log('Server is running on port', port));