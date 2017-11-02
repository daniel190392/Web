'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
	
	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec((err, albumStored) => {
			if(err) {
				res.status(500).send({message:'Error en la peticion'});	
			} else {
				if (!albumStored) {
					res.status(404).send({message:'El album no existe'});	
				} else {
					res.status(200).send({album:albumStored});
				}
			}
		});
}

function getListAlbumWithPaginate(req, res) {
	
	var artistId = req.params.artist;

	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}
	var itemsPerPage = 3;

	if (!req.params.artist){
		//Sacar todos los albums de la BD
		var total_Albums = Album.count({});
		var find = Album.find({}).sort('title').paginate(page,itemsPerPage);
	} else {
		var artistId = req.params.artist;
		var total_Albums = Album.count({artist: artistId});
		var find = Album.find({artist: artistId}).sort('year').paginate(page,itemsPerPage);
	}

	find.populate({path :'artist'}).exec((err,listAlbums) => {
		if (err) {
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if (!listAlbums) {
				res.status(404).send({message: 'No hay albums'});
			} else {
				total_Albums.exec((err,count) => {
					res.status(200).send({ albums : listAlbums , total_items :  count});
				});
			}
		}
	});
}

function getListAlbum(req, res) {
	var artistId = req.params.artist;

	if (!req.params.artist){
		//Sacar todos los albums de la BD
		var total_Albums = Album.count({});
		var find = Album.find({}).sort('title');
	} else {
		var artistId = req.params.artist;
		var total_Albums = Album.count({artist: artistId});
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path :'artist'}).exec((err,listAlbums) => {
		if (err) {
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if (!listAlbums) {
				res.status(404).send({message: 'No hay albums'});
			} else {
				res.status(200).send({ albums : listAlbums});
			}
		}
	});
}

function saveAlbum(req,res) {
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year= params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({message:'Error en la peticion'});	
		} else {
			if (!albumStored) {
					res.status(404).send({message:'El album no se registro'});	
				} else {
					res.status(200).send({album:albumStored});
				}
		}
	});
}

function updateAlbum(req, res) {
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err,albumUpdated) => {
		if (err){
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if (!albumUpdated){
				res.status(404).send({message: 'No existe el album'});
			} else {
				res.status(200).send({artist: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId,(err,albumRemoved) => {
		if (err){
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if (!albumRemoved){
				res.status(404).send({message: 'El album no ha sido eliminado'});
			} else {
				Song.find({album:albumRemoved._id}).remove((err,songRemoved) => {
					if (err){
						res.status(500).send({message: 'Error en la peticion'});
					} else {
						if (!songRemoved){
							res.status(404).send({message: 'No se pudo eliminar las canciones'});
						} else {
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}

function uploadImageOfAlbum(req,res) {
	var albumId = req.params.id;
	var file_name = 'no subido';

	console.log(req.files);
	if (req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		console.log(file_split);
		file_name = file_split[2];
		console.log(file_name);
		var ext_name = file_name.split('\.');
		var file_ext = ext_name[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			Album.findByIdAndUpdate(albumId,{image: file_name},(err, albumUpdate) => {
				if (err){
					res.status(500).send({message:'Error al actualizar el album'});
				} else {
					if (!albumUpdate) {
						res.status(404).send({message:'No se pudo actualizar el album'});
					} else {
						res.status(200).send({album:albumUpdate});
					}
				}
			});
		} else {
			res.status(401).send({message:'Extension de la imagen no valida'});
		}
	} else {
		res.status(401).send({message:'No ha subido ninguna imagen'});
	}
}

function getImageFile(req,res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/'+imageFile
	fs.exists(path_file,function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		} else {
			res.status(200).send({message:'No existe la imagen'});
		}
	});
}

module.exports = {
	getAlbum,
	saveAlbum,
	getListAlbum,
	getListAlbumWithPaginate,
	updateAlbum,
	deleteAlbum,
	uploadImageOfAlbum,
	getImageFile
};