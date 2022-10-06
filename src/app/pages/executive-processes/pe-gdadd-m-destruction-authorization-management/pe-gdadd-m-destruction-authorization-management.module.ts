import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PeGdaddMDestructionAuthorizationManagementRoutingModule } from './pe-gdadd-m-destruction-authorization-management-routing.module';
import { PeGdaddCDestructionAuthorizationManagementComponent } from './pe-gdadd-c-destruction-authorization-management/pe-gdadd-c-destruction-authorization-management.component';


@NgModule({
  declarations: [
    PeGdaddCDestructionAuthorizationManagementComponent
  ],
  imports: [
    CommonModule,
    PeGdaddMDestructionAuthorizationManagementRoutingModule,
    Ng2SmartTableModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class PeGdaddMDestructionAuthorizationManagementModule { }
