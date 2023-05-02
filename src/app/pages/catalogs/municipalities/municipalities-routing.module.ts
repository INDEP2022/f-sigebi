import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MunicipalityListComponent } from './municipality-list/municipality-list.component';

const routes: Routes = [
  {
    path: '',
    component: MunicipalityListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MunicipalitiesRoutingModule {}
