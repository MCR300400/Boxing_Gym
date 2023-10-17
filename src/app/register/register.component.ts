import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  registrationSuccess: boolean = false;
  registrationError: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  registerUser() {
    this.http.post('http://127.0.0.1:5000/register', { username: this.username, password: this.password })
      .subscribe(
        response => {
          const testo = JSON.stringify(response);
          if (testo == '{"message":"Already registred"}'){
            this.router.navigate(['/login']); 
          } else {
            if (testo == '{"message":"Registration successful"}'){
              this.router.navigate(['/lezioni-utenti',this.username,this.password]); 
            }
          }
          this.registrationSuccess = true;
          this.registrationError = false;

        },
        error => {
          console.log(error)
          this.registrationSuccess = false;
          this.registrationError = true;
        }
      );
  }

  

}
