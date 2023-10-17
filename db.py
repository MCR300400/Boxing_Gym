import mysql.connector
import datetime
from datetime import timedelta, datetime


#definizione del db
db = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    password = 'PASSWORD',
    database = 'DB'
)

#creo un corsore per la visita delle tabelle 
cursor = db.cursor()
#elimino le tabelle se sono gia esistenti
cursor.execute('DROP TABLE IF EXISTS utenti')
cursor.execute('DROP TABLE IF EXISTS lezioni')
cursor.execute('CREATE TABLE utenti (mail VARCHAR(255) PRIMARY KEY, password VARCHAR(255), ruolo VARCHAR(255))')
cursor.execute('CREATE TABLE lezioni (id INTEGER PRIMARY KEY AUTO_INCREMENT,data VARCHAR(255), allievo VARCHAR(255) , allenatore VARCHAR(255), orario VARCHAR(255))')
# Esegui query SQL qui...
sql = 'INSERT INTO utenti (mail, password, ruolo) VALUES (%s, %s, %s)'
val = [('Alessio','111','admin'),('Michele','222','admin'),('utente3@gmail.com','333','utente')]
cursor.executemany(sql,val)
sql = 'INSERT INTO lezioni (data, allievo, allenatore, orario) VALUES (%s, %s, %s,%s)'
val = [('2023-10-01','edoardo','Alessio','11:00'),
       ('2023-10-01','edoardo','Alessio','13:00'),
       ('2023-10-01','','Alessio','18:00'),
        ('2023-10-01','','Michele','13:00'),
       ('2023-10-01','edoardo','Michele','16:00'),
       ('2023-10-01','','Michele','18:00')]
cursor.executemany(sql,val)
db.commit()



#----------------------------------------------
#           STAMPA LA TEBELLA DESIGNATA
#----------------------------------------------
def seeTable(name:str):
    cursor = db.cursor()
    cursor.execute(f'SELECT * FROM {name}')
    row = cursor.fetchall()
    for x in row:
        print(x)
    cursor.close()


#----------------------------------------------
#           NUOVO UTENTE
#----------------------------------------------
def nuovoUtente(mail:str, password:str, ruolo = 'utente'):
    cursor = db.cursor()
    if not mail or not password:
        return False
    sql = 'INSERT INTO utenti (mail, password, ruolo) VALUES (%s, %s, %s)'
    cursor.execute(sql,(mail,password,ruolo))
    db.commit()
    cursor.close()
    return True




#---------------------------------------------------------
#           CONTROLLA L'ESISTENZA DI UN UTENTE
#---------------------------------------------------------
def controlloUtente(mail:str):
    cursor = db.cursor()
    cursor.execute('SELECT * FROM utenti WHERE mail = %s', (mail,))  
    if cursor.fetchall():
        cursor.close()  
        return True
    cursor.close()  
    return False


#---------------------------------------------------------
#           CONTROLLA SE E' UN ADMIN
#---------------------------------------------------------
def controlloAdmin(mail:str):
    cursor = db.cursor()
    cursor.execute('SELECT ruolo FROM utenti WHERE mail = %s', (mail,))
    forse = cursor.fetchall()[0][0]
    cursor.close()
    if forse == 'admin':
        return True
    return False





#---------------------------------------------------------
#           CONTROLLO PASSWORD
#---------------------------------------------------------
def controlloPassword(mail:str, password:str):
    cursor = db.cursor()
    cursor.execute('SELECT * FROM utenti WHERE mail = %s', (mail,)) 
    utente = cursor.fetchall()
    if utente and utente[0][1] == password:
        cursor.close()
        return True
    cursor.close()
    return False



#---------------------------------------------------------
#           CONTROLLO DATA
#---------------------------------------------------------
def controlloData(data):
    cursor = db.cursor()
    cursor.execute('SELECT * FROM lezioni WHERE data = %s AND allievo = %s', (data,'',)) 
    lezioni = cursor.fetchall()
    cursor.close()
    if lezioni:
        res = {}
        for x in lezioni:
            res[x[0]] = {'data' : x[1], 'allenatore' : x[3], 'ora' : x[4]}
        cursor.close()
        return res
    else:
        return "NESSUNA LEZIONE OGGI"
    
    

#---------------------------------------------------------
#            PRENOTA
#---------------------------------------------------------
def prenotaAllievo(allievo:str, allenatore:str, ora:str, data:str):
    cursor = db.cursor()
    cursor.execute('UPDATE lezioni SET allievo = %s WHERE data = %s AND allenatore = %s AND orario = %s ', (allievo,data,allenatore,ora,))
    seeTable('lezioni')
    db.commit()
    cursor.close()


#---------------------------------------------------------
#            CANCELLA LEZIONE
#---------------------------------------------------------
def cancella(allenatore:str, ora:str, data:str):
    cursor = db.cursor()
    cursor.execute('DELETE FROM lezioni WHERE data = %s AND allenatore = %s AND orario = %s', (data,allenatore,ora,))
    db.commit()
    seeTable('lezioni')
    cursor.close()


#---------------------------------------------------------
#            RICERCA LE LEZIONI NON ANCORA 
#                PRENOTATE DA NESSUNO
#---------------------------------------------------------

def lezioniLibere(allievo:str, allenatore:str):
    cursor = db.cursor()
    cursor.execute('SELECT * FROM lezioni WHERE allievo = %s AND allenatore = %s',(allievo,allenatore,))
    lezioni = cursor.fetchall()
    cursor.close()
    if lezioni:
        return lezioni
    else:
        return "NESSUNA LEZIONE LIBERA"


#---------------------------------------------------------
#           CANCELLA LA PRENOTAZIONE
#---------------------------------------------------------
def cancellaPrenotaAllievo(allievo:str, allenatore:str, ora:str, data:str):
    cursor = db.cursor()
    cursor.execute('UPDATE lezioni SET allievo = %s WHERE data = %s AND allenatore = %s AND orario = %s ', ('',data,allenatore,ora,))
    seeTable('lezioni')
    db.commit()
    cursor.close()




#---------------------------------------------------------
#           RICERCA TUTTE LE LEZIONI DI UN ALLIEVO
#---------------------------------------------------------
def tutteLezioniAllievo(nome:str):
    cursor = db.cursor()
    cursor.execute('SELECT * FROM lezioni WHERE allievo = %s ', (nome,))
    lezioni = cursor.fetchall()
    if lezioni:
        cursor.close()
        return lezioni
    else:
        cursor.close()
        return "NON HA ANCORA PRENOTATO NESSUNA LEZIONE"
    


#---------------------------------------------------------
#           RICERCA TUTTE LE LEZIONI DI UN ALLENATORE
#---------------------------------------------------------

def tutteLezioniAllenatore(nome:str):
    cursor = db.cursor()
    cursor.execute('SELECT * FROM lezioni WHERE allenatore = %s AND allievo != %s', (nome,'',))
    lezioni = cursor.fetchall()
    if lezioni:
        cursor.close()
        return lezioni
    else:
        cursor.close()
        return "NON HA NESSUNA LEZIONE PRENOTATA"
    


#---------------------------------------------------------
#           CREA UNA NUOVA LEZIONE
#---------------------------------------------------------
def creaLezione(allenatore:str, data:str, orario:str, allievo = ''):
    cursor = db.cursor()
    cursor.execute('INSERT INTO lezioni (data, allievo, allenatore, orario) VALUES (%s, %s, %s,%s)',(data,allievo,allenatore,orario,))
    seeTable('lezioni')
    return True
