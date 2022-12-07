import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DestructionAuthorizationManagementRoutingModule } from './destruction-authorization-management-routing.module';
import { DestructionAuthorizationManagementComponent } from './destruction-authorization-management/destruction-authorization-management.component';

@NgModule({
  declarations: [DestructionAuthorizationManagementComponent],
  imports: [
    CommonModule,
    DestructionAuthorizationManagementRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DestructionAuthorizationManagementModule {}
