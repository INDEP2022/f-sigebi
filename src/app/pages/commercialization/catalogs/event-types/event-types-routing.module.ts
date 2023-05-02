import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { EventTypesComponent } from './event-types/event-types.component';

const routes: Routes = [
  {
    path: '',
    component: EventTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventTypesRoutingModule {}
