import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusClaimsListComponent } from './status-claims-list/status-claims-list.component';

const routes: Routes = [
  {
    path: '',
    component: StatusClaimsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusClaimsRoutingModule {}
