const handleSignIn = (req, res, db, bcrypt) => { 
    const { name, password } = req.body;
    if (!name || !password){
      return res.status(400).json('incorrect form submission')
    }   
    db.select("name", "hash")
        .from("users")
        .where("name", "=", name)
        .then((data) => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            return db
            .select("*")
            .from("users")
            .where("name", "=", name)
            .then((user) => {
                res.status(200).json(user[0]);
            })
            .catch((err) => res.status(400).json("unable to get user"));
        } else {
            res.status(400).json("User doesnt exist or wrong password");
        }
        })
        .catch((err) =>
        res.status(400).json("User doesnt exist or wrong password")
        );
}

module.exports ={
    handleSignIn: handleSignIn
}