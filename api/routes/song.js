'use stricts'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router(); //Metodos get, post ...
var md_auth = require('../middlewares/authenticated'); //get token

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' });

api.get('/song/getSong/:id',md_auth.ensureAuth, SongController.getSong);
api.post('/song/createSong',md_auth.ensureAuth, SongController.saveSong);
api.get('/song/listSongs/:album?',md_auth.ensureAuth, SongController.listSongs);
api.put('/song/updateSong/:id',md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/deleteSong/:id',md_auth.ensureAuth, SongController.deleteSong);

api.post('/song/upload-song/:id',[md_auth.ensureAuth, md_upload] ,SongController.uploadFileOfSong);
api.get('/song/get-song/:songFile',SongController.getSongFile);

module.exports = api;