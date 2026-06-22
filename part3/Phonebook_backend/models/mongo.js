const mongoose = require("mongoose")

const url = process.env.MONGODB_URI
mongoose.set(`strictQuery`, false)
mongoose.connect(url, { family: 4 })

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        mingLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d{5,}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

const Phonebook = mongoose.model(`Phone`, phoneSchema)

// if (process.argv.length > 3) {
//     const name = process.argv[3]
//     const number = process.argv[4]
//     const addPerson = new Phonebook({
//         name: name,
//         number: number
//     })

//     addPerson.save().then(result => {
//         console.log(`added ${addPerson.name} number ${addPerson.number} to phonebook`)
//     })
// }

// Phonebook.find({}).then(result => {
//     result.forEach(person => {
//         console.log(person)
//     })
//     mongoose.connection.close()
// })

module.exports = Phonebook