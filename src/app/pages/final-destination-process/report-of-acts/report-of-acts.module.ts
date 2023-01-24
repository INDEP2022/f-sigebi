import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { ReportOfActsRoutingModule } from './report-of-acts-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportOfActsRoutingModule,
    SharedFinalDestinationModule,
  ],
})
export class ReportOfActsModule {}
