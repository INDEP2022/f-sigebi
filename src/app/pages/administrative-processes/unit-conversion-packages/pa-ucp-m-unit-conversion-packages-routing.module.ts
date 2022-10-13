import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaUcpmcCMassiveConversionComponent } from './massive-conversion/pa-ucpmc-c-massive-conversion.component';

const routes: Routes = [
  {
    path: '',
    component: PaUcpmcCMassiveConversionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaUcpMUnitConversionPackagesRoutingModule {}
