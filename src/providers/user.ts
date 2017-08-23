import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';

@Injectable()
export class User {
  _user: any;

  constructor(public http: Http, public api: Api) {
  }

  login(accountInfo: any) {
    return this.api.post('auth', accountInfo)
      .map(res => {
        this._user = res.json();
        return res.json();
      });
  }

  logout() {
    this._user = null;
  }

  _loggedIn(resp) {
    this._user = resp.user;
  }

  registration(userInfo: any){
    return this.api.post('mols/registration', userInfo)
      .map(res => {
          return res.json();
        });
  }
}
