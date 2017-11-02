import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component ({

	selector: 'user-edit',
	templateUrl : '../views/user-edit.html',
	providers : [UserService]
})export class UserEditComponent implements OnInit {
	
	public titulo : string;
	public user : User;
	public identity;
	public token;
	public alertMessage;

	ngOnInit(){
		console.log('user edit cargado');
	}

	constructor(private _userService : UserService) {
		this.titulo = 'Actualizar mis datos';

		//local storage
		this.identity = this._userService.getIdentity();
    	this.token = this._userService.getToken();
    	this.user = this.identity
	}

	onSubmit(){
		console.log(this.user);
		this._userService.updateUser(this.user).subscribe(
			response => {
				if (!response.user){
					this.alertMessage = 'El usuario no se ha actualizado';
				} else {
					// this.user = response.user;
					localStorage.setItem('identity',JSON.stringify(this.user));
					document.getElementById("identity_name").innerHTML = this.user.name;
					this.alertMessage = 'El usuario se ha actualizado correctamente';
				}
			}, 
			error => {
			 var errorMessage = <any>error;
              if(errorMessage != null) {
                var body = JSON.parse(error._body);
                this.alertMessage = body.message
                console.log(this.alertMessage);
              }
			}
		)
	}
}
