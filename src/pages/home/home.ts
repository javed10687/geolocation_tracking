import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  GoogleMapsEvent,
  MarkerOptions,
  Marker,
  LatLng
  } from '@ionic-native/google-maps';
import 'rxjs/add/operator/filter';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map:GoogleMap;
  markers: MarkerOptions[] = [];
  updatedLocation: LatLng;
  watchLocation: any;
  tracking: boolean = false;
  marker: Marker;
  

  constructor(public navCtrl: NavController, public geolocation: Geolocation,
  public platform: Platform) {
    
  }

  ionViewDidEnter(){
    this.loadGoogleMap();
  }

  loadGoogleMap(){
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 5
    };

    this.geolocation.getCurrentPosition(options).then((resp)=>{
      let mylocation = new LatLng(resp.coords.latitude,resp.coords.longitude);
      this.loadMap(mylocation);
    }).catch((error)=>{
      console.log("Error getting location: ", error);
    });
  }
  
  loadMap(myloc: LatLng){
    let element = this.mapElement.nativeElement;
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: myloc,
        zoom: 18,
        tilt: 30
      }
    }; 

    this.map = GoogleMaps.create(element, mapOptions);

    this.marker = this.map.addMarkerSync({
      title: String(myloc),
      icon: 'blue',
      animation: 'DROP',
      anchor: [16, 32],
      visible: true,
      position: myloc,
      infoWindowAnchor: [16, 0],
    });
  
   }

  startTracking(){
    alert("Start tracking...");
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 5
    };

    
    this.watchLocation = this.geolocation.watchPosition(options)
                            
                            this.watchLocation.subscribe((resp) => {
                              this.tracking = true;
                              this.updatedLocation = new LatLng(resp.coords.latitude,resp.coords.longitude);
                              console.log(this.updatedLocation);
                              //this.marker.remove();
                              this.marker.setPosition(this.updatedLocation);
                              this.marker.setTitle(String(this.updatedLocation));
                              console.log(String(this.updatedLocation));
                              this.addMarker(this.updatedLocation);
                              //this.setMapOnAll();
                            }); 
  }

  stopTracking(){
    alert("Tracking Stopped");
    console.log(this.watchLocation);
    this.watchLocation.unsubscribe();
  }

  addMarker(mylocation) {
    let marker: MarkerOptions = {
      icon: 'blue',
      animation: 'DROP',
      anchor: [16, 32],
      visible: true,
      position: mylocation,
      infoWindowAnchor: [16, 0],      
    };
    this.markers.push(marker);
  }
  
  setMapOnAll() {
    console.log(this.markers);
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i]);
      this.map.addMarker(this.markers[i]).then((marker: Marker) => {
        marker.showInfoWindow();
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          alert('Marker Clicked');
        });
      });
    }
  }
  
  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].remove();
    }
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
}
