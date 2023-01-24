import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { MaintenanceOfAreasRoutingModule } from './maintenance-of-areas-routing.module';
import { MaintenanceOfAreasComponent } from './maintenance-of-areas/maintenance-of-areas.component';

@NgModule({
  declarations: [MaintenanceOfAreasComponent, DepartmentFormComponent],
  imports: [
    CommonModule,
    MaintenanceOfAreasRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    DelegationSharedComponent,
  ],
})
export class MaintenanceOfAreasModule {}
