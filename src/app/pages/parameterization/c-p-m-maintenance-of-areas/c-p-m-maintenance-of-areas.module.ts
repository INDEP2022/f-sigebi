import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMMaintenanceOfAreasRoutingModule } from './c-p-m-maintenance-of-areas-routing.module';
import { CPMaCMaintenanceOfAreasModalComponent } from './c-p-ma-c-maintenance-of-areas-modal/c-p-ma-c-maintenance-of-areas-modal.component';
import { CPMaCMaintenanceOfAreasComponent } from './c-p-ma-c-maintenance-of-areas/c-p-ma-c-maintenance-of-areas.component';

@NgModule({
  declarations: [
    CPMaCMaintenanceOfAreasComponent,
    CPMaCMaintenanceOfAreasModalComponent,
  ],
  imports: [
    CommonModule,
    CPMMaintenanceOfAreasRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    DelegationSharedComponent,
  ],
})
export class CPMMaintenanceOfAreasModule {}
