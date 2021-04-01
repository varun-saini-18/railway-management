const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
const movies = require('./movies');
const dbService = require('./dbService');

app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));

app.use('/abc', movies);

app.get("/", (req, res) => {
    res.render("index");
  });

app.get('/getAll', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();
  result
  .then(data => {
          response.json({data : data})
      })
  .catch(err => console.log(err));
})












const port = process.env.PORT || '5000';
app.listen(port, () => console.log(`Server started on Port ${port}`));

