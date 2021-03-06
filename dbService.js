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
      }  
      else
      {
          console.log('Connected');
      }                                   // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else { 
        handleDisconnect();   
                                              // connnection idle timeout (the wait_timeout
        // throw err;                                  // server variable configures this)
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
            const seatsReserved = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM trains WHERE train_num = ?;";
                connection.query(query,[train_num], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0].seats_res);
                })
            });
            const seat_num = seatsReserved + 1;
            const coach_num = 'A' + Math.floor(seat_num/40+1);
            let seat_type = 'Upper';
            if(seat_num%3==0)
                seat_type = 'Lower';
            else if(seat_num%3==1)
                seat_type = 'Middle';
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO tickets (user_id, train_num, src,dest,Seat_num,Coach_num,Seat_type) VALUES (?,?,?,?,?,?,?);";
                connection.query(query, [user_id,train_num,src,dest,seat_num,coach_num,seat_type] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            const updateSeats = await new Promise((resolve, reject) => {
                const sql = "UPDATE trains SET seats_res = seats_res + 1 WHERE  train_num = ?";
                connection.query(sql, [train_num], (err, results) => {resolve('OK');})
            });
            return {
                id : insertId
            };
        } catch (error) {
            console.log(error);
        }
    }

    async getTrains(stations) {
        try {
            let res = stations.split("+");
            let src = res[0], dest = res[1];
            const allTrains = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM trains;";
                connection.query(query,[], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            const selectedTrains = await new Promise((resolve, reject) => {
                var sTrains = [];
                for(let i=0;i<allTrains.length;i++)
                {
                    const query = "SELECT * FROM `"+ allTrains[i].train_num +"`;";
                    connection.query(query,[], (err, results) => {
                        if (err) reject(new Error(err.message));
                        let srci=-1,desti=-1;
                        for(let j=0;j<results.length;j++)
                        {
                            if(results[j].src_station.toLowerCase()===src.toLowerCase())
                            {
                                srci=j;
                            }
                            if(results[j].src_station.toLowerCase()===dest.toLowerCase())
                            {
                                desti=j;
                            }
                        }
                        if(srci!=-1&&desti!=-1&&desti>srci)
                        sTrains.push(allTrains[i].train_num);
                        if(i==allTrains.length-1)
                        resolve(sTrains);
                    })
                }
            });
            return selectedTrains;
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

    async getStations() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Stations;";
                connection.query(query,[], (err, results) => {
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
                    // console.log(results);
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getTrainDetail(train_num) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM `"+ train_num +"`;";
                connection.query(query,[], (err, results) => {
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

    async addVisitor(ip) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM visits WHERE ip= ?;";
                connection.query(query,[ip], (err, results) => {
                    if (err) reject(new Error(err.message));
                    if(results.length)
                    {
                        const sql = "UPDATE visits SET count = count + 1 WHERE  ip = ?";
                        connection.query(sql, [ip], (err, results) => {})
                    }
                    else
                    {
                        const query = "INSERT INTO visits (ip) VALUES (?);";
                        connection.query(query, [ip], (err, results) => {})
                    }
                })
            });
            return 'ok';
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = DbService;

