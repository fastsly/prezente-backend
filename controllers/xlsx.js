const handleXlsx = (req,res,db, XLSX) => {
  
    db("prezente")
    .select("*")
    .from("prezente")
    .andWhereRaw(`EXTRACT(YEAR FROM date::date) = ?`, [req.params.year])
    .andWhereRaw(`EXTRACT(MONTH FROM date::date) = ?`, [req.params.month])
    .then((data) => {
      //let tempList = JSON.parse(JSON.stringify(listBenef));
      //console.log({ name: "name", temp: 36.5 });
      // console.log("templist first is ")
      let tempList = {};
      db('list')
      .select('name')
      .then((list) => {
        list.sort()
        list.forEach(function (benef) {
          benef.array = [["Data","Temperatura","Pers. care consemneaza"]]
        });

      data.forEach((obj) => {
        // console.log("the obj is")
        // console.log(obj)
        list.map((value, index) => {
          if (obj["name"] === value.name) {
            tempDate =
              obj["date"].getDate() +
              "." +
              (obj["date"].getMonth() + 1) +
              "." +
              obj["date"].getFullYear();
            value.array.push([tempDate, obj["temp"], obj["cosemnat"]]);
          }
        });
      });
      // console.log("templist is")
      // console.log(tempList)
      console.table(list);
      var wb = XLSX.utils.book_new();
      list.map((value, index) => {
        console.log("array is for " + value.name);
        console.log(value.array);
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.aoa_to_sheet(value.array),
          value.name
        );
        console.log("worksheet is ");
        console.log(XLSX.utils.sheet_to_json(wb.Sheets[value.name]));
      });

      /* generate buffer */
      //const filename = `prezente${monthNumToName(req.params.month) + req.params.year}.xlsx`
      console.log("we starting to write xlsx");
      var buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      console.log("buffer is");
      console.log(buf);
      res.status(200).send(buf);
      })
      
    })
    .catch((err) => {
      res.status(411).json(err);
    });
};

module.exports ={
    handleXlsx: handleXlsx
}