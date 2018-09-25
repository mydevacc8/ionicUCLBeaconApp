import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { App } from 'ionic-angular';
import { DatabseProvider} from './../../providers/databse/databse';
import { EventListPage } from '../event-list/event-list';
import { IBeacon } from '@ionic-native/ibeacon';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs';

// TODO: Check what window is open now, if the same dont re-open

declare var google:any;

@IonicPage()

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage { 
  @ViewChild('map') mapRef: ElementRef;

  public tourId;
  public legs = [];
  public visibleBeacon = [];
  public legBeaconMajors = [];
  public beaconBeaconMajors = [];
  public markerList = [];
  private legsOfVisibleBeacons = []; 
  public activeWindow = null;
  public map;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, private view: ViewController, private app: App, private databaseProvider: DatabseProvider,private ibeacon: IBeacon) {
    this.tourId = this.navParams.data;
    console.log("The tour Id: "+ this.tourId);

    this.databaseProvider.getDatabaseSate().subscribe(rdy => {
      if (rdy){
        this.loadLegsData();
      }
    })

    this.ibeacon.requestAlwaysAuthorization();
    let delegate = this.ibeacon.Delegate();
    delegate.didRangeBeaconsInRegion()
      .subscribe(
      data => {
        this.visibleBeacon = data.beacons;
        console.log(this.visibleBeacon);
      },
      error => console.error()
      );

    let beaconRegion = this.ibeacon.BeaconRegion('testBeacon','B9407F30-F5F8-466E-AFF9-25556B57FE6D');
    this.ibeacon.startRangingBeaconsInRegion(beaconRegion).then(
      () => console.log('Native layer recieved the request to monitoring'),
      error => console.error('Native layer failed to begin monitoring: ', error)
    );

    Observable.interval(2000).subscribe((val) => {
      console.log('called');
      this.checkForUnusedBeacon();
      this.getLegFromBeacon();
      this.checkMarkers();
      this.checkLegs();

    });
  }


  loadLegsData(){

    this.databaseProvider.getLegsForTour(this.tourId).then(data =>{
      this.legs = data;
      
      this.showMap();
      this.events.publish('legs:loaded', this.legs);
      this.getBeaconsForLegs(this.legs).then(data=>{
        this.legBeaconMajors = data;
      });
    });

  }

  showMap(){
    var self = this;

    let lat = parseFloat(this.legs[0].lat);
    let long = parseFloat(this.legs[0].long);

    const location = new google.maps.LatLng(lat, long);
    const options = {
      center: location,
      zoom: 15,
      streetViewControl: false
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    for (var i = 0; i < this.legs.length; i++ ){
      let lat = parseFloat(this.legs[i].lat);
      let long = parseFloat(this.legs[i].long);
      const location = new google.maps.LatLng(lat, long);
      this.addMarker(location,this.legs[i].name, this.legs[i].id, this.map, this.legs[i].description);
    }

    google.maps.event.addListener(this.map, 'click', function(event){
      self.hideAllInfoWindows(this.map);// gives error if 'this' is used.
    });
    
  }

  hideAllInfoWindows(map){
    this.markerList.forEach(function(marker){
      marker.infowindow.close(map, marker);
    });
  }

  createInfoWindow(name, legId, legName, legDescription){
    var self = this;
    var locationinfowindow = new google.maps.InfoWindow({});
    var div = document.createElement('div');
    div.innerHTML = name;
    div.onclick = function(){self.goToEventPage(legId, legName, legDescription);};
    locationinfowindow.setContent(div);
    return locationinfowindow;
  }

  goToEventPage(legId, legName, legDescription){
    this.navCtrl.push(EventListPage,{
      legId: legId,
      legName: legName,
      legDescription: legDescription
    });
  }

  addMarker(position, name, legId, map, legDescription){

    var self = this;
    

    var marker = new google.maps.Marker({
      id: legId,
      position,
      infowindow: self.createInfoWindow(name, legId, name, legDescription),
      map
    });

    marker.addListener('click', function(){
      self.hideAllInfoWindows(map);// gives error if 'this' is used.
      this.infowindow.open(map, this);
    });
    this.markerList.push(marker);
    console.log(this.markerList);

    return marker;
  }

  // Checks if there are any unwanted markers
  checkMarkers(){
    let found = false;

    for(var i = 0; i<this.markerList.length;i++){
      found = false;
      for(var j = 0; j < this.legs.length; j++){
        if(this.markerList[i].id === this.legs[j].id){
          found = true;
          console.log("found the marke in the legs");
          break;
        }
      }
      if(found == false){
        for(j = 0; j < this.legsOfVisibleBeacons.length; j++){
          if (this.markerList[i].id === this.legsOfVisibleBeacons[j].id){
            found = true;
            console.log("found the marke in the visible beacons");
            break;
          }
        }
      }
      if(found == false){
        console.log('About to delete the marker');
        this.markerList[i].setMap(null);
        this.markerList.splice(this.markerList.indexOf(this.markerList[i]),1);
      }
    }
  }

  // Check if there are any legs not shown on the map
  checkLegs(){
    let found = false;
    for (var i = 0; i < this.legsOfVisibleBeacons.length; i++){
      found = false;
      for (var j = 0; j < this.markerList.length; j++){
        if (this.legsOfVisibleBeacons[i].id === this.markerList[j].id){
          found = true;
          console.log('The beacon is visible');
          break;
        }
      }
      if (found === false){
        console.log('About to add');
        let lat = parseFloat(this.legsOfVisibleBeacons[i].lat);
        let long = parseFloat(this.legsOfVisibleBeacons[i].long);
        const location = new google.maps.LatLng(lat, long);
        this.addMarker(location,this.legsOfVisibleBeacons[i].name,this.legsOfVisibleBeacons[i].id,this.map,this.legsOfVisibleBeacons[i].description);
      }
    }
  }

  getBeaconsForLegs(legs){
    let legIds = [];

    legs.forEach(leg=>{
      legIds.push(leg.id);
    });

    return this.databaseProvider.getBeaconForLeg(legIds).then(data=>{
      console.log(data);
      return data;
    });
  }

  checkForUnusedBeacon(){
    let same = false;

    // Clear the array before re populating it with new beacons
    while (this.beaconBeaconMajors.length > 0){
      this.beaconBeaconMajors.pop();
    }


    // Check is visible beacons are legs of the tour
    for (let beacon of this.visibleBeacon){
      same = false;
      for (let legBeaconMajor of this.legBeaconMajors){
        if(beacon.major == legBeaconMajor){
          same = true;
          break;
        }
      }
      if (same == false){

        this.beaconBeaconMajors.push(beacon.major);
      }
    }

    console.log(this.beaconBeaconMajors);
  }

  getLegFromBeacon(){
    this.databaseProvider.getLegsFromBeacons(this.beaconBeaconMajors).then(data=>{
      console.log("legsOfVisibleBeacons",data);
      this.legsOfVisibleBeacons = data;
    });
  }

  goHome(){
    //this.app.getRootNav().setRoot(HomePage);
    const root = this.app.getRootNav (); // in this line, you have to declare a root, which is the app's root 
    root.popToRoot ();
  }

}
