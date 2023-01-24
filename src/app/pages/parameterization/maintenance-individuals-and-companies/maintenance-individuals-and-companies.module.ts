import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { FederativeSharedComponent } from 'src/app/@standalone/shared-forms/federative-shared/federative-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceIndividualsAndCompaniesRoutingModule } from './maintenance-individuals-and-companies-routing.module';
import { MaintenanceIndividualsAndCompaniesComponent } from './maintenance-individuals-and-companies/maintenance-individuals-and-companies.component';

@NgModule({
  declarations: [MaintenanceIndividualsAndCompaniesComponent],
  imports: [
    CommonModule,
    MaintenanceIndividualsAndCompaniesRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    FederativeSharedComponent,
  ],
})
export class MaintenanceIndividualsAndCompaniesModule {}
