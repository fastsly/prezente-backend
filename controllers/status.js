//const download = require("./download.js");
//const drive = require("./drive")

const handleStatus = (req, res, db) => {
  // let stream = drive.handleGdrive("else",(err,resp) => {
  //   if (err) return console.log("The API returned an error: " + err);
  //   const files = resp.data.files;
  //   let fileNames
  //   if (files.length) {
      
  //     fileNames = files.map((file) => {
        
  //       return file.name.split(" ")[0] + " " + file.name.split(" ")[1];
  //     });
      
  //   } else {
  //     console.log("No files found.");
  //   }
  //   console.log(files);
  // })
    // drive.handleGdrive('list', () =>{})
    // download.downloadFile('0BwwA4oUTeiV1UVNwOHItT0xfa2M')
    // .catch(console.log)


    db.select("*")
      .from("status")
      .then((data) => {
        db("list")
          .select("*")
          .then((resp) => {
            let list = [];
            let day = 60 * 60 * 24 * 1000;

            console.log('db db');
            resp.forEach((benef) => {
              //console.log(fileNames);
              //console.log('we found '+benef.name+': ')
              
              const tempList = data.filter(
                (element) => element.name === benef.name
              );
              //console.log(tempList)
              //console.log(typeof tempList[0].planpers);
              if (tempList.length > 1) {
                //console.log(reducer(tempList, "planpers"));
                list.push({
                  name: benef.name,
                  suspended: benef.suspended,
                  planpers: new Date (reducer(tempList, "planpers").getTime()+day),
                  fisamonit: new Date (reducer(tempList, "fisamonit").getTime()+day),
                  registrusapt: new Date (reducer(tempList, "registrusapt").getTime()+day),
                  fisaeval: new Date (reducer(tempList, "fisaeval").getTime()+day),
                });
              } else if (tempList.length) {
                list.push({
                  name: benef.name,
                  suspended: benef.suspended,
                  planpers: new Date (tempList[0].planpers.getTime()+day),
                  fisamonit: new Date (tempList[0].fisamonit.getTime()+day),
                  registrusapt: new Date (tempList[0].registrusapt.getTime()+day),
                  fisaeval: new Date (tempList[0].fisaeval.getTime()+day),
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
            //console.table(list)
            res.json(list);
          })
          .catch(console.log);
      });
  //});
};

const reducer = (tempList, statusType) => {
  let temp = tempList.map((element)=>{
    //console.log(element[statusType]);
    return element[statusType]
  })
  return temp.reduce((acc, cv) =>
    {
    //console.log(`acc is ${acc}`);
     let result = acc < cv ? cv : acc
     //console.log(`in the reducer at ${statusType} ${JSON.stringify(acc)} and the current value ${JSON.stringify(cv)} and the result is ${result}`);
    return result
    }
  );
};


const handleSuspend = (req,res,db)=>{
  //we retrieve current suspended status from database flip it and update the db with new value
  if(req.body.suspend){
    db.select("*")
      .from("list")
      .where(`name`,`=`, req.body.suspend.name) 
      .then((data) => {
        db('list')
        .returning('*')
        .where(`name`,`=`, req.body.suspend.name)
        .update({name:data[0].name,suspended:!data[0].suspended})
        .then((benef) =>{
            console.log(`We updated the database for ${req.body.suspend.name}`);
            res.status(200).json(benef)
        })
      })
    .catch((err) => {
        res.status(400).json('There was a problem inserting into database: '+err)
    })
}
}

const addStatus = (req,res,db)=>{
  console.log(`Were adding status`);
  if(req.body.addStatus){
    db('status')
    .returning('*')
    .insert(req.body.addStatus)
    .then((benef) =>{
        res.status(200).json(benef)
    })
    .catch((err) => {
        res.status(400).json('There was a problem inserting into database: '+err)
    })
}
}

module.exports = {
  handleStatus: handleStatus,
  handleSuspend: handleSuspend,
  addStatus: addStatus
};
