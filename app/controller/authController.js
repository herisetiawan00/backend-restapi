const Boom = require('@hapi/boom')
const db = require('../config/db.js');
const config = require('../config/config.js');
const User = db.user;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.register = async (request, h) => {
    const checkEmail = await User.findOne({
        where: {
            email: request.payload.email
        }
    }).catch(err => {
        return Boom.badRequest(err)
    })

    if (checkEmail === null) {
        const user = await User.create({
            name: request.payload.name,
            username: request.payload.username,
            email: request.payload.email,
            password: bcrypt.hashSync(request.payload.password, 8)
        }).catch(err => {
            return Boom.badRequest(err)
        })
        user.setRoles(1)
        return h.response({ status: 'success', statusCode: 201 }).code(201)
    } else {
        return Boom.badRequest('Email already taken')
    }

}
exports.login = async (request, h) => {
    const user = await User.findOne({
        where: {
            email: request.payload.email
        }
    }).catch(err => {
        return Boom.badRequest(err)
    });

    if (user !== null) {
        var passwordIsValid = bcrypt.compareSync(request.payload.password, user.password);

        if (!passwordIsValid) {
            return Boom.badRequest('Login failed')
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        return h.response({ auth: true, type: "Bearer", accessToken: token }).code(200)

    } else {
        return Boom.badRequest('Login failed')
    }

}