const express = require('express');
const model = require('../db');
const minions = express.Router();
const modelName = 'minions'


const validateMinionData = (req, res, next) => {
    const body = req.body;
    if (body.name && (Number(body.salary) || body.salary == 0)) {
        body.salary = Number(body.salary);
        next();
    } else {
        res.status(400).send('Invalid request');
    };
};


minions.param('minionId', (req, res, next, id) => {
    const givenId = id;
    if (!Number(givenId)) {
        res.status(404).send(`Only number ids are allowed`);
    } else {
        const dbObj = model.getFromDatabaseById(modelName, givenId);
        const dbId = dbObj && dbObj.id;
        if (!dbId) {
            res.status(404).send(`Object with id ${givenId} not found`);
        } else {
            req.minionId = dbId
            next();
        };
    };
});


minions.get('/', (req, res, next) => {
    // Get an array of minions
    const list = model.getAllFromDatabase(modelName);
    res.send(list);
});

minions.post('/', validateMinionData, (req, res, next) => {
    // Create new minion and save to db
    const minionData = req.body;
    const createdObj = model.addToDatabase(modelName, minionData);
    if (createdObj) {
        res.status(201).send(createdObj);
    } else {
        let error = new Error();
        next(error);
    };
});

minions.get('/:minionId', (req, res, next) => {
    // Get a single minion by id
    const minion = model.getFromDatabaseById(modelName, req.minionId);
    res.send(minion);
});

minions.put('/:minionId', (req, res, next) => {
    // update single minion by id
    const minionData = req.body;
    const updatedMinion = model.updateInstanceInDatabase(modelName, minionData);
    if (updatedMinion) {
        res.status(200).send(updatedMinion);
    } else {
        let error = new Error();
        next(error);
    }
});

minions.delete('/:minionId', (req, res, next) => {
    // Delete single minion by id
    const deletedMinion = model.deleteFromDatabasebyId(modelName, req.minionId);
    if (deletedMinion) {
        res.status(204).send();
    } else {
        let error = new Error();
        next(error);
    }
})

minions.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).send('Something broke!');
  });

module.exports = minions;