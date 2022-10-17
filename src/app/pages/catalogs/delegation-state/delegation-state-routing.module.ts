import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegationStateListComponent } from './delegation-state-list/delegation-state-list.component';

const routes: Routes = [
  {
    path: '',
    component: DelegationStateListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegationStateRoutingModule {}
