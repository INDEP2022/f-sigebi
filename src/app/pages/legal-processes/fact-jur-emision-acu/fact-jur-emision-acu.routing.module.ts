import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactJurEmisionAcuComponent } from './fact-jur-emision-acu/fact-jur-emision-acu.component';

const routes: Routes = [
  {
    path: '',
    component: FactJurEmisionAcuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactJurEmisionAcuRoutingModule {}
