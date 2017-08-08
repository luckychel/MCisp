import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagePage } from '../message/message';
import { Item } from '../../models/item';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  items: Item[] = [];
  notification: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

   /*  debugger
    this.items = [
      new Item("Burt Bear", "assets/img/speakers/bear.jpg", "Burt is a Bear."),
      new Item("Charlie Cheetah", "assets/img/speakers/cheetah.jpg", "Charlie is a Cheetah."),
      new Item("Donald Duck", "assets/img/speakers/duck.jpg", "Donald is a Duck."),
      new Item("Eva Eagle", "assets/img/speakers/eagle.jpg", "Eva is an Eagle."),
      new Item("Ellie Elephant", "assets/img/speakers/elephant.jpg", "Ellie is an Elephant."),
      new Item("Molly Mouse", "assets/img/speakers/mouse.jpg", "Molly is a Mouse."),
      new Item("Paul Puppy", "assets/img/speakers/puppy.jpg", "Paul is a Puppy.")
    ];

    for (let item of this.items) {
      this.items.push(item);
    }
 */
  }

  openItem(item) {
    this.navCtrl.push(MessagePage, {
      item: item
    });
  }

}

