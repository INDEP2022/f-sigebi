import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpDsSoeCScheduleOfEventsComponent } from './schedule-of-events/fdp-ds-soe-c-schedule-of-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FdpDsSoeMScheduleOfEventsRoutingModule } from './fdp-ds-soe-m-schedule-of-events-routing.module';
import { FdpDsEtCEventTrackingComponent } from './event-tracking/fdp-ds-et-c-event-tracking.component';
import { FdpDsEcCEventCaptureComponent } from './event-capture/fdp-ds-ec-c-event-capture.component';
import { FdpDsGeCGenerateEstrategyComponent } from './generate-estrategy/fdp-ds-ge-c-generate-estrategy.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [
    FdpDsSoeCScheduleOfEventsComponent,
    FdpDsEtCEventTrackingComponent,
    FdpDsEcCEventCaptureComponent,
    FdpDsGeCGenerateEstrategyComponent,
  ],
  imports: [
    CommonModule,
    FdpDsSoeMScheduleOfEventsRoutingModule,
    SharedModule,
    FormsModule,
    TabsModule,
    TimepickerModule.forRoot(),
  ],
})
export class FdpDsSoeMScheduleOfEventsModule {}
