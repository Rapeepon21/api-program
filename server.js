const express = require('express')
const mysql = require('mysql');

const app =express();

const connection = mysql.createConnection({
    host:'127.0.0.1',
    username:'root',
    password:'goonza123',
    databasename:'dataalluser',
    port:'3306'
})
connection.connect((err)=>{
    if(err){
        console.log('Error connecting to MySQL database=',err)
        return;
    }
    console.log('MySQL successfully connected!');
})
app.listen(3000,()=>console.log('Server is running on port 3000'));