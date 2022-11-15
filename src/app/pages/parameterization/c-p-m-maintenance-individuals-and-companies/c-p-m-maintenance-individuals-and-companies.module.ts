import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { FederativeSharedComponent } from 'src/app/@standalone/shared-forms/federative-shared/federative-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMMaintenanceIndividualsAndCompaniesRoutingModule } from './c-p-m-maintenance-individuals-and-companies-routing.module';
import { CPMicCMaintenanceIndividualsAndCompaniesComponent } from './c-p-mic-c-maintenance-individuals-and-companies/c-p-mic-c-maintenance-individuals-and-companies.component';

@NgModule({
  declarations: [CPMicCMaintenanceIndividualsAndCompaniesComponent],
  imports: [
    CommonModule,
    CPMMaintenanceIndividualsAndCompaniesRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    FederativeSharedComponent,
  ],
})
export class CPMMaintenanceIndividualsAndCompaniesModule {}
