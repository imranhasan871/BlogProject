const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormater');
const Flash = require('../utils/Flash');

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup', {
        title: 'Create A New Account',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};
exports.signupPostController = async (req, res, next) => {
    let { username, email, password } = req.body;
    let errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
          req.flash('fail', 'Please Check Your Form');
        return res.render('pages/auth/signup', {
            title: 'Create A New Account',
            error: errors.mapped(),
            value: {
                username,
                email,
                password,
            },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        let hashedPassword = await bcrypt.hash(password, 11);
        let user = new User({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        req.flash('success', 'User Created Successfully');
        res.redirect('/auth/login');
    } catch (error) {
        console.log(error);
        next(error);
    }

    console.log(req.body);
};

exports.loginGetController = (req, res, next) => {
    res.render('pages/auth/login', {
        title: 'Log in',
        error: {},
        flashMessage: Flash.getMessage(req),
    });
};
exports.loginPostController = async (req, res, next) => {
    let { email, password } = req.body;
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Check Your Form');
        return res.render('pages/auth/login', {
            title: 'Login to Your Account',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
        });
    }
    try {
        let user = await User.findOne({ email });
        if (!user) {
            req.flash('fail', 'Please Provide Valid Creadintial');
            return res.render('pages/auth/login', {
                title: 'Login to Your Account',
                error: {},
                flashMessage: Flash.getMessage(req),
            });
        }

        let match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('fail', 'Please Provide Your Valid Credentials');
            return res.render('pages/auth/login', {
                title: 'Login to Your Account',
                error: {},
                flashMessage: Flash.getMessage(req),
            });
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
            if (err) {
                console.log(err);
                return next();
            }
            req.flash('success', 'Successfully Loggin');
            res.redirect('/dashboard');
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.logoutController = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        req.flash('success', 'Successfully Logout');
        return res.redirect('/auth/login');
    });
};
