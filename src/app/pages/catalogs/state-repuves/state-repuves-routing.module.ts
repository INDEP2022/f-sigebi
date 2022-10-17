import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateRepuvesListComponent } from './state-repuves-list/state-repuves-list.component';

const routes: Routes = [
  {
    path: '',
    component: StateRepuvesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StateRepuvesRoutingModule {}
