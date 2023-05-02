import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { MassiveConversionComponent } from './massive-conversion/massive-conversion.component';

const routes: Routes = [
  {
    path: '',
    component: MassiveConversionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitConversionPackagesRoutingModule {}
