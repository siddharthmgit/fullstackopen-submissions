const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(express.static('dist')); // serve frontend build

persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

morgan.token('body', (req) => { JSON.stringify(req.body) })

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const now = new Date()
    const formattedDate = now.toString()
    // res.setHeader('Content-Type', 'text/html')
    res.send(`<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${formattedDate}</p>    
        </div>`)

})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    console.log(req)
    const person = persons.find(p => p.id === id)
    if (!person)
        return res.status(404).end()
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    if (!persons.find(p => p.id == id))
        return res.status(204).send(`<p>Person doesnt exist</p>`)

    persons = persons.filter(p => p.id != id)
    res.json(persons)
})

const generateId = () => {
    const id = Number(Math.round(Math.random() * 100))
    return id
}
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number)
        return res.status(400).json({ error: 'name or number is missing' })
    else if (persons.find(p => p.name == body.name))
        return res.status(409).json({ error: 'name must be unique' })
    const person = { id: generateId(), ...body }
    res.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})