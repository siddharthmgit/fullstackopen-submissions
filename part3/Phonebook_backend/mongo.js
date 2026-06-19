const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log(`enter password`)
    exit(1)
}

const password = process.argv[2]
const url = `mongodb://dbuser:${password}@ac-fkp9t0p-shard-00-00.bkyrfsw.mongodb.net:27017,ac-fkp9t0p-shard-00-01.bkyrfsw.mongodb.net:27017,ac-fkp9t0p-shard-00-02.bkyrfsw.mongodb.net:27017/?ssl=true&replicaSet=atlas-cukc3r-shard-0&authSource=admin&appName=Cluster0`

mongoose.set(`strictQuery`, false)
mongoose.connect(url, { family: 4 })


const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Phonebook = mongoose.model(`Phone`, phoneSchema)

if (process.argv.length > 3) {
    const name = process.argv[3]
    const number = process.argv[4]
    const addPerson = new Phonebook({
        name: name,
        number: number
    })

    addPerson.save().then(result => {
        console.log(`added ${addPerson.name} number ${addPerson.number} to phonebook`)
    })
}

Phonebook.find({}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
})