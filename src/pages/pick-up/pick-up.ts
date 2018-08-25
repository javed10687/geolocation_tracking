import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the PickUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-pick-up',
  templateUrl: 'pick-up.html',
})
export class PickUpPage {

  searchText: string;
  GoogleAutocomplete = new google.maps.places.AutocompleteService();
  autocompleteItems = [];
  searchLocation: any;
  geocoder = new google.maps.Geocoder;
  list: AngularFireList<any>;

  constructor(public navCtrl: NavController, private zone: NgZone,
                public firebase: AngularFireDatabase) {
      
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad PickUpPage');
    // this.list = this.firebase.list('/devices').valueChanges().subscribe(
    //   data => {
    //     console.log(data);
    //   });
      
  }

  searchPlace(){
   if (this.searchText == ''){
   	this.autocompleteItems = [];
   	return;
   	}
 
   	this.GoogleAutocomplete.getPlacePredictions({ input: this.searchText }, (predictions, status) => {
   		this.autocompleteItems = [];
   		this.zone.run(() => {
   			predictions.forEach((prediction) => {
   				this.autocompleteItems.push(prediction);
   			});
   		});
   	});
   	console.log(this.autocompleteItems);
}

selectSearchResult(item, map){
	this.autocompleteItems = []

	this.geocoder.geocode({'placeId': item.place_id}, (results, status) =>{
		if(status === 'OK' && results[0]){
			console.log(results);
			map.centerLocation(results[0].geometry.location)
		}
	});

}

}
