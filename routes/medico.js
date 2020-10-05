var express = require('express');



var SEDD = require('../config/config').SEED;

var app = express();

var Medico = require('../models/medico');


/**
 * Verificar token
 */
var mdAutenticacion = require('../middlewares/autenticacion');


/**
 * Obtener todos los Medicos
 */
app.get('/', (req, res) => {

    //Para realizar la paginacion de resultados.
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        error: err
                    });
                }

                //Cuento el total de registros.
                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
            });
});


/**
 * Obtener Medico
 */
app.get('/:id', (req, res) => {

    var id = req.params.id;
    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    error: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe.',
                    errors: {
                        message: 'No existe un medico con ese ID'
                    }
                });
            }

            res.status(200).json({
                ok: true,
                medico: medico
            });
        });
});


/**
 * Crear un nuevo Medico
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        hospital: body.hospital,
        usuario: req.usuario._id
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                error: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

/**
 * Actualizar Medico
 */

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                error: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe.',
                errors: {
                    message: 'No existe un medico con ese ID'
                }
            });
        }
        medico.nombre = body.nombre;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    error: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

/**
 * Eliminar Medico
 */


app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                error: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: {
                    message: 'No existe un medico con ese id'
                }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});


module.exports = app;