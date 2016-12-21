'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildTeamPlayersArray = buildTeamPlayersArray;
exports.buildTeamDivisionsArray = buildTeamDivisionsArray;

var _db = require('../database/db');

var _sql = require('../database/sql');

var _sql2 = _interopRequireDefault(_sql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var teamSQL = _sql2.default.team;

function buildTeamPlayersArray(tournamentId, players, currentUser) {
  return {
    tournamentIds: players.map(function () {
      return tournamentId;
    }),
    playerIds: players.map(function (player) {
      return player.id;
    }),
    playerNames: players.map(function (player) {
      return player.name;
    }),
    teamIds: players.map(function (player) {
      return player.teamId;
    }),
    addedBy: players.map(function () {
      return currentUser;
    })
  };
}

function buildTeamDivisionsArray(tournamentId, teamId, divisions) {
  return {
    divisionTeamIds: divisions.map(function () {
      return teamId;
    }),
    divisionTournamentIds: divisions.map(function () {
      return tournamentId;
    })
  };
}

exports.default = {
  getTeamsByTournament: function getTeamsByTournament(tournamentId) {
    return new Promise(function (resolve, reject) {
      var params = [tournamentId];
      (0, _db.query)(teamSQL.findByTournament, params, _db.queryTypeMap.any).then(function (allTeams) {
        var formattedTeams = allTeams.map(function (team) {
          return _extends({}, team, {
            team_divisions: team.team_divisions.filter(function (division) {
              return division.phase_id !== null;
            })
          });
        });
        resolve(formattedTeams);
      }).catch(function (error) {
        return reject(error);
      });
    });
  },

  findById: function findById(tournamentId, teamId) {
    return new Promise(function (resolve, reject) {
      var params = [tournamentId, teamId];
      (0, _db.query)(teamSQL.findById, params, _db.queryTypeMap.one).then(function (team) {
        return resolve(team);
      }).catch(function (error) {
        return reject(error);
      });
    });
  },

  addTeamToTournament: function addTeamToTournament(tournamentId, teamId, teamName, players, divisionIds, currentUser) {
    return new Promise(function (resolve, reject) {
      var addTeamQueries = teamSQL.add;
      var queriesArray = [];

      var _buildTeamPlayersArra = buildTeamPlayersArray(tournamentId, players, currentUser);

      var playerIds = _buildTeamPlayersArra.playerIds;
      var playerNames = _buildTeamPlayersArra.playerNames;
      var teamIds = _buildTeamPlayersArra.teamIds;
      var tournamentIds = _buildTeamPlayersArra.tournamentIds;
      var addedBy = _buildTeamPlayersArra.addedBy;

      var _buildTeamDivisionsAr = buildTeamDivisionsArray(tournamentId, teamId, divisionIds);

      var divisionTeamIds = _buildTeamDivisionsAr.divisionTeamIds;
      var divisionTournamentIds = _buildTeamDivisionsAr.divisionTournamentIds;


      queriesArray.push({
        text: addTeamQueries.addTeam,
        params: [teamId, teamName, tournamentId, currentUser],
        queryType: _db.txMap.one
      }, {
        text: addTeamQueries.addPlayers,
        params: [playerIds, playerNames, teamIds, tournamentIds, addedBy],
        queryType: _db.txMap.any
      }, {
        text: addTeamQueries.addDivisions,
        params: [divisionTeamIds, divisionIds, divisionTournamentIds],
        queryType: _db.txMap.any
      });
      (0, _db.transaction)(queriesArray).then(function (result) {
        var formattedResult = {
          team: result[0],
          players: result[1],
          divisions: result[2]
        };
        resolve(formattedResult);
      }).catch(function (error) {
        return reject(error);
      });
    });
  },

  updateTeamName: function updateTeamName(tournamentId, teamId, name) {
    return new Promise(function (resolve, reject) {
      var params = [tournamentId, teamId, name];
      (0, _db.query)(teamSQL.updateName, params, _db.queryTypeMap.one).then(function (team) {
        return resolve(team);
      }).catch(function (error) {
        return reject(error);
      });
    });
  },

  updateTeamDivisions: function updateTeamDivisions(tournamentId, teamId, divisions) {
    return new Promise(function (resolve, reject) {
      var queriesArray = [];

      var _buildTeamDivisionsAr2 = buildTeamDivisionsArray(tournamentId, teamId, divisions);

      var divisionTeamIds = _buildTeamDivisionsAr2.divisionTeamIds;
      var divisionTournamentIds = _buildTeamDivisionsAr2.divisionTournamentIds;

      queriesArray.push({
        text: teamSQL.removeDivisions,
        params: [tournamentId, teamId],
        queryType: _db.txMap.none
      }, {
        text: teamSQL.add.addDivisions,
        params: [divisionTeamIds, divisions, divisionTournamentIds],
        queryType: _db.txMap.any
      });
      (0, _db.transaction)(queriesArray).then(function (result) {
        return resolve({ divisions: result[1] });
      }).catch(function (error) {
        return reject(error);
      });
    });
  },

  deleteTeam: function deleteTeam(tournamentId, teamId) {
    return new Promise(function (resolve, reject) {
      var params = [tournamentId, teamId];
      (0, _db.query)(teamSQL.remove, params, _db.queryTypeMap.one).then(function (result) {
        return resolve(result);
      }).catch(function (error) {
        return reject(error);
      });
    });
  }
};