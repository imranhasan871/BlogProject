const { body } = require('express-validator');

module.exports = [
    body('email')
        .not().isEmpty().withMessage('Email Cannot Be Empty'),
    body('password').not().isEmpty().withMessage('Password Cannot Be Empty')
]
