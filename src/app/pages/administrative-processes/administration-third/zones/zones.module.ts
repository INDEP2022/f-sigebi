import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonesRoutingModule } from './zones-routing.module';
import { ZonesComponent } from './zones/zones.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ZonesComponent
  ],
  imports: [
    CommonModule,
    ZonesRoutingModule,
    SharedModule
  ]
})
export class ZonesModule { }
