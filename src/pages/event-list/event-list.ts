import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DatabseProvider} from './../../providers/databse/databse';
/**
 * Generated class for the EventListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage {
  public legId;
  public legName;
  public legDescription;
  public events = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private databaseProvider: DatabseProvider) {
    this.legId = this.navParams.get('legId');
    this.legName = this.navParams.get('legName');
    this.legDescription = this.navParams.get('legDescription');
    console.log('The leg id: '+this.legId);
    console.log('The leg name: '+this.legName);
    console.log('The leg description: '+this.legDescription);
    this.databaseProvider.getDatabaseSate().subscribe(rdy =>{
      if(rdy){
        this.loadEventsData();
      }
    })
  }

  loadEventsData(){
    this.databaseProvider.getEventsForLeg(this.legId).then(data =>{
      this.events = data;
      console.log("Legs: "+this.events[0].name);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventListPage\n'+this.navParams.get('legId'));
  }

}
