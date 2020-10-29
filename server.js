const express = require("express");
const cors = require("cors");
const app = express();
const XLSX = require("xlsx");
const knex = require("knex");

//db is a table with name, date, temp(auto-generated), cosemnat 
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
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

app.get('/',(req,res) => {
    res.status(200).json('Server is running, everything is a ok')
})

app.get("/xlsx/:year/:month", (req, res) => {

  // req.params.year
  // req.params.month
  try{
  const date = Date.parse(req.params.month + req.params.year)
  console.log(date)
  }catch (err){
    console.log(err)
    res.status(410).json(err)
  }
  //

  try{
  db("beneficiari")
        //.returning("*")
        .select('*')
        .from("beneficiari")
        .andWhereRaw(`EXTRACT(MONTH FROM dateColumn::date) = ?`, [date])
        .then(data =>{
          if (data){
            res.json(data)
          }
        })
        
        
  }catch (err){
    console.log(err)
    res.status(411).json(err)
  }  
  

  /* generate workbook */
  // var ws = XLSX.utils.aoa_to_sheet(data);
  // var wb = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

  /* generate buffer */
  // var buf = XLSX.write(wb, { type: "buffer", bookType: bookType || "xlsx" });

  /* send to client */
  // res.status(200).send(buf);



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

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running!");
});

function handleDatabaseInsert(benef, res) {
    const { name, cosemnat } = benef;
    date = new Date();
    //generate temp
    const min = 35.6;
    const max = 36.9;
    const rand = Math.random() * (max - min + 1)+ min
    benef.temp = rand.toFixed(1)
    benef.date = date

    db("beneficiari")
        .returning("*")
        .insert(benef)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => res.status(400).json("Unable to register! "+err));
}

