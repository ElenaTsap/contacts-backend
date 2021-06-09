require('dotenv').config() //always on top of file to be sure

const express= require('express');
const app = express();
const contacts = require('./router/contacts');
const auth = require('./router/auth');
const publicView = require('./router/publicViews');
const connectDB = require('./config/db');
const authMid = require('./middleware/auth');
const path = require('path');
const hbs = require('hbs');
const publicRoutes = require('./router/public')

//this port is a specific thing for node.js
//it is a port assigned by the server
const port = process.env.PORT || 8080;

connectDB();

//sharing the public folder with the client
//now if someone types http://localhost:8080/avatars/a1622537057921.png it goes into the public folder by default and then to folder public
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.json());

app.engine('html', hbs.__express);
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');

//protection to protect server and client
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE");
    next();
} 
app.use(allowCrossDomain);

//putting the middleware in the main route
//since the router here is not handled by the express router we have to manage the preflight request from the browser 
app.use('/contacts', authMid.checkAuth, contacts);
app.use('/auth', auth);
app.use('/pages', publicView);
//public route for get-contact email
app.use('/', publicRoutes);

app.listen(port, () => console.log(`Server started to run on ${port}`));