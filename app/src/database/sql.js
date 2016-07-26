import pgp from 'pg-promise';

let QueryFile = pgp.QueryFile;

let getSQL = (file) => {
    const relativePath = './../sql/';
    return new QueryFile(relativePath + file, {minify: true});
}

export default {
    tournament: {
        add: getSQL('tournament-sql/createTournament.sql'),
        findByUser: getSQL('tournament-sql/findByUser.sql'),
        findById: getSQL('tournament-sql/findById.sql'),
        update: getSQL('tournament-sql/updateTournament.sql'),
        editPointScheme: {
            addPointValue: getSQL('tournament-sql/addTossupPointValue.sql'),
            edit: {
                deleteTossupValues: getSQL('tournament-sql/transactions/editPointScheme/deleteTossupValues.sql'),
                updateBonusValues: getSQL('tournament-sql/transactions/editPointScheme/updateBonusValues.sql'),
                updateTossupPointValues: getSQL('tournament-sql/transactions/editPointScheme/updateTossupPointValues.sql')
            }
        }
    },
    account: {
        add: getSQL('account-sql/createAccount.sql'),
        findOne: getSQL('account-sql/findAccount.sql'),
        permissions: getSQL('tournament-sql/tournamentPermission.sql'),
        findUsers: getSQL('account-sql/findUsers.sql')
    },
    match: {
        findByTournament: getSQL('match-sql/findMatchesByTournament.sql')
    },
    team: {
        findByTournament: getSQL('team-sql/findTeamsByTournament.sql')
    }
}