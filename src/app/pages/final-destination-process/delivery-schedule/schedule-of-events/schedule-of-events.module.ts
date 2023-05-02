import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventCaptureComponent } from './event-capture/event-capture.component';
import { EventTrackingComponent } from './event-tracking/event-tracking.component';
import { GenerateEstrategyComponent } from './generate-estrategy/generate-estrategy.component';
import { ScheduleOfEventsRoutingModule } from './schedule-of-events-routing.module';
import { ScheduleOfEventsComponent } from './schedule-of-events/schedule-of-events.component';

@NgModule({
  declarations: [
    ScheduleOfEventsComponent,
    EventTrackingComponent,
    EventCaptureComponent,
    GenerateEstrategyComponent,
  ],
  imports: [
    CommonModule,
    ScheduleOfEventsRoutingModule,
    SharedModule,
    FormsModule,
    TabsModule,
    TimepickerModule.forRoot(),
  ],
})
export class ScheduleOfEventsModule {}
