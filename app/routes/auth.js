const auth = require('../controller/authController');

module.exports = [{
    method: 'POST',
    path: '/auth/login',
    handler: auth.login
}, {
    method: 'POST',
    path: '/auth/register',
    handler: auth.register
}
]