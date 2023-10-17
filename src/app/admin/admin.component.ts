import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  righe:tabella[] = [];
  noPrenotate: tabella[] = [];
  mail:string = '';
  password:string = '';
  displayedColumns: string[] = [];
  displayedColumns2: string[] = [];
  selectedDate: moment.Moment | undefined;
  orario: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
       this.mail = params['mail'];
       this.password = params['password'];
       this.creoTabella()
       this.ricercaLezioniNoPrenotazione()

    });
  }


  ricercaLezioniNoPrenotazione(){
    this.http.post('http://127.0.0.1:5000/no-prenotazione',{allenatore: this.mail, data: this.selectedDate, orario: this.orario})
      .subscribe(
        response => {
          const testo = JSON.stringify(response);
          var jsonObject = JSON.parse(testo);
          const keys = Object.keys(jsonObject);
          const k =  Object.keys(jsonObject.message);
          if (jsonObject.message != "NESSUNA LEZIONE LIBERA"){
          for (const element of k) {
            this.noPrenotate.push({data: jsonObject.message[element][1],
                            allievo: jsonObject.message[element][2],
                            orario: jsonObject.message[element][4]})
          }
          this.displayedColumns2 = ['data', 'ora', 'cancella']
          // Seleziona la tabella
          var table = document.getElementById('lezioniNoPrenotate');
          if (table != null){
          // Controlla se la tabella ha almeno una riga
          if (this.noPrenotate.length > 0) {
            // Rimuovi la classe CSS per renderla visibile
            table.classList.remove('hidden');
          } else {
            // Aggiungi la classe CSS per nasconderla
            table.classList.add('hidden');
          }
        }
          } else {
            var table = document.getElementById('lezioniNoPrenotate');
            if (table != null){
              table.classList.add('hidden');
            }
          }
          
        },
        error => {
          console.log(error)

        });

  }

  cancellaLezione(noPrenotate:any, indice:number){
    this.http.post('http://127.0.0.1:5000/cancella-lezione',{allenatore: this.mail,
                                                            data: noPrenotate.data,
                                                            orario: noPrenotate.orario})
      .subscribe(
        response => {
          window.location.reload();
          
        },
        error => {
          console.log(error)

        });

  }


  nuovaLezione(){
    if (this.orario != '' && this.selectedDate != null){
      this.http.post('http://127.0.0.1:5000/nuova-lezione',{allenatore: this.mail, data: this.selectedDate, orario: this.orario})
      .subscribe(
        response => {
          window.location.reload();
        },
        error => {
          console.log(error)

        });
    }
  }


  cancellaPrenotazione(riga:any, indice:number){
    this.http.post('http://127.0.0.1:5000/cancella-prenotazione',{ allievo: riga.allievo, allenatore: this.mail, ora: riga.orario, data: riga.data, stato: true})
      .subscribe(
        response => {
          console.log(response)
          
        },
        error => {
          console.log(error)

        });
        window.location.reload();
  }



  creoTabella(){
    this.http.post('http://127.0.0.1:5000/tabellaAdmin',{mail:this.mail})
      .subscribe(
        response => {
          const testo = JSON.stringify(response);
          var jsonObject = JSON.parse(testo);
          const keys = Object.keys(jsonObject);
          const k =  Object.keys(jsonObject.message);
          if (jsonObject.message != "NON HA NESSUNA LEZIONE PRENOTATA"){
          for (const element of k) {
            this.righe.push({data: jsonObject.message[element][1],
                            allievo: jsonObject.message[element][2],
                            orario: jsonObject.message[element][4]})
          }
          this.displayedColumns = ['data', 'allievo', 'ora', 'cancella']
          // Seleziona la tabella
          var table = document.getElementById('myTable');
          if (table != null){
          // Controlla se la tabella ha almeno una riga
          if (this.righe.length > 0) {
            // Rimuovi la classe CSS per renderla visibile
            table.classList.remove('hidden');
          } else {
            // Aggiungi la classe CSS per nasconderla
            table.classList.add('hidden');
          }
        }
          } else {
            var table = document.getElementById('myTable');
            var noLezioni = document.getElementById('nolezioni');
            if (table != null && noLezioni != null){
              table.classList.add('hidden');
              noLezioni.classList.remove('hidden');
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
  allievo: string;
  orario: string;
}
