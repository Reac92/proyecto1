const express = require('express');
const shared = require('./shared')
const meetings = express.Router();
const modelName = 'meetings'

const validateMeetingData = (req, res, next) => {
    const body = req.body;
    if (body.time && body.date && body.day) {
        next();
    } else {
        console.log('invalid');
        res.status(400).send('Invalid request');
    };
};

meetings.get('/', shared.getFromDBandSend(modelName));

meetings.post('/', validateMeetingData, shared.postToDBandSend(modelName));

meetings.delete('/', shared.deleteAllfromDB(modelName));

module.exports = meetings;