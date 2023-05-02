import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FractionWithClassifierListComponent } from './fraction-with-classifier-list/fraction-with-classifier-list.component';

const routes: Routes = [
  {
    path: '',
    component: FractionWithClassifierListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FractionWithClassifierRoutingModule {}
