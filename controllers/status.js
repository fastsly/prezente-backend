const getNames = require("./drive");

const handleStatus = (req, res, db) => {
  getNames.handleGdrive((err, resp) => {
    if (err) return console.log("The API returned an error: " + err);
    const files = resp.data.files;
    let fileNames
    if (files.length) {
      //console.log('Files:');
      fileNames = files.map((file) => {
        //console.table(`${file.name} (${file.id})`);
        return file.name.split(" ")[0] + " " + file.name.split(" ")[1];
      });
      //console.log(fileNames);
      //return fileNames;
    } else {
      console.log("No files found.");
    }

    db.select("*")
      .from("status")
      .then((data) => {
        db("list")
          .select("*")
          .then((resp) => {
            let list = [];
            console.log('db db');
            resp.forEach((benef) => {
              //console.log(fileNames);
              console.log('we found '+benef.name+': '+ fileNames.find((value)=>value === benef.name))
              const tempList = data.filter(
                (element) => element.name === benef.name
              );
              //console.log('for '+benef.name);
              //console.table(tempList)
              if (tempList.length > 1) {
                list.push({
                  name: benef.name,
                  suspended: benef.suspended,
                  planpers: reducer(tempList, "planpers"),
                  fisamonit: reducer(tempList, "fisamonit"),
                  registrusapt: reducer(tempList, "registrusapt"),
                  fisaeval: reducer(tempList, "fisaeval"),
                });
              } else if (tempList.length) {
                list.push({
                  name: benef.name,
                  suspended: benef.suspended,
                  planpers: tempList[0].planpers,
                  fisamonit: tempList[0].fisamonit,
                  registrusapt: tempList[0].registrusapt,
                  fisaeval: tempList[0].fisaeval,
                });
              } else {
                list.push({
                  name: benef.name,
                  suspended: benef.suspended,
                  planpers: "N/A",
                  fisamonit: "N/A",
                  registrusapt: "N/A",
                  fisaeval: "N/A",
                });
              }
            });

            res.json(list);
          })
          .catch(console.log);
      });
  });
};

const reducer = (tempList, statusType) => {
  return tempList.reduce((acc, cv) =>
    acc[statusType] < cv[statusType] ? cv[statusType] : acc[statusType]
  );
};
module.exports = {
  handleStatus: handleStatus,
};
