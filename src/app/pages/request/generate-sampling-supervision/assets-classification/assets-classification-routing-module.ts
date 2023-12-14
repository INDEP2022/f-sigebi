import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsClassificationComponent } from './assets-classification/assets-classification.component';
import { ClassificationAnnexedSignComponent } from './classification-annexed-sign/classification-annexed-sign.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsClassificationComponent,
  },
  {
    path: 'sign-annexes/:id',
    component: ClassificationAnnexedSignComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsClassificationRoutingModule {}
