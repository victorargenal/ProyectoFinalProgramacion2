const db = require("../models");
const UsuariosAPI = db.usuariosAPI;
const Op = db.Sequelize.Op;

exports.crearUsuario = (req, res) => {
    if(!req.body.nombre_usuario || !req.body.password_hash || !req.body.nombre_completo || !req.body.rol){
        res.status(400).send({
            message: "Algun campo esta vacio, favor rellenarlo."
        });
        return;
    }

    const usuariosAPI = {
        nombre_usuario: req.body.nombre_usuario,
        password_hash: req.body.password_hash,
        nombre_completo: req.body.nombre_completo,
        rol: req.body.rol
    };

    UsuariosAPI.create(usuariosAPI)
        .then(() => {
            res.send({
                message: "Usuario creado correctamente"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al crear Usuario"
            });
        });
};

exports.buscarFiltros = (req, res) => {
    const nombre_recibido = req.query.nombre_completo;
    const estado_recibido = req.query.estado_usuario;
    const rol_recibido = req.query.rol;
    
    const condition = {}

    if(rol_recibido) {
        condition.rol= rol_recibido
    }

    if(estado_recibido) {
        condition.estado_usuario= estado_recibido
    }
    
    if (nombre_recibido) {
        condition.nombre_completo = {
            [Op.iLike]: `%${nombre_recibido}%`
        };
    }
    
    UsuariosAPI.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al encontrar los usuarios "
            });
        });
};

exports.queryUsarios = (req, res) => {
    UsuariosAPI.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "error al encontrar los registros"
            });
        });
};

exports.buscarId = (req, res) => {
    const id_usuario_recibido= req.params.id;

    UsuariosAPI.findByPk(id_usuario_recibido)
        .then(data => {
            if(!data){
                res.status(404).send({
                    message: "No existe el id: " + id_usuario_recibido
                });
                return;
            }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al encontrar el Usuario con el id: " + id_usuario_recibido
            });
        });
};

exports.actualizarUsuario = (req, res) => {
    const id_usuario_recibido = req.params.id;

    UsuariosAPI.update(req.body, {
        where: { id_usuario: id_usuario_recibido}
    })
        .then(num => {
            if (num == 1){
                res.send({
                    message: "Registro actualizado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Error al actualizar el Usuario id= ${id_usuario_recibido}. Registro inexistente o valor nulo`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al actualizar el registro con el id: " + id_usuario_recibido
            });
        });
};

exports.eliminarUsario = (req, res) => {
    const id_usuario_recibido = req.params.id;

    UsuariosAPI.destroy({
        where: {id_usuario: id_usuario_recibido}
    })
        .then(num => {
            if (num == 1){
                res.send({
                message: "Usuario eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el usuario id= ${id_usuario_recibido}. Usuario inexistente`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar el ususario con el id: " + id_usuario_recibido
            });
        });
};

exports.loginUsuario = (req, res) => {

    const nombre_usuario_recibido = req.body.nombre_usuario;
    const password_recibida = req.body.password_hash;

    if (!nombre_usuario_recibido || !password_recibida) {
        return res.status(400).send({
            message: "Usuario o contraseña vacios"
        });
    }

    UsuariosAPI.findOne({
        where: {
            nombre_usuario: nombre_usuario_recibido
        }
    })
    .then(usuario => {

        if (!usuario) {
            return res.status(401).send({
                message: "Usuario o contraseña incorrectos"
            });
        }

        if (usuario.password_hash !== password_recibida) {
            return res.status(401).send({
                message: "Usuario o contraseña incorrectos"
            });
        }

        if (usuario.estado_usuario !== "Activo") {
            return res.status(403).send({
                message: "Usuario inactivo"
            });
        }

        res.send({
            message: "Login correcto",
            id_usuario: usuario.id_usuario,
        });

    })
    .catch(err => {

        res.status(500).send({
            message:
                err.message ||
                "Error al iniciar sesion"
        });

    });
};
