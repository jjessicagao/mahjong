const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const players = [
    { id: 1, name: 'player1'},
    { id: 2, name: 'player2'},
    { id: 3, name: 'player3'},
]

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/players', (req, res) => {
    res.send(players);
});

app.post('/api/players', (req, res) => {
    const { error } = validatePlayer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const player = {
        id: players.length + 1,
        name: req.body.name
    }
    players.push(player);
    res.send(player);
})

app.put('/api/players/:id', (req, res) => {
    const player = players.find(c => c.id === parseInt(req.params.id));
    if (!player) return res.status(404).send('The player with the given ID was not found.');

    const { error } = validatePlayer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    player.name = req.body.name;
    res.send(player);
})

app.delete('/api/players/:id', (req, res) => {
    const player = players.find(c => c.id === parseInt(req.params.id));
    if (!player) return res.status(404).send('The player with the given ID was not found.');
    
    const index = players.indexOf(player);
    players.splice(index, 1);
    res.send(player);
})

function validatePlayer(player) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    
    return schema.validate(player);
}

app.get('/api/players/:id', (req, res) => {
    const player = players.find(c => c.id === parseInt(req.params.id));
    if (!player) return res.status(404).send('The player with the given ID was not found.');
    res.send(player);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));



app.get('/api/tiles/:id', (req, res) => {
    
})