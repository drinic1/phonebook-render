const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
//:method :url :status :res[content-length] - :response-time ms
//app.use(morgan("tiny"));

morgan.token("body-content", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body-content"
  )
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  response.end(
    `<div>Phonebook has info for ${
      persons.length
    } people.</div><div>${new Date()}</div>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((person) => person.id == request.params.id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).end();
  }
  const matchedPerson = persons.find((person) => person.name == body.name);
  if (matchedPerson) {
    return response.status(409).end();
  }
  //   const person = { ...body, id: Math.floor(Math.random() * 100000) + 1 };
  const person = {
    id: Math.floor(Math.random() * 100000) + 1,
    name: body.name,
    number: body.number,
  };
  //   persons.push(person);
  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((person) => person.id != request.params.id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`server listening on port ${PORT}`);
