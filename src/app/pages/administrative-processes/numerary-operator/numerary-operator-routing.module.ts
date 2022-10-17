import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraryOperatorComponent } from './numerary-operator/numerary-operator.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraryOperatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryOperatorRoutingModule {}
