const handleStatus = (req, res, db) => {
  db.select("*")
    .from("status")
    .then((data) => {
      db("list")
      .select('*')
      .then(resp=> {
        let list = [];
        //console.table(data);
        resp.forEach( (benef) => {
          const tempList = data.filter( element => element.name===benef.name)
          console.log('for '+benef.name);
          console.table(tempList)
            if (tempList.length>1) {
              list.push({
                name:benef.name, 
                suspended:benef.suspended, 
                planpers:reducer(tempList,"planpers"), 
                fisamonit: reducer(tempList,'fisamonit'),
                registrusapt: reducer(tempList, 'registrusapt'),
                fisaeval: reducer(tempList, 'fisaeval')
              })
            } else if(tempList.length){
              list.push({
                name:benef.name, 
                suspended:benef.suspended, 
                planpers:tempList[0].planpers, 
                fisamonit: tempList[0].fisamonit,
                registrusapt: tempList[0].registrusapt,
                fisaeval: tempList[0].fisaeval
              })
            } else {
              list.push({
                name:benef.name, 
                suspended:benef.suspended, 
                planpers:"N/A", 
                fisamonit: "N/A",
                registrusapt: "N/A",
                fisaeval: "N/A"
              })
            }
          }
        )
        
        res.json(list);
      })
      
    });
};

const reducer= (tempList,statusType) => {
  return tempList.reduce((acc, cv) => acc[statusType]<cv[statusType]? cv[statusType]:acc[statusType]);
}
module.exports = {
  handleStatus: handleStatus,
};
