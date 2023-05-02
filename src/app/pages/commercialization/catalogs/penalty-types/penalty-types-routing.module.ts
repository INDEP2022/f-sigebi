import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PenaltyTypesListComponent } from './penalty-types-list/penalty-types-list.component';

const routes: Routes = [
  {
    path: '',
    component: PenaltyTypesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenaltyTypesRoutingModule {}
