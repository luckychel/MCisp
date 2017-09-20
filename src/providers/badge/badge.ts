import { Injectable } from '@angular/core';
import { Badge } from '@ionic-native/badge';

@Injectable()
export class BadgeProvider {

  constructor(public badge: Badge) {
    //console.log('Hello BadgeProvider Provider');
  }
  
  updateCnt(cnt){
    this.badge.set(cnt);
  }

}
