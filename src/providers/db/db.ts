import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class DbProvider {

  constructor(private storage: Storage) {
    //console.log('Hello DbProvider Provider');
  }

  async setValue(key: string, val: any){
    
    return await this.storage.set(key, val)
      .then(()=> {
        //console.log("set " + key+ " = " + val); 
        return true;
      })
      .catch((err)=>{
        return false;
      });
  }

  async getValue(key: string){
    let v = await this.storage.get(key);
    if (v == null)
    {
      this.setValue(key, "");
      v = "";
    }
    return v;
  }

}
