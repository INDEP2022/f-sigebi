import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecordsTrackerRoutingModule } from './records-tracker-routing.module';
import { RecordsTrackerComponent } from './records-tracker/records-tracker.component';

@NgModule({
  declarations: [RecordsTrackerComponent],
  imports: [CommonModule, RecordsTrackerRoutingModule, SharedModule],
})
export class RecordsTrackerModule {}
