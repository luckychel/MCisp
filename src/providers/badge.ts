import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Badge } from '@ionic-native/badge';
import { Api } from './api';
import { Settings } from '../providers/settings';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';

@Injectable()
export class BadgeProvider {

  constructor(public http: Http, public api: Api, public settings: Settings, public badge: Badge) {
  }
  
  update() {
    return this.settings.getValue("mol_id")
        .then((mol_id) => {
          this.api.get('messages/unread/' + mol_id)
            .subscribe(res => {
                this.updateCnt(res.json())
            }, err => {
              console.error('ERROR', err);
            });
        });
  }
  
  updateCnt(cnt){
    this.badge.set(cnt);
  }

}
