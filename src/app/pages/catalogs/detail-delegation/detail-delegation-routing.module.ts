import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailDelegationListComponent } from './detail-delegation-list/detail-delegation-list.component';

const routes: Routes = [
  {
    path: '',
    component: DetailDelegationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailDelegationRoutingModule {}
