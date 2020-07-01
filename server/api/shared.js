const express = require('express');
const model = require('../db');

const idHandler = (modelName, paramName) => (req, res, next, id) => {
    const givenId = id;
    if (!Number(givenId)) {
        res.status(404).send(`Only number ids are allowed`);
    } else {
        const dbObj = model.getFromDatabaseById(modelName, givenId);
        const dbId = dbObj && dbObj.id;
        if (!dbId) {
            res.status(404).send(`Object with id ${givenId} not found`);
        } else {
            req[paramName] = dbId
            next();
        };
    };
};

const errHandler = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).send('Something broke!');
};

const getFromDBandSend = (modelName) => (req, res, next) => {
    const list = model.getAllFromDatabase(modelName);
    res.send(list);
};

const postToDBandSend = (modelName) => (req, res, next) => {
    const objData = req.body;
    const createdObj = model.addToDatabase(modelName, objData);
    if (createdObj) {
        res.status(201).send(createdObj);
    } else {
        let error = new Error();
        next(error);
    };
};

const deleteAllfromDB = (modelName) => (req, res, next) => {
    const deletedList = model.deleteAllFromDatabase(modelName);
    if (deletedList) {
        res.status(204).send();
    } else {
        let error = new Error();
        next(error);
    }
};

module.exports = {
    idHandler,
    errHandler,
    getFromDBandSend,
    postToDBandSend,
    deleteAllfromDB
}