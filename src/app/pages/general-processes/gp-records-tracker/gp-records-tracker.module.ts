import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpRecordsTrackerRoutingModule } from './gp-records-tracker-routing.module';
import { GpRecordsTrackerComponent } from './gp-records-tracker/gp-records-tracker.component';

@NgModule({
  declarations: [GpRecordsTrackerComponent],
  imports: [CommonModule, GpRecordsTrackerRoutingModule, SharedModule],
})
export class GpRecordsTrackerModule {}
