import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassiveConversionMainComponent } from './massive-conversion-main/massive-conversion-main.component';

const routes: Routes = [
  {
    path: '',
    component: MassiveConversionMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassiveConversionRoutingModule {}
