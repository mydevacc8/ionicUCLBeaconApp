import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';


/**
 * Generated class for the MapTabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-map-tabs',
  templateUrl: 'map-tabs.html'
})
export class MapTabsPage {
  mapRoot = 'MapPage';
  overviewRoot = 'OverviewPage';
  public legs = [];
  public tourId;
  public test;


  constructor(public events: Events, public navCtrl: NavController,public navParams: NavParams) {

    this.tourId = this.navParams.get('tourId');
    this.events.subscribe('legs:loaded', (data) =>{
      console.log(data);
      this.test = data;
    });
  }

}
