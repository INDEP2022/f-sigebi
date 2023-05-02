import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraryCalcComponent } from './numerary-calc.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraryCalcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryCalcRoutingModule {}
