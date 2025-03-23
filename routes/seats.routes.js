const express = require('express');
const router = express.Router();
const db = require('./../db/db');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

router.route('/seats').get((reg, res) => {
    try {
        if(db.seats.length > 0) res.json(db.seats);
        else res.status(404).json({  message: 'Empty seats database.' });
    } catch {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.route('/seats/:id').get((req, res) => {
    try {
        const selectedData = db.seats.find(data => data.id === req.params.id);
        if(selectedData) res.json(selectedData);
        else res.status(404).json({ message: 'This id does not exist.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.route('/seats').post((req, res) => {
    try {
        const { day, seat, client, email } = req.body;
        if(day && seat && client && email) {
            db.seats.push({ id: uuid, day, seat, client, email });
            res.json({ message: 'OK' });
        } else res.status(400).json({ message: 'All params are required.'});
    } catch(error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.route('/seats/:id').put((req, res) => {
    try {
        const { day, seat, client, email } = req.body;
        const dataToEdit = db.seats.find(data => data.id === req.params.id);
        if(dataToEdit) {
            if(day && seat && client && email) {
                Object.assign(dataToEdit, {day, seat, client, email});
                res.json( { message: 'OK' });
            } else {
                res.status(400).json({ message: 'All params are required.' });
            }
        } else {
            res.status(404).json({ message: 'This id does not exist.' });
        }
    } catch(error){
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.route('/seats/:id').delete((req, res) => {
    try {
        const dataToRemove = db.seats.find(data => data.id === req.params.id);
        if(dataToRemove){
            const dataToRemoveIndex = db.seats.indexOf(dataToRemove);
            db.seats.splice(dataToRemoveIndex, 1);
            res.json({ message: 'OK' });
        } else {
            res.status(404).json({ message: 'This id does not exist...' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error'});
    }
});

module.exports = router;