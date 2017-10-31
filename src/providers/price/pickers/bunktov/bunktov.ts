import { Injectable } from '@angular/core';
import { ApiProvider } from '../../../api/api';
import { IonPickerService} from '../../../../component/ion-picker/ion-picker-service';

@Injectable()
export class BunkTovProvider implements IonPickerService  {
  labelAttribute = "name";
 
  items= [];
  constructor(public api: ApiProvider) {
    
  }

  getResults(keyword:string){

    this.items = [
      {
        id: 4,
        name: "Рыба1"
      },
      {
        id: 5,
        name: "Кошка1"
      },
      {
        id: 6,
        name: "Собака1"
      }
    ];

    return this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
    }).map(function(el) {
        return el;
    }).slice(0,20); 
    
  }
}
