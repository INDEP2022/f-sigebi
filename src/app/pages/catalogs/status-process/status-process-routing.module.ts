import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusProcessListComponent } from './status-process-list/status-process-list.component';

const routes: Routes = [
  {
    path: '',
    component: StatusProcessListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusProcessRoutingModule {}
