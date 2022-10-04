import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeAtbQuarterlyAccumulatedAssetsRoutingModule } from './pe-atb--quarterly-accumulated-assets-routing.module';
import { PeAtbQuarterlyAccumulatedAssetsComponent } from './pe-atb-quarterly-accumulated-assets/pe-atb-quarterly-accumulated-assets.component';


@NgModule({
  declarations: [
    PeAtbQuarterlyAccumulatedAssetsComponent
  ],
  imports: [
    CommonModule,
    PeAtbQuarterlyAccumulatedAssetsRoutingModule,
    BsDatepickerModule,
    SharedModule
  ]
})
export class PeAtbQuarterlyAccumulatedAssetsModule { }
