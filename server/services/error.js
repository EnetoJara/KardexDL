var ERROR = [
    {
        code: 'ER_DUP_ENTRY',
        errno: 1062,
        message: 'Matricula o Nom. Empleado ya existe.'
    },{
        code: 'INVALID_PSSWRD',
        errno: 5000,
        message: 'ERROR la contraseña actual no es valida.'
    }
];

exports.getError = function (code,errno) {
    for (var i = 0; i < ERROR.length; i++) {
        if (ERROR[i].code === code && ERROR[i].errno === errno) {
            return ERROR[i].message;
        }
    }
};