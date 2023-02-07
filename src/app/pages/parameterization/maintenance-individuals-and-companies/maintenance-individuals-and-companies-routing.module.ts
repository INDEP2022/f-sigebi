import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceIndividualsAndCompaniesComponent } from './maintenance-individuals-and-companies/maintenance-individuals-and-companies.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceIndividualsAndCompaniesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceIndividualsAndCompaniesRoutingModule {}
