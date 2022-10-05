import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeGdaddMDestructionAuthorizationManagementRoutingModule } from './pe-gdadd-m-destruction-authorization-management-routing.module';
import { PeGdaddCDestructionAuthorizationManagementComponent } from './pe-gdadd-c-destruction-authorization-management/pe-gdadd-c-destruction-authorization-management.component';


@NgModule({
  declarations: [
    PeGdaddCDestructionAuthorizationManagementComponent
  ],
  imports: [
    CommonModule,
    PeGdaddMDestructionAuthorizationManagementRoutingModule
  ]
})
export class PeGdaddMDestructionAuthorizationManagementModule { }
