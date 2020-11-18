const express = require("express");
const cors = require("cors");
const app = express();
const XLSX = require("xlsx");
const knex = require("knex");
const bcrypt = require('bcrypt')
const fs = require("fs");
const signIn = require('./controllers/signin')
const { sign } = require("crypto");
const xlsxController = require('./controllers/xlsx')
const daily = require('./controllers/daily')
const status = require('./controllers/status')
const list = require('./controllers/list')

//db is a table with name, date, temp(auto-generated), cosemnat
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
// CREATE TABLE beneficiari (
//     name        varchar(100)  PRIMARY KEY,
//     date   date,
//     temp         integer NOT NULL,
//     cosemnat varchar(100)
// );

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json("Server is running, everything is a ok");
});

app.get("/xlsx/:year/:month", (req, res) => { xlsxController.handleXlsx(req,res,db,XLSX)
  
});

app.post("/daily", (req, res) => {
  //req must be object with these keys name, date, cosemnat
  console.log(req.body.length)
  if (req.body.length > 0) {
    daily.handleDatabaseInsert(req.body, res, (isArray = true),db);
  } else {
    daily.handleDatabaseInsert(req.body, res, (isArray = false),db);
  }

});

app.post('/signin',(req,res) => {signIn.handleSignIn(req,res,db,bcrypt)})

app.post('/status',(req,res) => {status.handleStatus(req,res,db)})

app.post('/list/add',(res,req) => {list.handleAdd(req, res, db)})

app.get('/list/get', (res, req) => {list.handleGet(req, res, db)})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running!");
});



// function monthNumToName(monthnum) {
//   var months = [
//     "Ianuarie",
//     "Februarie",
//     "Martie",
//     "Aprilie",
//     "Mai",
//     "Iunie",
//     "Iulie",
//     "August",
//     "Septembrie",
//     "Octombrie",
//     "Novembrie",
//     "Decembrie",
//   ];
//   return months[monthnum - 1] || "";
// }
