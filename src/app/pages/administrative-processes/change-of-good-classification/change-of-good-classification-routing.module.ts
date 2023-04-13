import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeOfGoodClassificationComponent } from './change-of-good-classification/change-of-good-classification.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeOfGoodClassificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeOfGoodClassificationRoutingModule {}
