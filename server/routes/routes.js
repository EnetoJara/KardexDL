/**
	Esta clase es la que se encarga de escuchar al cliente y ejecuta el controlador correspondiente
*/
var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('.././middleware/auth.min');
var user = require('.././controllers/userController');
var home = require('.././controllers/homeController');
var carrera = require('.././controllers/carreraController');
var ciclo = require('.././controllers/cicloController');
var materia = require('.././controllers/materiaController');
var maestro = require('.././controllers/maestroController');
var control = require('.././controllers/controlController');
var alumno = require('.././controllers/alumnoController');

//-----------------PRIVATE ROUTES--------------------
//UNIVERSAL CONTROLLER
router.post('/inicio', passport.authenticate('local', {
    successRedirect: '/inicio',
    failureRedirect: '/login',
    failureFlash: true
}));
router.get('/', home.index);
router.get('/login', home.index);
router.get('/inicio', auth.isLogged, home.home);
router.get('/salida', auth.isLogged, home.logOut);
//USER CONTROLLER
router.post('/registrar', [auth.isLogged, auth.isAuth], user.registrarUsuario);
router.get('/registrar', [auth.isLogged, auth.isAuth], user.registrar);
router.get('/actualizar', [auth.isLogged], user.getActualizar);
router.post('/actualizar', [auth.isLogged], user.actualizar);
router.get('/listaAlumno', [auth.isLogged, auth.isControl], user.listaAlumno);
router.post('/listaAlumno', [auth.isLogged, auth.isControl], user.getListaAlumnos);
router.post('/eliminarAlumno', [auth.isLogged, auth.isControl], user.eliminarAlumno);
router.post('/activarAlumno', [auth.isLogged, auth.isControl], user.activarAlumno);
router.get('/alumno/:matricula', [auth.isLogged, auth.isControl], user.editarAlumno);
router.post('/actualizarAlumno', [auth.isLogged, auth.isControl], user.actualizarAlumno);
router.get('/listaMaestro', [auth.isLogged, auth.isControl], user.getListaMaestro);
router.post('/listaMaestro', [auth.isLogged, auth.isControl], user.listaMaestro);
router.get('/maestro/:maestro', [auth.isLogged, auth.isControl], user.editarMaestro);
router.post('/actualizarMaestro', [auth.isLogged, auth.isControl], user.actualizarMaestro);
router.get('/materias/:maestro', [auth.isLogged, auth.isControl], user.asignarMaterias);
router.post('/planAcademico', [auth.isLogged, auth.isAuth], user.verAsignacion);
//CARRERA CONTROLLER
router.get('/registrarCarrera', [auth.isLogged, auth.isAdmin], carrera.getCarrera);
router.post('/registrarCarrera', [auth.isLogged, auth.isAdmin], carrera.registrarCarrera);
router.post('/eliminarCarrera', [auth.isLogged, auth.isAdmin], carrera.eliminarCarrera);
router.post('/activarCarrera', [auth.isLogged, auth.isAdmin], carrera.activarCarrera);
router.get('/editarCarrera/:id', [auth.isLogged, auth.isAdmin], carrera.editarCarrera);
router.post('/editarCarrera', [auth.isLogged, auth.isAdmin], carrera.postEditarCarrera);
//CICLO CONTROLLER
router.get('/registrarCiclo', [auth.isLogged, auth.isAdmin], ciclo.getCiclo);
router.post('/registrarCiclo', [auth.isLogged, auth.isAdmin], ciclo.registrarCiclo);
router.post('/eliminarCiclo', [auth.isLogged, auth.isAdmin], ciclo.eliminarCiclo);
router.post('/activarCiclo', [auth.isLogged, auth.isAdmin], ciclo.activarCiclo);
//MATERIA CONTROLLER
router.get('/registrarMateria', [auth.isLogged, auth.isControl], materia.getMateria);
router.post('/registrarMateria', [auth.isLogged, auth.isControl], materia.registrarMateria);
router.post('/activarMateria', [auth.isLogged, auth.isControl], materia.activarMateria);
router.post('/eliminarMateria', [auth.isLogged, auth.isControl], materia.eliminarMateria);
router.get('/editarMateria/:id', [auth.isLogged, auth.isControl], materia.editarMateria);
router.post('/editarMateria', [auth.isLogged, auth.isControl], materia.postEditarMateria);
router.post('/getMateriasBySemestre', [auth.isLogged, auth.isControl], materia.getMateriasBySemestre);
router.post('/postAsignar', [auth.isLogged, auth.isControl], materia.postAsignar);
router.post('/designarMarteria', [auth.isLogged, auth.isControl], materia.designarMarteria);
router.get('/planAcademico', [auth.isLogged, auth.isAuth], materia.planAcademico);
//MAESTRO CONTROLLER
router.get('/asignarCalificacion', [auth.isLogged, auth.isMaestro], maestro.buscarMaterias);
router.get('/detalleCalificacion', [auth.isLogged, auth.isMaestro], maestro.detalleMaterias);
router.post('/asignarCalificacion', [auth.isLogged, auth.isMaestro], maestro.getMateriasDelMaestro);
router.post('/detalleListaMateras', [auth.isLogged, auth.isMaestro], maestro.getDetalleMateriasDelMaestro);
router.get('/:idTurno/calificar/:idMateria', [auth.isLogged, auth.isMaestro], maestro.darCalificacion);
router.post('/grupoCalificado', [auth.isLogged, auth.isMaestro], maestro.grupoCalificado);
router.get('/:idTurno/actualizarNota/:id', [auth.isLogged, auth.isMaestro], maestro.actualizarNota);
router.get('/:idTurno/detalleNota/:id', [auth.isLogged, auth.isMaestro], maestro.detalleNota);
router.post('/actualizarCalificacion',[auth.isLogged, auth.isMaestro], maestro.actualizarCalificacion);
router.post('/eliminarMaestro', [auth.isLogged, auth.isAuth], maestro.eliminarMaestro);
router.post('/activarMaestro', [auth.isLogged, auth.isAuth], maestro.activarMaestro);
//CONTROL CONTROLLER
router.get('/calificaciones/:idMateria', [auth.isLogged, auth.isAuth], control.verCalificaciones);
router.get('/publicarNotas', [auth.isLogged, auth.isControl], control.publicarNotas);
router.post('/hacerPublicas', [auth.isLogged, auth.isControl], control.hacerPublicas);
router.get('/:idMatricula/calificaciones', [auth.isLogged, auth.isControl], control.verNotas);
router.post('/permitirAsignarNotas', [auth.isLogged, auth.isControl], control.permitirAsignarNotas);
router.get('/listaControl', [auth.isLogged, auth.isControl], control.getListaControl);
router.post('/listaControl', [auth.isLogged, auth.isControl], control.listaControl);
router.post('/eliminarControl', [auth.isLogged, auth.isAuth], control.eliminarControl);
router.get('/control/:idControl', [auth.isLogged, auth.isControl], control.detalleControl);
router.post('/actualizarControl', [auth.isLogged, auth.isControl], control.actualizarControl);
//ALUMNO CONTROLLER
router.get('/verMisMaterias', [auth.isLogged, auth.isAlumno], alumno.verMisMaterias);
router.get('/verMisCalificaciones',[auth.isLogged, auth.isAlumno], alumno.verMisNotas);
router.post('/verMisCalificaciones', [auth.isLogged, auth.isAlumno], alumno.resumenNotas);
router.get('/buscarAlumno', [auth.isLogged, auth.isControl], alumno.buscarAlumnoPorNombre);
router.post('/buscarAlumno', [auth.isLogged, auth.isControl], alumno.postBuscarAlumnoPorNombre);
router.post('/:idMatricula/calificaciones', [auth.isLogged, auth.isAuth], alumno.resultadoDelSemestre);
router.post('/pdf-:idMatricula', [auth.isLogged, auth.isAlumno], alumno.pdfFromHTMLString);
//-----------------PRIVATE ROUTES--------------------
module.exports = router;
