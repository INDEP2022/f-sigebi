import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectEventModalComponent } from './select-event-modal/select-event-modal.component';

const routes: Routes = [
  {
    path: '',
    component: SelectEventModalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventPreparationRoutingModule {}
