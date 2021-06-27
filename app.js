const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')

// Import Routes
const authRoutes = require('./routes/authRoute');
const dashboardRoute = require('./routes/dashboardRoute')

// Import Middelware

const { bindUserWithRequest } = require('./middleware/authMiddelware');
const setLocals = require('./middleware/setLocals')




const MONGODB_URI =
    'mongodb+srv://testadmin:test123@cluster0.qure3.mongodb.net/myFirstDatabase';
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'Sessions',
    expires: 1000 * 60 * 60 * 2,
});

// PlayGround Routes


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware Array

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
    bindUserWithRequest(),
    setLocals(),
    flash()
];
app.use(middleware);
app.use('/auth', authRoutes);
app.use('/dashboard',dashboardRoute)

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World',
    });
});
// getting-started.js
const PORT = process.env.PORT || 8080;

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log('Database Connected');
            console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
        });
    })
    .catch((e) => {
        return console.log(e);
    });
