import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { PickUpPage } from './pick-up';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ComponentsModule } from '../../components/components.module';

var config = {
  apiKey: "YOUR_API_KEY",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
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
