import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginSuccess: boolean = false;
  loginError: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  async loginUser() {
    this.http.post('http://127.0.0.1:5000/login', { username: this.username, password: this.password})
      .subscribe(
        data => {
          const testo = JSON.stringify(data);
          if (testo == '{"message":"Login Admin"}') {
            this.router.navigate(['/admin',this.username,this.password]);
          }
          if (testo == '{"message":"Login"}') {
            this.router.navigate(['/lezioni-utenti',this.username,this.password]); 
          } else {
            if (testo == '{"message":"not Login"}'){
              alert("NON HA ANCORA UN SUO ACCOUNT");
            } else {
              if (testo == '{"message":"Wrong password"}') {
                alert("CREDENZIALI ERRATE");
              }
            }
          } 
          this.loginSuccess = true;
          this.loginError = false;
        },
        error => {
          console.log(error)
          this.loginSuccess = false;
          this.loginError = true;
        }
      );
  }
}
