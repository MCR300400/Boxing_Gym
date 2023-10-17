import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.css']
})
export class PrenotazioniComponent {
  righe: tabella[] = [];
  mail:string = '';
  password:string = '';
  displayedColumns: string[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  cancellaPrenotazione(riga:any, indice:number){
    this.http.post('http://127.0.0.1:5000/cancella-prenotazione',{ allievo: this.mail, allenatore: riga.allenatore, ora: riga.orario, data: riga.data, stato: true})
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
    this.http.post('http://127.0.0.1:5000/tabellaLezioni',{mail:this.mail})
      .subscribe(
        response => {
          const testo = JSON.stringify(response);
          var jsonObject = JSON.parse(testo);
          const keys = Object.keys(jsonObject);
          const k =  Object.keys(jsonObject.message);
          if (jsonObject.message != 'NON HA ANCORA PRENOTATO NESSUNA LEZIONE'){
          for (const element of k) {
            this.righe.push({data: jsonObject.message[element][1],
                            allenatore: jsonObject.message[element][3],
                            orario: jsonObject.message[element][4]})
          }
          this.displayedColumns = ['data', 'allenatore', 'ora', 'cancella']
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
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mail = params['mail'];
      this.password = params['password'];
      this.creoTabella()
      
      // Esegui le operazioni desiderate con la mail e la password
      // ...
    });
  }



  
}


export interface tabella {
  data: string;
  allenatore: string;
  orario: string;
}

