import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactJurregDestLegComponent } from './fact-jurreg-dest-leg/fact-jurreg-dest-leg.component';

const routes: Routes = [
  {
    path: '',
    component: FactJurregDestLegComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactJurregDestLegRoutingModule {}
