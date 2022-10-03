import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegationListComponent } from './delegation-list/delegation-list.component';

const routes: Routes = [
  {
    path: '',
    component: DelegationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegationsRoutingModule {}
