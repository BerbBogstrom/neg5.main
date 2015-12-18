var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RegistrationSchema = new Schema({
    teamName : String,
    numTeams : Number,
    email : {type : String, set : function(email) {
        return email.toLowerCase();
    }},
    tournamentid : String,
    directorid : String,
    message : String,
    signupTime : {type : Date, default : Date.now()}
});

module.exports = mongoose.model("Registration", RegistrationSchema);