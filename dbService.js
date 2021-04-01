const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: 'bemvgo8nokzzatzk1jik-mysql.services.clever-cloud.com',
    user: 'u2jnj1s64todnegn',
    password: 'oF2UhdcDwSfqp6dIxbmC',
    database: 'bemvgo8nokzzatzk1jik'
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});


class DbService {

    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM mySampleTable;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(Name,Numb) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO mySampleTable (Name,Numb) VALUES (?,?);";
                connection.query(query, [Name,Numb] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            console.log(insertId,Name,Numb);
            return {
                id : insertId,
                Name : Name,
                Numb : Numb
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM mySampleTable WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, Name) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE mySampleTable SET Name = ? WHERE id = ?";
    
                connection.query(query, [Name, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(Name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM mySampleTable WHERE Name = ?;";

                connection.query(query, [Name], (err, results) => {
                    if (err) 
                    {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;