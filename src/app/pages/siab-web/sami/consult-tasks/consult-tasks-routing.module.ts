import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultTasksComponent } from './consult-tasks/consult-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultTasksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultTasksRoutingModule {}
