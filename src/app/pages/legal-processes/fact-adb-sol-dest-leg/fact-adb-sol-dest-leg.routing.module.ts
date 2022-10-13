import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactAdbSolDestLegComponent } from './fact-adb-sol-dest-leg/fact-adb-sol-dest-leg.component';

const routes: Routes = [
  {
    path: '',
    component: FactAdbSolDestLegComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactAdbSolDestLegRoutingModule {}
