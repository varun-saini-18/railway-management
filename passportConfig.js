const LocalStrategy = require("passport-local").Strategy;
// const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const dbService = require('./dbService');


function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    console.log('Yes');
    const db = dbService.getDbServiceInstance();
    const result = db.authUser(email);
    
    result.then(user => {
      if (user.userFound) {
                if(user.password==password)
                {
                  console.log('User Found');
                  return done(null, user);
                }
                else
                {
                  console.log('Password didnt matched!');
                  return done(null, false, { message: "Password is incorrect" });
                }
            } 
      else {
        console.log('User not found!');
        return done(null, false, {
          message: "No user with that email address"
        });
      }
    })
    .catch(err => done(err));
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
  // Stores user details inside session. serializeUser determines which data of the user
  // object should be stored in the session. The result of the serializeUser method is attached
  // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
  //   the user id as the key) req.session.passport.user = {id: 'xyz'}
  passport.serializeUser((user, done) => done(null, user.id));

  // In deserializeUser that key is matched with the in memory array / database or any data resource.
  // The fetched object is attached to the request object as req.user

  passport.deserializeUser((id, done) => {
    const db = dbService.getDbServiceInstance();
    const result = db.deserializeUser(id);
    result.then(results => {
      return done(null, results[0]);
    })
    .catch(err => done(err));
    // pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
    //   if (err) {
    //     return done(err);
    //   }
    //   console.log(`ID is ${results.rows[0].id}`);
    //   return done(null, results.rows[0]);
    // });
  });
}

module.exports = initialize;
