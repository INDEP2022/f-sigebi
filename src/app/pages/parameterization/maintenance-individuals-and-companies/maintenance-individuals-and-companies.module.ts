import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { FederativeSharedComponent } from 'src/app/@standalone/shared-forms/federative-shared/federative-shared.component';

import { TurnCompanyComponent } from 'src/app/@standalone/shared-forms/turn-company/turn-company.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListIndividualsAndCompaniesComponent } from './list-individuals-and-companies/list-individuals-and-companies.component';
import { MaintenanceIndividualsAndCompaniesRoutingModule } from './maintenance-individuals-and-companies-routing.module';
import { MaintenanceIndividualsAndCompaniesComponent } from './maintenance-individuals-and-companies/maintenance-individuals-and-companies.component';

@NgModule({
  declarations: [
    MaintenanceIndividualsAndCompaniesComponent,
    ListIndividualsAndCompaniesComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceIndividualsAndCompaniesRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    FederativeSharedComponent,
    TurnCompanyComponent,
  ],
})
export class MaintenanceIndividualsAndCompaniesModule {}
