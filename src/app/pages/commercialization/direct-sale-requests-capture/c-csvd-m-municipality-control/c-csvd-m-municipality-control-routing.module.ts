import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCsvdCMunicipalityControlMainComponent } from './c-csvd-c-municipality-control-main/c-csvd-c-municipality-control-main.component';

const routes: Routes = [
  {
    path: '',
    component: CCsvdCMunicipalityControlMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCsvdMMunicipalityControlRoutingModule {}
