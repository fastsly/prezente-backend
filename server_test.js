const express = require("express");
const cors = require("cors");
const app = express();
const XLSX = require("xlsx");
const knex = require("knex");
const fs = require("fs");
const listBenef = require("./listBenef.json");

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

app.get("/xlsx/:year/:month", (req, res) => {
  const data = [
    {
      name: "Putnoki Lorand",
      date: "2020-10-29T09:25:42.417Z",
      temp: 36.5,
      cosemnat: "Szalai Laszlo",
    },
    {
      name: "Putnoki Lorand",
      date: "2020-11-29T09:25:42.417Z",
      temp: 36.5,
      cosemnat: "Szalai Laszlo",
    },
    {
      name: "Buroi Alexandra",
      date: "2020-11-29T09:25:42.417Z",
      temp: 36.5,
      cosemnat: "Szalai Laszlo",
    },
  ];

  // res.json(data);
  data.forEach((obj) => {
    Object.keys(listBenef).map((key, index) => {
      if (obj.name === listBenef[key].name) {
        listBenef[key].array.push([
          obj.date.slice(0, 10),
          obj.temp,
          obj.cosemnat,
        ]);
      }
    });
  });

  var wb = XLSX.utils.book_new();
  Object.keys(listBenef).map((key, index) => {
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet(listBenef[key].array),
      listBenef[key].name
    );
  });

  /* generate buffer */
  
  const filename = `prezente${
    monthNumToName(req.params.month) + req.params.year
  }.xlsx`;
  var buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  //XLSX.writeFile(wb, filename);

//   fs.readFileSync("/", "utf8", function (err, data) {
//     if (err) {
//       return console.log(err);
//     }
//   });
  res.status(200).send(buf);
});
/* send to client */
// res.status(200).send(buf);

//buffer is probably better implementation

//send a file through http

app.post("/daily", (req, res) => {
  //req must be object with these keys name, date, cosemnat
  handleDatabaseInsert(req.body, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running!");
});

function handleDatabaseInsert(benef, res) {
  const { name, cosemnat } = benef;
  date = new Date();
  //generate temp
  const min = 35.6;
  const max = 36.9;
  const rand = Math.random() * (max - min + 1) + min;
  benef.temp = rand.toFixed(1);
  benef.date = date;

  db("beneficiari")
    .returning("*")
    .insert(benef)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => res.status(400).json("Unable to register! " + err));
}

function monthNumToName(monthnum) {
  var months = [
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Novembrie",
    "Decembrie",
  ];
  return months[monthnum - 1] || "";
}