var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");
var moment = require("moment");

function scrape(req, res) {
    var url = "http://www.inventorspot.com";
    request(url + "/news", function (error, response, body) {   
        if (error) {
            res.send(500, {error});

        } else {
            var $ = cheerio.load(body);
            var results = [];
    
            $(".ntype-blog-2").each(function (i, element) {
                var result = {};
    
                result.title = $(this)
                    .children("h2")
                    .text();
                result.link = url + $(this)
                    .children("h2")
                    .children("a")
                    .attr("href");
                result.date = moment().format("MMM-DD-YYYY");
                result.img = $(this)
                    .find("img")
                    .attr("src");
                result.description = $(this)
                    .find(".KonaBody")
                    .text();

                results.push(result);
                return i < 19;
            });   
                         
            db.Article.create(
                results
            )
            .then(function (dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            });
        }

        res.redirect("/");
    });
}

function all(req, res) {
    var perPage = 9;
    var page = req.params.page || 1;

    db.Article.find({})
        .populate("notes")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({
            date: 1
        })
        .exec(function(err, articles) {
            if (err) {console.log(err);}
            db.Article
                .count()
                .exec(function(err, count) {
                    if (err) {console.log(err)}
                    res.render("index", {              
                        moment,
                        articles,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    });
                });
        });
}

function addNote(req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If the User was updated successfully, send it back to the client
            res.redirect("/#" + req.params.id);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            console.log(err);
        });
}

function deleteNote(req, res) {
    db.Note.remove({
        _id: req.params.noteID
    })
    .then( function (deleted) {
            console.log("Note deleted");
            res.redirect("/#" + req.params.id);
    })
    .catch(function(err) {
        console.log(error);
    });
}

module.exports = {
    scrape, all, addNote, deleteNote
};