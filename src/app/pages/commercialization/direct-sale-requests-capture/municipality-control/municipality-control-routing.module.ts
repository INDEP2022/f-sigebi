import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MunicipalityControlMainComponent } from './municipality-control-main/municipality-control-main.component';

const routes: Routes = [
  {
    path: '',
    component: MunicipalityControlMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MunicipalityControlRoutingModule {}
