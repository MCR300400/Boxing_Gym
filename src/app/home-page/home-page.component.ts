import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent {
  mostraContenuto: boolean = false;
  mostraContenuto2: boolean = false;
  mostraContenuto1: boolean = false;

    mc() {
        this.mostraContenuto = !this.mostraContenuto;
    }

    mc1() {
        this.mostraContenuto1 = !this.mostraContenuto1;
    }

    mc2() {
        this.mostraContenuto2 = !this.mostraContenuto2;
    }
}
