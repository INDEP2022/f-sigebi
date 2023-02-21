import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CircuitSharedComponent } from 'src/app/@standalone/shared-forms/circuit-shared/circuit-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { CourtListComponent } from './court-list/court-list.component';
import { CourtMaintenanceRoutingModule } from './court-maintenance-routing.module';
import { CourtMaintenanceComponent } from './court-maintenance/court-maintenance.component';

@NgModule({
  declarations: [CourtMaintenanceComponent, CourtListComponent],
  imports: [
    CommonModule,
    CourtMaintenanceRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    CircuitSharedComponent,
    DelegationSharedComponent,
  ],
})
export class CourtMaintenanceModule {}
