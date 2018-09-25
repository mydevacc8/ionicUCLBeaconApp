import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatabseProvider} from './../../providers/databse/databse'

import { MapTabsPage} from '../map-tabs/map-tabs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tours = [];
  tour = {};

  grid: Array<Array<number>>;

  constructor(public navCtrl: NavController, private databaseProvider: DatabseProvider) {

    this.databaseProvider.getDatabaseSate().subscribe(rdy => {
      if (rdy){
        this.loadToursData();
      }
    })

    this.grid = Array(Math.ceil(this.tours.length/2));
  }

  loadToursData(){
    this.databaseProvider.getAllTours().then(data =>{
      this.tours = data;
      this.makeGrid();
    });

  }

  makeGrid(){
    
    let num = 1;
    let y = 0;
    while(num < this.tours.length+1){
      this.grid[y] = Array(2);
      for (let x = 0; x < 2; x+=1){
        if (num < this.tours.length+1){
          this.grid[y][x] = num;
        }
        
        num ++;
      }

      y++;

    }
  }

  someFunction(i: number){
    this.navCtrl.push(MapTabsPage, {
      tourId: this.tours[i - 1].id
    });
  }

}
