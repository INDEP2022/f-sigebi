import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonSelectComponent } from './components/button-select/button-select.component';
import { RecordsTrackerRoutingModule } from './records-tracker-routing.module';
import { RecordsTrackerComponent } from './records-tracker/records-tracker.component';

@NgModule({
  declarations: [RecordsTrackerComponent, ButtonSelectComponent],
  imports: [
    CommonModule,
    RecordsTrackerRoutingModule,
    SharedModule,
    AccordionModule,
  ],
})
export class RecordsTrackerModule {}
