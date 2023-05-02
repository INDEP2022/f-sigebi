import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { EventPermissionControlComponent } from './event-permission-control/event-permission-control.component';

const routes: Routes = [
  {
    path: '',
    component: EventPermissionControlComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
