'use stricts'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router(); //Metodos get, post ...
var md_auth = require('../middlewares/authenticated'); //get token

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums' });

api.get('/album/getAlbum/:id',md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album/saveAlbum',md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/album/getListOfAlbum/:artist?',md_auth.ensureAuth, AlbumController.getListAlbum);
api.put('/album/updateAlbum/:id',md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/deleteAlbum/:id',md_auth.ensureAuth, AlbumController.deleteAlbum);

api.post('/album/upload-image/:id',[md_auth.ensureAuth, md_upload] ,AlbumController.uploadImageOfAlbum);
api.get('/album/get-image/:imageFile',AlbumController.getImageFile);


module.exports = api;