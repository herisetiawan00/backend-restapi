const user = require('../controller/userController');

module.exports = [{
    method: 'GET',
    path: '/users',
    handler: user.users
},
{
    method: 'GET',
    path: '/test',
    handler: async (request, h) => {
        return h.response({ status: "Connected" }).code(200)
    }
},
{
    method: 'GET',
    path: '/users/remove/{id}',
    handler: user.delete
}]
