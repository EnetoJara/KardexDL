var AlumnoDAO = require('../database/DAOS/alumnoDAO');

var AlumnoService = class AlumnoService {
    constructor() {}

    verMisMaterias(idAlumno) {
        var dao = new AlumnoDAO();
        return dao.verMisMaterias(idAlumno)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
            });
    }

    resumenNotas(idAlumno) {
        var dao = new AlumnoDAO();
        var toReturn = {};
        return dao.resumenNotas(idAlumno)
            .then(function (result) {
                toReturn.DEFAULTS = result[0];
                if (result[0].PUBLICA === 0) {
                    return toReturn;
                } else {
                    return dao.viewNotas(idAlumno, toReturn.DEFAULTS.CICLOESCOLAR_ID, toReturn.DEFAULTS.SEMESTRE_ID)
                        .then(function (notas) {
                            toReturn.NOTAS = notas;
                            var hasN = false;
                            for (var i = 0; i < toReturn.NOTAS.length; i++) {
                                if (toReturn.NOTAS[i].SIGLAS === 'SN') {
                                    toReturn.NOTAS[i].PSEMESTRE = 'N/A';
                                    toReturn.NOTAS[i].SSEMESTRE = 'N/A';
                                    toReturn.NOTAS[i].TSEMESTR = 'N/A';
                                    toReturn.NOTAS[i].TOTAL = 'N/A';
                                    hasN = true;
                                }
                            }
                            if (hasN === true) {
                                toReturn.NOTAS[toReturn.NOTAS.length - 1].PSEMESTRE = 'N/A';
                                toReturn.NOTAS[toReturn.NOTAS.length - 1].SSEMESTRE = 'N/A';
                                toReturn.NOTAS[toReturn.NOTAS.length - 1].TSEMESTR = 'N/A';
                                toReturn.NOTAS[toReturn.NOTAS.length - 1].TOTAL = 'N/A';
                            }
                            hasN = null;
                            return dao.getAlumno(idAlumno);
                        }).then(function (alumno) {
                            toReturn.ALUMNO = alumno;
                            return toReturn;
                        });
                }
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                toReturn = null;
            });
    }

    hacertabla(tabla, nombre, usuario, ALUMNO) {
        var docDefinition = [];
        var htmlHead = "<html><head>" +
            "<title> KardexDL </title>" +
            "</head><body><div> <p>" + ALUMNO.CARRERA + " - " + ALUMNO.CICLO + "</p>" +
            "<div><center><h2><b>Universidad Enrique Díaz de León</b></h2></center></div>" +
            "<div><center><table border='1'><thead><th>NOMBRE</th><th>MATRICULA</th><th>TURNO</th><th>SEMESTRE</th></thead>" +
            "<tbody><td><center><i> " + ALUMNO.NOMBRE + " </i></center></td><td> <center>" + usuario + " </center></td><td> <center>" + ALUMNO.TURNO + " </center></td><td><center> " + ALUMNO.SEMESTRE + " </center></td></tbody></table></center></div>" +
            "<br/> " +
            "<div><table class='ui definition table' border='1'> " +
            "<thead> " +
            "<tr> " +
            "<th>Materia</th> " +
            "<th>Primer Parcial</th> " +
            "<th>Segundo Parcial</th> " +
            "<th>Tercer Parcial</th> " +
            "<th>Total</th> " +
            "<th>Paso</th> " +
            "</tr> " +
            "</thead> " +
            "<tbody> ";

        var htmlFoot = "</tbody> " +
            "</table> </div>" +

            "</div></body></hmlt>";
        var cuerpo = '';
        for (var i = 0; i < tabla.length; i++) {
            cuerpo += '<tr><td><center>' + tabla[i].MATERIA + '</center></td><td><center>' + tabla[i].PSEMESTRE + '</center></td><td><center>' + tabla[i].SSEMESTRE + '</center></td><td><center>' + tabla[i].TSEMESTR + '</center></td><td><center>' + tabla[i].TOTAL + '</center></td><td><center>' + tabla[i].PASO + '</center></td></tr>';
        }
        return htmlHead + cuerpo + htmlFoot;
    }

    getPosiblesAlumnos(params) {
        var dao = new AlumnoDAO();
        var aux = {};
        return dao.getPosiblesAlumnos(params)
            .then(function (result) {
                aux.ALUMNOS = result;
                return aux;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                aux = null;
            });
    }

    resultadoDelSemestre(params) {
        var dao = new AlumnoDAO();
        var toReturn = {};
        return dao.getAlumnoInfo(params.ID)
            .then(function (alumno) {
                toReturn.ALUMNO = alumno;
                return dao.resultadoDelSemestre(params);
            }).then(function (result) {
                toReturn.CALIFICIONES = result;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                toReturn = null;
            });
    }
};
module.exports = AlumnoService;
