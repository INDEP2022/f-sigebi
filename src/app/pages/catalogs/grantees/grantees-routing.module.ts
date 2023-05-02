import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GranteesListComponent } from './grantees-list/grantees-list.component';

const routes: Routes = [
  {
    path: '',
    component: GranteesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrateesRoutingModule {}
