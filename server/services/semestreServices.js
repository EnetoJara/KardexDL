var SemestreDAO = require('.././database/DAOS/semestreDAO');

var SemestreServices = class SemestreServices {
    contructor () {}
    
    getSemestres() {
        var SemestreDB = new SemestreDAO();
        return SemestreDB.getSemestres()
        .then(function(semestres) {
            return semestres;
        });
    }
};
module.exports = SemestreServices;
