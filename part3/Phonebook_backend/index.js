require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Phonebook = require('./models/mongo.js')

const app = express()

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(express.static('dist')); // serve frontend build

// persons = [
//     {
//         "id": "1",
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": "2",
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": "3",
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": "4",
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

morgan.token('body', (req) => { JSON.stringify(req.body) })

app.get('/api/persons', (req, res) => {
    Phonebook.find({}).then(contacts => {
        res.json(contacts)
    })
})

app.get('/info', (req, res) => {

    const now = new Date()
    const formattedDate = now.toString()
    // res.setHeader('Content-Type', 'text/html')
    Phonebook.countDocuments({})
        .then(count => {
            res.send(`<div>
        <p>Phonebook has info for ${count} people</p>
        <p>${formattedDate}</p>    
        </div>`)
        })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Phonebook.findById(id)
        .then(contact => {
            if (contact)
                return res.json(contact)
            else
                return res.status(400).end()
        })
    // console.log(req)
    // const person = persons.find(p => p.id === id)
    // if (!person)
    //     return res.status(404).end()
    // res.json(person)
})


app.delete('/api/persons/:id', (req, res, next) => {
    Phonebook.findById(req.params.id)
        .then(person => {
            if (!person) {
                return res.status(404).json({ error: 'person does not exist' })
            }

            return person.deleteOne()
        })
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Phonebook.findById(id).then(contact => {
        console.log(`checking contact details = ${contact}`)
        if (contact) {
            console.log(`contact name ${contact.name} already exists, updating phone number`)
            const newInfo = req.body
            contact.number = newInfo.number
            return contact.save().then((updatedContact) => {
                res.json(updatedContact)
            })
        }
        else {
            return res.status(400).send({ error: 'person not found' })
        }
    })
        .catch(error => next(error))
})


// const generateId = () => {
//     const id = Number(Math.round(Math.random() * 100))
//     return id
// }
app.post('/api/persons', (req, res, next) => {
    const body = req.body
    console.log("this is the sent doc", body)
    Phonebook.findOne({ name: body.name }).then(name => {
        if (name)
            return res.status(409).json({ error: 'name must be unique' })
        const newPerson = new Phonebook({
            name: body.name,
            number: body.number
        })
        return newPerson.save().then(savedPerson => res.json(savedPerson))
    })
        .catch(error => next(error))
    // if (!body.name || !body.number)
    //     return res.status(400).json({ error: 'name or number is missing' })
    // else if (persons.find(p => p.name == body.name))
    //     return res.status(409).json({ error: 'name must be unique' })
    // const person = { id: generateId(), ...body }
    // res.json(person)
})

const errorHandler = (error, req, res, next) => {
    console.error(error)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
