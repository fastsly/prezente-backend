const handleXlsx = (req,res,db, XLSX,listBenef) => {
  
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
      Object.keys(listBenef)
        .sort()
        .forEach(function (key) {
          tempList[key] = listBenef[key];
        });

      data.forEach((obj) => {
        // console.log("the obj is")
        // console.log(obj)
        Object.keys(tempList).map((key, index) => {
          if (obj["name"] === tempList[key].name) {
            tempDate =
              obj["date"].getDate() +
              "." +
              (obj["date"].getMonth() + 1) +
              "." +
              obj["date"].getFullYear();
            tempList[key].array.push([tempDate, obj["temp"], obj["cosemnat"]]);
          }
        });
      });
      // console.log("templist is")
      // console.log(tempList)
      console.table(tempList);
      var wb = XLSX.utils.book_new();
      Object.keys(tempList).map((key, index) => {
        console.log("array is for " + tempList[key].name);
        console.log(tempList[key].array);
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.aoa_to_sheet(tempList[key].array),
          tempList[key].name
        );
        console.log("worksheet is ");
        console.log(XLSX.utils.sheet_to_json(wb.Sheets[tempList[key].name]));
      });

      /* generate buffer */
      //const filename = `prezente${monthNumToName(req.params.month) + req.params.year}.xlsx`
      console.log("we starting to write xlsx");
      var buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      console.log("buffer is");
      console.log(buf);
      res.status(200).send(buf);
    })
    .catch((err) => {
      res.status(411).json(err);
    });
};

module.exports ={
    handleXlsx: handleXlsx
}