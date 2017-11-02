'use stricts'

var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router(); //Metodos get, post ...
var md_auth = require('../middlewares/authenticated'); //get token

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists' });

api.get('/artist/getArtist/:id',md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artist/getList/:page?',md_auth.ensureAuth, ArtistController.listOfArtist);
api.post('/artist/create',md_auth.ensureAuth, ArtistController.createArtist);
api.put('/artist/update/:id',md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/delete/:id',md_auth.ensureAuth, ArtistController.deleteArtist);

api.post('/artist/upload-image/:id',[md_auth.ensureAuth, md_upload] ,ArtistController.uploadImageOfArtist);
api.get('/artist/get-image/:imageFile',ArtistController.getImageFile);

module.exports = api;
