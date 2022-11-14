import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMicCMaintenanceIndividualsAndCompaniesComponent } from './c-p-mic-c-maintenance-individuals-and-companies/c-p-mic-c-maintenance-individuals-and-companies.component';

const routes: Routes = [
  {
    path: '',
    component: CPMicCMaintenanceIndividualsAndCompaniesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMMaintenanceIndividualsAndCompaniesRoutingModule {}
