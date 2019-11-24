# InventoryMgtSystem-API-Express

![alt](https://user-images.githubusercontent.com/57636419/69487125-bf405d00-0e8f-11ea-89dc-0b54e2e944c4.JPG)

<b>1. Node.js & npm installed</b>
  
<b>2. Create & go to project directory: C:/Projects Express/inventory_sytem</b>

<b>3. Create package.json</b>
  
     {
        "name": "inventory_system",
        "version": "0.1.0",
        "description": "A sample Node.js app using Express 4",
        "engines": { "node": "5.9.1" },
        "main": "server.js",
        "scripts": { "start": "node server.js" },
        "devDependencies": {
           "body-parser": "^1.15.2",
           "cors": "^2.8.0",
           "del": "2.2.0",
           "express": "^4.14.0",
           "http": "0.0.0",
           "method-override": "^2.3.6",
           "mongoose": "^4.10.8",
           "morgan": "^1.7.0",
           "superlogin": "^0.6.1"
        },
        "dependencies": {}
     }
     
<b>4. Create server.js</b>
  
     var express = require('express');
     var app = express(); 
     var mongoose = require('mongoose');  
     var morgan = require('morgan');  
     var bodyParser = require('body-parser');  
     var methodOverride = require('method-override'); 
     var cors = require('cors');

     mongoose.connect('mongodb://localhost/inventory_system');

     app.use(morgan('dev'));    
     app.use(bodyParser.urlencoded({'extended':'true'})); 
     app.use(bodyParser.json());   
     app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
     app.use(methodOverride());
     app.use(cors());

     app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();
     });

     var People = mongoose.model('People', { email:String, name:String, position:String, password:String } );
     var Item = mongoose.model('Item', { name:String, quantity:Number, price:Number, userid:String } );

     app.get('/api/test', function(req, res) {
        People.find( function(err, ppl, ) { if(err) res.send(err); res.json(ppl); } );
     });

     app.post('/api/login', function(req, res) {
        People.find(
           { email:req.body.email, password:req.body.password },
           function(err, ppl, ) { if(err) res.send(err); res.json(ppl); }
        );
     });

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

     app.post('/api/getinventory', function(req, res) {
        Item.find(
           { userid:req.body.userid }, 
           function(err, itm) { if(err) res.send(err); res.json(itm); }
        );
     });

     app.post('/api/insert', function(req, res) {
        Item.create(
           { name:req.body.name, quantity:req.body.quantity, price:req.body.price, userid:req.body.userid } ,
           function(err, itm) { if(err) res.send(err); res.json("success"); }
        );
     });

     app.post('/api/update', function(req, res) {
        Item.updateOne(
           { _id: req.body.itemid } ,
           { $set:{name:req.body.name, quantity:req.body.quantity, price:req.body.price} } ,
           function(err, itm) { if(err) res.send(err); res.json("success"); }
        );
     });

     app.delete('/api/delete/:itemid', function(req, res) {
         Item.remove( 
           { _id:req.params.itemid } , 
           function(err, itm) { if(err) res.send(err); res.json("success"); }
         );
     });

     app.listen(8080);
     console.log("App listening on port 8080");
     
<b>5. Open cmd</b>
  
     cd C:/Projects Express/inventory_sytem
     node server.js
     
<b>6. Test API in browser
  
     http://localhost:8080/api/test
