'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt')

function pruebas(req, res) {
	res.status(200).send({
		message: 'Probando una accion del controlador usuario'
	});
}

function saveUser(req, res) {
	var user = new User();

	var params = req.body;

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	if(params.password) {
		bcrypt.hash(params.password,null,null,function(err, hash){
			user.password = hash
			if (user.name != null && user.surname != null && user.email != null) {
				//Guardar el usuario
				user.save((err, userStored) => {
					if (err) {
						res.status(500).send({message:'Error al guardar el usuario'});
					} else {
						if (!userStored) {
							res.status(400).send({message:'No se ha registrado el usuario'});
						} else {
							res.status(200).send({user: userStored});
						}
					}
				});

			} else {
				res.status(200).send({message:'Faltan datos del usuario'});		
			}
		});
	} else {
		res.status(500).send({message:'Introduce una contraseña'});
	}
}

function loginUser(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({ email : email.toLowerCase()},(err, user) => {
		if (err) {
			res.status(500).send({message:'Error en la peticion'});	
		} else {
			if (!user) {
				res.status(400).send({message:'El usuario no existe'});	
			} else {
				bcrypt.compare(password, user.password, function(err, check){
					if (check) {
						if (params.gethash) {
							console.log('Crear token')
							res.status(200).send({
								token : jwt.createToken(user)
							});
						} else {
							res.status(200).send({user});	
						}
					} else {
						res.status(400).send({message:'La contraseña es incorrecta'});	
					}
				});
			} 
		}
	});
}

function updateUser(req,res){
	var userId = req.params.id;
	var update = req.body;

	if(userId != req.user.sub) {
		return res.status(500).send({message:'No tienes permiso para actualizar este usuario'});
	}

	User.findByIdAndUpdate(userId,update,(err,userUpdate) => {
		if (err){
			res.status(500).send({message:'Error al actualizar el usuario'});
		} else {
			if (!userUpdate) {
				res.status(404).send({message:'No se pudo actualizar el usuario'});
			} else {
				res.status(200).send({user:userUpdate});
			}
		}
	});
}

function uploadImage(req,res) {
	var userId = req.params.id;
	var file_name = 'No Subido ...';
	if (req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		file_name = file_split[2];
		var ext_name = file_name.split('\.');
		var file_ext = ext_name[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			User.findByIdAndUpdate(userId,{image: file_name},(err, userUpdate) => {
				if (err){
					res.status(500).send({message:'Error al actualizar el usuario'});
				} else {
					if (!userUpdate) {
						res.status(404).send({message:'No se pudo actualizar el usuario'});
					} else {
						res.status(200).send({image: file_name, user:userUpdate});
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
	var path_file = './uploads/users/'+imageFile
	fs.exists(path_file,function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		} else {
			res.status(200).send({message:'No existe la imagen'});
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
}; 