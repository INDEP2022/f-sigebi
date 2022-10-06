import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionalDelegationsListComponent } from './regional-delegations-list/regional-delegations-list.component';

const routes: Routes = [
  {
    path: '',
    component: RegionalDelegationsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionalDelegationsRoutingModule {}
