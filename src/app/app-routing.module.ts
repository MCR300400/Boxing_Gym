import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LezioniUtentiComponent } from './lezioni-utenti/lezioni-utenti.component';
import { LoginComponent } from './login/login.component';
import { PrenotazioniComponent } from './prenotazioni/prenotazioni.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path:'',component: HomePageComponent },
  { path:'login',component: LoginComponent },
  { path:'register',component: RegisterComponent },
  { path: 'lezioni-utenti/:mail/:password', component: LezioniUtentiComponent },
  { path: 'prenotazioni/:mail/:password', component: PrenotazioniComponent },
  { path: 'admin/:mail/:password', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
