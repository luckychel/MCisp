import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class SettingsServiceProvider {
    db: SQLite = null;

    constructor() {
      this.db = new SQLite();
    }

    openDatabase(){
      return this.db.openDatabase({
        name: 'MCisp.db',
        location: 'default'
    }).then(() => {

      let table = this.db.executeSql("CREATE TABLE IF NOT EXISTS CispSettings(id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT)", []);
      return Promise.all([table]);
      
    }).then(() => {

        return this.db.executeSql('SELECT * FROM CispSettings', []);
      }
    ).then((res) => {

        if(res.rows.length == 0) {
            this.db.executeSql("INSERT INTO CispSettings (key, value) VALUES (?, ?)", ['version', '1']);
            this.db.executeSql("INSERT INTO CispSettings (key, value) VALUES (?, ?)", ['auth', '0']);
            this.db.executeSql("INSERT INTO CispSettings (key, value) VALUES (?, ?)", ['email', '0']);
            this.db.executeSql("INSERT INTO CispSettings (key, value) VALUES (?, ?)", ['password', '0']);
            this.db.executeSql("INSERT INTO CispSettings (key, value) VALUES (?, ?)", ['mol_id', '0']);
            return Promise.all([]);
        }
      }
   );
}

  getVersion(){
    return this.db.executeSql('SELECT * FROM CispSettings WHERE key=?', ['version'])
        .then( response => {
          return response.rows.item(0).value;
        });
  }

  getAll(){
    return this.db.executeSql( 'SELECT * FROM CispSettings', [])
      .then(response => {
          let setts = {};
          for (let i = 0; i < response.rows.length; i++) {
            setts[response.rows.item(i).key] = response.rows.item(i).value;
          }
          return Promise.resolve(setts);
      })
  }

  deleteSettingsData(){
    let sql = 'DELETE FROM CispSettings';
    return this.db.executeSql(sql, []);
  }

  updateSettingsData(sett: any){
    let sql = 'UPDATE CispSettings SET value=? WHERE key=?';
    return this.db.executeSql(sql, [sett.value, sett.key]);
  }

  
}
