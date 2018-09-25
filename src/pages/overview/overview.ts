import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
/**
 * Generated class for the OverviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html',
})
export class OverviewPage {
  public items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    console.log("Overview test: "+this.navParams.data);
    this.items = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OverviewPage');
  }

}
