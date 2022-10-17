import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpDsSoeCScheduleOfEventsComponent } from './schedule-of-events/fdp-ds-soe-c-schedule-of-events.component';
import { FdpDsEcCEventCaptureComponent } from './event-capture/fdp-ds-ec-c-event-capture.component';
import { FdpDsGeCGenerateEstrategyComponent } from './generate-estrategy/fdp-ds-ge-c-generate-estrategy.component';

const routes: Routes = [
  {
    path: "",
    component: FdpDsSoeCScheduleOfEventsComponent
  },
  {
    path: "capture-event",
    component: FdpDsEcCEventCaptureComponent
  },
  {
    path: "capture-event/generate-estrategy",
    component: FdpDsGeCGenerateEstrategyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdpDsSoeMScheduleOfEventsRoutingModule { }
