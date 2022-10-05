import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeAmdvdaMUpdateMssValueRoutingModule } from './pe-amdvda-m-update-mss-value-routing.module';
import { PeAmdvdaCUpdateMssValueComponent } from './pe-amdvda-c-update-mss-value/pe-amdvda-c-update-mss-value.component';


@NgModule({
  declarations: [
    PeAmdvdaCUpdateMssValueComponent
  ],
  imports: [
    CommonModule,
    PeAmdvdaMUpdateMssValueRoutingModule
  ]
})
export class PeAmdvdaMUpdateMssValueModule { }
