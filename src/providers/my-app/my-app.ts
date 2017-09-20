import { Injectable } from '@angular/core';

@Injectable()
export class MyAppProvider {

  isRegistrationId: boolean = false;

  constructor() {
  }

  setRegistrationId(val) {
    this.isRegistrationId = val;
  }

  getRegistrationId() {
    return this.isRegistrationId;
  }   
}
