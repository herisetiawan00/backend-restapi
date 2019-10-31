const Boom = require('@hapi/boom')
const db = require('../config/db.js');
const config = require('../config/config.js');
const User = db.user;
var jwt = require('jsonwebtoken');

exports.delete = async (request, h) => {
    let token = request.headers['x-access-token'] || request.headers['authorization'];
    if (!token) {
        return Boom.forbidden('Token not provided')
    }
    if (token.startsWith('Bearer')) {
        token = token.slice(7, token.length);
    }
    try {
        jwt.verify(token, config.secret, (err, decoded) => {
            request.userId = decoded.id;
        });
    } catch (error) {
        return Boom.forbidden('Token mismatch')
    }
    if (request.userId !== null) {
        const user = await User.findByPk(request.userId).catch(err => {
            return Boom.badImplementation(err)
        })
        const role = await user.getRoles().catch(err => {
            return Boom.badImplementation(err)
        })
        if (role[0].name.toUpperCase() === 'ADMIN') {
            console.log('Deleting')
            console.log(request.params.id)
            User.destroy({
                where: {
                    id: request.params.id
                }
            }).catch(err => {
                return Boom.badImplementation(err)
            })
            console.log('Success')
            return h.response({ status: 'success', statusCode: 200 }).code(200)
        } else {
            return Boom.forbidden('You\'re not allowed to see this')
        }
    } else {
        return Boom.forbidden('Token mismatch')
    }
}
exports.users = async (request, h) => {
    let token = request.headers['x-access-token'] || request.headers['authorization'];

    if (!token) {
        return Boom.forbidden('Token not provided')
    }

    if (token.startsWith('Bearer')) {
        //  Remove Bearer from string
        token = token.slice(7, token.length);
    }

    try {
        jwt.verify(token, config.secret, (err, decoded) => {
            request.userId = decoded.id;
        });
    } catch (error) {
        return Boom.forbidden('Token mismatch')
    }
    if (request.userId !== null) {
        const user = await User.findByPk(request.userId).catch(err => {
            return Boom.badImplementation(err)
        })

        const role = await user.getRoles().catch(err => {
            return Boom.badImplementation(err)
        })

        if (role[0].name.toUpperCase() === 'ADMIN') {
            let users = await User.findAll({
                attributes: ['id', 'name', 'username', 'email'],
            }).catch(err => {
                return Boom.badImplementation(err)
            })
            return h.response({ auth: true, type: role[0].name.toUpperCase(), users: users }).code(200)
        } else if (role[0].name.toUpperCase() === 'USER') {
            let profile = await User.findByPk(request.userId, {
                attributes: ['name', 'username', 'email'],
            }).catch(err => {
                return Boom.badImplementation(err)
            })
            return h.response({ auth: true, type: role[0].name.toUpperCase(), user: profile }).code(200)
        } else {
            return Boom.forbidden('You\'re not allowed to see this')
        }
    } else {
        return Boom.forbidden('Token mismatch')
    }
}