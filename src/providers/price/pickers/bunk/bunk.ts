import { Injectable } from '@angular/core';
import { ApiProvider } from '../../../api/api';
import { IonPickerService} from '../../../../component/ion-picker/ion-picker-service';

@Injectable()
export class BunkProvider implements IonPickerService  {
  labelAttribute = "name";
  items= [];
  constructor(public api: ApiProvider) {
    
  }

  getResults(keyword:string){
   

      return this.api.get("messages/" + molId)
      .then((res) => {
          return res
        });

    return this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
    }).map(function(el) {
        return el;
    }).slice(0,20); 
    
  }
}
