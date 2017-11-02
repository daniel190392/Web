import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'Angular';
  public user : User;
  public userRegister : User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;

  constructor(private _userService:UserService){
  	this.user = new User('','','','','','ROLE_USER','');
    this.userRegister = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit() {
    this._userService.signup(this.user).subscribe(
      response  => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity || !this.identity._id){
          alert("El usuario no está correctamente identificado");
        } else {
           //  Crear elemento en localstore para tener usuario en sesion
           localStorage.setItem('identity', JSON.stringify(identity));

           //Conseguir el token para enviar en el http
           this._userService.signup(this.user, 'true').subscribe(
            response  => {
              let token = response.token;
              this.token = token;
              this.user = new User('','','','','','ROLE_USER','');
              if (this.token.length <= 0){
                alert("El usuario no está correctamente identificado");
              } else {
                localStorage.setItem('token', token);
              }
            },
            error => {
              var errorMessage = <any>error;
              if(errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message
                console.log(this.errorMessage);
              }
            }
          );


        }
      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message
          console.log(this.errorMessage);
        }
      }
    );
  }

  public onSubmitRegister(){
    this._userService.register(this.userRegister).subscribe(
      response  => { 
        let newUser = response.user; 
        this.userRegister = newUser;
        if (!newUser || !newUser._id){
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.userRegister.email;
          this.userRegister = new User('','','','','','ROLE_USER','');
         }
      },
          error => {
           var errorMessage = <any>error;
              if(errorMessage != null) {
                var body = JSON.parse(error._body);
                this.alertRegister = body.message
                console.log(this.alertRegister);
              }
           }

      );
  }

  public logout(){
    // localStorage.removeItem('identity');
    // localStorage.removeItem('token');
    // this.user = this._userService.logout(this.user);
    localStorage.clear();
    this.token = null;
    this.identity = null;
  }
}
