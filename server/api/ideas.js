const express = require('express');
const model = require('../db');
const shared = require('./shared');
const millionsChecker = require('../checkMillionDollarIdea');
const ideas = express.Router();
const modelName = 'ideas';


const validateIdeaData = (req, res, next) => {
    const body = req.body;
    if (body.name && Number(body.numWeeks) && Number(body.weeklyRevenue)) {
        body.numWeeks = Number(body.numWeeks);
        body.weeklyRevenue = Number(body.weeklyRevenue);
        next();
    } else {
        res.status(400).send('Invalid request');
    };
};

ideas.param('ideaId', shared.idHandler(modelName, 'ideaId'));

ideas.get('/', shared.getFromDBandSend(modelName));

ideas.post('/', validateIdeaData, millionsChecker, shared.postToDBandSend(modelName));

ideas.get('/:ideaId', (req, res, next) => {
    const obj = model.getFromDatabaseById(modelName, req.ideaId);
    res.send(obj);
});

ideas.put('/:ideaId', (req, res, next) => {
    const objData = req.body;
    const updatedObj = model.updateInstanceInDatabase(modelName, objData);
    if (updatedObj) {
        res.status(200).send(updatedObj);
    } else {
        let error = new Error();
        next(error);
    }
});

ideas.delete('/:ideaId', (req, res, next) => {
    const deletedObj = model.deleteFromDatabasebyId(modelName, req.ideaId);
    if (deletedObj) {
        res.status(204).send();
    } else {
        let error = new Error();
        next(error);
    }
})

ideas.use(shared.errHandler);

module.exports = ideas;