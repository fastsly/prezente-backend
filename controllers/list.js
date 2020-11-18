const handleAdd = (res,req, db)  =>{
    if(req.body.list){
        db('list')
        .returning('*')
        .insert(req.body.list)
        .then((benef) =>{
            res.status(200).json(benef)
        })
        .catch((err) => {
            res.status(400).json('There was a problem inserting into database: '+err)
        })
    }
}

const handleGet = (res, req, db) =>{
    db('list')
    .select('*')
    .then((list) => {
        res.status(200).json(list)
    })
    .catch((err) => {
        res.status(400).json('There was a problem fetching the list from the database: '+err)
    })
}

module.exports = {
    handleAdd,
    handleGet
}