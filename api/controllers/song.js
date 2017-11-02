'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res) {
	var songId = req.params.id;

	Song.findById(songId).populate({path : 'album'}).exec((err,song) => {
		if (err){
			res.status(500).send({message:'Error en la peticion'});
		} else {
			if (!song){
				res.status(404).send({message:'La cancion no existe'});
			} else {
				res.status(200).send({song:song});
			}
		}
	});
}

function saveSong(req,res) {
	var song = new Song();

	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err,songStored) => {
		if (err) {
			res.status(500).send({message:'Error en la peticion'});	
		} else {
			if (!songStored) {
				res.status(404).send({message:'La cancion no se registro'});	
			} else {
				res.status(200).send({song:songStored});
			}
		}
	});
}

function listSongs(req,res){

	var albumId = req.params.album;

	if (!albumId) {
		var find = Song.find({}).sort('number');
	} else {
		var find = Song.find({album :albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate : {
			path: 'artist',
			model : 'Artist'
			}
		}).exec((err,songStored) => {
			if (err) {
				res.status(500).send({message:'Error en la peticion'});	
			} else {
				if (!songStored) {
					res.status(404).send({message:'No existen canciones'});	
				} else {
					res.status(200).send({song:songStored});
				}
			}
	});
}

function updateSong(req,res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId,update,(err,songUpdated)=> {
		if (err) {
				res.status(500).send({message:'Error en la peticion'});	
			} else {
				if (!songUpdated) {
					res.status(404).send({message:'No se pudo actualizar la cancion'});	
				} else {
					res.status(200).send({song:songUpdated});
				}
			}
	});
}

function deleteSong(req,res) {
	var songId = req.params.id;
	Song.findByIdAndRemove(songId,(err,songRemoved) => {
		if (err){
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if (!songRemoved){
				res.status(404).send({message: 'La cancion no ha sido eliminado'});
			} else {
				res.status(200).send({song: songRemoved});
			}
		}
	});
}

function uploadFileOfSong(req,res) {
	var songId = req.params.id;
	var file_name = 'no subido';

	console.log(req.files);
	if (req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('\/');
		file_name = file_split[2];
		console.log(file_name);
		var ext_name = file_name.split('\.');
		var file_ext = ext_name[1];

		if (file_ext == 'mp3' || file_ext == 'ogg') {
			Song.findByIdAndUpdate(songId,{file: file_name},(err, songUpdate) => {
				if (err){
					res.status(500).send({message:'Error al actualizar la cancion'});
				} else {
					if (!songUpdate) {
						res.status(404).send({message:'No se pudo actualizar la cancion'});
					} else {
						res.status(200).send({song:songUpdate});
					}
				}
			});
		} else {
			res.status(401).send({message:'Extension de la cancion no valida'});
		}
	} else {
		res.status(401).send({message:'No ha subido ninguna cancion'});
	}
}

function getSongFile(req,res){
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile
	fs.exists(path_file,function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		} else {
			res.status(200).send({message:'No existe la cancion'});
		}
	});
}


module.exports = {
	getSong,
	saveSong,
	listSongs,
	updateSong,
	deleteSong,
	uploadFileOfSong,
	getSongFile
};