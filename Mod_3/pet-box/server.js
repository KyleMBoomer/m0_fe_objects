const express = require('express');
const app = express();
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';

app.get('/', (request, response) => {
    response.send('');
});

app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
})

app.locals.pets = [
    { id: '1', name: 'Jessica', type: 'dog' },
    { id: '2', name: 'Marcus Aurelius', type: 'parakeet' },
    { id: '3', name: 'Craisins', type: 'cat' }
]
app.get('/api/v1/pets', (request, response) => {
    const pets = app.locals.pets;
    response.send(pets)
})

app.get('/api/v1/pets/:id', (request, response) => {
    const { id } = request.params;
    const pet = app.locals.pets.find(pet => pet.id === id);
    if (!pet) {
        return response.sendStatus(404);
    }

    response.status(200).json(pet);
})

app.post('/api/v1/pets', (request, response) => {
    const id = Date.now();
    const pet = request.body

    for (let requiredParameter of ['name', 'type']) {
        if (!pet[requiredParameter]) {
            response
                .status(422)
                .send({ error: `Expected format: {name: <String>, type: <String>}. You're missing a "${requiredParameter}" property.` })
            return
        }
    }
    const { name, type } = pet

    app.locals.pets.push({ name, type, id });

    response.status(201).json({ name, type, id });
})

app.delete('/api/v1/pets/:id', (request, response) => {
    const { id } = request.params;
    const petIndex = app.locals.pets.findIndex(pet => pet.id === id);

    if (petIndex === -1) {
        return response.sendStatus(404);
    }

    const deletePet = app.locals.pets.splice(petIndex, 1)[0]
    response.status(200).json(deletePet);
})