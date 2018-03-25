var express = require('express');
var router = express.Router();
var controller = require('../controllers/html-controller.js');
var db = require("../models");

router.get('/scrape', controller.scrape);
router.get("/:page?", controller.all);
router.post("/articles/:id/notes", controller.addNote);
router.delete("/articles/:id/notes/:noteID", controller.deleteNote);

module.exports = router;
