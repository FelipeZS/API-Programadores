const express = require("express");

const {uuid, isUuid} = require("uuidv4");

const app = express();

app.use(express.json());

const programadores = [];

function logRequests(request, response, next) {
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); 

    console.timeEnd(logLabel);
}

function validadeProjectId(request, response, next) {
    const {id} = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({error: "Param sent is not a valid UUID"});
    }

    next();
}

function checkEmptyScraps(request, response, next) {
    const {name, surname, age, company, mainTechnologies} = request.body;

    if (name == "" || surname == "" || age == "" || company == "" || mainTechnologies == "") {
        return response.status(400).json({error: "Fill in all fields"});
    }

    next();
}

app.use(logRequests);

app.get('/programadores', (request, response) => {
    const {name} = request.query;

    const results = name ? programadores.filter(programador => programador.name.includes(name)) : programadores;

    return response.json(results); 
});

app.post('/programadores', checkEmptyScraps, (request, response) => {
    // REQUEST BODY
    const {name, surname, age, company, mainTechnologies} = request.body;

    const programador = {id: uuid(), name, surname, age, company, mainTechnologies};

    programadores.push(programador);

    return response.json(programador);
});

app.put('/programadores/:id', validadeProjectId, (request, response) => {
    // ROUTE PARAMS
    const {id} = request.params;
    const {name, surname, age, company, mainTechnologies} = request.body;

    const programadorIndex = programadores.findIndex((programador) => programador.id === id);

    if (programadorIndex < 0) {
        return response.status(400).json({error: "Project not found."});
    }

    const programador = {
        id, 
        name, 
        surname,
        age,
        company,
        mainTechnologies
    };

    programadores[programadorIndex] = programador;

    return response.json(programador);
});

app.delete('/programadores/:id', validadeProjectId, (request, response) => {

    const {id} = request.params;

    const programadorIndex = programadores.findIndex((programador) => programador.id === id);

    if (programadorIndex < 0) {
        return response.status(400).json({error: "Project not found."});
    }

    programadores.splice(programadorIndex, 1);

    return response.status(204).send();
         
});

const port = 3333;
app.listen(3333, () => {
    console.log(`Server up and running on PORT ${port}`);
});