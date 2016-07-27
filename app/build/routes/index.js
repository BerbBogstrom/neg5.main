'use strict';

var _token = require('./../auth/middleware/token');

var _tournament = require('./../models/sql-models/tournament');

var _tournament2 = _interopRequireDefault(_tournament);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app) {

    var index = require('../controllers/index-controller');

    app.get('/', function (req, res) {
        if (req.session.director) {
            res.redirect("/home");
        } else {
            index.render(req, res);
        }
    });

    app.get("/tournaments", _token.hasToken, function (req, res, next) {
        var currentUser = req.currentUser;
        res.render('tournament/alltournaments', { tournamentd: currentUser });
    });

    app.get("/t/:tid", _token.hasToken, function (req, res, next) {
        res.render("tournament/tournament-view", { tournamentd: req.currentUser });
    });

    app.get("/about", function (req, res) {
        res.render("index/about", { tournamentd: req.session.director });
    });
};