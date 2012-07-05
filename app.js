var express = require('express'),
    path = require("path"),
    mongoose = require('mongoose'),
    application_root = __dirname;

var app = express.createServer();

// Database
mongoose.connect('mongodb://localhost/test');

// Model
var Guitar = mongoose.model('Guitar', new mongoose.Schema({
    make: String,
    model: String,
    type: String,
    year: String
}));

app.configure(function(){
    app.use(express.bodyParser()); // This is to parse the request body correctly
//    app.use(express.methodOverride());
//    app.use(app.router);
    app.use(express.static(path.join(application_root, "public"))); // Use node to serve up static files.
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
app.get('/', function (request, response) {
    response.send('Hello, world!');
});

app.get('/guitarstore', function (request, response) {
    response.render('guitar', { title: "MongoDB Backed GuitarStore App" });
});

// Retrieve a list of guitars
app.get('/api/guitars', function (request, response) {
    return Guitar.find(function (err, guitars) {
        if(err) {
            return console.log(err);
        } else {
            return response.send(guitars);
        }
    });
});

// Create a single guitar
app.post('/api/guitars', function (request, response) {
    var guitar;
    console.log("POST: ");
    console.log(request.body);

    guitar = new Guitar({
        make: request.body.make,
        model: request.body.model,
        type: request.body.type,
        year: request.body.year
    });

    guitar.save(function (err) {
        if(err) {
            return console.log(err);
        } else {
            return console.log('created');
        }
    });

    return response.send(guitar);
});

// Read a single guitar by id
app.get('/api/guitars/:id', function (request, response) {
    return Guitar.findById(request.params.id, function (err, guitar) {
        if(err) {
            return console.log(err);
        } else {
            response.send(guitar);
        }
    });
});

app.listen(3000);
console.log("Server running at http://localhost:3000");