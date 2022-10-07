import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeAtbMQuarterlyAccumulatedAssetsRoutingModule } from './pe-atb-m-quarterly-accumulated-assets-routing.module';
import { PeAtbCQuarterlyAccumulatedAssetsComponent } from './pe-atb-c-quarterly-accumulated-assets/pe-atb-c-quarterly-accumulated-assets.component';


@NgModule({
  declarations: [
    PeAtbCQuarterlyAccumulatedAssetsComponent
  ],
  imports: [
    CommonModule,
    PeAtbMQuarterlyAccumulatedAssetsRoutingModule,
    BsDatepickerModule,
    SharedModule
  ]
})
export class PeAtbMQuarterlyAccumulatedAssetsModule { }
