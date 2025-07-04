const express = require('express');
const pool = require('./database'); // require() will default to looking for the file in the `node_modules` folder
                                    // ./ means SAME DIRECTORY AS THE CURRENT FILE

const hbs = require('hbs');
const cors = require('cors');

const app = express();

// setup express to use hbs files
app.set('view engine', 'hbs');

// setup static content
// express.static is a function that enables express to use static files
// the parameter is the name of the folder that will store the static files
app.use(express.static('public'));

// enable express to use json for data communication
app.use(express.json());

// enable cross origin resources sharing for all domains
app.use(cors());

// enable express to process form
app.use(express.urlencoded({
    extended: true
}))

// Register routes
const recipeApi = require('./routes/api/recipes');
const categoriesApi = require('./routes/api/categories');
const cuisinesApi = require('./routes/api/cuisines');
const tagsApi = require('./routes/api/tags')

const recipeAdminRouter = require('./routes/www/recipes');

app.use('/api/recipes', recipeApi);
app.use('/api/categories', categoriesApi);
app.use('/api/cuisines', cuisinesApi);
app.use('/api/tags', tagsApi);

app.use('/admin/recipes', recipeAdminRouter);

app.get('/', function (req, res) {
    res.send("Please use /api to access the API endpoints");
})

app.get('/api/', function (req, res) {
    res.json({
        'message': 'API is ok'
    })
})







app.listen(3000, function () {
    console.log("Server has started");
})