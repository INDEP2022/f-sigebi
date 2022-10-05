import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { PeAmdvdaMUpdateMssValueRoutingModule } from './pe-amdvda-m-update-mss-value-routing.module';
import { PeAmdvdaCUpdateMssValueComponent } from './pe-amdvda-c-update-mss-value/pe-amdvda-c-update-mss-value.component';


@NgModule({
  declarations: [
    PeAmdvdaCUpdateMssValueComponent
  ],
  imports: [
    CommonModule,
    PeAmdvdaMUpdateMssValueRoutingModule,
    SharedModule,
    Ng2SmartTableModule
  ]
})
export class PeAmdvdaMUpdateMssValueModule { }
