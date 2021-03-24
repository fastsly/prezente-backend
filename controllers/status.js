const handleStatus = (req, res, db, listBenef) => {
  db.select("*")
    .from("status")
    .then((data) => {
      let tempList = [];
      console.table(data);

      data.forEach((obj) => {
        if (tempList.length) {
          tempList.map((value, i) => {
            console.log(value);
            if (obj.name === value.name) {
              if (obj.planpers.getTime() > value.planpers.getTime()) {
                value.planpers = obj.planpers;
              }
              if (obj.fisamonit.getTime() > value.fisamonit.getTime()) {
                value.fisamonit = obj.fisamonit;
              }
            } else {
              tempList.push(obj);
            }
          });
        } else {
          tempList.push(obj);
        }
      });
      res.json(tempList);
    });
};
module.exports = {
  handleStatus: handleStatus,
};
