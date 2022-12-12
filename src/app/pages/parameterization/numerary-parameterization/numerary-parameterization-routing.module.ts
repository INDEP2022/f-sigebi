import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraryParameterizationComponent } from './numerary-parameterization/numerary-parameterization.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraryParameterizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryParameterizationRoutingModule {}
