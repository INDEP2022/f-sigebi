import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'schedule-of-events',
    loadChildren: () =>
      import('./schedule-of-events/schedule-of-events.module').then(
        m => m.ScheduleOfEventsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryScheduleRoutingModule {}
