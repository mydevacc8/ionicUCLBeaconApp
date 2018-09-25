import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http'
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '../../../node_modules/@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/Rx'
import { Storage } from '@ionic/storage'
import { Platform } from 'ionic-angular'
import { SQLitePorter } from '../../../node_modules/@ionic-native/sqlite-porter';




@Injectable()
export class DatabseProvider {

  // Creates local Database Later to be Deleted or use for online of line sync
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  constructor(public http: Http, private sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'UclApp.db',
        location: 'default'
      })
      .then((db: SQLiteObject) =>{
        this.database = db;
        this.storage.get('database_filled').then(val => {
          if(val){
            this.databaseReady.next(true);
          }else{
            this.fillDatabase();
          }
        })
      })
    });
  }

  // Fills database with dummy data
  fillDatabase(){
    this.http.get('assets/tempDb.sql')
    .map(res => res.text())
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(data => {
        this.databaseReady.next(true);
        this.storage.set('database_filled', true);
      })
      .catch(e => console.log(e));
    });
  }


  getAllTours(){
    return this.database.executeSql("SELECT * FROM tours",[]).then(data =>{
      let tours = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++){
          tours.push({id: data.rows.item(i).id, name: data.rows.item(i).name, image: data.rows.item(i).image})
        }
      }
      return tours;
    }, err => {
      console.log('Error: ', err);
      return[];
    })
  }

  getLegsForTour(tourId){
    let legIds = [];
    
    return this.getLegIds(tourId).then(data =>{
      let legs = [];
      legIds = data;

      var promises = [];
      for (var i = 0; i < legIds.length; i++){
        var promise = this.getLegs(legIds[i].id).then(data =>{
          console.log(data);
          legs.push(data);
        });
        promises.push(promise);
      }
      return Promise.all(promises).then(function() {
        return legs;
      });
      
      
    });

  }

  getLegIds(tourId){ 
    return this.database.executeSql("SELECT * FROM tourRelations WHERE tourId=?",[tourId]).then(data=>{
      let legIds = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++){
          legIds.push({id: data.rows.item(i).legId})
        }
      }
      return legIds;
    }, err => {
      console.log('Error: ', err);
      return[];
    })
  }

  getLegs(legId){
    return this.database.executeSql("SELECT * FROM legs WHERE id=?",[legId]).then(data =>{
      let leg = {};
      leg = {id: data.rows.item(0).id, name: data.rows.item(0).name, description: data.rows.item(0).description, lat: data.rows.item(0).long, long: data.rows.item(0).lat, address: data.rows.item(0).address};

      return leg;
    })
  }

  getEventsForLeg(legId){
    let eventIds = [];

    return this.getEventIds(legId).then(data =>{
      let events = [];
      eventIds = data;

      var promises = [];
      for (var i = 0; i < eventIds.length; i++){
        var promise = this.getEvents(eventIds[i].id).then(data =>{
          console.log(data);
          events.push(data);
        });
        promises.push(promise);
      }
      return Promise.all(promises).then(function() {
        return events;
      });
    });
  }

  getEventIds(legId){
    return this.database.executeSql("SELECT * FROM eventRelations WHERE legId=?",[legId]).then(data => {
      let eventIds = [];
      if (data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++){
          eventIds.push({id: data.rows.item(i).eventId})
        }
      }
      return eventIds;
    }, err => {
      console.log('Error: ', err);
      return[];
    })
  }

  getEvents(eventId){
    return this.database.executeSql("SELECT * FROM events WHERE id=?",[eventId]).then(data =>{
      let event = {};
      event = {id: data.rows.item(0).id, name: data.rows.item(0).name, description: data.rows.item(0).description};

      return event;
    })
  }

  getBeaconForLeg(legIds){
    let beacons = [];
    var promises = [];
    for (var i = 0; i < legIds.length; i++){
      var promise = this.getBeaconMajor(legIds[i]).then(data=>{
        console.log(data.major);
        if(data.major.beaconMajor != -1){
          beacons.push(data.major.beaconMajor);
        }
        
      });
      promises.push(promise);
    }
    return Promise.all(promises).then(function() {
      return beacons;
    });
  }

  getBeaconId(legId){
    return this.database.executeSql("SELECT beaconId FROM legRelations WHERE legId=?",[legId]).then(data=>{
      if(data.insertId === undefined){
        let beaconId = {id: data.rows.item(0)};
        return beaconId;
      }
      let beaconId = {id: -1}
      return beaconId;
    });
  }

  getBeaconMajor(legId){
    return this.getBeaconId(legId).then(data=>{
      if (data.id.beaconId === -1){
        let beaconMajor = {major: -1};
        return beaconMajor;
      }else{
        return this.database.executeSql("SELECT beaconMajor FROM beacons WHERE id=?",[data.id.beaconId]).then(data=>{
          let beaconMajor = {major: data.rows.item(0)};
          return beaconMajor;
        });
      }
      
    });
  }

  getLegsFromBeacons(beaconMajors){
    let legs = []
    var promises = [];
    for (var i = 0; i < beaconMajors.length; i++){
      var promise = this.getLegIdFromBeaconId(beaconMajors[i]).then(data=>{
          legs.push(data);
        
      });
      promises.push(promise);
    }
    return Promise.all(promises).then(function(){
      return legs;
    });
  }

  getBeaconIdFromMajor(beaconMajor){
    return this.database.executeSql("SELECT id FROM beacons WHERE beaconMajor=?",[beaconMajor]).then(data=>{
      let beaconId = {id: data.rows.item(0)};
      return beaconId;
    });
  }

  getLegIdFromBeaconId(beaconMajor){
    return this.getBeaconIdFromMajor(beaconMajor).then(data=>{
      return this.database.executeSql("SELECT legId FROM legRelations WHERE beaconId=?",[data.id.id]).then(data=>{
        let legId = {id: data.rows.item(0)};
        return this.getLegs(legId.id.legId).then(data=>{
          return data;
        });
      });
    });
  }

  getDatabaseSate() {
    return this.databaseReady.asObservable();
  }

}
