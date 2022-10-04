import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubDelegationListComponent } from './sub-delegation-list/sub-delegation-list.component';

const routes: Routes = [
  {
    path: '',
    component: SubDelegationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubDelegationsRoutingModule {}
