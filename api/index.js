'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

var databaseUri = 'mongodb://localhost:27017/curso-mean';

mongoose.Promise = global.Promise;
mongoose.connect(databaseUri, { useMongoClient: true })
        .then(() => {
            console.log('Connected to MongoDB at ', databaseUri);
            
            app.listen(port, function(){
            	console.log('Servidor del api escuchando con el puerto ', port);	
            });
        })
        .catch(err => debug('Database connection error: ${err.message}'));