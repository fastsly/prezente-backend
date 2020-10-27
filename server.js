const express = require("express");
const cors = require("cors");
const app = express();
const XLSX = require("xlsx");
const knex = require("knex");

//db is a table with name, date, temp(auto-generated), cosemnat 
const db = knex({
  client: "pg",
  connection: {
    host: "35.197.22.189",
    user: "postgres",
    password: "",
    database: "alsterdorf",
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

app.get('/test',(req,res) => {
    res.status(200).json('Server is running, everything is a ok')
})

app.get("/xlsx", (req, res) => {
  /* generate workbook */
  var ws = XLSX.utils.aoa_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

  /* generate buffer */
  var buf = XLSX.write(wb, { type: "buffer", bookType: bookType || "xlsx" });

  /* send to client */
  res.status(200).send(buf);
  //buffer is probably better implementation
  //   fs.readFile("/", "utf8", function (err, data) {
  //     if (err) {
  //       return console.log(err);
  //     }
  //   });
  //   //send a file through http
  //   res.status(200).sendFile(__dirname + "/prezenta2020aprilie.xlsx");
});

app.post("/daily", (req, res) => {
  //req must be object with these keys name, date, cosemnat 
    handleDatabaseInsert(req.body, res);
});

app.listen(3000, () => {
  console.log("Server is running!");
});

function handleDatabaseInsert(benef, res) {
    const { name, date, cosemnat } = benef;
    db("beneficiari")
        .returning("*")
        .insert(benef)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => res.status(400).json("Unable to register!"));
}

