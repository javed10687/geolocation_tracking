import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { PickUpPage } from './pick-up';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ComponentsModule } from '../../components/components.module';

var config = {
  apiKey: "AIzaSyDI6SEnVxf9UucI06to5LVKvwm3aBkvLs0",
  authDomain: "unified-cortex-207611.firebaseapp.com",
  databaseURL: "https://unified-cortex-207611.firebaseio.com",
  projectId: "unified-cortex-207611",
  storageBucket: "unified-cortex-207611.appspot.com",
  messagingSenderId: "5777872586"
};

@NgModule({
  declarations: [
    PickUpPage,
      ],
  imports: [
    IonicPageModule.forChild(PickUpPage),
    ComponentsModule,
    IonicModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule
  ],
  providers:[
    Geolocation,
    Device
  ]
})
export class PickUpPageModule {}
