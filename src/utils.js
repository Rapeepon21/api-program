const dbCon = require("./db");

const dbQuery = (sql) => {
    return new Promise((resolve, reject) => {
        dbCon.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    connection.release();
                });
            }
        });
    });
};


module.exports = {
    dbQuery
};