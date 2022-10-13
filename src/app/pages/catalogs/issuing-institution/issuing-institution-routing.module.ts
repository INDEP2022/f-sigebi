import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuingInstitutionListComponent } from './issuing-institution-list/issuing-institution-list.component';

const routes: Routes = [
  {
    path: '',
    component: IssuingInstitutionListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssuingInstitutionRoutingModule {}
