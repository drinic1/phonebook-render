require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhoneBookEntry = require("./models/phonebookEntry");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// :method :url :status :res[content-length] - :response-time ms
app.use(morgan("tiny"));

morgan.token("body-content", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body-content"
  )
);

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/info", (request, response) => {
  PhoneBookEntry.countDocuments().then((entriesNum) => {
    response.end(
      `<div>Phonebook has info for ${entriesNum} people.</div><div>${new Date()}</div>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  PhoneBookEntry.find().then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  //const person = persons.find((person) => person.id == request.params.id);
  PhoneBookEntry.findById(request.params.id)
    .then((matchedPerson) => {
      if (matchedPerson) {
        response.json(matchedPerson);
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).end();
  }
  // const matchedPerson = persons.find((person) => person.name == body.name);
  // if (matchedPerson) {
  //   return response.status(409).end();
  // }
  //   const person = { ...body, id: Math.floor(Math.random() * 100000) + 1 };
  // const person = {
  //   id: Math.floor(Math.random() * 100000) + 1,
  //   name: body.name,
  //   number: body.number,
  // };

  const person = new PhoneBookEntry({
    name: body.name,
    number: body.number,
  });

  //   persons.push(person);
  //persons = persons.concat(person);
  person.save().then((createdPerson) => {
    response.json(createdPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  PhoneBookEntry.findById(request.params.id)
    .then((foundPerson) => {
      if (!foundPerson) {
        return response.status(404).send();
      }

      foundPerson.name = request.body.name;
      foundPerson.number = request.body.number;

      foundPerson.save().then((savedPerson) => {
        response.json(savedPerson);
      });
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  //persons = persons.filter((person) => person.id != request.params.id);
  PhoneBookEntry.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "wrong id format" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`server listening on port ${PORT}`);
