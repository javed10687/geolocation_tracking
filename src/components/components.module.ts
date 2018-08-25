import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { IonicModule } from 'ionic-angular';


@NgModule({
	declarations: [MapComponent],
	imports: [IonicModule],
	exports: [MapComponent]
})
export class ComponentsModule {}
