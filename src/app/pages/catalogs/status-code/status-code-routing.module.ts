import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusCodeListComponent } from './status-code-list/status-code-list.component';

const routes: Routes = [
  {
    path: '',
    component: StatusCodeListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusCodeRoutingModule {}
