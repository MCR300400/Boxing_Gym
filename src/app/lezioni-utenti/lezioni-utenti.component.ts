import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-lezioni-utenti',
  templateUrl: './lezioni-utenti.component.html',
  styleUrls: ['./lezioni-utenti.component.css']
})



export class LezioniUtentiComponent implements OnInit {
  buttonStates: boolean[] = [];
  prenotate: tabella[] = [];
  displayedColumns: string[] = [];
  righe: tabella[] = [];
  mail: string = '';
  password: string = '';
  selectedDate: moment.Moment | undefined;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.selectedDate = this.getCurrentDate();
    this.route.params.subscribe(params => {
      this.mail = params['mail'];
      this.password = params['password'];
      // Esegui le operazioni desiderate con la mail e la password
      // ...
    });
  }

  getCurrentDate(): moment.Moment {
    return moment().local();
  }


  onclicks(riga: any, indice: number){
    if (!this.buttonStates[indice]){
      this.prenota(riga);
    } else {
      this.cancellaPrenotazione(riga);
    }
    this.buttonStates[indice] = !this.buttonStates[indice];

  }
  cancellaPrenotazione(riga: any){
    this.http.post('http://127.0.0.1:5000/cancella-prenotazione', { allievo: this.mail, allenatore: riga.allenatore, ora: riga.ora, data: riga.data})
      .subscribe(
        response => {
          console.log(response)
        },
        error => {
          console.log(error)
        });


  }


  prenota(riga: any){
    this.http.post('http://127.0.0.1:5000/prenota', { allievo: this.mail, allenatore: riga.allenatore, ora: riga.ora, data: riga.data})
      .subscribe(
        response => {
          console.log(response)
        },
        error => {
          console.log(error)
        });


  }
  

  ricercaDisponibilita(){
    this.http.post('http://127.0.0.1:5000/controllo-disponibilita', { selectedDate: this.selectedDate })
    .subscribe(
      response => {
        const testo = JSON.stringify(response);
        if (testo != '{"message":"NESSUNA LEZIONE OGGI"}'){
          var jsonObject = JSON.parse(testo);
        const keys = Object.keys(jsonObject);
        const k =  Object.keys(jsonObject.message);
        for (const element of k) {
          this.righe.push(jsonObject.message[element])
        }
        this.displayedColumns = ['data', 'allenatore', 'ora', 'prenota']
        // Seleziona la tabella
        var table = document.getElementById('myTable');
        if (table != null){
        // Controlla se la tabella ha almeno una riga
        if (this.righe.length > 0) {
          this.buttonStates = new Array(this.righe.length).fill(false);
          // Rimuovi la classe CSS per renderla visibile
          table.classList.remove('hidden');
        } else {
          // Aggiungi la classe CSS per nasconderla
          table.classList.add('hidden');
        }
      }
          
        }
      },
      error => {
        console.log(error)
      });
  }
}

export interface tabella {
  data: string;
  allenatore: string;
  orario: string;
}
