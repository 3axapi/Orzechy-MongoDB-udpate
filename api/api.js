const {
    isValidDocument,
    errorHandle,
    validateIdInRequest 
} = require("./appfunction");

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const myDataBase = "orzechy";   
const url = `mongodb://localhost:27017/${myDataBase}`;

router.use(`/${myDataBase}/:id`, validateIdInRequest);

mongoose.connect(url);

const db = mongoose.connection; // obiekt do interakcji z bazą danych
db.on("error", console.error.bind.bind(console, "conection error"));
db.once("open", () => console.log("Conected to MongoDB"));

const mdbSchema = new mongoose.Schema({
    title: {type: String},
    tree: {type: String},
    protein: {type: Number},
    price: {type: Number},
    id: {type: Number}
});

const Model = mongoose.model(myDataBase, mdbSchema, "myorzechy");

router.get(`/${myDataBase}`, async (req, res) => {
    try {
        const allPonczkis = await Model.find({});
        res.send(allPonczkis);
    } catch (err) {
        errorHandle(res, err);
    }
});

router.get(`/${myDataBase}/:id`, async (req, res) => {
    try {
        const ponczekDokument = await Model.findOne({id: currentID});

        if (!ponczekDokument)
            return res.status(404).json({message: "Dokument not found"});
        
        res.send(ponczekDokument);
    } catch (err) {
        errorHandle(res, err);
    }
});

router.delete(`/${myDataBase}/:id`, async (req, res) => {
    try {
        const result = await Model.deleteOne({id: myID});
        if (result.deletedCount === 0)
            return res.status(404).json({message: "Docunemt Not Found"});
    
        res.json({message: "Your document has deleted succesfully already"});
    } catch (err) {
        errorHandle(res, err);
    }
});

router.post(`/${myDataBase}`, async (req, res) => {
    try {
        const newPonczekDokument = req.body
        const result = await Model.insertOne(newPonczekDokument);

        if (!result.acknowledged) // if true — insert accept
            return res.status(500).json({message: "Failed to add the document"});
        res.status(201).json({message: "Document added successfully", insertID: result.insertedId});
    } catch (err) {
        errorHandle(res, err);
    }
});

router.put(`/${myDataBase}/:id`, async (req, res) => {
    try {
        const docToUpdate = req.body;
        if (!isValidDocument(docToUpdate))
            return res.status(400).json({message: "Invalid document format"});

        const result = await Model.replaceOne({id: req.correctID}, docToUpdate);
        if (result.matchedCount === 0)
            return res.status(404).json({message: "Document Not Found"});
        if (result.modifiedCount === 0)
            return res.status(400).json({message: "Nie chciało mie się nic zmenić"});

        res.json({message: "Zamieniłem dokumenty"});
    } catch (err) {
        errorHandle(res, err);
    }
});

router.patch(`/${myDataBase}/:id`, async (req, res) => {
    try {
        const docToUpdate = req.body;
        if (!isValidDocument(docToUpdate))
            return res.status(400).json({message: "Invalid document format"});

        const result = await Model.replaceOne({id: req.correctID}, {$set: docToUpdate});
        if (result.matchedCount === 0)
            return res.status(404).json({message: "Document Not Found"});
        if (result.modifiedCount === 0)
            return res.status(400).json({message: "Nie chciało mie się nic zmenić"});

        res.json({message: "Zamieniłem dokumenty"});
    } catch (err) {
        errorHandle(res, err);
    }
});

module.exports = router;    