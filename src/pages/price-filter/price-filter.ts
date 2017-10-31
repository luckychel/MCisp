import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NgForm} from '@angular/forms';

import { DbProvider } from '../../providers/db/db';
import { BunkProvider } from '../../providers/price/pickers/bunk/bunk';
import { BunkTovProvider } from '../../providers/price/pickers/bunktov/bunktov';

@Component({
  selector: 'page-price-filter',
  templateUrl: 'price-filter.html',
})
export class PriceFilterPage {
  molId: number;

  showBunks = false;
  showBunksTovs = false;

  items = [];

  filter = {
    BUNK_ID:"",
    BUNK: "",
    BUNKTOV_DEPT_ID: "",
    BUNKTOV_DEPT: ""
  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private db: DbProvider, 
    public bunkService: BunkProvider,
    public bunkTovService: BunkTovProvider,
  ) 
  {
    
  }

  async ionViewWillEnter() {
    this.molId = await this.db.getValue("molId");
  }

  popView(){
    this.navCtrl.pop();
  }

  getItems(ev, mn) {
    console.log(this.molId);

  
      
   }
 
   onSubmit(f: NgForm) {
    this.filter = f.value;
    console.log(this.filter);
    console.log(f.valid);  // false
  }

   onClear(ev, model) { 
     ev.stopPropagation();
   }
 
   clickItem(ev, model){
  
    this.showBunks = false;
    this.showBunksTovs = false;

    this.filter[model.name] = ev.id;
    this.filter[model.name.replace("_ID", "")] = ev.name;

/*      console.log("Модель:" + model.name)
     console.log(this.filter);
     console.log(ev); */
      
   }


}
