import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPNpCNumeraryParameterizationComponent } from './c-p-np-c-numerary-parameterization/c-p-np-c-numerary-parameterization.component';

const routes: Routes = [
  {
    path: '',
    component: CPNpCNumeraryParameterizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMNumeraryParameterizationRoutingModule {}
