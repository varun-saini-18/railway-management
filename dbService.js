const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

// const connection = mysql.createConnection({
//     host: 'bemvgo8nokzzatzk1jik-mysql.services.clever-cloud.com',
//     user: 'u2jnj1s64todnegn',
//     password: 'oF2UhdcDwSfqp6dIxbmC',
//     database: 'bemvgo8nokzzatzk1jik'
// });

// connection.connect((err) => {
//     if (err) {
//         console.log(err.message);
//     }
//     console.log('db ' + connection.state);
// });

var db_config = {
    host: 'bemvgo8nokzzatzk1jik-mysql.services.clever-cloud.com',
    user: 'u2jnj1s64todnegn',
    password: 'oF2UhdcDwSfqp6dIxbmC',
    database: 'bemvgo8nokzzatzk1jik'
  };
  
  var connection;
  
  function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect();


class DbService {

    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async bookTicket(user_id,train_num,src,dest) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                
                const query = "INSERT INTO tickets (user_id, train_num, src,dest) VALUES (?,?,?,?);";
                connection.query(query, [user_id,train_num,src,dest] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    console.log(result);
                    resolve(result.insertId);
                })
            });
            return {
                id : insertId
            };
        } catch (error) {
            console.log(error);
        }
    }

    async getTickets(user_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM tickets WHERE user_id= ?;";
                connection.query(query,[user_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getTicketDetail(ticket_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM tickets WHERE ticket_id= ?;";
                connection.query(query,[ticket_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getTrainName(train_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM trains WHERE train_num= ?;";
                connection.query(query,[train_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async registerUser(username,email,password) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                
                const query = "INSERT INTO users (username, email, password) VALUES (?,?,?);";
                connection.query(query, [username,email,password] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            // console.log(insertId,Name,Numb);
            return {
                id : insertId,
                Name : username,
                Email : email
            };
        } catch (error) {
            console.log(error);
        }
    }

    async authUser(email) {
        try {
            const user = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE email = ?";
                connection.query(query, [email] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            if(user.length==0)
            {
                return {
                    userFound : false
                };
            }
            return {
                userFound : true,
                username : user[0].username,
                password : user[0].password,
                id : user[0].id
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deserializeUser(id) {
        try {
            const user = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE id = ?";
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            if(user.length==0)
            {
                return {
                    userFound : false
                };
            }
            return user;
        } catch (error) {
            console.log(error);
        }
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