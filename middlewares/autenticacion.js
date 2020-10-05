var jwt = require('jsonwebtoken');
var SEDD = require('../config/config').SEED;


/**
 * Verificar token
 */

exports.verificaToken = function (req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEDD, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                error: err
            });
        }
        req.usuario = decoded.usuario;

        next();
    });
};

/**
 * Verificar Admin
 */

exports.verificaADMIN_ROLE = function (req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - no es administrador',
            error: {
                message: 'No es administrador, no puede hacer eso.'
            }
        });
    }
};

/**
 * Verificar Admin o Mismo usuario
 */

exports.verificaADMIN_o_MismoUsuario = function (req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - no es administrador ni es el mismo usuario',
            error: {
                message: 'No es administrador, no puede hacer eso.'
            }
        });
    }
};