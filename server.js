// Set up
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

// Configuration
mongoose.connect('mongodb://localhost/inventory_system');

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "*");
   res.header("Access-Control-Allow-Headers", "*");
   next();
});

// Models
var People = mongoose.model('People', { email:String, name:String, position:String, password:String } );
var Item = mongoose.model('Item', { name:String, quantity:Number, price:Number, userid:String } );

// Routes

//test connection
app.get('/api/test', function(req, res) {
    People.find(        
        function(err, ppl, ) { if(err) res.send(err); res.json(ppl); }
    );
});

//login
app.post('/api/login', function(req, res) {
    People.find(
        { email:req.body.email, password:req.body.password },
        function(err, ppl, ) { if(err) res.send(err); res.json(ppl); }
    );
});

//register new user
app.post('/api/register', function(req, res) {
    People.find(
        { email:req.body.email },
        function(err, ppl) {
            if (err) res.send(err);
            if(ppl==""){ 
                People.create(
                    { email:req.body.email, name:req.body.name, position:req.body.position, password:req.body.password } ,
                    function(err, result) { if(err) res.send(err); res.json("success"); }
                );
            }
            else { res.json("error. email already registered"); }        
        }
    );
})

//update profile
app.post('/api/profile', function(req, res) {
    People.updateOne( 
        { _id: req.body.userid } ,
        { $set:{email:req.body.email, name:req.body.name, position:req.body.position, password:req.body.password} } ,
        function(err, ppl) {
            People.find(
                { _id:req.body.userid },
                function(err, result) { if(err) res.send(err); res.json(result); }
            );
        }
    );
});

//get inventory
app.post('/api/getinventory', function(req, res) {
    Item.find(
        { userid:req.body.userid }, 
        function(err, itm) { if(err) res.send(err); res.json(itm); }
    );
});

//insert new item in inventory
app.post('/api/insert', function(req, res) {
    Item.create(
        { name:req.body.name, quantity:req.body.quantity, price:req.body.price, userid:req.body.userid } ,
        function(err, itm) { if(err) res.send(err); res.json("success"); }
    );
});

//update inventory
app.post('/api/update', function(req, res) {
    Item.updateOne(
        { _id: req.body.itemid } ,
        { $set:{name:req.body.name, quantity:req.body.quantity, price:req.body.price} } ,
        function(err, itm) { if(err) res.send(err); res.json("success"); }
    );
});

//delete inventory
app.delete('/api/delete/:itemid', function(req, res) {
    Item.remove( 
        { _id:req.params.itemid } , 
        function(err, itm) { if(err) res.send(err); res.json("success"); }
    );
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");