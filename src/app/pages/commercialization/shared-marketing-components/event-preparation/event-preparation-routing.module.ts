import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventPreparationComponent } from './event-preparation/event-preparation.component';

const routes: Routes = [
  {
    path: '',
    component: EventPreparationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventPreparationRoutingModule {}
