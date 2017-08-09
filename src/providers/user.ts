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

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('auth', accountInfo).share();

    seq.map(res => res.json())
      .subscribe(res => {
        this._user = res;
      }, err => {
        console.error('ERROR', err);
      });
    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }

  registration(userInfo: any){
    let seq = this.api.post('mols/registration', userInfo).share();

    seq.map(res => res.json())
      .subscribe(res => {
        return res;
      });
    return seq;
  }
}
