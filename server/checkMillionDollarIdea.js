const express = require('express');

const checkMillionDollarIdea = (req, res, next) => {
    const body = req.body;
    const value = body.numWeeks * body.weeklyRevenue;
    if (Number(value) && (value >= 1000000)) {
        next();
    } else {
        res.status(400).send();
    };
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
