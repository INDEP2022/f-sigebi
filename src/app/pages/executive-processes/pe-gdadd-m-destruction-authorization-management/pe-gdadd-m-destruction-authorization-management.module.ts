import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeGdaddCDestructionAuthorizationManagementComponent } from './pe-gdadd-c-destruction-authorization-management/pe-gdadd-c-destruction-authorization-management.component';
import { PeGdaddMDestructionAuthorizationManagementRoutingModule } from './pe-gdadd-m-destruction-authorization-management-routing.module';

@NgModule({
  declarations: [PeGdaddCDestructionAuthorizationManagementComponent],
  imports: [
    CommonModule,
    PeGdaddMDestructionAuthorizationManagementRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class PeGdaddMDestructionAuthorizationManagementModule {}
