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

     this.items = [];
     let val = ev.target.value;
 
     // if the value is an empty string don't filter the items
     if (val && val.trim() != '') {

     // debugger
      if (mn.name == "BUNK_ID")
      {
        this.items = this.bunkService.getResults(val)

        if (this.items.length > 0)
        {
          this.showBunks = true;
        }
        else
        {
          this.showBunks = false;
        }
      }
      else if (mn.name == "BUNKTOV_DEPT_ID")
      {
        this.items = [
          {
            id: 1,
            name: "Рыба1"
          },
          {
            id: 2,
            name: "Кошка1"
          },
          {
            id: 3,
            name: "Собака1"
          }
        ]

        this.items = this.items.filter((item) => {
          return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }).map(function(el) {
            return el;
        }).slice(0,20); 


        if (this.items.length > 0)
        {
          this.showBunksTovs = true;
        }
        else
        {
          this.showBunksTovs = false;
        }
      }
     }
     else
     {
       this.showBunks = false;
       this.showBunksTovs = false;
     }
   }
 
   onSubmit(f: NgForm) {
    this.filter = f.value;
    console.log(this.filter);
    console.log(f.valid);  // false
  }

   onClear(ev, model) { 

/*     console.log("Модель:" + model.name)
    this.filter[model.name] = "";
    console.log(this.filter);
 */
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
