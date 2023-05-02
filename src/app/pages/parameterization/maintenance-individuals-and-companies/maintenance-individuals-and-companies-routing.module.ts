import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListIndividualsAndCompaniesComponent } from './list-individuals-and-companies/list-individuals-and-companies.component';

const routes: Routes = [
  {
    path: '',
    component: ListIndividualsAndCompaniesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceIndividualsAndCompaniesRoutingModule {}
