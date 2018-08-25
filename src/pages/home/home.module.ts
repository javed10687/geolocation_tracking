import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

import { HomePage } from './home';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  providers:[
    Geolocation,
    GoogleMaps
  ]
})
export class HomePageModule {}
