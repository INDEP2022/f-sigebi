import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CircuitSharedComponent } from 'src/app/@standalone/shared-forms/circuit-shared/circuit-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPCmCCourtMaintenanceComponent } from './c-p-cm-c-court-maintenance/c-p-cm-c-court-maintenance.component';
import { CPMCourtMaintenanceRoutingModule } from './c-p-m-court-maintenance-routing.module';

@NgModule({
  declarations: [CPCmCCourtMaintenanceComponent],
  imports: [
    CommonModule,
    CPMCourtMaintenanceRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    CircuitSharedComponent,
    DelegationSharedComponent,
  ],
})
export class CPMCourtMaintenanceModule {}
