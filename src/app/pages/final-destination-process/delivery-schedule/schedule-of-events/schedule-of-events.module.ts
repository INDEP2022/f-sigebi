import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CoordinationModalComponent } from 'src/app/@standalone/shared-forms/coordination/coordination-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParametersComponent } from './event-capture/components/parameters/parameters.component';
import { SmartDateInputHeaderDirective } from './event-capture/directives/smart-date-input.directive';
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
    ParametersComponent,
    SmartDateInputHeaderDirective,
  ],
  imports: [
    CommonModule,
    ScheduleOfEventsRoutingModule,
    SharedModule,
    FormsModule,
    TabsModule,
    TimepickerModule.forRoot(),
    ModalModule.forChild(),
    CoordinationModalComponent,
  ],
})
export class ScheduleOfEventsModule {}
