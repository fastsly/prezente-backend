function handleDatabaseInsert(benef, res, isArray,db) {
    
    let tempDate
    if (isArray) {
      let userArray = []
      benef.forEach((user) => {
        const { name, date, cosemnat } = user;
        if (!date) {
          tempDate = new Date();
        } else{
          tempDate = false
        }
        console.log(tempDate+' and date '+date)
        //generate temp
        const min = 35.6;
        const max = 36.0;
        const rand = Math.random() * (max - min + 1) + min;
        user.temp = rand.toFixed(1);
        user.date = date || tempDate;
        userArray.push(user)
        console.table(userArray)
      });
      db("prezente")
          .returning("*")
          .insert(userArray)
          .then((user) => {
            res.status(200).json(user);
          })
          .catch((err) => res.status(400).json("Unable to register! " + err));
    } else {
      const { name, date, cosemnat } = benef;
      if (!date) {
        tempDate = new Date();
      }else{
        tempDate = false
      }
      console.log(tempDate+' and date not array '+date)
      //generate temp
      const min = 35.6;
      const max = 36.0;
      const rand = Math.random() * (max - min + 1) + min;
      benef.temp = rand.toFixed(1);
      benef.date = date || tempDate;
  
      db("prezente")
        .returning("*")
        .insert(benef)
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => res.status(400).json("Unable to register! " + err));
    }
  }

  module.exports ={
    handleDatabaseInsert: handleDatabaseInsert
}