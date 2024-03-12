const {
    isValidDocument,
    errorHandle,
    validateIdInRequest 
} = require("./appfunction");

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

mongoose.connect("mongodb://localhost:27017/orzechy");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => console.log("Conected to MongoDB"));

const mdbSchema = new mongoose.Schema({
    title: {type: String},
    tree: {type: String},
    protein: {type: Number},
    price: {type: Number},
    id: {type: Number}
});

const Model = mongoose.model("orzechy", mdbSchema, "myorzechy");

router.put("orzech", async (req, res) => {
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

module.exports = router;