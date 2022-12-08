import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { EventProcessListComponent } from './event-process-list/event-process-list.component';

const routes: Routes = [
  {
    path: '',
    component: EventProcessListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventProcessRoutingModule {}
