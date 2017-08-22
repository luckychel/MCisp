import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Api } from './api';
import { Settings } from '../providers/settings';


@Injectable()
export class MessagesProvider {

  constructor(public http: Http, private api: Api, private settings: Settings) {
   
  }

  getMessages(){
    return this.settings.getValue("mol_id")
      .then((mol_id) => {
          return this.api.get("messages/" + mol_id)
            .map(res => {
              return res.json()
            });
      });
  }

  getUnreadCount(){
    return this.settings.getValue("mol_id")
      .then((mol_id) => {
         return this.api.get('messages/unread/' + mol_id)
          .map(res => {
            return res.json()
          });
      });
  }


}
