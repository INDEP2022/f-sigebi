import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeductivesListComponent } from './deductives-list/deductives-list.component';

const routes: Routes = [
  {
    path: '',
    component: DeductivesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeductivesRoutingModule {}
