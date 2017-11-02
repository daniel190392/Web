'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function createArtist(req, res) {
	var params = req.body;
	console.log(params.description);
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	if (artist.name) {
		artist.save((err, artistStored) => {
			if (err){
				res.status(500).send({message:'Ocurrio un error al guardar el artista'});
			} else {
				if (!artistStored) {
					res.status(404).send({message:'El artista no se ha guardado'});
				} else {
					res.status(200).send({artist: artistStored});
				}
			}
		});
	} else {
		res.status(500).send({message:'Introduce un nombre al artista'});
	}
}

function getArtist(req, res) {
	
	var artistId = req.params.id;
	console.log(artistId);

	Artist.findById(artistId ,(err, artistStored) => {
			if(err) {
				res.status(500).send({message:'Error en la peticion'});	
			} else {
				if (!artistStored) {
					res.status(404).send({message:'El artista no existe'});	
				} else {
					res.status(404).send({artist:artistStored});
				}
			}
		});
}

function listOfArtist(req, res) {
	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page,itemsPerPage,function(err,artists, total) {
		if (err) {
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if (!artists) {
				res.status(404).send({message: 'No hay artistas'});
			} else {
				res.status(200).send({
					total_items:total,
					artists : artists
				});
			}
		}
	});
}

function updateArtist(req, res) {
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err,artistUpdated) => {
		if (err){
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if (!artistUpdated){
				res.status(404).send({message: 'No existe el artista'});
			} else {
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

function deleteArtist(req,res) {
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err,artistRemoved) => {
		if (err){
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if (!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			} else {
				Album.find({artist:artistRemoved._id}).remove((err,albumRemoved) => {
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
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImageOfArtist(req,res) {
	var artistId = req.params.id;
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
			Artist.findByIdAndUpdate(artistId,{image: file_name},(err, artistUpdate) => {
				if (err){
					res.status(500).send({message:'Error al actualizar el usuario'});
				} else {
					if (!artistUpdate) {
						res.status(404).send({message:'No se pudo actualizar el usuario'});
					} else {
						res.status(200).send({artist:artistUpdate});
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
	var path_file = './uploads/artists/'+imageFile
	fs.exists(path_file,function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		} else {
			res.status(200).send({message:'No existe la imagen'});
		}
	});
}

module.exports = {
	getArtist,
	createArtist,
	listOfArtist,
	updateArtist,
	deleteArtist,
	uploadImageOfArtist,
	getImageFile
};