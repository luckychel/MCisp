import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';
import { DbProvider } from '../db/db';
import { BadgeProvider } from '../badge/badge';

@Injectable()
export class MessagesProvider {

  constructor(private api: ApiProvider, private db: DbProvider, private badgeProvider: BadgeProvider ) {
    //console.log('Hello MessagesProvider Provider');
  }
  
  getMessage(){}

  getMessages(){
    return this.db.getValue("molId")
      .then((molId) => {
          return this.api.get("messages/" + molId)
          .then((res) => {
              //console.log("Сообщения: " + JSON.stringify(res))
              return res
            });
      });
  }

  async getUnreadCount(isBadgeUpdate = false){
    let cnt = await this.db.getValue("molId")
    .then((molId) => {
       return this.api.get('messages/unread/' + molId)
        .then((res) => {
          let unread = parseInt(res);
          if (isBadgeUpdate)
            this.badgeProvider.updateCnt(unread);
          return unread;
        });
    });
    return cnt;
  }

  setRead(model){
    return this.api.post("messages/setread", model)
  }

  setUnread(model){
    return this.api.post("messages/setunread", model)
  }

  setDelete(model){
    return this.api.post("messages/setdelete", model)
  }
}
