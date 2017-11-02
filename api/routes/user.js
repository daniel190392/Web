'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });


api.get('/probando-controlador', md_auth.ensureAuth ,UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/user/update/:id', md_auth.ensureAuth ,UserController.updateUser);
api.post('/user/upload-image/:id',[md_auth.ensureAuth, md_upload] ,UserController.uploadImage);
api.get('/user/get-image/:imageFile',UserController.getImageFile);


module.exports = api;