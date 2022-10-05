import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeRddeMDailyControlReceptionRoutingModule } from './pe-rdde-m-daily-control-reception-routing.module';
import { PeRddeCDailyControlReceptionComponent } from './pe-rdde-c-daily-control-reception/pe-rdde-c-daily-control-reception.component';


@NgModule({
  declarations: [
    PeRddeCDailyControlReceptionComponent
  ],
  imports: [
    CommonModule,
    PeRddeMDailyControlReceptionRoutingModule
  ]
})
export class PeRddeMDailyControlReceptionModule { }
