import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventCaptureComponent } from './event-capture/event-capture.component';
import { GenerateEstrategyComponent } from './generate-estrategy/generate-estrategy.component';
import { ScheduleOfEventsComponent } from './schedule-of-events/schedule-of-events.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleOfEventsComponent,
  },
  {
    path: 'capture-event',
    component: EventCaptureComponent,
  },
  {
    path: 'capture-event/generate-estrategy',
    component: GenerateEstrategyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleOfEventsRoutingModule {}
