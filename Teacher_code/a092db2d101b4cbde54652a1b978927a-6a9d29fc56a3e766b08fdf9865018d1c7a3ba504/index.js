import path from 'node:path'; 
import { fileURLToPath } from 'node:url';
import cowsay from 'cowsay'
import express from 'express'
import bodyParser from 'body-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express()

app.use(bodyParser.text({ type: 'text' }))

let people = [
  {
    id: 'a',
    name: 'Bob',
    debt: 400
  },
  {
    id: 'b',
    name: 'Tom',
    debt: 100000
  }
]

/*
GET /people
GET /people/a
POST /people
PUT /people/a
*/

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.get('/people', (req, res) => {
  res.send(people)
})

app.get('/people/:id', (req, res) => {
  res.send(people?.filter(
    (person) => person?.id === req.params.id
  ))
})

app.post('/people', (req, res) => {
  console.log(req.body)
  const newPerson = JSON.parse(req.body)

  people = [...people, newPerson]

  res.send(newPerson)
})

app.get('/wiki/:page', async (req, res) => {
  console.log(req.params.page)

  const response = await fetch(`https://en.wikipedia.org/wiki/${req.params.page}`);
  const body = await response.text()

  res.send(body)
})

app.listen(3001)

// console.log(cowsay.say({
//   text : "I'm a moooodule",
//   e : "^^",
//   T : " "
// }));

