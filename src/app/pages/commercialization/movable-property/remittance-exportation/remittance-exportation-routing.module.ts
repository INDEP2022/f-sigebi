import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemittanceExportationComponent } from './remittance-exportation/remittance-exportation.component';

const routes: Routes = [
  {
    path: '',
    component: RemittanceExportationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemittanceExportationRoutingModule {}
