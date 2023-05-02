import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PenaltyListComponent } from './penalty-list/penalty-list.component';

const routes: Routes = [
  {
    path: '',
    component: PenaltyListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenaltyRoutingModule {}
