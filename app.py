import db
import datetime
from datetime import timedelta, datetime





from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if not db.controlloUtente(username):
        if db.nuovoUtente(username,password):
            return jsonify(message='Registration successful')
        else:
            return jsonify(message='mancano dei campi per la registrazione')
    return jsonify(message='Already registred')


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify(message = 'mancano dei campi per il login')
    db.seeTable('utenti')
    if db.controlloAdmin(username):
        if db.controlloPassword(username,password):
            return jsonify(message = 'Login Admin')
        else:
            return jsonify(message = 'Wrong password')
    if db.controlloUtente(username):
        if db.controlloPassword(username,password):
            return jsonify(message = 'Login')
        else:
            return jsonify(message = 'Wrong password')
    return jsonify(message='not Login')

@app.route('/controllo-disponibilita', methods=['POST'])
def controlloDisponibilita():
    stringa = (request.json.get('selectedDate').split(':'))[0][:10]
    data = (datetime.strptime(stringa, '%Y-%m-%d').date()) + timedelta(days=1)
    return jsonify(message = db.controlloData(data.strftime('%Y-%m-%d')))


@app.route('/prenota', methods=['POST'])
def prenota():
    allievo = request.json.get('allievo')
    allenatore = request.json.get('allenatore')
    ora = request.json.get('ora')
    data = request.json.get('data')
    db.prenotaAllievo(allievo,allenatore,ora,data)
    return jsonify(message=True)

@app.route('/no-prenotazione', methods=['POST'])
def noPrenotazione():
    allenatore = request.json.get('allenatore')
    return jsonify(message=db.lezioniLibere('',allenatore))


@app.route('/cancella-lezione', methods=['POST'])
def cancellaLezione():
    allenatore = request.json.get('allenatore')
    orario = request.json.get('orario')
    data = request.json.get('data')
    db.cancella(allenatore,orario,data)
    return jsonify(message=True)



@app.route('/cancella-prenotazione', methods=['POST'])
def cancellaPrenotazione():
    allievo = request.json.get('allievo')
    allenatore = request.json.get('allenatore')
    ora = request.json.get('ora')
    data = request.json.get('data')
    db.cancellaPrenotaAllievo(allievo,allenatore,ora,data)
    return jsonify(message=True)


@app.route('/tabellaLezioni', methods=['POST'])
def tabellaLezioni():
    nome = request.json.get('mail')
    return jsonify(message = db.tutteLezioniAllievo(nome))


@app.route('/tabellaAdmin', methods=['POST'])
def tabellaAdmin():
    nome = request.json.get('mail')
    return jsonify(message = db.tutteLezioniAllenatore(nome))

@app.route('/nuova-lezione', methods=['POST'])
def nuovaLezione():
    allenatore = request.json.get('allenatore')
    stringa = request.json.get('data')[:10]
    data = ((datetime.strptime(stringa, '%Y-%m-%d').date()) + timedelta(days=1)).strftime('%Y-%m-%d')
    orario = request.json.get('orario')
    return jsonify(message = db.creaLezione(allenatore,data,orario))


if __name__ == '__main__':
    app.run()

