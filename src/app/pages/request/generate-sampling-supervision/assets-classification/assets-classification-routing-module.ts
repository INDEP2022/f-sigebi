import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsClassificationComponent } from './assets-classification/assets-classification.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsClassificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsClassificationRoutingModule {}
