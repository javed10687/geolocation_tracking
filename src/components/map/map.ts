import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { Device } from '@ionic-native/device';
import { DeviceList } from '../../app/models/device.model';
import { AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/filter';



declare var google: any;

@Component({
  selector: 'google-map',
  templateUrl: 'map.html'
})
export class MapComponent {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;
  watcher: any;
  currentLocation: any;
  tracking: boolean = false;
  devicelist: Observable<any>;
  deviceObj: DeviceList = new DeviceList();
  markers: Array<any> = [];
  markerIcon = {
  url: "assets/icon/location.png",
  scaledSize: new google.maps.Size(50, 50),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(32,65),
  labelOrigin: new google.maps.Point(30,0)
};

  constructor(public navCtrl: NavController, public platform: Platform, public geolocation: Geolocation,
              public loadingCtrl: LoadingController, private device: Device,
              public firebase: AngularFireDatabase) {
  }

  ngOnInit(){
    //this.devicelist = this.firebase.object('/devices/' + this.device.uuid);
    //this.devicelist.set(this.device.uuid);
    // this.devicelist.valueChanges().subscribe(
    //   data => {
    //     console.log(data.length);
    //   });

    // this.devicelist.set("user", {
    //   user_id : 'mj',
    //   coords : {
    //     lat: 24.7857574,
    //     lng: 90.0485849
    //   }
    // });
    
    this.getCurrentLocation().subscribe(location => {
      this.loadMap(location);
      this.updateLocation(this.currentLocation);
      this.loadUserLocation();
    });

    //this.updateLocation(this.currentLocation);
  }

  getCurrentLocation(): Observable<any> {
    let loading = this.loadingCtrl.create({
      content: 'Loading map...'
    });
    loading.present();

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 5
    };

    let locationObs = Observable.create(observable => {
      this.geolocation.getCurrentPosition(options).then((resp)=>{
        this.currentLocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
        observable.next(this.currentLocation);
        loading.dismiss();
      }).catch((error)=>{
        console.log("Error getting location: ", error);
        alert("Error getting location.." + error);
        loading.dismiss();
      });
    });
    return locationObs;
  }  

  centerLocation(location){
    if (location){
      this.setMarker(location);
    }

    else if (this.currentLocation){
      this.setMarker(this.currentLocation);
    }
    else {
      this.getCurrentLocation().subscribe(location => {
        this.currentLocation = location;
        this.setMarker(location);
      })
    }
  }
    
  setMarker(location){
    this.map.panTo(location);
    this.marker.setPosition(location);
    this.marker.setLabel(this.device.uuid + ':' + this.device.model);
  }

  loadMap(myloc){
    let element = this.mapElement.nativeElement;
    let mapOptions= {
        center: myloc,
        zoom: 18,
        tilt: 30,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    }; 

    this.map = new google.maps.Map(element, mapOptions);

    this.marker = new google.maps.Marker({
      label: "You are here!",   
      icon: this.markerIcon,
      map: this.map,
      position: myloc,
      infoWindowAnchor: [16, 0],
    });
  
  }

  startTracking(){
    alert("Start Tracking...");
    this.tracking = true;
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 5
    };

    this.watcher = this.geolocation.watchPosition(options)
                            .filter((p)=> p.coords !== undefined)
                            .subscribe(resp => {
                              this.currentLocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
                              this.updateLocation(this.currentLocation);
                              this.setMarker(this.currentLocation);
                            }); 
    this.loadUserLocation();
  }

  stopTracking(){
      alert("Stop Tracking...")
      this.tracking = false;
      this.watcher.unsubscribe();
      //this.devicelist.unsubscribe();
  }

  updateLocation(location){
    this.deviceObj = {
      device_id : this.device.uuid,
      coords : {
        lat: location.lat(),
        lng: location.lng()
      }
    };
    this.firebase.object('devices/' + this.device.uuid).update(this.deviceObj);
  }

  loadUserLocation(){
    this.devicelist = this.firebase.list('devices/').valueChanges();
     this.devicelist.subscribe(data => {
      console.log(data);
      this.deleteMarkers();
      data.forEach(item => {
        if ( item.device_id != this.device.uuid){
          let loc = new google.maps.LatLng(item.coords.lat,item.coords.lng);
          let marker = new google.maps.Marker({
          label: this.device.uuid,
          map: this.map,
          position: loc,
          icon: this.markerIcon,
          infoWindowAnchor: [16, 0],
          });
          this.markers.push(marker);
        }
      });

      //load markers on map
      this.setMapOnAll(this.map)
    });
  }

  setMapOnAll(map) {
    this.markers.forEach(marker => {
      marker.setMap(map);
    });
 }

clearMarkers() {
  this.setMapOnAll(null);
}

deleteMarkers() {
  this.clearMarkers();
  this.markers = [];
}

}
