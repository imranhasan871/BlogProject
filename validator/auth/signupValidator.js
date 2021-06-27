const { body } = require('express-validator');
const User = require('../../models/User');


module.exports = [
    body('username')
        .isLength({ min: 2, max: 15 })
        .withMessage('Username Must Be Btween 2 to 15Chars')
        .custom(async (username) => {
            let user = await User.findOne({ username });
            if (user) {
                return Promise.reject('Username Already Exised');
            }
        }),
    body('email')
        .isEmail()
        .trim()
        .withMessage('Please Provide a Valid Email')
        .custom(async (email) => {
            email = await User.findOne({ email });
            if (email) {
                return Promise.reject('Email is Already Exised');
            }
        })
        .normalizeEmail(),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Your password must be getter then 5 Chart'),
    body('confirmpassword')
        .isLength({ min: 5 })
        .withMessage('Your password must be getter then 5 Chart')
        .custom((confirmpassword, { req }) => {
            if (confirmpassword !== req.body.password) {
                throw new Error('Password doset match');
            }
            return true;
        }),
];
